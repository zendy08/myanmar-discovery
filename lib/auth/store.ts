import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { StoredReader } from "@/lib/auth/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll(): Promise<StoredReader[]> {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredReader[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(readers: StoredReader[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, `${JSON.stringify(readers, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

export async function findReaderByEmail(email: string): Promise<StoredReader | null> {
  const readers = await readAll();
  return readers.find((reader) => reader.email === email) ?? null;
}

export async function findReaderById(id: string): Promise<StoredReader | null> {
  const readers = await readAll();
  return readers.find((reader) => reader.id === id) ?? null;
}

export async function insertReader(reader: StoredReader): Promise<StoredReader> {
  return enqueue(async () => {
    const readers = await readAll();
    if (readers.some((existing) => existing.email === reader.email)) {
      throw new Error("EMAIL_TAKEN");
    }
    readers.push(reader);
    await writeAll(readers);
    return reader;
  });
}

export async function updateReader(
  id: string,
  patch: Partial<Pick<StoredReader, "savedPlaceIds" | "name">>,
): Promise<StoredReader | null> {
  return enqueue(async () => {
    const readers = await readAll();
    const index = readers.findIndex((reader) => reader.id === id);
    if (index < 0) return null;
    const next = { ...readers[index], ...patch };
    readers[index] = next;
    await writeAll(readers);
    return next;
  });
}
