"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SketchfabScan from "@/components/SketchfabScan";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";
import {
  GALLERY_COLLECTION_HREF,
  GALLERY_SEARCH_HREF,
  GALLERY_SECTIONS,
  findSectionForPlate,
  galleryPoster,
  getGalleryPlate,
  getGallerySection,
  type GalleryPlate,
  type GallerySection,
} from "@/lib/gallery";

const TempleHero = dynamic(() => import("@/components/TempleHero"), {
  ssr: false,
  loading: () => <div className="gallery-poster" aria-hidden="true" />,
});

function plateFromHash(): { sectionId: string; plateId: string } {
  const first = GALLERY_SECTIONS[0];
  if (typeof window === "undefined") {
    return { sectionId: first.id, plateId: first.plates[0].id };
  }
  const fromHash = window.location.hash.replace(/^#/, "");
  if (!fromHash) return { sectionId: first.id, plateId: first.plates[0].id };
  const asSection = GALLERY_SECTIONS.find((s) => s.id === fromHash);
  if (asSection) {
    return { sectionId: asSection.id, plateId: asSection.plates[0].id };
  }
  const asPlate = GALLERY_SECTIONS.flatMap((s) => s.plates).find((p) => p.id === fromHash);
  if (asPlate) {
    const host = findSectionForPlate(asPlate.id);
    return { sectionId: host.id, plateId: asPlate.id };
  }
  return { sectionId: first.id, plateId: first.plates[0].id };
}

function LocalScan({ armed }: { armed: boolean }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(false);
  }, [armed]);

  if (!armed) {
    return (
      <div className="gallery-viewer is-on" aria-hidden="true">
        <div className="gallery-poster" />
      </div>
    );
  }

  return (
    <div className={`gallery-viewer is-on${live ? " is-live" : ""}`}>
      <div className="gallery-poster" aria-hidden="true" />
      <div className="gallery-local-scan" aria-hidden={!live}>
        <TempleHero onReady={() => setLive(true)} />
      </div>
    </div>
  );
}

function ActiveViewer({
  plate,
  reduceMotion,
  armed,
}: {
  plate: GalleryPlate;
  reduceMotion: boolean;
  armed: boolean;
}) {
  if (plate.source === "local") {
    return <LocalScan armed={armed} />;
  }

  if (!plate.sketchfabId) return null;

  return (
    <SketchfabScan
      uid={plate.sketchfabId}
      name={plate.name}
      reduceMotion={reduceMotion}
      poster={galleryPoster(plate)}
      armed={armed}
    />
  );
}

function prefetchSectionStills(section: GallerySection) {
  for (const plate of section.plates) {
    const src = galleryPoster(plate);
    if (!src) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }
}

export default function GalleryRoom() {
  const first = GALLERY_SECTIONS[0];
  const [sectionId, setSectionId] = useState(first.id);
  const [activeId, setActiveId] = useState(first.plates[0].id);
  const [motionReady, setMotionReady] = useState(false);
  const reduceMotion = useReducedMotionPref();
  const sectionTabsId = useId();
  const plateTabsId = useId();
  const plateTabsRef = useRef<HTMLDivElement>(null);

  const section = getGallerySection(sectionId);
  const plate = getGalleryPlate(activeId);

  const isZamaniOrLocal =
    plate.source === "local" || plate.credit.includes("Zamani");
  const creditHref = isZamaniOrLocal ? GALLERY_COLLECTION_HREF : GALLERY_SEARCH_HREF;
  const creditLinkLabel = isZamaniOrLocal ? "Bagan collection" : "Myanmar on Sketchfab";

  useLayoutEffect(() => {
    const fromHash = plateFromHash();
    setSectionId(fromHash.sectionId);
    setActiveId(fromHash.plateId);
    setMotionReady(true);

    const applyHash = () => {
      const next = plateFromHash();
      setSectionId(next.sectionId);
      setActiveId(next.plateId);
    };
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectSection = useCallback((id: string) => {
    const next = getGallerySection(id);
    setSectionId(next.id);
    setActiveId(next.plates[0].id);
    window.history.replaceState(null, "", `/gallery#${next.id}`);
  }, []);

  const selectPlate = useCallback((id: string) => {
    const host = findSectionForPlate(id);
    setSectionId(host.id);
    setActiveId(id);
    window.history.replaceState(null, "", `/gallery#${id}`);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.location.assign("/#gallery");
        return;
      }
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as Node | null;
      if (!plateTabsRef.current || !target || !plateTabsRef.current.contains(target)) {
        return;
      }
      event.preventDefault();
      const plates = section.plates;
      const i = plates.findIndex((p) => p.id === activeId);
      if (i < 0) return;
      const next =
        event.key === "ArrowRight"
          ? plates[(i + 1) % plates.length]
          : plates[(i - 1 + plates.length) % plates.length];
      selectPlate(next.id);
      const btn = document.getElementById(`${plateTabsId}-${next.id}`);
      btn?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeId, section, selectPlate, plateTabsId]);

  useEffect(() => {
    prefetchSectionStills(section);
  }, [section]);

  useEffect(() => {
    if (plate.source !== "local") return;
    let cancelled = false;
    void import("@/components/TempleHero").then(async (mod) => {
      if (cancelled) return;
      const { useGLTF } = await import("@react-three/drei");
      useGLTF.preload(mod.SULAMANI_MODEL_SRC);
    });
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = "/models/sulamani-temple.glb";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => {
      cancelled = true;
      link.remove();
    };
  }, [plate.source]);

  return (
    <div className="gallery-room">
      <a className="skip" href="#gallery-label">
        Skip to caption
      </a>
      <a className="gallery-exit" href="/#gallery">
        <span className="close-x" aria-hidden="true" />
        Leave
      </a>

      <main
        className={`gallery-stage${plate.source === "sketchfab" ? " is-scan" : ""}`}
        aria-label={`${plate.name}, in the round`}
        id="gallery-panel"
        role="tabpanel"
        aria-labelledby={`${plateTabsId}-${plate.id}`}
      >
        <div className="gallery-viewers">
          <ActiveViewer plate={plate} reduceMotion={reduceMotion} armed={motionReady} />
        </div>

        <div className="gallery-veil" aria-hidden="true" />
        <div className="reticle" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="gallery-chrome">
          <div className="gallery-label" id="gallery-label" tabIndex={-1}>
            <p className="kicker">
              <i /> {plate.kicker}
            </p>
            <h1>
              {plate.name}
              <em>{plate.where}</em>
            </h1>
            <p className="lede">{plate.lede}</p>
          </div>

          <div className="gallery-nav">
            <div
              className="gallery-sections"
              role="tablist"
              aria-label="Gallery sections"
              id={sectionTabsId}
            >
              {GALLERY_SECTIONS.map((item) => {
                const on = item.id === section.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`${sectionTabsId}-${item.id}`}
                    aria-selected={on}
                    className={on ? "is-on" : undefined}
                    onClick={() => selectSection(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div
              className="gallery-plates"
              role="tablist"
              aria-label={`${section.label} plates`}
              id={plateTabsId}
              ref={plateTabsRef}
            >
              {section.plates.map((item) => {
                const on = item.id === plate.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`${plateTabsId}-${item.id}`}
                    aria-selected={on}
                    aria-controls="gallery-panel"
                    className={on ? "is-on" : undefined}
                    onClick={() => selectPlate(item.id)}
                  >
                    <span className="n">{item.n}</span>
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="gallery-foot">
            <span className="gallery-credit">
              {plate.credit}{" "}
              <a href={creditHref} rel="noreferrer">
                {creditLinkLabel}
              </a>
            </span>
            <a className="scroll-cue gallery-volume-cue" href="/#gallery">
              The volume
              <span className="line" aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
