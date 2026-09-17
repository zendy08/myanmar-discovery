# Places

Source: [`lib/places.ts`](../lib/places.ts). Canonical list for the outline map and place plates. Edit the TypeScript array; do not invent a parallel JSON file.

## Types

```ts
export type PlaceTone = "umber" | "jade" | "gold";

export type Place = {
  id: string;
  name: string;
  teaser: string;
  plate: string;
  where: string;
  body: string;
  meta: [string, string][];
  x: number;
  y: number;
  variant: "photo" | "type";
  tone?: PlaceTone;
  image?: string;
  imageAlt?: string;
  className: string;
};
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable slug; used by map pins, drawer, and `savedPlaceIds` |
| `name` | yes | Display name |
| `teaser` | yes | Short line for card and accessible pin name |
| `plate` | yes | Plate label, e.g. `Plate 01 · Dry zone` |
| `where` | yes | Location line (may include coordinates as copy) |
| `body` | yes | Long drawer copy |
| `meta` | yes | Two label/value pairs for the drawer |
| `x`, `y` | yes | Pin position in `MAP_VIEWBOX` units |
| `variant` | yes | `photo` or `type` |
| `tone` | when `type` | `umber`, `jade`, or `gold` |
| `image` | when `photo` | Path under `/images/...` |
| `imageAlt` | when `photo` | Descriptive alt |
| `className` | yes | Bento grid class, e.g. `place-bagan` |

## Map viewBox

```ts
export const MAP_VIEWBOX = { width: 270, height: 410 } as const;
```

`x` and `y` are coordinates in this viewBox, not latitude/longitude pixels. The outline map is **not to scale**. Place pins by eye and verify at ~980px and on a phone.

`MAP_PLACES` is a pin projection: `{ id, name, teaser, x, y }` derived from `PLACES`.

## Current records

| ID | Name | Plate | Variant |
| --- | --- | --- | --- |
| `bagan` | Bagan | 01 · Dry zone | photo |
| `inle` | Inle Lake | 02 · Shan plateau | photo |
| `yangon` | Yangon | 03 · The old capital | photo |
| `mandalay` | Mandalay | 04 · 21°58′N | type · umber |
| `mrauku` | Mrauk-U | 05 · Rakhine | type · jade |
| `ngapali` | Ngapali | 06 · Rakhine coast | type · gold |

## Invariants

- Do not silently swap names from the legacy static HTML.
- Photo places need `image` and `imageAlt`; type places need `tone`.
- `savedPlaceIds` on a reader must match a `Place.id`.
- Photographs live in `public/images/` and are referenced as `/images/...`.
