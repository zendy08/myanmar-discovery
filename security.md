<p align="center">
  <img src="public/favicon.svg" width="40" height="40" alt="Myanmar Discovery mark" />
</p>

<h1 align="center">Security</h1>

<p align="center">
  Trust boundaries for <strong>Myanmar Discovery</strong><br />
  <sub>Local readers &middot; CSP &middot; quiet contact &mdash; not a marketplace IdP</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CSP-middleware-110703?style=flat-square&labelColor=1b3b36" alt="CSP" />
  <img src="https://img.shields.io/badge/passwords-scrypt-2b1e16?style=flat-square&labelColor=110703" alt="scrypt" />
  <img src="https://img.shields.io/badge/session-httpOnly-c59b27?style=flat-square&labelColor=110703" alt="httpOnly session" />
  <a href="./README.md"><img src="https://img.shields.io/badge/docs-README-b85d38?style=flat-square&labelColor=110703" alt="README" /></a>
</p>

<p align="center">
  <a href="#principles">Principles</a> &middot;
  <a href="#trust-boundaries">Boundaries</a> &middot;
  <a href="#headers">Headers</a> &middot;
  <a href="#reader-accounts">Readers</a> &middot;
  <a href="#contact-form">Contact</a> &middot;
  <a href="#reporting">Report</a>
</p>

---

Product scope: [`spec.md`](./spec.md). Reader shapes: [`schema/readers.md`](./schema/readers.md). Demo path: [`demo.md`](./demo.md).

## Principles

- Prefer least privilege: readers keep plates and prefs; nothing else is stored remotely by default.
- Fail closed on auth and mail configuration; fail open on optional rate limits when Redis is unset (dev stays usable).
- Never leak stack traces, provider names, or whether an email exists beyond the copy already on the form.
- Secrets stay out of git. `.env`, `.env.*` (except `.env.example`), `data/*`, and `.dev.vars` are ignored.

## Trust boundaries

| Surface | Trust |
| :------ | :---- |
| Public `/`, `/gallery` | Untrusted input; CSP and headers apply |
| `/sign-in`, `/sign-up` | Untrusted forms; server actions validate and rate-limit |
| Signed-in volume | Session cookie required for later chapters and kept plates |
| `POST /api/contact` | Untrusted JSON; Zod, honeypot, size cap, optional Upstash |
| Cloudflare Worker fallback | Same handler logic; CORS allowlisted via `CONTACT_ALLOWED_ORIGIN` |
| `data/users.json` | Server-only; mode `0o600`; gitignored |
| Sketchfab embeds | Third-party frames; allowlisted in CSP |

## Headers

Set in [`middleware.ts`](./middleware.ts) for matched routes:

| Header | Role |
| :----- | :--- |
| `Content-Security-Policy` | Restrict scripts, frames, connect targets (self, fonts, Resend, Sketchfab, optional contact fallback) |
| `X-Frame-Options: DENY` | Clickjacking |
| `X-Content-Type-Options: nosniff` | MIME sniffing |
| `Referrer-Policy: strict-origin-when-cross-origin` | Referrer trimming |
| `Permissions-Policy` | Camera, mic, geolocation, payment, USB, topics off |
| `Strict-Transport-Security` | HTTPS in production (2 years, includeSubDomains, preload) |

CSP allows `'unsafe-inline'` / `'unsafe-eval'` for Next.js and the Sketchfab viewer. Tighten only with a measured CSP upgrade &mdash; do not break `/gallery`.

## Reader accounts

Local only. No OAuth, no third-party IdP.

| Concern | Behaviour |
| :------ | :-------- |
| Passwords | scrypt (`16384$8$1`); never stored plain &mdash; see [`schema/readers.md`](./schema/readers.md) |
| Session cookie | `md_reader` &mdash; httpOnly, `SameSite=Lax`, `Secure` in production, 30-day max age |
| Cookie payload | HMAC-SHA256 over `{ sub, exp, v }` with `AUTH_SECRET` or `data/.session-secret` |
| Redirects | `next` constrained by `safeNextPath` (defaults to `/`) |
| Sign-in / sign-up | In-memory rate limit: 8 attempts / 15 minutes per email key |
| Errors | Generic mismatch copy; do not reveal which field failed on sign-in |

Kept plates (`savedPlaceIds`) and display name updates require a valid session. Reading preferences live in `localStorage` on the device only.

> **Production note:** the file-backed store (`data/users.json`) suits a single Node instance. Multi-instance or serverless deployments need a shared store before treating accounts as durable across hosts.

## Contact form

Shared handler in [`lib/contact.ts`](./lib/contact.ts) (Vercel route + Worker).

| Control | Detail |
| :------ | :----- |
| Method | `POST` only |
| Body | Max ~8 KB; Zod schema |
| Honeypot | Hidden `company` &mdash; filled bots get `{ ok: true }` without mail |
| Rate limit | Upstash when env is set; skipped (no crash) when unset |
| Errors | Generic client copy; details logged server-side only |
| Mail | Resend; `replyTo` is the reader's address |

Required env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. See [`.env.example`](./.env.example).

## Secrets checklist

| Secret | Where |
| :----- | :---- |
| `AUTH_SECRET` | &ge;32 chars in production env; else minted under `data/` (dev) |
| Resend / Upstash keys | `.env.local` or host secrets &mdash; never commit |
| Worker CORS origin | `CONTACT_ALLOWED_ORIGIN` = public site origin |
| Session / user files | `data/` &mdash; backup carefully; treat as PII |

Rotate `AUTH_SECRET` only when you intend to invalidate all sessions.

## Reachability (Myanmar)

Vercel `*.vercel.app` hostnames are often blocked. Prefer a custom domain on Cloudflare (orange cloud) so readers hit Cloudflare, not the origin hostname. Optional Worker ([`workers/contact.ts`](./workers/contact.ts)) is the mail fallback when `/api/contact` cannot be reached &mdash; not a second auth plane.

## Out of scope (today)

- Hosted identity, email verification, password reset flows
- Encryption at rest beyond OS file permissions
- WAF rules beyond Cloudflare's defaults when orange-clouded
- Formal pen-test report or SOC attestation

## Reporting

If you find a vulnerability in this repository, open a **private** report with the maintainer &mdash; do not file a public issue with exploit detail.

| | |
| :--- | :--- |
| Repo | [zendy08/myanmar-discovery](https://github.com/zendy08/myanmar-discovery) |
| Include | Steps, impact, and whether PII is involved |

---

<p align="center"><sub><a href="./README.md">README</a> &middot; <a href="./demo.md">Demo</a> &middot; <a href="./spec.md">Spec</a></sub></p>
