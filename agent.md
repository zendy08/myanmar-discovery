# Agent manual

How to work on **Myanmar Discovery**. Read `spec.md` before changing copy, layout, or interaction. Human setup lives in `README.md`.

## Mission

Keep this a quiet editorial guide. Improve craft, accessibility, and accuracy. Do not turn it into a travel marketplace, dashboard, or generic marketing site.

## Source of truth

| Concern | File |
| --- | --- |
| Product, voice, IA | `spec.md` |
| Visual system, UI kit | `design.md` |
| Data contracts | `schema.md` |
| Gallery plates | `lib/gallery.ts` |
| Page composition | `components/EditorialSite.tsx`, `components/GalleryRoom.tsx`, `components/GalleryPeek.tsx` |
| Shared header / account plates | `components/SiteHeader.tsx` |
| Reading preferences | `components/ReadingPrefsProvider.tsx`, `lib/reading-prefs.ts` |
| Body scroll lock | `lib/body-lock.ts` |
| Map + place grid | `components/PlacesSection.tsx`, `components/InteractiveMap.tsx` |
| Glossary tooltips | `components/GlossaryTerm.tsx` |
| Local voices | `components/LocalVoices.tsx` |
| Contact form | `components/ContactForm.tsx`, `app/api/contact/route.ts`, `workers/contact.ts` |
| Editorial CSS | `css/styles.css` |
| Map/layout utilities | `app/globals.css` |
| Metadata | `app/layout.tsx` |

The Next.js app is canonical. `index.html` and `js/main.js` are a leftover static snapshot and may disagree (they still mention Hpa-An and Kyaiktiyo). If you must touch the snapshot, say so; do not treat it as live product.

## Stack

Next.js 15 App Router, React 19, TypeScript (strict), Tailwind 3 with `preflight: false`, Framer Motion. Path alias `@/*` → repo root.

Dev server: `npm run dev` on port **3000**.

## Editorial rules

- Match the existing voice: short, specific, no brochure adjectives.
- Prefer editing `lib/places.ts` over hard-coding new place copy in JSX.
- Photographs live in `public/images/` and are referenced as `/images/...`.
- Keep Myanmar/Burma usage as specified. Do not add political slogans or advocacy CTAs.
- Practical notes must not be presented as legal or consular advice.

## Code rules

- Client components only where interaction requires it (`EditorialSite`, `PlacesSection`, `InteractiveMap`). Keep `app/page.tsx` a thin server entry.
- Reuse CSS custom properties and existing class names. Do not introduce a second visual system.
- Tailwind is for map/utility colour and layout helpers, not to replace `css/styles.css`.
- Honour `prefers-reduced-motion` for animation, parallax, and `scrollIntoView`.
- Glossary and local-voices chrome live in `css/styles.css`. Do not restyle voices as testimonial cards.
- Preserve skip link, dialog focus, body-lock counting, and `aria-*` already in place.
- Map coordinates are in the `MAP_VIEWBOX` (270×410), not latitude/longitude pixels.
- Do not add telemetry, auth, or environment secrets unless explicitly requested.

## Adding a gallery plate

1. Append a `GalleryPlate` under the right section in `lib/gallery.ts` (`GALLERY_SECTIONS`) with a stable `id`.
2. Prefer a Sketchfab embed (`sketchfabId`) from heritage / places searches. Skip weapons, vehicles, and product SKUs. Use `source: "local"` only when a scan cannot be shown.
3. Keep copy quiet and specific. Credit the author or Zamani. Do not add booking language.
4. Keep a single live WebGL viewer. A still holds the frame until the scan is ready. Never show a loading screen.

## Adding a place

1. Append a `Place` in `lib/places.ts` with a stable `id`, teaser, plate, body, meta, `x`/`y`, variant, and `className`.
2. Add a photo under `public/images/` if `variant: "photo"`.
3. Extend bento grid rules in `css/styles.css` / `app/globals.css` if the six-up layout breaks.
4. Do not invent coordinates; place the pin on the outline by eye and verify at 980px and on a phone.

## Visual checks

After UI work, verify as a reader would:

1. Hero → glance → gallery peek → `/gallery` (signed-out continues to the volume gate; signed-in continues into history)
2. Hero → glance → history era clicks → map pin → place card → drawer → Escape
3. Glossary hover/focus/tap and Escape
4. Local voices scroll-snap and reduced-motion
5. Culture mosaic and notes accordion
6. Mobile menu open/close and scroll lock; reader chip → Profile / Settings plates
7. Keyboard-only pass and a reduced-motion pass (system and Settings “Always reduce”)

If a browser is available, use it. If not, say what you could not verify.

## Do not

- Restyle into a card-grid tourism template
- Add “Book now”, prices, or affiliate links
- Replace the outline map with a tiled web map unless the spec changes
- Commit `.env` files, `node_modules`, or `.next`
- Expand scope into multiple routes without updating `spec.md`
