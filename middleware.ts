import { NextResponse, type NextRequest } from "next/server";

function fallbackOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_FALLBACK_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

function contentSecurityPolicy(): string {
  const connect = ["'self'", "https://api.resend.com", "https://sketchfab.com", "https://*.sketchfab.com"];
  const fallback = fallbackOrigin();
  if (fallback) connect.push(fallback);
  if (process.env.NODE_ENV !== "production") connect.push("ws:", "wss:");

  return [
    "default-src 'self'",
    // cdnjs as requested; Sketchfab's viewer script is already used by /gallery.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://static.sketchfab.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://media.sketchfab.com",
    `connect-src ${connect.join(" ")}`,
    "frame-src 'self' https://sketchfab.com https://*.sketchfab.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", contentSecurityPolicy());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
  );

  if (request.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
