import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * 5 notes per IP per 10 minutes (sliding). Tight enough to blunt form spam,
 * loose enough for a slow connection that retries once. When Upstash env vars
 * are missing (local dev), `limiter` is null and the route skips this check
 * instead of crashing.
 */
export function createLimiter(
  url = process.env.UPSTASH_REDIS_REST_URL,
  token = process.env.UPSTASH_REDIS_REST_TOKEN,
): Ratelimit | null {
  if (!url?.trim() || !token?.trim()) return null;

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
    prefix: "myanmar-contact",
    // Fail open if Redis is slow so Myanmar readers are not blocked by the limiter.
    timeout: 1500,
  });
}

export const limiter = createLimiter();

/**
 * Prefer Cloudflare's connecting IP when the custom domain is orange-clouded.
 * Myanmar traffic then never talks to Vercel directly; CF-Connecting-IP is the
 * real client. Fall back to the usual proxy headers.
 */
export function getClientIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;

  const vercel = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;

  return "unknown";
}
