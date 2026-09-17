# Voices

Source: [`components/LocalVoices.tsx`](../components/LocalVoices.tsx). Interstitial quotes on the signed-in volume (`#voices`). Not a chapter; not in primary nav. Not in `lib/`; not persisted.

## Type

```ts
type Voice = {
  name: string;
  role: string;
  quote: string;
  imageSrc: string;
};
```

| Field | Notes |
| --- | --- |
| `name` | Speaker name |
| `role` | Quiet role / place line |
| `quote` | Short quote; keep the editorial voice |
| `imageSrc` | Path under `/images/...` |

## Current records

| Name | Role |
| --- | --- |
| Thiri | tea shop owner, Yangon |
| U Sandimar | monk, Mahagandhayon, Mandalay |
| Ma Hla | lotus weaver, Inle Lake |
| Ko Myint | pagoda caretaker, Bagan |

## Invariants

- Do not restyle as testimonial cards.
- Horizontal scroll-snap, one quote at a time; respect reduced motion.
- Roman indexes in the UI are `I`–`IV` for the four slides.
