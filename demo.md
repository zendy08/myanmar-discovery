<p align="center">
  <img src="public/images/bagan-dawn.png" alt="Bagan at dawn" width="720" />
</p>

<h1 align="center">Demo</h1>

<p align="center">
  An ~8 minute walkthrough of <strong>Myanmar Discovery</strong><br />
  <sub>Quiet looking &middot; name the country &mdash; do not sell it</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/duration-~8_min-c59b27?style=flat-square&labelColor=110703" alt="About 8 minutes" />
  <img src="https://img.shields.io/badge/runtime-Next.js_3000-1b3b36?style=flat-square&labelColor=110703" alt="Port 3000" />
  <a href="./README.md"><img src="https://img.shields.io/badge/setup-README-b85d38?style=flat-square&labelColor=110703" alt="README" /></a>
  <a href="./security.md"><img src="https://img.shields.io/badge/trust-security.md-2b1e16?style=flat-square&labelColor=110703" alt="Security" /></a>
</p>

<p align="center">
  <a href="#before-you-start">Prep</a> &middot;
  <a href="#script-8-minutes">Script</a> &middot;
  <a href="#keyboard-and-a11y-beats-pick-two">A11y</a> &middot;
  <a href="#talking-points">Talking points</a>
</p>

---

Product truth: [`spec.md`](./spec.md). Setup: [`README.md`](./README.md).

## Before you start

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. Use a clean browser profile or a private window so the session gate is visible.

| Prep | Why |
| :--- | :--- |
| Desktop ~1280px, then a phone width | Nav vs overlay menu; map beside the bento |
| Reduced-motion pass once | Settings &rarr; Always reduce, or OS preference |
| Optional: create a throwaway reader | Unlock history through closeout |
| Optional: contact env from `.env.example` | Only if you will send a test note |

Contact mail and Upstash are optional. The volume runs without them.

## Script (~8 minutes)

### 1. Opening plate (~1 min)

Land on `/`. Pause on the hero: Bagan at dawn, title, lede.

Say: this is a printed volume online &mdash; plates and kickers, not an itinerary builder.

Scroll to **Glance**. Point at the five facts (seat, language, currency, faith, season). A first-time reader should place the country roughly here.

### 2. Gallery peek &rarr; hall (~2 min)

On the volume, open the **Gallery** doorway (`#gallery`) &mdash; text only, no 3D on `/`.

Enter `/gallery`. Walk one section (Bagan or Faith). Show:

- Section tabs and plate rail
- One live viewer at a time (Sulamani local model or a Sketchfab plate)
- **Leave** (or Escape) returns to `#gallery` on the volume

If reduced motion is on, note stills instead of motion.

<p align="center">
  <img src="public/images/inle.png" alt="Inle Lake" width="42%" />
  &nbsp;&nbsp;
  <img src="public/images/shwedagon.png" alt="Shwedagon" width="42%" />
</p>

<p align="center"><sub>Plates you may open later &mdash; Inle &middot; Yangon</sub></p>

### 3. The gate (~1 min)

Signed-out: after glance and the peek, the quiet **volume gate** (`#volume`) holds the later chapters.

| Action | Route |
| :----- | :---- |
| **Sign in** | Returning reader &rarr; `/sign-in` |
| **Explore** | New reader &rarr; `/sign-up` (name, email, password) |

Create or sign into a demo account. Land back on `/` with the full volume open.

### 4. History and places (~2 min)

**History** &mdash; click through eras; the sticky plate should follow the active era.

**Places** &mdash; outline map (not to scale):

1. Activate a pin (e.g. Bagan or Inle) &mdash; card scrolls into view and focuses
2. **Open plate** &mdash; drawer with the long copy
3. Escape / veil closes; focus returns
4. Optionally **keep** a plate (signed-in)

Six plates: **Bagan &middot; Inle &middot; Yangon &middot; Mandalay &middot; Mrauk-U &middot; Ngapali**.

### 5. Voices, culture, notes, write (~1.5 min)

| Stop | Show |
| :--- | :--- |
| **Voices** | Horizontal snap; one quote at a time |
| **Culture** | Mosaic (faith, thanaka, food, water, cloth, Thingyan) |
| **Notes** | Accordion; one panel; manners, not legal advice |
| **Write** | Quiet correspondence (`#write`); public, not booking |

### 6. Close and chrome (~30 s)

**Closeout** &mdash; return toward places. Show the header reader chip &rarr; **Profile** / **Settings** (type size, motion, contrast &mdash; device only). Sign out returns to the public front of the volume.

## Keyboard and a11y beats (pick two)

| Beat | Expect |
| :--- | :----- |
| Skip link | Jumps to `#glance` |
| Tab into a map pin | Name + teaser in the accessible name |
| Open drawer | Focus inside; Escape closes |
| Mobile menu | Body scroll locked; Escape or nav tap closes |
| Glossary term | Hover / tap / keyboard; Escape dismisses |

## What not to demo as product

- `index.html` / `js/main.js` &mdash; static snapshot, not the runtime
- Booking, live visa APIs, tiled web maps
- Multi-language UI or OAuth

## Talking points

| Prompt | Answer |
| :----- | :----- |
| Why sign-in? | Later chapters and kept plates for returning readers; glance and gallery stay public |
| Why not Google Maps? | The map is an outline for orientation, not GIS |
| Where does copy live? | Places &rarr; `lib/places.ts`; gallery &rarr; `lib/gallery.ts`; chapters &rarr; `EditorialSite.tsx` |
| Production in Myanmar? | Custom domain on Cloudflare in front of the host &mdash; see [`security.md`](./security.md) |

## Success

A viewer can name Myanmar, recall one historical turn, open one place plate, and leave with one practical manner &mdash; without being sold anything.

---

<p align="center"><sub><a href="./README.md">README</a> &middot; <a href="./security.md">Security</a> &middot; <a href="./spec.md">Spec</a></sub></p>
