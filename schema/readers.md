# Readers

Sources: [`lib/auth/types.ts`](../lib/auth/types.ts), [`lib/auth/store.ts`](../lib/auth/store.ts), [`lib/auth/session.ts`](../lib/auth/session.ts), [`lib/auth/validate.ts`](../lib/auth/validate.ts), [`lib/auth/password.ts`](../lib/auth/password.ts), [`lib/auth/actions.ts`](../lib/auth/actions.ts).

Local reader accounts only. No third-party identity provider.

## Types

```ts
export type StoredReader = {
  id: string;
  name: string;
  email: string;
  password: string;
  savedPlaceIds: string[];
  createdAt: string;
};

export type Reader = {
  id: string;
  name: string;
  email: string;
  savedPlaceIds: string[];
};

export type AuthFormState = { error: string } | null;
```

| Type | Role |
| --- | --- |
| `StoredReader` | On-disk record in `data/users.json` |
| `Reader` | Public session shape — no `password`, no `createdAt` (`toPublicReader`) |
| `AuthFormState` | Sign-in / sign-up action result |

| Field | Notes |
| --- | --- |
| `id` | UUID |
| `name` | 2–80 characters after trim; spaces collapsed |
| `email` | Lowercase, trimmed; max 254; simple email pattern |
| `password` | Stored as `scrypt$N$r$p$salt$derived` (never plain) |
| `savedPlaceIds` | Must match a [`Place.id`](places.md) |
| `createdAt` | ISO-8601 string |

## Persistence

- File: `data/users.json` — `StoredReader[]`, pretty JSON + newline, mode `0o600`.
- Directory is gitignored except `data/.gitkeep`.
- Writes are serialised through a promise chain in the store.

## Session cookie

| Concern | Value |
| --- | --- |
| Name | `md_reader` |
| Payload | `{ sub: readerId, exp: unixSeconds, v: 1 }` |
| Encoding | `base64url(JSON).base64url(HMAC-SHA256)` |
| Flags | `httpOnly`, `sameSite: "lax"`, `secure` in production, `path: "/"`, max age 30 days |
| Secret | `AUTH_SECRET` (≥32 chars) or minted to `data/.session-secret` |

`getSessionReader` decodes the cookie, then loads the reader by `sub` and returns the public `Reader`.

## Password

Plain passwords: 8–72 characters on input. Stored format:

```
scrypt$16384$8$1$<salt-base64url>$<hash-base64url>
```

## Actions (shapes)

| Action | Success | Failure |
| --- | --- | --- |
| `signUpAction` / `signInAction` | redirect | `AuthFormState` with `error` |
| `signOutAction` | redirect to `/` | — |
| `toggleSavedPlaceAction` | `{ savedPlaceIds }` | `{ error }` |
| `updateReaderNameAction` | `{ name }` | `{ error }` |

Safe redirect targets for `next` are constrained by `safeNextPath` (defaults to `/`).
