const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function readName(value: unknown): string | { error: string } {
  if (typeof value !== "string") return { error: "Name should be at least two letters." };
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2) return { error: "Name should be at least two letters." };
  if (name.length > 80) return { error: "Name should be shorter than eighty letters." };
  return name;
}

export function readEmail(value: unknown): string | { error: string } {
  const email = normalizeEmail(value);
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { error: "Use a proper email address." };
  }
  return email;
}

export function readPassword(value: unknown): string | { error: string } {
  if (typeof value !== "string") {
    return { error: "Password needs eight characters or more." };
  }
  if (value.length < 8) return { error: "Password needs eight characters or more." };
  if (value.length > 72) return { error: "Password should be seventy-two characters or fewer." };
  return value;
}

export function isError(value: unknown): value is { error: string } {
  return Boolean(value && typeof value === "object" && "error" in value);
}
