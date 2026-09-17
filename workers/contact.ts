import { createLimiter } from "../lib/rateLimit";
import { methodNotAllowed, processContactPost } from "../lib/contact";

/**
 * Cloudflare Worker fallback for the contact form.
 *
 * Vercel hostnames are often blocked in Myanmar unless the reader uses a VPN.
 * This Worker lives on Cloudflare's Anycast network, which is reachable there.
 * The browser only uses it when same-origin `/api/contact` cannot be reached
 * (failed fetch / 5xx) — not on validation or rate-limit responses.
 *
 * Production still wants the custom domain orange-clouded at Cloudflare so the
 * whole volume loads without a VPN. This Worker is the belt as well as the braces.
 */

type WorkerEnv = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  CONTACT_ALLOWED_ORIGIN?: string;
};

function corsHeaders(origin: string | null, allowed: string | undefined): HeadersInit {
  const headers: Record<string, string> = {
    vary: "Origin",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
  if (allowed && origin === allowed) {
    headers["access-control-allow-origin"] = allowed;
  }
  return headers;
}

function withCors(response: Response, request: Request, env: WorkerEnv): Response {
  const headers = new Headers(response.headers);
  const extra = corsHeaders(request.headers.get("origin"), env.CONTACT_ALLOWED_ORIGIN?.trim());
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: { waitUntil: (p: Promise<unknown>) => void }): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin"), env.CONTACT_ALLOWED_ORIGIN?.trim()) });
    }

    if (request.method === "GET") {
      return withCors(methodNotAllowed(), request, env);
    }

    if (request.method !== "POST") {
      return withCors(methodNotAllowed(), request, env);
    }

    const limiter = createLimiter(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
    const response = await processContactPost(
      request,
      limiter,
      {
        RESEND_API_KEY: env.RESEND_API_KEY,
        CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
        CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
      },
      (pending) => ctx.waitUntil(pending),
    );

    return withCors(response, request, env);
  },
};
