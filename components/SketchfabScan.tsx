"use client";

import { useEffect, useRef, useState } from "react";

type SketchfabApi = {
  start: () => void;
  stop?: () => void;
  addEventListener: (event: string, cb: () => void) => void;
};

type SketchfabClient = {
  init: (
    uid: string,
    options: Record<string, unknown> & {
      success?: (api: SketchfabApi) => void;
      error?: () => void;
    },
  ) => void;
};

type SketchfabCtor = new (iframe: HTMLIFrameElement) => SketchfabClient;

let apiLoader: Promise<SketchfabCtor> | null = null;

function loadSketchfabApi(): Promise<SketchfabCtor> {
  const existing = (window as Window & { Sketchfab?: SketchfabCtor }).Sketchfab;
  if (existing) return Promise.resolve(existing);
  if (apiLoader) return apiLoader;

  apiLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    script.onload = () => {
      const Ctor = (window as Window & { Sketchfab?: SketchfabCtor }).Sketchfab;
      if (Ctor) resolve(Ctor);
      else reject(new Error("Sketchfab API missing"));
    };
    script.onerror = () => reject(new Error("Sketchfab API failed"));
    document.head.appendChild(script);
  });

  return apiLoader;
}

export default function SketchfabScan({
  uid,
  name,
  reduceMotion,
  poster,
  armed = true,
}: {
  uid: string;
  name: string;
  reduceMotion: boolean;
  poster?: string;
  armed?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<SketchfabApi | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(false);
    apiRef.current = null;
    if (!armed) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cancelled = false;
    let revealTimer: number | undefined;

    loadSketchfabApi()
      .then((Sketchfab) => {
        if (cancelled || !iframeRef.current) return;
        const client = new Sketchfab(iframeRef.current);
        client.init(uid, {
          autostart: 1,
          preload: 1,
          camera: 0,
          ui_theme: "dark",
          ui_infos: 0,
          ui_controls: 0,
          ui_sound: 0,
          ui_hint: 0,
          ui_help: 0,
          ui_settings: 0,
          ui_inspector: 0,
          ui_annotations: 0,
          ui_vr: 0,
          ui_ar: 0,
          ui_stop: 0,
          ui_watermark: 0,
          ui_watermark_link: 0,
          dnt: 1,
          autospin: reduceMotion ? 0 : 0.12,
          success: (api) => {
            if (cancelled) {
              api.stop?.();
              return;
            }
            apiRef.current = api;
            const reveal = () => {
              window.requestAnimationFrame(() => {
                revealTimer = window.setTimeout(() => {
                  if (!cancelled) setLive(true);
                }, 280);
              });
            };
            api.addEventListener("viewerready", reveal);
            api.start();
          },
          error: () => {
            /* Keep the still. Do not uncover a failed loader. */
          },
        });
      })
      .catch(() => {
        /* Keep the still. */
      });

    return () => {
      cancelled = true;
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
      try {
        apiRef.current?.stop?.();
      } catch {
        /* ignore */
      }
      apiRef.current = null;
      if (iframeRef.current) iframeRef.current.src = "about:blank";
    };
  }, [uid, reduceMotion, armed]);

  return (
    <div className={`gallery-viewer is-on is-scan-viewer${live ? " is-live" : ""}`}>
      {poster ? (
        <img
          className="gallery-poster"
          src={poster}
          alt=""
          decoding="async"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
      ) : (
        <div className="gallery-poster" aria-hidden="true" />
      )}
      <iframe
        ref={iframeRef}
        key={uid}
        className="gallery-scan"
        title={`${name}. A 3D looking related to Myanmar.`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        tabIndex={-1}
        aria-hidden={!live}
      />
    </div>
  );
}
