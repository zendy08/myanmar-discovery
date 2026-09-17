import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SECRET_FILE = path.join(DATA_DIR, ".session-secret");

let cached: string | null = null;

export async function getAuthSecret(): Promise<string> {
  const fromEnv = process.env.AUTH_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) return fromEnv;
  if (cached) return cached;

  try {
    const existing = (await readFile(SECRET_FILE, "utf8")).trim();
    if (existing.length >= 32) {
      cached = existing;
      return existing;
    }
  } catch {
    // First run: mint a local secret.
  }

  const secret = randomBytes(48).toString("base64url");
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SECRET_FILE, secret, { encoding: "utf8", mode: 0o600 });
  cached = secret;
  return secret;
}
