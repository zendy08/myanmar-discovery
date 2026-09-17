"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyReadingPrefsToDocument,
  DEFAULT_READING_PREFS,
  readReadingPrefs,
  writeReadingPrefs,
  type ContrastPref,
  type MotionPref,
  type ReadingPrefs,
  type TypeSize,
} from "@/lib/reading-prefs";

type ReadingPrefsContextValue = {
  prefs: ReadingPrefs;
  setType: (type: TypeSize) => void;
  setMotion: (motion: MotionPref) => void;
  setContrast: (contrast: ContrastPref) => void;
  reduceMotion: boolean;
};

const ReadingPrefsContext = createContext<ReadingPrefsContextValue | null>(null);

export function ReadingPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ReadingPrefs>(DEFAULT_READING_PREFS);
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    const loaded = readReadingPrefs();
    setPrefs(loaded);
    applyReadingPrefsToDocument(loaded);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduce(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  const patch = useCallback((partial: Partial<ReadingPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      writeReadingPrefs(next);
      applyReadingPrefsToDocument(next);
      return next;
    });
  }, []);

  const setType = useCallback((type: TypeSize) => patch({ type }), [patch]);
  const setMotion = useCallback((motion: MotionPref) => patch({ motion }), [patch]);
  const setContrast = useCallback((contrast: ContrastPref) => patch({ contrast }), [patch]);

  const reduceMotion = prefs.motion === "reduce" || systemReduce;

  const value = useMemo(
    () => ({ prefs, setType, setMotion, setContrast, reduceMotion }),
    [prefs, setType, setMotion, setContrast, reduceMotion],
  );

  return (
    <ReadingPrefsContext.Provider value={value}>{children}</ReadingPrefsContext.Provider>
  );
}

export function useReadingPrefs(): ReadingPrefsContextValue {
  const ctx = useContext(ReadingPrefsContext);
  if (!ctx) {
    throw new Error("useReadingPrefs must be used within ReadingPrefsProvider");
  }
  return ctx;
}

/** Prefer this over Framer's useReducedMotion — honour the reader's setting. */
export function useReducedMotionPref(): boolean {
  const ctx = useContext(ReadingPrefsContext);
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    if (ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduce(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, [ctx]);

  if (ctx) return ctx.reduceMotion;
  return systemReduce;
}
