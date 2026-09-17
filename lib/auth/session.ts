import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAuthSecret } from "@/lib/auth/secret";
import { findReaderById } from "@/lib/auth/store";
import { toPublicReader, type Reader } from "@/lib/auth/types";

export const SESSION_COOKIE = "md_reader";
const SESSION_DAYS = 30;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

type SessionPayload = {
  sub: string;
  exp: number;
  v: 1;
};

function encode(payload: SessionPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decode(token: string, secret: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (parsed.v !== 1 || typeof parsed.sub !== "string" || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function createSession(readerId: string): Promise<void> {
  const secret = await getAuthSecret();
  const token = encode(
    {
      sub: readerId,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
      v: 1,
    },
    secret,
  );
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionReader(): Promise<Reader | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const secret = await getAuthSecret();
  const payload = decode(token, secret);
  if (!payload) return null;
  const stored = await findReaderById(payload.sub);
  return stored ? toPublicReader(stored) : null;
}
