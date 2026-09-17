# Reading preferences

Source: [`lib/reading-prefs.ts`](../lib/reading-prefs.ts). Local to this device only — not part of the reader account.

## Types

```ts
export type TypeSize = "regular" | "large";
export type MotionPref = "system" | "reduce";
export type ContrastPref = "regular" | "strong";

export type ReadingPrefs = {
  type: TypeSize;
  motion: MotionPref;
  contrast: ContrastPref;
};
```

Defaults (`DEFAULT_READING_PREFS`):

```json
{ "type": "regular", "motion": "system", "contrast": "regular" }
```

## Persistence

| Concern | Value |
| --- | --- |
| Key | `md-reading` (`READING_PREFS_KEY`) |
| Storage | `localStorage` |
| Invalid / missing | Fall back to defaults |

## Document attributes

Applied by `applyReadingPrefsToDocument`. Attributes are **omitted** when the value is the default.

| Pref | When set | Effect (visual kit) |
| --- | --- | --- |
| `type: "large"` | `html[data-type="large"]` | 112.5% root type |
| `motion: "reduce"` | `html[data-motion="reduce"]` | Mirrors reduced-motion block |
| `contrast: "strong"` | `html[data-contrast="strong"]` | Lifted `--type-muted` |

## Motion

Reader “Always reduce” ORs with `prefers-reduced-motion`. Honour either the same way (skip parallax, pin pulses, voice motion, smooth `scrollIntoView`).

## Boot script

`READING_PREFS_BOOT_SCRIPT` is inlined in the root layout to avoid a flash of default prefs. It **must stay in sync** with `applyReadingPrefsToDocument`.
