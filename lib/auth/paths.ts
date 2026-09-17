export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  const next = value.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/";
  if (next.startsWith("/sign-in") || next.startsWith("/sign-up")) return "/";
  return next;
}
