"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

const GENERIC_ERROR = "The note could not be sent. Try again.";
const SLOW_NETWORK_MS = 20_000;

function contactEndpoints(): string[] {
  const fallback = process.env.NEXT_PUBLIC_CONTACT_FALLBACK_URL?.trim();
  const endpoints = ["/api/contact"];
  if (fallback) endpoints.push(fallback);
  return endpoints;
}

function isUnreachableStatus(status: number): boolean {
  return status >= 500;
}

async function postNote(url: string, body: string, signal: AbortSignal): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    signal,
  });
}

/**
 * Same-origin `/api/contact` first. If Vercel is blocked (typical in Myanmar on
 * *.vercel.app, or when the custom domain is not orange-clouded), fetch fails
 * and we try the Cloudflare Worker fallback. We do not fall back after a timeout
 * or a 4xx — that would risk a duplicate send, or skip a real validation error.
 */
async function submitNote(payload: unknown): Promise<{ ok: boolean; error?: string }> {
  const body = JSON.stringify(payload);
  const endpoints = contactEndpoints();
  let lastError = GENERIC_ERROR;

  for (let i = 0; i < endpoints.length; i += 1) {
    const url = endpoints[i];
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), SLOW_NETWORK_MS);

    try {
      const response = await postNote(url, body, controller.signal);
      window.clearTimeout(timer);

      if (response.ok) return { ok: true };

      if (response.status === 400 || response.status === 429) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        return { ok: false, error: data?.error || GENERIC_ERROR };
      }

      if (isUnreachableStatus(response.status) && i < endpoints.length - 1) {
        lastError = GENERIC_ERROR;
        continue;
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: data?.error || GENERIC_ERROR };
    } catch (error) {
      window.clearTimeout(timer);
      const aborted = error instanceof DOMException && error.name === "AbortError";
      // Abort = slow line; do not also hit the fallback (the first request may still complete).
      if (aborted) return { ok: false, error: GENERIC_ERROR };
      lastError = GENERIC_ERROR;
    }
  }

  return { ok: false, error: lastError };
}

const fieldClass =
  "w-full rounded-none border-0 border-b border-cream/20 bg-transparent px-0 py-2 font-body text-cream outline-none ring-0 transition-colors placeholder:text-cream/35 focus:border-saffron-soft focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-saffron-soft";

const labelClass =
  "font-body text-[0.68rem] font-semibold uppercase tracking-kicker text-cream/60";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError("");

    const result = await submitNote({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("error");
    setError(result.error || GENERIC_ERROR);
  }

  if (status === "success") {
    return (
      <p className="font-body text-cream/80" role="status">
        Received. We will read it.
      </p>
    );
  }

  return (
    <form className="relative flex max-w-xl flex-col gap-7" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Off-screen honeypot: not display:none, so naive bots still fill it. */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true" inert>
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" ? (
        <p className="font-body text-[0.92rem] text-terracotta" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="btn w-fit rounded-none"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send the note"}
        <span className="arrow" aria-hidden="true" />
      </button>
    </form>
  );
}
