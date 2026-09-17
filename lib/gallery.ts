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

export const GALLERY_COLLECTION_HREF =
  "https://sketchfab.com/zamaniproject/collections/bagan-temples-and-pagodas-myanmar-9ff01889a852467e9904fd08f73a9e69";

export const GALLERY_SEARCH_HREF =
  "https://sketchfab.com/search?q=Myanmar&type=models";

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "bagan",
    label: "Bagan",
    plates: [
      {
        id: "sulamani",
        n: "01",
        name: "Sulamani",
        kicker: "Plate 01 · Brick and stucco",
        where: "Monument 748 · c. 1183",
        lede: "Narapatisithu raised it on the dry plain. Move, and the light rakes the stone.",
        source: "local",
        modelSrc: "/models/sulamani-temple.glb",
        credit: "A looking in the round.",
      },
      {
        id: "kubyaukgyi",
        n: "02",
        name: "Kubyauk-gyi",
        kicker: "Plate 02 · Myinkaba",
        where: "Monument 298 · 12th c.",
        lede: "A small temple in Myinkaba. The paintings remain. The Myazedi stone, nearby, still holds the old script.",
        source: "sketchfab",
        sketchfabId: "08ab915fc62944e5ab1b63ac749d5593",
        thumbSrc: "https://media.sketchfab.com/models/08ab915fc62944e5ab1b63ac749d5593/thumbnails/01ccd6c1d7784d4ebf18ab2fe9171e99/fa4bb22b70814c43bc019144d4e5c6c7.jpeg",
        credit: "Scan · Zamani Project, University of Cape Town.",
      },
      {
        id: "kyaukkuumin",
        n: "03",
        name: "Kyauk-ku-umin",
        kicker: "Plate 03 · Nyaung-U",
        where: "Monument 154 · early Bagan",
        lede: "Cut into the river terrace. A cave temple, more stone than sky.",
        source: "sketchfab",
        sketchfabId: "f50ab3e3a71446f9b7c6bbd030d239df",
        thumbSrc: "https://media.sketchfab.com/models/f50ab3e3a71446f9b7c6bbd030d239df/thumbnails/cda7718f7197452394eed7f6c6a3d915/4adf9b4590254f77adc1e7d6226afc5b.jpeg",
        credit: "Scan · Zamani Project, University of Cape Town.",
      },
      {
        id: "seinnyetama",
        n: "04",
        name: "Sein-nyet-ama",
        kicker: "Plate 04 · The pair",
        where: "Monument 1085",
        lede: "The hollow temple that stands with its stupa. Two shapes, one precinct.",
        source: "sketchfab",
        sketchfabId: "f38da8e68ec7441c888dd88897a39d7a",
        thumbSrc: "https://media.sketchfab.com/models/f38da8e68ec7441c888dd88897a39d7a/thumbnails/ca809936c77f45d8974b1d9df8dc9b5b/97b28ce46a984125807fe328c85c4e56.jpeg",
        credit: "Scan · Zamani Project, University of Cape Town.",
      },
      {
        id: "sulamani-inside",
        n: "05",
        name: "The passages",
        kicker: "Plate 05 · Inside Sulamani",
        where: "Monument 748 · the corridors",
        lede: "The corridors turn in brick. Light comes as a slit.",
        source: "sketchfab",
        sketchfabId: "4a0f40235b3c40caabac87bf815c0026",
        thumbSrc: "https://media.sketchfab.com/models/4a0f40235b3c40caabac87bf815c0026/thumbnails/4a41e4eac6a24dfba59e1e86c9bcf3e1/246bd43ba1ad4af5b7ebf363d21d97ab.jpeg",
        credit: "Scan · Zamani Project, University of Cape Town.",
      },
      {
        id: "eimyakyaung",
        n: "06",
        name: "Eim Ya Kyaung",
        kicker: "Plate 06 · Before the quake",
        where: "Bagan · CyArk, 2016",
        lede: "Recorded before the 2016 earthquake. Brick held, then shifted.",
        source: "sketchfab",
        sketchfabId: "66ac0c795bfa44a2b0e9f95254780d37",
        thumbSrc: "https://media.sketchfab.com/models/66ac0c795bfa44a2b0e9f95254780d37/thumbnails/e7d5f838dfb54c98a1fb5b8ae34d8df2/1c93f3036fd647109b65f35dd509cb4c.jpeg",
        credit: "Scan · CyArk.",
      },
      {
        id: "khemingazedi",
        n: "07",
        name: "Khe Min Ga Zedi",
        kicker: "Plate 07 · The stupa",
        where: "Bagan · CyArk",
        lede: "A zedi on the plain. The profile is clean against the dry ground.",
        source: "sketchfab",
        sketchfabId: "895d6d28ceef48da9c891819904648e7",
        thumbSrc: "https://media.sketchfab.com/models/895d6d28ceef48da9c891819904648e7/thumbnails/efdec8323ce4424dafff393560f3a97e/60ef9c4660094565a7617ac801eaa06f.jpeg",
        credit: "Scan · CyArk.",
      },
      {
        id: "ananda",
        n: "08",
        name: "Ananda",
        kicker: "Plate 08 · Ananda-gu-hpaya-gyi",
        where: "Bagan · CyArk",
        lede: "Four standing Buddhas face the cardinal points. The plan is a Greek cross in brick.",
        source: "sketchfab",
        sketchfabId: "914c0cf810584319ae08b185b0343718",
        thumbSrc: "https://media.sketchfab.com/models/914c0cf810584319ae08b185b0343718/thumbnails/11fb55f4c1774a47b701200cd808420b/blob.jpeg",
        credit: "Scan · CyArk.",
      },
    ],
  },
  {
    id: "yangon",
    label: "Yangon",
    plates: [
      {
        id: "shwedagon",
        n: "01",
        name: "Shwedagon",
        kicker: "Plate 01 · The golden hill",
        where: "Yangon · Singuttara",
        lede: "The stupa that holds the city. Gold leaf, bells, and the long climb.",
        source: "sketchfab",
        sketchfabId: "ffca3e0400144a48aad10cd314364fd5",
        thumbSrc: "https://media.sketchfab.com/models/ffca3e0400144a48aad10cd314364fd5/thumbnails/bbb9caede3114d83b2b70661a914e17e/68bcd627c3c64ea0bd3a30e88276d0ea.jpeg",
        credit: "Model · Kyaw Lin Htet.",
      },
      {
        id: "martyrs",
        n: "02",
        name: "Martyrs' Monument",
        kicker: "Plate 02 · Kandawgyi",
        where: "Yangon",
        lede: "A quiet marker by the lake. The city keeps the names.",
        source: "sketchfab",
        sketchfabId: "ce88419ff3da432ab039880691904c24",
        thumbSrc: "https://media.sketchfab.com/models/ce88419ff3da432ab039880691904c24/thumbnails/3b7a8fe03c3f474aad08dc7fe322615b/7bcf047fdc554ddbbdb5ac2a03c12106.jpeg",
        credit: "Model · Thurein Minn Oo.",
      },
    ],
  },
  {
    id: "mandalay",
    label: "Mandalay",
    plates: [
      {
        id: "mingun",
        n: "01",
        name: "Mingun Pahtodawgyi",
        kicker: "Plate 01 · The unfinished mass",
        where: "Mingun · Irrawaddy",
        lede: "Begun as the largest stupa. The quake of 1839 left the cracks you still see.",
        source: "sketchfab",
        sketchfabId: "57b60f6f45f04b3e9bd2b108d5cd481d",
        thumbSrc: "https://media.sketchfab.com/models/57b60f6f45f04b3e9bd2b108d5cd481d/thumbnails/6b08ed8f061f4f3290f79813bbc515bc/d1439cd46f7a40229f87b337f8b3684d.jpeg",
        credit: "Model · LibanCiel.",
      },
    ],
  },
  {
    id: "faith",
    label: "Faith",
    plates: [
      {
        id: "burmese-buddha",
        n: "01",
        name: "Seated Buddha",
        kicker: "Plate 01 · Mandalay manner",
        where: "Burmese image",
        lede: "The face is calm. The robe falls in quiet folds.",
        source: "sketchfab",
        sketchfabId: "007e7e6af9724978b17366f07e17328c",
        thumbSrc: "https://media.sketchfab.com/models/007e7e6af9724978b17366f07e17328c/thumbnails/19a2227dcca844a3b28b4255b1039915/b84f6b41f04d4f35b56285db7b3f3f0e.jpeg",
        credit: "Model · Vision Fountain.",
      },
      {
        id: "gautama",
        n: "02",
        name: "Gautama",
        kicker: "Plate 02 · Standing",
        where: "Myanmar",
        lede: "A standing Gautama. The gesture is still.",
        source: "sketchfab",
        sketchfabId: "5e6098fb9ebf4298835b1f98fc0f0c62",
        thumbSrc: "https://media.sketchfab.com/models/5e6098fb9ebf4298835b1f98fc0f0c62/thumbnails/49ef994961704edaa6b969453d72943d/950b7fc3559b45d89fdde96925944335.jpeg",
        credit: "Model · arshad irfan.",
      },
      {
        id: "sandstone-buddha",
        n: "03",
        name: "Sandstone Buddha",
        kicker: "Plate 03 · Ashmolean",
        where: "Burma · museum cast",
        lede: "Sandstone from Burma, held now in Oxford. The stone keeps the carving.",
        source: "sketchfab",
        sketchfabId: "1a91e0af5d65424998dbf5d950109cea",
        thumbSrc: "https://media.sketchfab.com/models/1a91e0af5d65424998dbf5d950109cea/thumbnails/3698c3052cff4ba99367856290519e94/d27d8246087646c6a3d981477aebacdb.jpeg",
        credit: "Scan · Nitesh Bhatia, Ashmolean.",
      },
      {
        id: "buddha-head",
        n: "04",
        name: "Buddha head",
        kicker: "Plate 04 · 11th–12th c.",
        where: "Minneapolis Institute of Art",
        lede: "A head from an image. The period is early Bagan.",
        source: "sketchfab",
        sketchfabId: "070cb30f27d24c3fbe4e7c13f0eaebad",
        thumbSrc: "https://media.sketchfab.com/models/070cb30f27d24c3fbe4e7c13f0eaebad/thumbnails/3c2dab39fd3b40b89dac2c8cb50e2bb9/f22e056cb1ed49bb800bdc5292136a26.jpeg",
        credit: "Scan · Minneapolis Institute of Art.",
      },
      {
        id: "sakyamuni",
        n: "05",
        name: "Śākyamuni",
        kicker: "Plate 05 · Übersee-Museum",
        where: "Bremen",
        lede: "Śākyamuni in the round. A museum looking at a Burmese image.",
        source: "sketchfab",
        sketchfabId: "c708dbd85bc14b53a9a8a5490728757b",
        thumbSrc: "https://media.sketchfab.com/models/c708dbd85bc14b53a9a8a5490728757b/thumbnails/53f09e5ea8b345e389fe790ee5daa6a5/94b7c1edaba1447c9e707fca23ea96b0.jpeg",
        credit: "Scan · Übersee-Museum Bremen.",
      },
      {
        id: "bagan-buddha",
        n: "06",
        name: "Bagan Buddha",
        kicker: "Plate 06 · On the plain",
        where: "Bagan",
        lede: "An image among the temples. Dust and brick light.",
        source: "sketchfab",
        sketchfabId: "716f7570638f49c0978bd478c1622525",
        thumbSrc: "https://media.sketchfab.com/models/716f7570638f49c0978bd478c1622525/thumbnails/97001fd2da4e4affa83eed7dae935b75/e2edeae584ba410c9af4e6a6161def52.jpeg",
        credit: "Model · noelbynature.",
      },
    ],
  },
  {
    id: "craft",
    label: "Craft",
    plates: [
      {
        id: "paper-mache",
        n: "01",
        name: "Paper-mâché toys",
        kicker: "Plate 01 · Festival forms",
        where: "Burmese craft",
        lede: "Light figures for play and offering. Colour on pulp.",
        source: "sketchfab",
        sketchfabId: "99fa77c40d38437da3f8269d5ac6f428",
        thumbSrc: "https://media.sketchfab.com/models/99fa77c40d38437da3f8269d5ac6f428/thumbnails/dcc29ef46ca6411b9fe222e1e7b30820/4610d02ae17c4132a3e4326647af9918.jpeg",
        credit: "Model · MyoHan.",
      },
      {
        id: "wooden-figure",
        n: "02",
        name: "Wooden figure",
        kicker: "Plate 02 · Carved wood",
        where: "The Watt Institution",
        lede: "A Burmese figure in wood. The grain still shows.",
        source: "sketchfab",
        sketchfabId: "8dcf9178a74a422fac60f6b991c1c9a4",
        thumbSrc: "https://media.sketchfab.com/models/8dcf9178a74a422fac60f6b991c1c9a4/thumbnails/aef91e5e43d7447196e6601cf23f4d04/2a4e1afbbd0a492a88064b55732bb789.jpeg",
        credit: "Scan · The Watt Institution.",
      },
      {
        id: "kalaga",
        n: "03",
        name: "Kalaga",
        kicker: "Plate 03 · Dragon tapestry",
        where: "Embroidered cloth",
        lede: "A kalaga with a dragon. Thread raised from the ground.",
        source: "sketchfab",
        sketchfabId: "acc73e5719ad419791b8c3b449603254",
        thumbSrc: "https://media.sketchfab.com/models/acc73e5719ad419791b8c3b449603254/thumbnails/accbb703187b4205b439de22eb23fbef/01c5098335174ac78d8a60e8ef3350da.jpeg",
        credit: "Scan · JFN.",
      },
      {
        id: "chinthe",
        n: "04",
        name: "Chinthe",
        kicker: "Plate 04 · Pagoda lion",
        where: "Guardian",
        lede: "The lion that keeps the stair. Mouth open, stance fixed.",
        source: "sketchfab",
        sketchfabId: "1fbf69bfaf534a299b2329fafc9def42",
        thumbSrc: "https://media.sketchfab.com/models/1fbf69bfaf534a299b2329fafc9def42/thumbnails/4e4ba807895c4375a47f18fc83b3d9b6/4083fd3edda74c7da6afdd958a91b802.jpeg",
        credit: "Model · MyoHan.",
      },
      {
        id: "naya",
        n: "05",
        name: "Nāya",
        kicker: "Plate 05 · Serpent form",
        where: "Burmese myth",
        lede: "A nāya in the round. Scale and coil.",
        source: "sketchfab",
        sketchfabId: "6f08134a444842c785aa2b1700886ad8",
        thumbSrc: "https://media.sketchfab.com/models/6f08134a444842c785aa2b1700886ad8/thumbnails/7bb7bf678cd04a638af17c413badec76/967c94ee6f6c4119a6066e752256e075.jpeg",
        credit: "Model · MyoHan.",
      },
      {
        id: "lion-throne",
        n: "06",
        name: "Lion Throne",
        kicker: "Plate 06 · The seat",
        where: "Court form",
        lede: "The lion throne. Carved for a king who no longer sits.",
        source: "sketchfab",
        sketchfabId: "284f61dc0b8844b0914abddeeb2edcde",
        thumbSrc: "https://media.sketchfab.com/models/284f61dc0b8844b0914abddeeb2edcde/thumbnails/69fc1a9a82e04b1b84c9038de866e1e7/8ade6d9daed34d838d4854a46b4fdcf2.jpeg",
        credit: "Model · MyoHan.",
      },
      {
        id: "opium-weight",
        n: "07",
        name: "Opium weight",
        kicker: "Plate 07 · Bronze animal",
        where: "Trade weight",
        lede: "A small bronze animal used as a weight. Market and measure.",
        source: "sketchfab",
        sketchfabId: "c695cd4d3d9c450ba45f9191e69ea63f",
        thumbSrc: "https://media.sketchfab.com/models/c695cd4d3d9c450ba45f9191e69ea63f/thumbnails/4324b693db4e4e14a84ca7c8ef030cfd/d4387ff0902a42609f60c431cf64536a.jpeg",
        credit: "Scan · T.Koeniger.",
      },
    ],
  },
];

/** Flat list for lookups and arrow-key cycling within the active section. */
export const GALLERY_PLATES: GalleryPlate[] = GALLERY_SECTIONS.flatMap((s) => s.plates);

export function getGallerySection(id: string | null): GallerySection {
  return GALLERY_SECTIONS.find((s) => s.id === id) ?? GALLERY_SECTIONS[0];
}

export function getGalleryPlate(id: string | null): GalleryPlate {
  return GALLERY_PLATES.find((p) => p.id === id) ?? GALLERY_SECTIONS[0].plates[0];
}

export function findSectionForPlate(plateId: string): GallerySection {
  return (
    GALLERY_SECTIONS.find((s) => s.plates.some((p) => p.id === plateId)) ??
    GALLERY_SECTIONS[0]
  );
}

/** Prefer the stored Sketchfab still so the frame is never empty. */
export function galleryPoster(plate: GalleryPlate): string | undefined {
  if (plate.thumbSrc) return plate.thumbSrc;
  if (plate.sketchfabId) {
    return `https://media.sketchfab.com/models/${plate.sketchfabId}/thumbnails/${plate.sketchfabId}/1920x1080.jpeg`;
  }
  return undefined;
}
