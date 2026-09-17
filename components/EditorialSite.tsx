"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ContactForm from "@/components/ContactForm";
import GlossaryTerm from "@/components/GlossaryTerm";
import GalleryPeek from "@/components/GalleryPeek";
import LocalVoices from "@/components/LocalVoices";
import PlacesSection from "@/components/PlacesSection";
import SiteHeader from "@/components/SiteHeader";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";
import { toggleSavedPlaceAction } from "@/lib/auth/actions";
import type { Reader } from "@/lib/auth/types";
import { isBodyLocked, setBodyLock } from "@/lib/body-lock";
import { MAP_VIEWBOX, MYANMAR_OUTLINE, PLACES } from "@/lib/places";

const BAGAN = PLACES.find((place) => place.id === "bagan")!;

const ERA_META = [
  { label: "Plate · Bagan kingdom", years: "849–1287" },
  { label: "Plate · Royal capitals", years: "14th–19th c." },
  { label: "Plate · Rangoon / Yangon", years: "1885–1948" },
  { label: "Plate · Independence", years: "1948–" },
];

function WriteSection() {
  return (
    <section className="section notes" id="write" aria-labelledby="writeTitle">
      <div className="notes-layout">
        <aside className="note-aside reveal">
          <p className="idx">A word</p>
          <h2 id="writeTitle">Write if something is unclear.</h2>
          <p>Not a booking desk. A note, if one is needed.</p>
        </aside>
        <ContactForm />
      </div>
    </section>
  );
}

function GlanceFacts() {
  return (
    <dl className="facts">
      <div className="fact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L16 9 H8 Z" /><path d="M12 9 V20" /><path d="M7 20 H17" /></svg>
        <dt>Seat</dt>
        <dd>Naypyidaw</dd>
        <small>Heart: Yangon</small>
      </div>
      <div className="fact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16 C8 8, 12 8, 12 12 C12 16, 16 16, 19 8" /></svg>
        <dt>Language</dt>
        <dd>Burmese</dd>
        <small>Myanmar script</small>
      </div>
      <div className="fact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" /><path d="M12 8 V16" /></svg>
        <dt>Currency</dt>
        <dd>Kyat</dd>
        <small>MMK · cash still rules</small>
      </div>
      <div className="fact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 L14 10 H20 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 H10 Z" /></svg>
        <dt>Faith</dt>
        <dd>Theravāda</dd>
        <small>Lived, not displayed</small>
      </div>
      <div className="fact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21" /></svg>
        <dt>Go when</dt>
        <dd>Nov–Feb</dd>
        <small>Cool, clear mornings</small>
      </div>
    </dl>
  );
}

function BalloonMark() {
  return (
    <svg viewBox="0 0 24 40" fill="currentColor">
      <ellipse cx="12" cy="11" rx="9" ry="11" />
      <path d="M7 20 L12 28 L17 20 Z" opacity="0.85" />
      <rect x="10.5" y="28" width="3" height="5" rx="0.5" opacity="0.7" />
      <path d="M8 35 H16 V37.5 H8 Z" opacity="0.55" />
    </svg>
  );
}

function PublicStageBg() {
  return (
    <div className="public-stage-bg" aria-hidden="true">
      <div className="dusk-field" />
      <div className="auth-stage-scrim" />
      <div className="auth-liquids">
        <span className="auth-liquid auth-liquid--gold" />
        <span className="auth-liquid auth-liquid--jade" />
        <span className="auth-liquid auth-liquid--mist" />
      </div>
      <span className="hero-balloon hero-balloon--a auth-balloon">
        <BalloonMark />
      </span>
      <span className="hero-balloon hero-balloon--b auth-balloon">
        <BalloonMark />
      </span>
      <span className="hero-balloon hero-balloon--c auth-balloon">
        <BalloonMark />
      </span>
      <div className="reticle">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}

export default function EditorialSite({ reader }: { reader: Reader | null }) {
  const [localReader, setLocalReader] = useState(reader);
  const [savedPlaceIds, setSavedPlaceIds] = useState(reader?.savedPlaceIds ?? []);
  const [headerSolid, setHeaderSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [era, setEra] = useState(0);
  const [openNote, setOpenNote] = useState("note-1");
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("glance");
  const lastFocus = useRef<HTMLElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const reduceMotion = useReducedMotionPref();

  useEffect(() => {
    setLocalReader(reader);
    setSavedPlaceIds(reader?.savedPlaceIds ?? []);
  }, [reader]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? window.scrollY / max : 0;
      setProgress(t * 100);
      if (heroRef.current && !isBodyLocked()) {
        setHeaderSolid(window.scrollY > 40);
      }
      if (!reduceMotion && heroImgRef.current && finePointer.matches && heroRef.current) {
        const y = Math.min(window.scrollY, heroRef.current.offsetHeight);
        heroImgRef.current.style.transform = `scale(1.04) translateY(${y * 0.12}px)`;
      } else if (heroImgRef.current) {
        heroImgRef.current.style.transform = "";
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let revealIo: IntersectionObserver | null = null;
    if (!reduceMotion && "IntersectionObserver" in window) {
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealIo?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );
      document.querySelectorAll(".reveal").forEach((el) => revealIo?.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
    }

    const sections = (localReader
      ? ["glance", "history", "places", "culture", "notes"]
      : ["glance", "volume"]
    )
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 },
    );
    sections.forEach((s) => navIo.observe(s));

    const eras = [...document.querySelectorAll<HTMLElement>(".era")];
    const eraIo = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setEra(Number(vis.target.getAttribute("data-era")));
      },
      { threshold: 0.55, rootMargin: "-20% 0px -20% 0px" },
    );
    eras.forEach((el) => eraIo.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      revealIo?.disconnect();
      navIo.disconnect();
      eraIo.disconnect();
    };
  }, [localReader, reduceMotion]);

  const openDrawer = (id: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setDrawerId(id);
    requestAnimationFrame(() => {
      setDrawerVisible(true);
      setBodyLock(true);
      drawerCloseRef.current?.focus();
    });
  };

  const closeDrawer = useCallback(() => {
    if (!drawerVisible && !drawerId) return;
    setDrawerVisible(false);
    setBodyLock(false);
    window.setTimeout(() => setDrawerId(null), 400);
    lastFocus.current?.focus();
  }, [drawerId, drawerVisible]);

  const toggleKeptPlate = async () => {
    if (!drawerId) return;
    const result = await toggleSavedPlaceAction(drawerId);
    if ("savedPlaceIds" in result) {
      setSavedPlaceIds(result.savedPlaceIds);
      if (localReader) {
        setLocalReader({ ...localReader, savedPlaceIds: result.savedPlaceIds });
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  const drawer = drawerId ? PLACES.find((p) => p.id === drawerId) : null;
  const eraMeta = ERA_META[era];

  const volumeNav = localReader
    ? [
        { href: "#glance", label: "Glance", id: "glance" },
        { href: "/gallery", label: "Gallery" },
        { href: "#history", label: "History", id: "history" },
        { href: "#places", label: "Places", id: "places" },
        { href: "#culture", label: "Culture", id: "culture" },
        { href: "#notes", label: "Notes", id: "notes" },
        { href: "#write", label: "Write", id: "write" },
      ]
    : [
        { href: "#glance", label: "Glance", id: "glance" },
        { href: "/gallery", label: "Gallery" },
        { href: "#volume", label: "The volume", id: "volume" },
        { href: "#write", label: "Write", id: "write" },
      ];

  const volumeMobile = localReader
    ? [
        { href: "#glance", label: "At a glance", index: "01" },
        { href: "/gallery", label: "The hall", index: "Hall" },
        { href: "#history", label: "A brief history", index: "02" },
        { href: "#places", label: "Must-see places", index: "03" },
        { href: "#culture", label: "Culture & people", index: "04" },
        { href: "#notes", label: "Good to know", index: "05" },
        { href: "#write", label: "A word", index: "Note" },
      ]
    : [
        { href: "#glance", label: "At a glance", index: "01" },
        { href: "/gallery", label: "The hall", index: "Hall" },
        { href: "#volume", label: "The rest of the volume", index: "02" },
        { href: "#write", label: "A word", index: "Note" },
      ];

  return (
    <>
      <a className="skip" href="#glance">Skip to content</a>
      <div className="progress" id="progress" aria-hidden="true" style={{ width: `${progress}%` }} />

      <SiteHeader
        reader={localReader}
        variant="volume"
        glass={headerSolid}
        wordmarkHref="#top"
        navLinks={volumeNav}
        mobileLinks={volumeMobile}
        activeSection={activeSection}
        onReaderChange={(next) => {
          setLocalReader(next);
          setSavedPlaceIds(next.savedPlaceIds);
        }}
      />

      <main id="top">
        <section className="hero" aria-label="Opening plate" ref={heroRef}>
          <div className="hero-media" id="heroMedia">
            <img
              ref={heroImgRef}
              src="/images/bagan-dawn.png"
              width={1376}
              height={768}
              fetchPriority="high"
              decoding="async"
              alt="Hot-air balloons drifting over the brick temples of Bagan in dawn mist."
            />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-sky" aria-hidden="true">
            <div className="hero-mist" />
            <span className="hero-balloon hero-balloon--a">
              <svg viewBox="0 0 24 40" fill="currentColor">
                <ellipse cx="12" cy="11" rx="9" ry="11" />
                <path d="M7 20 L12 28 L17 20 Z" opacity="0.85" />
                <rect x="10.5" y="28" width="3" height="5" rx="0.5" opacity="0.7" />
                <path d="M8 35 H16 V37.5 H8 Z" opacity="0.55" />
              </svg>
            </span>
            <span className="hero-balloon hero-balloon--b">
              <svg viewBox="0 0 24 40" fill="currentColor">
                <ellipse cx="12" cy="11" rx="9" ry="11" />
                <path d="M7 20 L12 28 L17 20 Z" opacity="0.85" />
                <rect x="10.5" y="28" width="3" height="5" rx="0.5" opacity="0.7" />
                <path d="M8 35 H16 V37.5 H8 Z" opacity="0.55" />
              </svg>
            </span>
            <span className="hero-balloon hero-balloon--c">
              <svg viewBox="0 0 24 40" fill="currentColor">
                <ellipse cx="12" cy="11" rx="9" ry="11" />
                <path d="M7 20 L12 28 L17 20 Z" opacity="0.85" />
                <rect x="10.5" y="28" width="3" height="5" rx="0.5" opacity="0.7" />
                <path d="M8 35 H16 V37.5 H8 Z" opacity="0.55" />
              </svg>
            </span>
          </div>
          <div className="reticle" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className="hero-inner">
            <p className="kicker"><i /> 21°10′N · 94°52′E · Bagan, dry season</p>
            <h1>Myanmar,<br /><em>at first light.</em></h1>
            <p className="lede">A quiet introduction to a country most maps still call Burma — its kingdoms, its people, and the places that hold them.</p>
          </div>
          <div className="hero-foot">
            <span>Plate I · Temples in the mist</span>
            <a className="scroll-cue" href="#glance">
              Scroll
              <span className="line" aria-hidden="true" />
            </a>
          </div>
        </section>

        {localReader ? (
          <div className="public-stage is-volume">
            <PublicStageBg />

            <div className="public-main auth-main">
              <aside className="public-aside auth-aside">
                <p className="kicker">
                  <i /> 21°10′N · 94°52′E · Bagan
                </p>
                <p className="auth-aside-copy">The mist still holds the shapes. The plates are open.</p>
                <svg className="public-aside-map" viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} fill="none" aria-hidden="true">
                  <path d={MYANMAR_OUTLINE} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <circle cx={BAGAN.x} cy={BAGAN.y} r="3.2" fill="#C59B27" />
                  <circle cx={BAGAN.x} cy={BAGAN.y} r="7" stroke="#C59B27" strokeOpacity="0.45" />
                </svg>
              </aside>

              <div className="public-plates">
                <section className="auth-plate is-glass" id="glance">
                  <p className="idx">01 — At a glance</p>
                  <GlanceFacts />
                </section>
              </div>
            </div>

            <GalleryPeek />

            <div className="volume-chapters">
        <section className="section history" id="history">
          <div className="section-head reveal">
            <div>
              <p className="idx">02 — A brief history</p>
              <h2>Four turns of the river.</h2>
            </div>
            <p>Not a textbook. Just the shapes that still sit on the land.</p>
          </div>

          <div className="history-layout">
            <figure className="history-plate" id="historyPlate">
              <img className={era === 0 ? "is-on" : undefined} data-era="0" src="/images/bagan-dawn.png" width={1376} height={768} loading="lazy" decoding="async" alt="The temple plain of Bagan at sunrise." />
              <div className={`field-plate${era === 1 ? " is-on" : ""}`} data-era="1" data-tone="umber">
                <span className="num">Field plate · II</span>
                <strong>Mandalay</strong>
                <span className="caption" style={{ color: "rgba(243,240,235,0.7)", marginTop: "0.4rem" }}>21°58′N · Last royal capital, 1857</span>
              </div>
              <img className={era === 2 ? "is-on" : undefined} data-era="2" src="/images/shwedagon.png" width={1376} height={768} loading="lazy" decoding="async" alt="Shwedagon Pagoda at dusk, lamps and monks on the marble terrace." />
              <div className={`field-plate${era === 3 ? " is-on" : ""}`} data-era="3" data-tone="jade">
                <span className="num">Field plate · IV</span>
                <strong>Still becoming.</strong>
                <span className="caption" style={{ color: "rgba(199,234,226,0.75)", marginTop: "0.4rem" }}>Independence, 4 January 1948</span>
              </div>
              <figcaption className="plate-meta">
                <span>{eraMeta.label}</span>
                <span>{eraMeta.years}</span>
              </figcaption>
            </figure>

            <div className="eras" id="eras">
              {[
                ["I · 9th–13th century", "Ten thousand stupas", "On a bend of the Ayeyarwady, kings and villagers raised a forest of brick temples. More than two thousand still stand in the dust and the morning."],
                ["II · 14th–19th century", "Teak, gold, Mandalay", "Power moved upriver — Inwa, Amarapura, then Mandalay — palaces of carved teak and workshops that still beat gold leaf paper-thin."],
                ["III · 1885–1948", "The port called Rangoon", "A fishing town became an empire’s rice-and-teak harbour. The colonnades remain; the name on the map is Yangon again."],
                ["IV · 1948–", "A country in its own tense", "Independence did not freeze the culture. Monasteries still teach, markets still argue, and the old rites are ordinary, not costume."],
              ].map(([when, title, copy], i) => (
                <button
                  key={when}
                  className={`era${era === i ? " is-active" : ""}`}
                  type="button"
                  data-era={i}
                  onClick={() => setEra(i)}
                >
                  <span className="when">{when}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <PlacesSection onOpenPlace={openDrawer} savedPlaceIds={savedPlaceIds} />

        <LocalVoices />

        <section className="section culture" id="culture">
          <div className="section-head reveal">
            <div>
              <p className="idx">04 — Culture &amp; people</p>
              <h2>What the photographs cannot hold.</h2>
            </div>
            <p>A few living things, set beside one another — not a catalogue.</p>
          </div>

          <div className="mosaic">
            <article className="tile is-photo tile-faith">
              <img src="/images/shwedagon.png" width={1376} height={768} loading="lazy" decoding="async" alt="Devotees and monks on the marble terrace of Shwedagon Pagoda at twilight." />
              <div className="tile-copy">
                <span className="tag">Faith, in public</span>
                <h3>The day begins with bowls.</h3>
                <p>Before the heat, monks walk the lanes. Rice is given, not as spectacle — as breakfast, and as merit.</p>
              </div>
            </article>
            <article className="tile is-clay tile-thanaka">
              <div className="tile-copy">
                <span className="tag">The face of the country</span>
                <h3>Thanaka</h3>
                <p>
                  <GlossaryTerm
                    term="thanaka"
                    definition="A pale paste of ground bark, worn on the face as sun protection and adornment. Cool, and faintly of sandalwood."
                  >Thanaka</GlossaryTerm>{" "}
                  is bark, ground on stone with a little water. Worn on cheeks against the sun — cream, cool, faintly of sandalwood.
                </p>
              </div>
            </article>
            <article className="tile is-invert tile-food">
              <div className="tile-copy">
                <span className="tag">The table</span>
                <h3>Mohinga, then tea.</h3>
                <p>Catfish broth and rice noodles at morning. Later, pickled tea leaves tossed with nuts, garlic, a little heat — laphet thoke.</p>
              </div>
            </article>
            <article className="tile is-photo tile-people">
              <img src="/images/inle.png" width={1376} height={768} loading="lazy" decoding="async" alt="An Intha fisherman standing on one leg in a narrow boat on Inle Lake." />
              <div className="tile-copy">
                <span className="tag">On the water</span>
                <h3>Work as a kind of poise.</h3>
                <p>At Inle the oar is wrapped around the leg. It looks like dance. It is how you keep both hands free for the net.</p>
              </div>
            </article>
            <article className="tile is-jade tile-dress">
              <div className="tile-copy">
                <span className="tag">Cloth</span>
                <h3>The longyi</h3>
                <p>
                  A sheet of cotton or silk, knotted at the waist — the{" "}
                  <GlossaryTerm
                    term="longyi"
                    definition="A traditional wrap-around garment worn by both men and women in Myanmar."
                  >longyi</GlossaryTerm>. Ministers wear it. Boatmen wear it. Acheik silk still comes off Amarapura looms.
                </p>
              </div>
            </article>
            <article className="tile is-clay tile-festival">
              <div className="tile-copy">
                <span className="tag">April · the new year</span>
                <h3>Thingyan</h3>
                <p>Water, thrown with intent: to wash the old year off. Streets become rivers. Elders are sprinkled, not soaked, if you know the manner.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section notes" id="notes">
          <div className="notes-layout">
            <aside className="note-aside reveal">
              <p className="idx">05 — Good to know</p>
              <h2>A few things, before you go.</h2>
              <p>Practical, not exhaustive. Open only what you need — the country will teach the rest.</p>
            </aside>

            <div className="checklist" id="checklist">
              {(
                [
                  {
                    id: "note-1",
                    n: "01",
                    title: "Visa",
                    copy: "Most passports need an eVisa before flying. Apply through the official immigration site; keep six months’ validity on the passport. Rules shift — read them close to your date, not from an old blog.",
                  },
                  {
                    id: "note-2",
                    n: "02",
                    title: "Temple manner",
                    copy: (
                      <>
                        Shoes and socks off at the gate of a{" "}
                        <GlossaryTerm
                          term="pagoda"
                          definition="A Buddhist stupa or temple complex. In Myanmar it is usually a working shrine, not a museum you tick off."
                        >pagoda</GlossaryTerm>. Shoulders and knees covered. Sit so the soles of your feet do not point at a Buddha, or at an elder. Ask before you photograph someone at prayer. Do not touch a monk’s robes.
                      </>
                    ),
                  },
                  {
                    id: "note-3",
                    n: "03",
                    title: "Getting around",
                    copy: "Yangon, Mandalay, Bagan, Inle — think in hops, not a single road. Domestic flights save days. The Ayeyarwady between Mandalay and Bagan is the slow, right way if you have the hours. In towns: taxis, and walking in the cool.",
                  },
                  {
                    id: "note-4",
                    n: "04",
                    title: "Money & the rest",
                    copy: "Day-to-day is kyat, in cash. Cards are not a plan. If dollars are asked for, they should be new, unmarked, uncreased. Check current travel advice before you pack — this is a living country, not a museum hour.",
                  },
                ] satisfies { id: string; n: string; title: string; copy: ReactNode }[]
              ).map(({ id, n, title, copy }) => {
                const expanded = openNote === id;
                return (
                  <div className="check" key={id}>
                    <button
                      className="check-btn"
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={id}
                      onClick={() => setOpenNote(expanded ? "" : id)}
                    >
                      <span className="n">{n}</span>
                      <h3>{title}</h3>
                      <span className="chev" aria-hidden="true" />
                    </button>
                    <div className={`check-panel${expanded ? " is-open" : ""}`} id={id}>
                      <div>
                        <p>{copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <WriteSection />
            </div>

        <section className="closeout" id="closeout" aria-label="Closing plate">
          <img src="/images/shwedagon.png" width={1376} height={768} loading="lazy" decoding="async" alt="Shwedagon Pagoda glowing against a deep blue evening sky." />
          <div className="veil" aria-hidden="true" />
          <div className="closeout-inner">
            <p className="kicker"><i /> The rest is learned by going</p>
            <h2>Come when you can.<br />Go gently.</h2>
            <p>Not a brochure. A first looking — toward a country that rewards patience more than itinerary.</p>
            <a className="btn is-ghost" href="#places">Explore the places <span className="arrow" aria-hidden="true" /></a>
          </div>
        </section>

            <footer className="site-footer is-glass">
              <div>
                <p className="colophon">Myanmar Discovery · not a booking desk.</p>
                <p>Myanmar is also called Burma. Both names are used with care here.</p>
              </div>
              <p>Vol. 01 · Plates from Bagan, Inle, Yangon</p>
            </footer>
          </div>
        ) : (
          <div className="public-stage">
            <PublicStageBg />

            <div className="public-main auth-main">
              <aside className="public-aside auth-aside">
                <p className="kicker">
                  <i /> 21°10′N · 94°52′E · Bagan
                </p>
                <p className="auth-aside-copy">The mist still holds the shapes. Glance stays open; the plates wait for readers.</p>
                <svg className="public-aside-map" viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} fill="none" aria-hidden="true">
                  <path d={MYANMAR_OUTLINE} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <circle cx={BAGAN.x} cy={BAGAN.y} r="3.2" fill="#C59B27" />
                  <circle cx={BAGAN.x} cy={BAGAN.y} r="7" stroke="#C59B27" strokeOpacity="0.45" />
                </svg>
              </aside>

              <div className="public-plates">
                <section className="auth-plate is-glass" id="glance">
                  <p className="idx">01 — At a glance</p>
                  <GlanceFacts />
                </section>
              </div>
            </div>

            <GalleryPeek />

            <div className="public-volume">
              <section className="auth-plate volume-gate" id="volume" aria-labelledby="volumeTitle">
                <p className="idx">The rest of the volume</p>
                <h2 id="volumeTitle">The plates are for readers.</h2>
                <p className="auth-lede">
                  History, the outline map, six places, and the notes open when you begin looking. Glance stays open — a first looking, still.
                </p>
                <div className="volume-actions">
                  <a className="btn" href="/sign-up">
                    Explore the volume <span className="arrow" aria-hidden="true" />
                  </a>
                  <a className="btn is-ghost" href="/sign-in?next=%2F%23places">
                    Sign in
                  </a>
                </div>
              </section>
            </div>

            <WriteSection />

            <footer className="site-footer is-glass">
              <div>
                <p className="colophon">Myanmar Discovery · not a booking desk.</p>
                <p>A reader account keeps the plates, nothing more.</p>
              </div>
              <p>Vol. 01 · Plates from Bagan, Inle, Yangon</p>
            </footer>
          </div>
        )}
      </main>

      <div
        className={`drawer-veil${drawerVisible ? " is-on" : ""}`}
        id="drawerVeil"
        hidden={!drawerId}
        onClick={closeDrawer}
      />
      <aside
        className={`drawer${drawerVisible ? " is-open" : ""}`}
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerTitle"
        hidden={!drawerId}
      >
        <div className="drawer-bar">
          <span id="drawerPlate">{drawer?.plate ?? "Plate"}</span>
          <button className="close-x" ref={drawerCloseRef} type="button" aria-label="Close" onClick={closeDrawer} />
        </div>
        <h3 id="drawerTitle">{drawer?.name}</h3>
        <p className="where" id="drawerWhere">{drawer?.where}</p>
        <p className="body" id="drawerBody">{drawer?.body}</p>
        <div className="meta-row" id="drawerMeta">
          {drawer?.meta.map(([k, v]) => (
            <div key={k}>
              <strong>{k}</strong>
              <span>{v}</span>
            </div>
          ))}
        </div>
        {localReader && drawer ? (
          <button
            className="keep-plate"
            type="button"
            aria-pressed={savedPlaceIds.includes(drawer.id)}
            onClick={toggleKeptPlate}
          >
            {savedPlaceIds.includes(drawer.id) ? "Kept in the volume" : "Keep this plate"}
          </button>
        ) : null}
      </aside>
    </>
  );
}
