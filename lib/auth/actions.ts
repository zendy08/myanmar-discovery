"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { PLACES } from "@/lib/places";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { safeNextPath } from "@/lib/auth/paths";
import { tooManyAttempts } from "@/lib/auth/rate-limit";
import { createSession, destroySession, getSessionReader } from "@/lib/auth/session";
import { findReaderByEmail, insertReader, updateReader } from "@/lib/auth/store";
import { toPublicReader, type AuthFormState } from "@/lib/auth/types";
import { isError, readEmail, readName, readPassword } from "@/lib/auth/validate";

export type { AuthFormState } from "@/lib/auth/types";

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = readName(formData.get("name"));
  const email = readEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  if (isError(name)) return name;
  if (isError(email)) return email;
  if (isError(password)) return password;

  if (tooManyAttempts(`signup:${email}`)) {
    return { error: "Wait a moment, then try again." };
  }

  try {
    const reader = await insertReader({
      id: randomUUID(),
      name,
      email,
      password: await hashPassword(password),
      savedPlaceIds: [],
      createdAt: new Date().toISOString(),
    });
    await createSession(reader.id);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return { error: "An account with that email is already open. Sign in." };
    }
    return { error: "The account could not be opened. Try again." };
  }

  redirect(safeNextPath(formData.get("next")));
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  if (isError(email)) return { error: "Email or password did not match." };
  if (isError(password)) return { error: "Email or password did not match." };

  if (tooManyAttempts(`signin:${email}`)) {
    return { error: "Wait a moment, then try again." };
  }

  const stored = await findReaderByEmail(email);
  const passwordOk = stored ? await verifyPassword(password, stored.password) : false;
  if (!stored || !passwordOk) {
    return { error: "Email or password did not match." };
  }

  await createSession(stored.id);
  redirect(safeNextPath(formData.get("next")));
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function toggleSavedPlaceAction(
  placeId: string,
): Promise<{ savedPlaceIds: string[] } | { error: string }> {
  const reader = await getSessionReader();
  if (!reader) return { error: "Sign in to keep a plate." };
  if (!PLACES.some((place) => place.id === placeId)) {
    return { error: "That plate is not in the volume." };
  }

  const already = reader.savedPlaceIds.includes(placeId);
  const savedPlaceIds = already
    ? reader.savedPlaceIds.filter((id) => id !== placeId)
    : [...reader.savedPlaceIds, placeId];

  const updated = await updateReader(reader.id, { savedPlaceIds });
  if (!updated) return { error: "The plate could not be kept. Try again." };
  return { savedPlaceIds: toPublicReader(updated).savedPlaceIds };
}

export async function updateReaderNameAction(
  nameValue: unknown,
): Promise<{ name: string } | { error: string }> {
  const reader = await getSessionReader();
  if (!reader) return { error: "Sign in to change your name." };

  const name = readName(nameValue);
  if (isError(name)) return name;

  const updated = await updateReader(reader.id, { name });
  if (!updated) return { error: "The name could not be saved. Try again." };
  return { name: toPublicReader(updated).name };
}
