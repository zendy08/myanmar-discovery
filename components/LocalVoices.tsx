"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";

type Voice = {
  name: string;
  role: string;
  quote: string;
  imageSrc: string;
};

const VOICES: Voice[] = [
  {
    name: "Thiri",
    role: "tea shop owner, Yangon",
    quote: "The kettle is on by five. People come for the tea, and stay for the argument.",
    imageSrc: "/images/shwedagon.png",
  },
  {
    name: "U Sandimar",
    role: "monk, Mahagandhayon, Mandalay",
    quote: "The bowls go out before the heat. That is breakfast. The rest is study.",
    imageSrc: "/images/shwedagon.png",
  },
  {
    name: "Ma Hla",
    role: "lotus weaver, Inle Lake",
    quote: "The fibre comes from the stem. It takes patience, and water on the hands.",
    imageSrc: "/images/inle.png",
  },
  {
    name: "Ko Myint",
    role: "pagoda caretaker, Bagan",
    quote: "I sweep the same terrace I swept as a boy. The bricks remember more than we do.",
    imageSrc: "/images/bagan-dawn.png",
  },
];

const ROMAN = ["I", "II", "III", "IV"] as const;

export default function LocalVoices() {
  const reduceMotion = useReducedMotionPref();
  const headingId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(VOICES.length - 1, index));
      const scroller = scrollerRef.current;
      const slide = slideRefs.current[next];
      if (!scroller || !slide) return;
      const slideRect = slide.getBoundingClientRect();
      const rootRect = scroller.getBoundingClientRect();
      const left =
        scroller.scrollLeft +
        (slideRect.left - rootRect.left) -
        (scroller.clientWidth - slideRect.width) / 2;
      scroller.scrollTo({
        left,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setActive(next);
    },
    [reduceMotion],
  );

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis) return;
        const index = Number((vis.target as HTMLElement).dataset.voice);
        if (!Number.isNaN(index)) setActive(index);
      },
      { root, threshold: 0.55 },
    );

    slideRefs.current.forEach((node) => {
      if (node) io.observe(node);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section className="section voices" id="voices" aria-labelledby={headingId}>
      <div className="section-head reveal">
        <div>
          <p className="idx">Heard along the way</p>
          <h2 id={headingId}>A few voices.</h2>
        </div>
        <p>Not interviews. Just people, speaking in their own tense.</p>
      </div>

      <div
        ref={scrollerRef}
        className="voices-scroller"
        tabIndex={0}
        aria-label="Local voices"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(active + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(active - 1);
          }
        }}
      >
        {VOICES.map((voice, index) => (
          <motion.article
            key={voice.name}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className="voice"
            data-voice={index}
            aria-label={`${voice.name}, ${voice.role}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <figure className="voice-portrait">
              <img
                src={voice.imageSrc}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <blockquote className="voice-quote">
              <p>{voice.quote}</p>
            </blockquote>
            <footer className="voice-attr">
              <span className="voice-name">{voice.name}</span>
              <span className="voice-role">{voice.role}</span>
            </footer>
          </motion.article>
        ))}
      </div>

      <div className="voices-nav" role="group" aria-label="Choose a voice">
        {VOICES.map((voice, index) => (
          <button
            key={voice.name}
            type="button"
            className={active === index ? "is-on" : undefined}
            aria-label={`${ROMAN[index]} · ${voice.name}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => goTo(index)}
          >
            {ROMAN[index]}
          </button>
        ))}
      </div>
    </section>
  );
}
