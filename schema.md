# Schema — Myanmar Discovery

Field contracts for editorial and reader data. Product, voice, and IA stay in [`spec.md`](spec.md). Visual tokens and chrome stay in [`design.md`](design.md).

TypeScript under `lib/` is the runtime source of truth. These files describe shapes, IDs, persistence, and invariants — not a second copy of the copy.

## Entities

| Entity | Doc | Source |
| --- | --- | --- |
| Place | [`schema/places.md`](schema/places.md) | [`lib/places.ts`](lib/places.ts) |
| Gallery section / plate | [`schema/gallery.md`](schema/gallery.md) | [`lib/gallery.ts`](lib/gallery.ts) |
| Reader / session | [`schema/readers.md`](schema/readers.md) | [`lib/auth/`](lib/auth/) |
| Reading preferences | [`schema/reading-prefs.md`](schema/reading-prefs.md) | [`lib/reading-prefs.ts`](lib/reading-prefs.ts) |
| Voice | [`schema/voices.md`](schema/voices.md) | [`components/LocalVoices.tsx`](components/LocalVoices.tsx) |

## Relationships

- A **Reader** may keep place plates via `savedPlaceIds` → `Place.id`.
- A **Place** pin uses `x` / `y` in `MAP_VIEWBOX` (270×410), not latitude/longitude pixels.
- A **GallerySection** holds ordered **GalleryPlate** records.
- **ReadingPrefs** live in `localStorage` and map to `html[data-*]` attributes.
- **Voice** quotes are editorial only; they are not persisted and do not join other entities.

## Persistence

| What | Where |
| --- | --- |
| Places | TypeScript module `PLACES` |
| Gallery | TypeScript module `GALLERY_SECTIONS` |
| Voices | Hardcoded array in `LocalVoices.tsx` |
| Readers | `data/users.json` (`StoredReader[]`, gitignored) |
| Session | httpOnly cookie `md_reader` |
| Reading prefs | `localStorage["md-reading"]` |
| Auth secret | `AUTH_SECRET` env, or `data/.session-secret` |

## Not schema

- CSS custom properties and the dusk glass kit → [`design.md`](design.md)
- Routes, chapters, session gate behaviour → [`spec.md`](spec.md)
- Glossary terms (inline JSX props)
- Component prop types (`SiteHeader`, Sketchfab client, and so on)
