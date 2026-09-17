# Design system — Myanmar Discovery

Visual kit for restyling the site. Product, voice, and behaviour stay in [`spec.md`](spec.md). Implementation lives in [`css/styles.css`](css/styles.css) (source of truth) with map helpers in [`app/globals.css`](app/globals.css) and Tailwind tokens in [`tailwind.config.js`](tailwind.config.js).

The site is a printed volume on dusk glass: cream type on umber-deep, saffron kickers, floating glass plates over a dusk field of umber, gold, and jade. Do not restyle into a card-grid tourism template, and do not add booking CTAs.

---

## Principles

- Quiet, specific, slightly literary. Short sentences. No brochure adjectives, no exclamation marks.
- Plate language: hairlines, paper grain, reticle corners, glass sheen. Not generic drop shadows or rounded marketing cards.
- One visual system. Reuse CSS custom properties and existing class names.
- Honour `prefers-reduced-motion` for liquids, sheen, parallax, pin pulses, and smooth `scrollIntoView`.
- Accessibility: skip link, saffron focus rings, drawer dialog focus, body scroll lock.

---

## Palette

Tokens in `:root`. Parchment is a **glass wash**, not page ground.

| Token | Hex / value | CSS | Use |
| --- | --- | --- | --- |
| umber-deep | `#110703` | `--umber-deep` | Page ground, scrims, hall |
| cream | `#f3f0eb` | `--cream` | Body type on dusk |
| type-muted | `rgba(243, 240, 235, 0.72)` | `--type-muted` | Ledes, captions, secondary copy |
| saffron | `#c59b27` | `--saffron` | Progress rule, focus, map pin, pressed keep |
| saffron-soft | `#eec14b` | `--saffron-soft` | Kickers, indexes, italic display, ghost hover |
| umber | `#2b1e16` | `--umber` | Type-plate tone, skip-link chip |
| jade | `#1b3b36` | `--jade` | Cool type plates, mosaic invert cousin |
| jade-mist | `#2d4c47` | `--jade-mist` | Cool mist |
| terracotta | `#b85d38` | `--terracotta` | Warm mosaic tags, map pin fill |
| parchment | `#faf7f2` | `--parchment` | Glass wash only (`rgba(250, 247, 242, 0.22)`) |
| parchment-dim | `#f4efe6` | `--parchment-dim` | Legacy; do not use as page |
| parchment-deep | `#ebe4d6` | `--parchment-deep` | Legacy |
| ink / ink-soft | `#1c1c19` / `#4e4540` | `--ink` / `--ink-soft` | Legacy; do not use for new dusk UI |
| hairline | `rgba(43, 30, 22, 0.14)` | `--hairline` | Legacy dark-on-light |
| hairline-strong | `rgba(43, 30, 22, 0.28)` | `--hairline-strong` | Legacy |
| hairline-glass | `rgba(243, 240, 235, 0.14)` | `--hairline-glass` | Rules on dusk |
| hairline-glass-strong | `rgba(243, 240, 235, 0.28)` | `--hairline-glass-strong` | Glass plate borders |
| glass-fill | parchment→umber gradient | `--glass-fill` | Liquid-glass panels |
| error | `#e4a07c` | (hardcoded) | Auth form errors |
| selection | `#ffdf98` on `#251a00` | `::selection` | Text highlight |

**Do not invent a second palette.** Mirror any new token in `tailwind.config.js`.

---

## Type

| Role | Family | Token |
| --- | --- | --- |
| Display | Playfair Display | `--font-display` |
| Body / UI | Plus Jakarta Sans | `--font-body` |

| Element | Size | Weight / style | Colour |
| --- | --- | --- | --- |
| Hero `h1` | `clamp(2.55rem, 10.5vw, 7.4rem)` | 400, italic em in saffron-soft | cream |
| Auth / 404 `h1` | `clamp(2.15rem, 5.5vw, 3.05rem)` | 400 | cream |
| Section `h2` | `clamp(2rem, 4.6vw, 3.15rem)` | 400 | cream |
| Place / drawer titles | `clamp(1.6rem–3rem)` | 400 | cream |
| `.kicker` | 0.64rem | 600, 0.14em caps | saffron-soft |
| `.idx` | 0.68rem | 600, 0.2em caps, 1.5rem rule | saffron-soft |
| UI caps (nav, `.btn`, `.auth-link`) | 0.68rem | 600, 0.16–0.18em caps | currentColor / umber-deep on fill |
| Fact `dd` | `clamp(1.35rem, 3vw, 1.7rem)` | Playfair | cream |
| Lede / body | ~1rem, line-height 1.65–1.7 | 400 | `--type-muted` or cream 0.86 |

---

## Spacing and breakpoints

| Token | Value |
| --- | --- |
| `--page-pad` | `clamp(1.25rem, 4.5vw, 5rem)` |
| `--max` | `72rem` |
| `--header-h` | `4.25rem` |
| `--safe-top` / `--safe-bottom` | `env(safe-area-inset-*)` |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |

| Break | What changes |
| --- | --- |
| 520px | Notes accordion indent |
| 720px | Place grid, mosaic 2-col, glance facts 2–3 col |
| 980px | Desktop nav; sticky map; history two-col; **aside + glass plate**; peek/volume plate right-aligned |
| 980–1180px | Tighter header |
| max 979px | Hamburger; hide second auth link and reader name; hide auth stage ornaments |
| landscape 560px height | Compressed hero |

---

## Surfaces

### Dusk field stage

Classes: `.public-stage`, `.public-stage-bg`, `.auth-stage`, `.auth-shell`.

Recipe:

1. Ground `--umber-deep`
2. CSS dusk field (`.dusk-field`) — saffron-soft at upper right, jade-mist at lower left, faint cream mist in the middle
3. Dual scrim (`.auth-stage-scrim`) — lighter horizontal + vertical umber washes
4. Gold / jade / mist liquids (`.auth-liquid--gold|jade|mist`, `mix-blend-mode: screen`)
5. Optional balloons, outline map, place shards, compass (auth pages)
6. Reticle corners (`.reticle`)
7. Paper grain on `body::before` (`overlay`, opacity 0.07)

Signed-out `/` and signed-in chapters share `.public-stage`. Hero and closeout are their own photo plates (Bagan dawn / Shwedagon) and sit outside or above that stage.

### Liquid glass

Class: `.auth-plate`, `.glass-panel`, and the same recipe on eras, notes checklist, drawer, map frame, gallery label, peek doorway.

```
background: var(--glass-fill);
border: 1px solid var(--hairline-glass-strong);
backdrop-filter: blur(28px) saturate(1.55);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.22–0.38), 0 18–28px 48–70px rgba(17,7,3,0.28–0.38);
```

Sheen: `.auth-plate::after` (`glass-sheen`, 9s). Off under reduced motion.

### Header / footer

- Header: transparent cream over the hero; after scroll `.is-glass` (umber-alpha + blur). Never parchment `.is-solid` on live routes.
- Shared `SiteHeader`: chapter links with saffron hairline on `.is-active`; hairline before `.nav-auth`.
- Signed-in: `.reader-chip` (initials) opens `.reader-menu-panel` (Profile / Settings / Sign out). Profile and Settings reuse `.drawer` / `.drawer-veil` as `.account-plate`.
- Signed-out: Settings control + Sign in / Explore.
- Reading prefs: `html[data-type="large"]` (112.5% root), `html[data-contrast="strong"]` (lifted `--type-muted`), `html[data-motion="reduce"]` (mirrors the reduced-motion block). Controls are `.reading-options` chips in the Settings plate. JSON shape: [`schema/reading-prefs.md`](schema/reading-prefs.md).
- Footer: always `.is-glass` — cream colophon, muted caps.
- Skip link: umber chip, parchment type, jumps to `#glance` or `#auth`.
- Progress: 1px `--saffron` at the top of the viewport.

---

## Layouts

### Hero — full-bleed photo plate

```
[ reticle ]
[ kicker  21°10′N · Bagan ]
[ h1      Myanmar, at first light. ]
[ lede ]
[ Plate I · Scroll cue ]
```

Viewport tall. Cream display, saffron italic. Shared on `/` for both sessions.

### Desktop aside + plate (~980px)

Class: `.auth-main` / `.public-main.auth-main`.

```
| aside                         | glass plate (max ~30rem) |
| kicker · coords               | .idx                     |
| Playfair lede                 | facts / form / 404 copy  |
| optional outline map          | actions                  |
```

Used on: signed-out glance, signed-in glance, sign-in, sign-up, 404. Below 980px the aside hides; the plate centres.

### Signed-out stack

Hero → glance (aside + plate) → gallery peek (glass doorway, text only) → volume gate (glass plate, right-aligned on desktop) → glass footer.

### Signed-in chapters

Same dusk stage after the hero. Glance matches signed-out. Then:

| Chapter | Layout | Glass treatment |
| --- | --- | --- |
| History | Sticky photo/field plate + era list | Eras column is a glass stack; active era saffron-soft rail |
| Places | Outline map + six-up bento | Map frame glass; place cards keep photos/type tones, cream hairline |
| Voices | Horizontal snap, one quote | Cream italic quotes, saffron-soft marks — not testimonial cards |
| Culture | Mosaic of photo + type tiles | Photo tiles stay; clay tiles are glass, not parchment |
| Notes | Aside (kicker + h2) + accordion | Checklist is a glass panel |
| Closeout | Full-bleed Shwedagon | Cream / saffron-soft / ghost button |

Drawer: right sheet, glass over umber veil. Escape, veil click, focus return.

### Gallery hall (`/gallery`)

Full-viewport 3D. Do **not** put the scan in a 29rem card. A dusk still (or Sketchfab thumbnail) holds the frame until the live scan is ready. One WebGL at a time; Three/GLB only when Sulamani is the active plate.

```
[ scan / still — no volume header bar ]
[ glass Leave (close-x) — top right ]
[ chrome column — bottom ]
  glass label: kicker, title, lede
  section tabs + plate rail — glass chips
  credit · The volume (hidden on narrow phones; Leave is the exit)
```

Phone (`max-width: 719px`): compact label, wrap subtitle, hide lede and volume cue, 44px chip targets. Short landscape: tighter chrome so the scan stays visible.

Peek on `/` uses the shared dusk stage; doorway is a glass plate (“The hall”), right-aligned at 980px.

---

## Components

### Buttons

| Class | Look | Use |
| --- | --- | --- |
| `.btn` | Saffron fill `#c59b27` / 0.92, umber-deep type, 0.68rem caps, optional `.arrow` | Primary: Explore, Sign in submit, Begin looking |
| `.btn:hover` | `--saffron-soft` fill | |
| `.btn.is-ghost` | Transparent, cream type, cream 0.45 border | Secondary: Sign in on the gate, Return home, closeout |
| `.btn.is-ghost:hover` | Parchment 0.08 wash, saffron-soft border | |
| `.btn.is-ink` | Ghost on dusk (cream type). Legacy name; do not restore parchment ink | |
| `.btn:disabled` | Opacity 0.55, `cursor: wait` | Pending auth |

Padding: `0.9rem 1.5rem`. No border-radius. Arrow is a 1.4rem hairline with a 45° corner.

### Text actions

| Class | Look | Use |
| --- | --- | --- |
| `.auth-link` | 0.68rem caps, 0.72 opacity | Header Sign in / Sign out / Settings |
| `.auth-link.is-strong` | Full opacity | Explore in the header |
| `.reader-chip` | Round glass initials | Opens account menu |
| `.keep-plate` | Saffron-soft underline caps | Drawer: Keep this plate (`savedPlaceIds` — [`schema/readers.md`](schema/readers.md)) |
| `.keep-plate[aria-pressed="true"]` | `--saffron` | Kept in the volume |
| `.gallery-peek-door` | Saffron-soft caps + arrow | The hall |
| `.scroll-cue` | Caps + vertical saffron fade line | Hero / gallery foot |

### Forms

`.field` + `.auth-form` inside `.auth-plate`.

- Label: 0.68rem caps, `--type-muted`
- Input: dusk wash `rgba(17, 7, 3, 0.22)`, cream type, glass hairline; focus saffron-soft
- Autofill: cream fill on umber inset (auth plate)
- `.auth-error`: `#e4a07c`
- `.auth-switch`: muted cream; links saffron-soft underline

### Navigation

- Desktop: `.nav-desktop` links, 0.68rem caps, 0.72 opacity, 1.0 when `.is-active`
- Hamburger: `.menu-toggle` (hidden ≥980px)
- Overlay: `.nav-mobile` — umber-deep, Playfair items, saffron-soft `em` indexes, glass hairlines, body lock
- Gallery: `.gallery-sections` and `.gallery-plates` — glass chips, saffron-soft active

### Plates and chips

- `.auth-plate` / `.is-glass` — glance, volume gate, auth, 404
- `.era` / `.era.is-active` — history
- `.place` photo or `.is-type` with `data-tone="umber|jade|gold"`
- `.tile.is-photo|is-clay|is-invert|is-jade`
- `.fact` — icon, `dt` muted caps, `dd` Playfair
- Glossary: dotted saffron underline; tip is umber-deep chip with saffron-soft term

### Overlay chrome

- `.drawer-veil` — umber 0.58
- `.drawer` — glass sheet, cream title, muted body, saffron-soft bar, cream `.close-x`
- `.glossary-tip` — already dusk

---

## Motion

| Effect | Class / keyframe | Reduced motion |
| --- | --- | --- |
| Liquids | `liquid-morph` | Hide `.auth-liquids` |
| Glass sheen | `glass-sheen` | Hide `.auth-plate::after` |
| Balloons | `.hero-balloon`, `.auth-balloon` | Hide |
| Hero parallax | fine pointer only | Off |
| Reveal | `.reveal` / `.is-in` | Instant opacity |
| Pin pulse / map | Framer Motion | Off |
| Voices | fade/slide once in view | Off |
| Scroll-into-view | places | `behavior: auto` |

---

## Files to touch on a restyle

1. Tokens and chrome — [`css/styles.css`](css/styles.css) `:root`, `body`, header, footer, `.auth-plate`, `.public-stage`
2. Map frame — [`app/globals.css`](app/globals.css)
3. Tailwind mirror — [`tailwind.config.js`](tailwind.config.js)
4. Markup shells — [`components/EditorialSite.tsx`](components/EditorialSite.tsx), [`AuthShell.tsx`](components/AuthShell.tsx), [`GalleryRoom.tsx`](components/GalleryRoom.tsx), [`app/not-found.tsx`](app/not-found.tsx)
5. Spec table — [`spec.md`](spec.md) Visual system

Copy, IA, and session gate stay in [`spec.md`](spec.md). Field contracts live in [`schema.md`](schema.md). Implementation: [`lib/places.ts`](lib/places.ts), [`lib/gallery.ts`](lib/gallery.ts), [`lib/auth/`](lib/auth/), [`lib/reading-prefs.ts`](lib/reading-prefs.ts).
