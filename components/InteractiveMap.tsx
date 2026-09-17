"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";
import { MAP_VIEWBOX, MYANMAR_OUTLINE, type Place } from "@/lib/places";

export type MapPlace = Pick<Place, "id" | "name" | "teaser" | "x" | "y">;

type InteractiveMapProps = {
  places: MapPlace[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
};

function tooltipAlign(x: number) {
  if (x < 70) return "left-0";
  if (x > 190) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

export default function InteractiveMap({
  places,
  activeId = null,
  onSelect,
}: InteractiveMapProps) {
  const reduceMotion = useReducedMotionPref();
  const captionId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const visibleId = focusedId ?? hoveredId;

  return (
    <figure
      className="interactive-map"
      aria-labelledby={captionId}
    >
      <div className="interactive-map-frame">
        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className="interactive-map-svg"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d={MYANMAR_OUTLINE}
            className="fill-umber stroke-cream/35"
            strokeWidth="1.35"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={MYANMAR_OUTLINE}
            className="fill-none stroke-saffron/25"
            strokeWidth="0.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute inset-0">
          {places.map((place, index) => {
            const open = visibleId === place.id || activeId === place.id;
            const tooltipId = `${captionId}-${place.id}-tip`;

            return (
              <div
                key={place.id}
                className="interactive-map-pin"
                style={{
                  left: `${(place.x / MAP_VIEWBOX.width) * 100}%`,
                  top: `${(place.y / MAP_VIEWBOX.height) * 100}%`,
                }}
              >
                <button
                  type="button"
                  className="interactive-map-marker"
                  data-place={place.id}
                  aria-label={`${place.name}. ${place.teaser.replace(/\.$/, "")}. Show this place below.`}
                  aria-describedby={open ? tooltipId : undefined}
                  aria-current={activeId === place.id ? "true" : undefined}
                  onMouseEnter={() => setHoveredId(place.id)}
                  onMouseLeave={() => setHoveredId((id) => (id === place.id ? null : id))}
                  onFocus={() => setFocusedId(place.id)}
                  onBlur={() => setFocusedId((id) => (id === place.id ? null : id))}
                  onClick={() => onSelect?.(place.id)}
                >
                  {!reduceMotion && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-saffron/35"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: [0.4, 1.15, 2.4], opacity: [0, 0.55, 0] }}
                      transition={{
                        duration: 1.7,
                        delay: 0.28 + index * 0.16,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      aria-hidden="true"
                    />
                  )}

                  <motion.span
                    className="relative grid h-[18px] w-[18px] place-items-center text-terracotta"
                    initial={reduceMotion ? false : { scale: 0.55, opacity: 0 }}
                    animate={{
                      scale: open ? 1.18 : 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.18 + index * 0.12,
                      type: "spring",
                      stiffness: 320,
                      damping: 22,
                    }}
                  >
                    <svg
                      viewBox="0 0 18 18"
                      width="18"
                      height="18"
                      aria-hidden="true"
                      className="overflow-visible"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="6.25"
                        fill="none"
                        className="stroke-saffron"
                        strokeWidth="1.1"
                      />
                      <circle cx="9" cy="9" r="2.15" fill="currentColor" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      id={tooltipId}
                      role="tooltip"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className={`interactive-map-tooltip ${tooltipAlign(place.x)}`}
                    >
                      <strong>{place.name}</strong>
                      <span>{place.teaser}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <figcaption id={captionId} className="interactive-map-caption">
        <span>In outline</span>
        <span>Not to scale</span>
      </figcaption>
    </figure>
  );
}
