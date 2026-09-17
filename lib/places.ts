export const MAP_VIEWBOX = {
  width: 270,
  height: 410,
} as const;

/** Mainland silhouette fitted to MAP_VIEWBOX. Natural Earth 50m, simplified. Not to scale. */
export const MYANMAR_OUTLINE =
  "M 206.7 183.4 L 201.9 181.2 L 193 182.5 L 193.5 186.9 L 185 187.9 L 181.8 194.7 L 163.1 195.1 L 159 201.1 L 157.6 219.2 L 149.9 220.6 L 155.2 225.3 L 156.7 235.5 L 171.9 252.5 L 176.5 265.8 L 181.2 265.4 L 175.1 271.6 L 174.3 285.7 L 166.8 289.1 L 167 293.8 L 186.3 319.9 L 186 334.1 L 191.9 344 L 196.2 359.9 L 178.5 383.1 L 177.3 392.8 L 174.4 396 L 172.4 382.7 L 176.8 376.3 L 178.1 363.8 L 180.9 361.2 L 176 360.8 L 177.2 350.7 L 175.2 350.3 L 176.8 348.2 L 174.7 331.3 L 166.9 314.4 L 165.1 320 L 164.9 310.7 L 160.9 300.5 L 163.2 300.5 L 158.9 296.3 L 156.8 275.2 L 154.2 272.3 L 157.1 260.9 L 149.9 261.9 L 146.3 250 L 139.1 243.7 L 140.2 251.3 L 137.3 258 L 130.4 262.2 L 125.4 256.8 L 128.2 263.5 L 116.6 269.2 L 108.8 278.4 L 107 277.7 L 107.9 270.6 L 104.4 276.3 L 99.6 276.4 L 98.6 268.9 L 93.8 274.6 L 94.6 262.1 L 89.2 270.7 L 84.7 272.3 L 92.3 240.2 L 85.2 216 L 81.5 212.8 L 81 204.7 L 78.6 212.7 L 69.6 203 L 76.5 205.7 L 80.1 201.5 L 72.1 194.6 L 74 191.8 L 64.6 188.5 L 62.1 192.9 L 59.5 188.4 L 60.8 182.2 L 57 186.8 L 55.1 185.6 L 56.3 181.4 L 53.4 178.3 L 53.7 183.8 L 46.6 175.1 L 42.5 163.2 L 45.6 160.2 L 51.1 163.7 L 50.6 149.1 L 53 145.9 L 58.7 148.5 L 62.5 143.8 L 61.1 133.8 L 67.5 120.9 L 66.2 105.9 L 82.7 109.8 L 94.7 85.6 L 92.1 80 L 103.5 65 L 103.4 53.6 L 125.4 39.8 L 136.6 38.4 L 144.2 42.8 L 139.6 33.1 L 149.1 25.8 L 148.8 20 L 153.3 14 L 164.9 21.6 L 169 33.9 L 172.2 31.6 L 176.3 33.4 L 178.1 51.5 L 177 62 L 174.5 64.4 L 176.4 68.7 L 169.7 74.4 L 165.8 74.8 L 163 80.5 L 159.1 81.4 L 157.4 89.3 L 154.2 91.2 L 153.1 97.1 L 156.8 102.5 L 153.8 109.1 L 167.2 105 L 180.1 104.7 L 176.8 109.2 L 180.7 124 L 194 128.8 L 187.5 146 L 202.5 148 L 202.9 153.6 L 208.6 159.7 L 216.7 159.5 L 227.5 154.1 L 226.5 159.6 L 218.7 164.1 L 215.2 169.4 L 217 172.2 L 209.3 174.9 L 206.8 182.3 L 206.7 183.4 Z";

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

export const PLACES: Place[] = [
  {
    id: "bagan",
    name: "Bagan",
    teaser: "A plain of temples. Best at the hour before the heat.",
    plate: "Plate 01 · Dry zone",
    where: "21°10′N · 94°52′E · Mandalay Region",
    body: "A twenty-six-square-mile plain of brick stupas, raised when this bend of the river was a capital. Go at first light, before the heat, and the mist still holds the shapes. An e-bike is enough. The temples are the point; the balloons, if they fly, are only weather.",
    meta: [
      ["Stay with", "Dawn and dusk. Midday is a white glare."],
      ["Move by", "Electric bike, on sandy tracks between fields."],
    ],
    x: 98.1,
    y: 165.8,
    variant: "photo",
    image: "/images/bagan-dawn.png",
    imageAlt: "Hot-air balloons and brick temples on the Bagan plain at dawn.",
    className: "place-bagan",
  },
  {
    id: "inle",
    name: "Inle Lake",
    teaser: "Leg-rowers, floating gardens, silk from lotus stem.",
    plate: "Plate 02 · Shan plateau",
    where: "20°33′N · 96°55′E · 900m",
    body: "A shallow highland lake where the Intha farm tomatoes on floating mats of weed and row with one leg. Villages sit on stilts. Lotus silk is still spun here. Hire a longboat for a day, and do not rush the market circuit — the lake is the culture, not a backdrop.",
    meta: [
      ["Stay with", "A night or two on the water, not a day-trip only."],
      ["Look for", "Lotus weave, boat workshops, the five-day market."],
    ],
    x: 140.5,
    y: 178.6,
    variant: "photo",
    image: "/images/inle.png",
    imageAlt: "An Intha fisherman standing on one leg in a narrow boat on Inle Lake.",
    className: "place-inle",
  },
  {
    id: "yangon",
    name: "Yangon",
    teaser: "The city gathers, at dusk, around a hill of gold.",
    plate: "Plate 03 · The old capital",
    where: "Shwedagon Pagoda · Dagon Township",
    body: "The commercial heart, even after the capital moved inland. Downtown is teak, plaster, and street tea. Above it, Shwedagon — a hill of gold leaf, lamps, and barefoot circuits at dusk. The pagoda is not an attraction you tick. It is where the city goes when the heat drops.",
    meta: [
      ["Go at", "Late afternoon, into blue hour."],
      ["Also", "Circular train, tea shops, the old secretariat façades."],
    ],
    x: 124.8,
    y: 256.1,
    variant: "photo",
    image: "/images/shwedagon.png",
    imageAlt: "Shwedagon Pagoda at dusk, lamps and monks on the marble terrace.",
    className: "place-yangon",
  },
  {
    id: "mandalay",
    name: "Mandalay",
    teaser: "Last royal seat. Teak bridge, gold leaf, hill at evening.",
    plate: "Plate 04 · 21°58′N",
    where: "21°58′N · 96°05′E",
    body: "King Mindon’s city, from 1857. The palace compound is a reconstruction; the craft is not — gold-leaf beating, marble carving, silk. At Amarapura, U Bein Bridge crosses Taungthaman Lake on two centuries of teak. Sunset there is famous because it is, in fact, that quiet.",
    meta: [
      ["See", "U Bein at dusk · Mahagandhayon in the morning."],
      ["Bring home", "Gold leaf, if you buy it from the beaters."],
    ],
    x: 123.3,
    y: 149.2,
    variant: "type",
    tone: "umber",
    className: "place-mandalay",
  },
  {
    id: "mrauku",
    name: "Mrauk-U",
    teaser: "Stone temples of an Arakanese kingdom, still half in the hills.",
    plate: "Plate 05 · Rakhine",
    where: "20°36′N · 93°11′E · Mrauk-U Township",
    body: "A former Arakanese capital, now a scatter of stone pagodas in low hills and paddy. The temples are quieter than Bagan, and older in a different way — fortress-thick, some of them, with interiors that hold their dark. Go with a local guide; the roads are part of the story.",
    meta: [
      ["Pace", "Slow. This is not a checklist landscape."],
      ["Pair with", "The Rakhine coast, if the roads and advice allow."],
    ],
    x: 63.1,
    y: 177.6,
    variant: "type",
    tone: "jade",
    className: "place-mrauku",
  },
  {
    id: "ngapali",
    name: "Ngapali",
    teaser: "A pale crescent of the Bay of Bengal, palms, unhurried evenings.",
    plate: "Plate 06 · Rakhine coast",
    where: "18°25′N · 94°20′E · Thandwe",
    body: "A fishing village that learned, gently, to keep a beach. The Bay of Bengal is the point: pale sand, boats at dawn, grilled fish at dusk. It is not a resort strip if you do not treat it as one. Walk the shore in the cool, and leave the middle of the day to the heat.",
    meta: [
      ["Stay with", "Sunrise on the sand, dinner by the boats."],
      ["Know", "It is a coast, not a circuit. One place is enough."],
    ],
    x: 86.9,
    y: 222.6,
    variant: "type",
    tone: "gold",
    className: "place-ngapali",
  },
];

export const MAP_PLACES = PLACES.map(
  ({ id, name, teaser, x, y }) => ({ id, name, teaser, x, y }),
);
