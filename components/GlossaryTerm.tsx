"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type GlossaryTermProps = {
  term: string;
  definition: string;
  children: ReactNode;
};

type TipCoords = {
  top: number;
  left: number;
  placement: "top" | "bottom";
};

const VIEW_PAD = 12;
const GAP = 8;
const MAX_WIDTH = 240;
const HEADER_CLEARANCE = 72;

export default function GlossaryTerm({
  term,
  definition,
  children,
}: GlossaryTermProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const pointerTypeRef = useRef("");
  const dismissedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [coords, setCoords] = useState<TipCoords | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return;

    const rect = trigger.getBoundingClientRect();
    const tipW = Math.min(MAX_WIDTH, tip.offsetWidth || MAX_WIDTH, window.innerWidth - VIEW_PAD * 2);
    const tipH = tip.offsetHeight;
    const placement: TipCoords["placement"] =
      rect.top >= tipH + GAP + HEADER_CLEARANCE ? "top" : "bottom";

    let left = rect.left + rect.width / 2 - tipW / 2;
    left = Math.max(VIEW_PAD, Math.min(left, window.innerWidth - VIEW_PAD - tipW));

    setCoords({
      top: placement === "top" ? rect.top - GAP : rect.bottom + GAP,
      left,
      placement,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      dismissedRef.current = true;
      setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (triggerRef.current?.contains(target)) return;
      if (tooltipRef.current?.contains(target)) return;
      dismissedRef.current = true;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const description = mounted
    ? createPortal(
        <>
          <span id={tooltipId} role="tooltip" className="sr-only">
            {definition}
          </span>
          {open && (
            <span
              ref={tooltipRef}
              className={`glossary-tip${coords ? " is-on" : ""}`}
              aria-hidden="true"
              style={{
                top: coords?.top ?? 0,
                left: coords?.left ?? 0,
                transform: coords?.placement === "top" ? "translateY(-100%)" : "none",
              }}
            >
              <strong>{term}</strong>
              <span>{definition}</span>
            </span>
          )}
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="glossary-term"
        aria-describedby={tooltipId}
        aria-expanded={open}
        onPointerDown={(event) => {
          pointerTypeRef.current = event.pointerType;
        }}
        onMouseEnter={() => {
          if (!finePointer) return;
          dismissedRef.current = false;
          setOpen(true);
        }}
        onMouseLeave={() => {
          if (!finePointer) return;
          if (triggerRef.current === document.activeElement) return;
          setOpen(false);
        }}
        onFocus={() => {
          const type = pointerTypeRef.current;
          if (type === "touch" || type === "pen") return;
          if (dismissedRef.current) return;
          setOpen(true);
        }}
        onBlur={() => {
          pointerTypeRef.current = "";
          dismissedRef.current = false;
          if (finePointer) setOpen(false);
        }}
        onClick={() => {
          dismissedRef.current = false;
          if (finePointer) {
            setOpen(true);
            return;
          }
          setOpen((value) => !value);
        }}
      >
        {children}
      </button>
      {description}
    </>
  );
}
