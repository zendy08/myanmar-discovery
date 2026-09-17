"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";
import InteractiveMap from "@/components/InteractiveMap";
import { PLACES, type Place } from "@/lib/places";

type PlacesSectionProps = {
  onOpenPlace: (id: string) => void;
  savedPlaceIds?: string[];
};

function PlaceOrnament({ id }: { id: string }) {
  if (id === "mandalay") {
    return (
      <svg className="ornament" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 34 H40 M10 34 V22 L24 12 L38 22 V34" stroke="currentColor" strokeWidth="1" />
        <path d="M24 12 V6" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  if (id === "mrauku") {
    return (
      <svg className="ornament" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M10 38 H38 M14 38 V24 L24 14 L34 24 V38" stroke="currentColor" strokeWidth="1" />
        <path d="M24 14 V8 M20 22 H28" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg className="ornament" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M6 30 C14 24, 22 26, 24 32 C26 26, 34 24, 42 30" stroke="currentColor" strokeWidth="1" />
      <path d="M8 36 C16 32, 24 34, 24 38 C24 34, 32 32, 40 36" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PlaceCard({
  place,
  focused,
  kept,
  onOpen,
}: {
  place: Place;
  focused: boolean;
  kept: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      className={`place ${place.className}${place.variant === "type" ? " is-type" : ""}${focused ? " is-map-focus" : ""}${kept ? " is-kept" : ""}`}
      type="button"
      id={`place-${place.id}`}
      data-place={place.id}
      data-tone={place.tone}
      onClick={() => onOpen(place.id)}
    >
      {place.variant === "photo" && place.image ? (
        <>
          <img src={place.image} width={1376} height={768} loading="lazy" decoding="async" alt="" />
          <span className="veil" aria-hidden="true" />
        </>
      ) : (
        <PlaceOrnament id={place.id} />
      )}
      <span className="place-copy">
        <span className="plate">{place.plate}</span>
        <h3>{place.name}</h3>
        <p>{place.teaser}</p>
        <span className="hint">{kept ? "Open plate · kept" : "Open plate"}</span>
      </span>
    </button>
  );
}

export default function PlacesSection({ onOpenPlace, savedPlaceIds = [] }: PlacesSectionProps) {
  const reduceMotion = useReducedMotionPref();
  const [focusId, setFocusId] = useState<string | null>(null);
  const clearRef = useRef<number | null>(null);
  const headingId = useId();

  useEffect(() => {
    return () => {
      if (clearRef.current) window.clearTimeout(clearRef.current);
    };
  }, []);

  const handleSelect = (id: string) => {
    setFocusId(id);
    if (clearRef.current) window.clearTimeout(clearRef.current);
    clearRef.current = window.setTimeout(() => setFocusId(null), 2600);

    const node = document.getElementById(`place-${id}`);
    if (!node) return;
    node.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => {
      node.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 420);
  };

  return (
    <section className="section places" id="places" aria-labelledby={headingId}>
      <div className="section-head reveal">
        <div>
          <p className="idx">03 — Must-see places</p>
          <h2 id={headingId}>Six rooms of the country.</h2>
        </div>
        <p>Find a place on the outline, then open a plate for a little more.</p>
      </div>

      {savedPlaceIds.length > 0 ? (
        <p className="kept-line">
          Kept{" "}
          <strong>
            {savedPlaceIds
              .map((id) => PLACES.find((place) => place.id === id)?.name)
              .filter(Boolean)
              .join(" · ")}
          </strong>
        </p>
      ) : null}

      <div className="places-stage">
        <InteractiveMap places={PLACES} activeId={focusId} onSelect={handleSelect} />
        <div className="bento has-six">
          {PLACES.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              focused={focusId === place.id}
              kept={savedPlaceIds.includes(place.id)}
              onOpen={onOpenPlace}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
