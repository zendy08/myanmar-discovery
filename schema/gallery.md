# Gallery

Source: [`lib/gallery.ts`](../lib/gallery.ts). Heritage hall at `/gallery`: sections of plates shown in the round. Prefer Sketchfab embeds from heritage / places searches; skip weapons, vehicles, and product SKUs.

## Types

```ts
export type GallerySource = "local" | "sketchfab";

export type GalleryPlate = {
  id: string;
  n: string;
  name: string;
  kicker: string;
  where: string;
  lede: string;
  source: GallerySource;
  modelSrc?: string;
  sketchfabId?: string;
  credit: string;
  thumbSrc?: string;
};

export type GallerySection = {
  id: string;
  label: string;
  plates: GalleryPlate[];
};
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable plate or section slug; used in hash routing |
| `n` | plate | Display index within the section, e.g. `01` |
| `name` | plate | Title in the hall chrome |
| `kicker` | plate | Quiet plate line |
| `where` | plate | Place / period line |
| `lede` | plate | Short looking line |
| `source` | plate | `local` or `sketchfab` |
| `modelSrc` | when `local` | GLB path, e.g. `/models/sulamani-temple.glb` |
| `sketchfabId` | when `sketchfab` | Sketchfab model UID |
| `thumbSrc` | when `sketchfab` | Still that holds the frame until ready |
| `credit` | plate | Author or Zamani credit; no booking language |
| `label` | section | Tab label |

## Source rules

- `source: "local"` — requires `modelSrc`. Only Sulamani uses the local GLB today; Three/GLB load only for that plate.
- `source: "sketchfab"` — requires `sketchfabId`; prefer `thumbSrc` so the frame is never empty.
- One live WebGL viewer at a time. A still holds the frame until the scan is ready. No loading chrome.

## Hash routing

`/gallery#sectionId` or `/gallery#plateId`. Lookups: `getGallerySection`, `getGalleryPlate`, `findSectionForPlate`.

## Current sections and plates

| Section ID | Label | Plate IDs |
| --- | --- | --- |
| `bagan` | Bagan | `sulamani`, `kubyaukgyi`, `kyaukkuumin`, `seinnyetama`, `sulamani-inside`, `eimyakyaung`, `khemingazedi`, `ananda` |
| `yangon` | Yangon | `shwedagon`, `martyrs` |
| `mandalay` | Mandalay | `mingun` |
| `faith` | Faith | `burmese-buddha`, `gautama`, `sandstone-buddha`, `buddha-head`, `sakyamuni`, `bagan-buddha` |
| `craft` | Craft | `paper-mache`, `wooden-figure`, `kalaga`, `chinthe`, `naya`, `lion-throne`, `opium-weight` |

Helpers: `GALLERY_PLATES` (flat list), `galleryPoster(plate)` (prefer `thumbSrc`, else Sketchfab still URL).

External search links: `GALLERY_COLLECTION_HREF`, `GALLERY_SEARCH_HREF`.
