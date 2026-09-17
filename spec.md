# Myanmar Discovery

Product and design specification for Myanmar Discovery.

**Source of truth:** product, voice, and IA live here. Visual tokens and chrome live in [`design.md`](design.md). Field contracts (places, gallery, readers, reading prefs, voices) live in [`schema.md`](schema.md).

## Purpose

A single-page editorial introduction to Myanmar for visitors who know little about the country and want to see it clearly. It is a first looking — history, culture, and six places — not a booking desk, itinerary builder, or news site.

The site should feel like a printed volume: plates, kickers, quiet type, and a map that is an outline rather than a GIS tool.

## Audience

- First-time visitors and the merely curious
- Readers who want tone and orientation more than deals
- Keyboard and screen-reader users; people who prefer reduced motion

## Voice

Quiet, precise, slightly literary. Short sentences. Specific nouns (teak, kyat, thanaka, longyi). No brochure language (“hidden gem”, “paradise”, “must-do”), no exclamation marks, no booking CTAs.

Use **Myanmar** as the primary name. **Burma** may appear when historical or cartographic context needs it. Treat both with care.

Practical notes (visas, cash, temple manner) should stay current in spirit and never pretend to be official advice. Point readers to official sources and current travel guidance.

## Information architecture

One editorial route: `/`, with a quiet museum plate at `/gallery`. Five anchored chapters plus opening and closing plates, with a quiet voices interstitial.

| ID | Label | Role |
| --- | --- | --- |
| `#top` | Hero | Opening plate: Bagan at dawn, title, lede |
| `#glance` | Glance | Five facts: seat, language, currency, faith, season |
| `#gallery` | Peek | Text doorway to `/gallery`. Not a chapter |
| `#history` | History | Four eras; sticky plate swaps with the active era |
| `#places` | Places | Outline map + six plates; drawer for the long copy |
| `#voices` | Voices | Interstitial quotes; not in primary nav |
| `#culture` | Culture | Mosaic of living culture (faith, thanaka, food, water, cloth, Thingyan) |
| `#notes` | Notes | Accordion of practical matters |
| `#write` | Write | Quiet correspondence. Public — not a chapter, not a booking desk |
| `#closeout` | Close | Closing plate and a return to places |

Primary navigation mirrors those five chapters, plus a quiet **Gallery** link to `/gallery` (a route, not a sixth chapter). Mobile uses a full-screen overlay menu. `#gallery` and `#voices` are pauses — not chapters.

The shared header (`SiteHeader`) carries chapter links and a quiet account end: signed-in readers open a **reader chip** (initials) for Profile, Settings, and Sign out; signed-out readers see Settings beside Sign in / Explore. **Profile** and **Settings** are overlay plates (same drawer language as place plates) — not routes and not chapters. Profile shows name (editable), email, and kept plates. Settings holds local reading preferences: type size, motion, and type contrast — stored in `localStorage` on this device only.

Signed-out readers see the hero, glance, a gallery sneak peek, and a quiet gate (`#volume`) instead of the later chapters. Returning readers **Sign in**; new readers **Explore** (`/sign-in`, `/sign-up`). A reader account unlocks the rest of the volume and can keep place plates. `/gallery` is public.

| Route | Role |
| --- | --- |
| `/` | Editorial volume. Glance and the gallery peek are public; history through closeout require a session. |
| `/gallery` | Heritage hall: Myanmar places and craft in the round, in sections (Bagan, Yangon, Mandalay, Faith, Craft). Not a sixth chapter. |
| `/sign-in` | Return to the volume. Email and password. Redirects to `/` (or a safe `next` path). |
| `/sign-up` | Begin looking. Name, email, password. Opens a session. |

## Places

Canonical list lives in `lib/places.ts`. Field contracts: [`schema/places.md`](schema/places.md). Do not silently swap names from the legacy static HTML.

| ID | Name | Plate | Variant |
| --- | --- | --- | --- |
| `bagan` | Bagan | 01 · Dry zone | photo |
| `inle` | Inle Lake | 02 · Shan plateau | photo |
| `yangon` | Yangon | 03 · The old capital | photo |
| `mandalay` | Mandalay | 04 · 21°58′N | type · umber |
| `mrauku` | Mrauk-U | 05 · Rakhine | type · jade |
| `ngapali` | Ngapali | 06 · Rakhine coast | type · gold |

Map pins scroll the matching card into view and focus it. Opening a card (or “Open plate”) launches the drawer with the long copy. The map is **not to scale**.

## Interaction

- Scroll progress: 1px saffron rule at the top of the viewport
- Header becomes solid after a short scroll
- Hero image has a light parallax only for fine pointers when motion is allowed
- `/gallery` is a full-viewport heritage hall: no volume header bar; a glass **Leave** control (and Escape) returns to `#gallery` on the volume; bottom chrome column (label, section tabs, plate rail, credit) stacks so phone and landscape do not overlap; Sulamani uses the local model (cursor rakes the light) with a dusk still until fitted; Sketchfab plates hold a thumbnail until ready; one 3D viewer at a time; no loading chrome; Three/GLB load only for the local plate; static if reduced motion. Plate shape: [`schema/gallery.md`](schema/gallery.md)
- `#gallery` on `/` is a quiet text doorway to `/gallery` (kicker, title, lede). No 3D on the volume — no section tabs, no plate rail, no Sketchfab
- `.reveal` elements fade in once via Intersection Observer
- History eras are buttons; the matching plate image or field plate is `is-on`
- Notes accordion: one panel open at a time (or none)
- Place drawer: modal dialog, body scroll lock, Escape and veil close, focus return
- Profile / Settings plates: same drawer pattern; shared body-lock counter with the place drawer and mobile menu
- Reading preferences: `html[data-type]`, `html[data-motion]`, `html[data-contrast]`; boot script avoids flash; motion preference ORs with `prefers-reduced-motion`. JSON shape: [`schema/reading-prefs.md`](schema/reading-prefs.md)
- Mobile menu: body scroll lock; closes on desktop breakpoint, Escape, or a nav tap
- Glossary terms (`GlossaryTerm`): hover on fine pointers, tap-to-toggle on coarse; Escape and outside tap close; keyboard-focusable with `aria-describedby`
- Local voices: horizontal scroll-snap, one quote at a time; Framer Motion fade/slide once in view
- Prefer `prefers-reduced-motion`: skip parallax, pin pulses, voice motion, and smooth scroll-into-view; honour the reader’s “Always reduce” setting the same way

## Visual system

Dusk glass is the site language. Page ground is umber-deep; type is cream; plates are liquid glass over a dusk field of umber, gold, and jade. Parchment is a glass wash only, not a page. Canonical tokens live in `css/styles.css` (`:root`), mirrored in Tailwind. The kit for a later restyle is `design.md`.

| Token | Hex | Use |
| --- | --- | --- |
| umber-deep | `#110703` | Page ground, scrims, hall |
| cream | `#f3f0eb` | Body type on dusk |
| saffron / saffron-soft | `#c59b27` / `#eec14b` | Accent, progress, focus, kickers |
| umber | `#2b1e16` | Deep plates, type-plate tone |
| jade / jade-mist | `#1b3b36` / `#2d4c47` | Cool plates |
| terracotta | `#b85d38` | Warm plates, map pins |
| parchment | `#faf7f2` | Glass wash (`rgba(250, 247, 242, …)`), not page ground |
| ink / ink-soft | `#1c1c19` / `#4e4540` | Legacy; do not use for new dusk UI |
| hairline-glass | `rgba(243, 240, 235, 0.14)` | Cream rules on dusk |

Type: **Playfair Display** for display, **Plus Jakarta Sans** for body and UI. Hairlines, paper grain overlay, and reticle corners are part of the plate language — do not replace them with generic cards or drop shadows. Glance, sign-in, Explore, the signed-in volume, gallery chrome, and 404 sit on a dusk field: umber / gold / jade washes, paper grain, outline map where it fits, and liquid-glass panels (`backdrop-filter`). Honour `prefers-reduced-motion` there too.

Desktop rhythm at ~980px: aside (coord kicker + lede) + glass plate. Denser chapters (history, map + bento, mosaic) keep their layouts on the same dusk ground. Breakpoints that already matter: ~720px (place grid), ~980px (desktop nav, sticky map beside the bento).

## Accessibility

- Skip link to `#glance`
- `lang="en"` on the root
- Focus-visible rings in saffron
- Map markers are buttons with names and teasers in the accessible name
- Drawer is `role="dialog"` with `aria-modal`, labelled by the place title
- Decorative images on type-adjacent cards may use empty alt; hero and culture photographs must keep descriptive alt text
- Body lock must restore scroll position
- Do not add motion that cannot be reduced

## Technical architecture

Canonical app: **Next.js 15 App Router**, React 19, TypeScript, Tailwind 3 (preflight off so the editorial CSS remains source of truth), Framer Motion for map chrome and local voices.

```
app/                 route, metadata, global Tailwind entry
app/sign-in          reader sign-in
app/sign-up          reader sign-up
components/          EditorialSite, SiteHeader, GalleryPeek, GalleryRoom, PlacesSection, InteractiveMap, GlossaryTerm, LocalVoices, AuthForm, ContactForm, ReadingPrefsProvider
app/api/contact      Serverless contact POST (Resend + Upstash). Cloudflare Worker fallback in workers/contact.ts
lib/places.ts        place records and map viewBox
lib/gallery.ts       heritage hall sections and plates (Sketchfab + local Sulamani)
lib/auth/            session, password hashing, local reader store
lib/body-lock.ts     shared body scroll lock for drawers and menus
lib/reading-prefs.ts local reading preference helpers
lib/validation.ts    Contact form Zod schema
lib/rateLimit.ts     Upstash limiter; skipped when env is unset
css/styles.css       editorial stylesheet (primary)
public/images/       served photographs
data/                local reader records (gitignored)
schema/              field contracts (see schema.md)
```

`index.html`, `js/main.js`, and `assets/images/` are the original static export. They are not the runtime. Do not add features there unless the task is explicitly to keep the static snapshot in sync.

Reader accounts are local. Shapes for `StoredReader`, the `md_reader` session cookie, and password hashing: [`schema/readers.md`](schema/readers.md). Optional `AUTH_SECRET` in the environment; otherwise a secret is minted to `data/.session-secret`. No third-party identity provider.

The contact form is stateless: no database. Mail goes out through Resend from a Vercel serverless route. Vercel hostnames are often blocked in Myanmar; production should use a custom domain orange-clouded on Cloudflare so readers hit Cloudflare, not Vercel. An optional Cloudflare Worker (`workers/contact.ts`) is the fallback when `/api/contact` cannot be reached.

## Out of scope

- Booking, maps with roads, weather, live visa APIs
- Multi-language UI (Burmese type may appear as content, not as a locale)
- Comments, search, OAuth, or a hosted identity provider
- Expanding into a multi-page magazine without a new spec

## Success

A first-time reader can, in one sitting, name the country and place it roughly from Glance. After sign-in they can recognise four historical turns, open at least one place plate, keep a plate, and leave with a few manners (shoes off, cash, cool season) — without being sold anything.
