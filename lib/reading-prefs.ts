export const READING_PREFS_KEY = "md-reading";

export type TypeSize = "regular" | "large";
export type MotionPref = "system" | "reduce";
export type ContrastPref = "regular" | "strong";

export type ReadingPrefs = {
  type: TypeSize;
  motion: MotionPref;
  contrast: ContrastPref;
};

export const DEFAULT_READING_PREFS: ReadingPrefs = {
  type: "regular",
  motion: "system",
  contrast: "regular",
};

function isType(value: unknown): value is TypeSize {
  return value === "regular" || value === "large";
}

function isMotion(value: unknown): value is MotionPref {
  return value === "system" || value === "reduce";
}

function isContrast(value: unknown): value is ContrastPref {
  return value === "regular" || value === "strong";
}

export function parseReadingPrefs(raw: unknown): ReadingPrefs {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_READING_PREFS };
  const data = raw as Record<string, unknown>;
  return {
    type: isType(data.type) ? data.type : DEFAULT_READING_PREFS.type,
    motion: isMotion(data.motion) ? data.motion : DEFAULT_READING_PREFS.motion,
    contrast: isContrast(data.contrast) ? data.contrast : DEFAULT_READING_PREFS.contrast,
  };
}

export function readReadingPrefs(): ReadingPrefs {
  if (typeof window === "undefined") return { ...DEFAULT_READING_PREFS };
  try {
    const raw = window.localStorage.getItem(READING_PREFS_KEY);
    if (!raw) return { ...DEFAULT_READING_PREFS };
    return parseReadingPrefs(JSON.parse(raw) as unknown);
  } catch {
    return { ...DEFAULT_READING_PREFS };
  }
}

export function writeReadingPrefs(prefs: ReadingPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READING_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota / private mode */
  }
}

export function applyReadingPrefsToDocument(prefs: ReadingPrefs): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (prefs.type === "large") root.setAttribute("data-type", "large");
  else root.removeAttribute("data-type");

  if (prefs.motion === "reduce") root.setAttribute("data-motion", "reduce");
  else root.removeAttribute("data-motion");

  if (prefs.contrast === "strong") root.setAttribute("data-contrast", "strong");
  else root.removeAttribute("data-contrast");
}

/** Inline boot script — keep in sync with applyReadingPrefsToDocument. */
export const READING_PREFS_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(READING_PREFS_KEY)};var r=localStorage.getItem(k);if(!r)return;var p=JSON.parse(r);var h=document.documentElement;if(p&&p.type==="large")h.setAttribute("data-type","large");if(p&&p.motion==="reduce")h.setAttribute("data-motion","reduce");if(p&&p.contrast==="strong")h.setAttribute("data-contrast","strong");}catch(e){}})();`;
