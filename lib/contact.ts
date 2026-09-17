import { Resend } from "resend";
import type { Ratelimit } from "@upstash/ratelimit";
import { getClientIp } from "./rateLimit";
import { contactSchema, type ContactInput } from "./validation";

/** Client-facing copy stays generic so we never leak Resend, Redis, or stack traces. */
export const GENERIC_ERROR = "Something went wrong. Try again later.";
export const RATE_LIMIT_ERROR = "Too many requests. Try again later.";
export const VALIDATION_ERROR = "Please check the form.";

const MAX_BODY_BYTES = 8_192;

export type ContactEnv = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
};

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function isHoneypotFilled(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || !("company" in raw)) return false;
  const company = (raw as { company: unknown }).company;
  if (company == null) return false;
  return String(company).trim().length > 0;
}

async function sendMail(input: ContactInput, env: ContactEnv): Promise<void> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();

  if (!apiKey || !from || !to) {
    throw new Error("Contact email env is not configured.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Note from ${input.name}`,
    text: `${input.name} <${input.email}>\n\n${input.message}`,
  });

  if (error) throw new Error(error.message);
}

/**
 * Shared POST handler for the Vercel route and the Cloudflare Worker fallback.
 * Same-origin `/api/contact` is preferred; the Worker is for when Vercel is
 * unreachable from the reader (common in Myanmar without a CF orange-cloud).
 */
export async function processContactPost(
  request: Request,
  limiter: Ratelimit | null,
  env: ContactEnv,
  waitUntil?: (promise: Promise<unknown>) => void,
): Promise<Response> {
  try {
    if (limiter) {
      const ip = getClientIp(request.headers);
      const result = await limiter.limit(ip);
      waitUntil?.(result.pending.catch(() => undefined));
      if (!result.success) {
        return json({ error: RATE_LIMIT_ERROR }, 429);
      }
    }

    const length = Number(request.headers.get("content-length") || "0");
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      return json({ error: VALIDATION_ERROR }, 400);
    }

    const rawText = await request.text();
    if (rawText.length > MAX_BODY_BYTES) {
      return json({ error: VALIDATION_ERROR }, 400);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(rawText);
    } catch {
      return json({ error: VALIDATION_ERROR }, 400);
    }

    // Check the honeypot before Zod so a filled trap returns 200, not a 400
    // that would teach bots which field to leave empty.
    if (isHoneypotFilled(raw)) {
      return json({ ok: true }, 200);
    }

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      const { company: _honeypot, ...details } = fieldErrors;
      return json({ error: VALIDATION_ERROR, details }, 400);
    }

    await sendMail(parsed.data, env);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact]", error);
    return json({ error: GENERIC_ERROR }, 500);
  }
}

export function methodNotAllowed(): Response {
  return new Response(JSON.stringify({ error: "Method not allowed." }), {
    status: 405,
    headers: {
      allow: "POST",
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
