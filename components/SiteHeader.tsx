"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { signOutAction, updateReaderNameAction } from "@/lib/auth/actions";
import type { Reader } from "@/lib/auth/types";
import { setBodyLock } from "@/lib/body-lock";
import { PLACES } from "@/lib/places";
import { useReadingPrefs } from "@/components/ReadingPrefsProvider";

export type NavLink = {
  href: string;
  label: string;
  id?: string;
  current?: boolean;
};

export type MobileLink = {
  href: string;
  label: string;
  index: string;
};

type SiteHeaderProps = {
  reader: Reader | null;
  variant: "volume" | "auth";
  glass?: boolean;
  wordmarkHref?: string;
  authNext?: string;
  navLinks?: NavLink[];
  mobileLinks?: MobileLink[];
  activeSection?: string;
  authTitle?: string;
  onReaderChange?: (reader: Reader) => void;
};

function readerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function Wordmark({ href }: { href: string }) {
  return (
    <a className="wordmark" href={href} aria-label="Myanmar Discovery — home">
      <svg viewBox="0 0 240 60" fill="none" aria-hidden="true">
        <g transform="translate(10, 10)">
          <path
            d="M20 2 C22 10, 28 14, 28 22 C28 30, 21 37, 10 38 C18 36, 23 30, 22 24 C21 16, 14 12, 20 2 Z"
            fill="#C59B27"
          />
          <circle cx="20" cy="18" r="2.5" fill="#1B3B36" />
          <path
            d="M7 26 C12 28, 17 32, 18 38 C14 36, 9 32, 7 26 Z"
            fill="#B85D38"
            opacity="0.85"
          />
        </g>
        <text
          x="50"
          y="32"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="21"
          fontWeight="600"
          letterSpacing="0.22em"
          fill="currentColor"
        >
          MYANMAR
        </text>
        <text
          x="51"
          y="44"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="7.5"
          fontWeight="500"
          letterSpacing="0.36em"
          fill="currentColor"
          opacity="0.7"
        >
          DISCOVERY
        </text>
        <line
          x1="205"
          y1="20"
          x2="205"
          y2="42"
          stroke="#C59B27"
          strokeWidth="0.75"
          strokeOpacity="0.7"
        />
        <text
          x="214"
          y="33"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="7"
          letterSpacing="0.25em"
          fill="currentColor"
          opacity="0.55"
        >
          VOL. 01
        </text>
      </svg>
    </a>
  );
}

function OverlayPlate({
  open,
  titleId,
  kicker,
  title,
  onClose,
  closeRef,
  children,
}: {
  open: boolean;
  titleId: string;
  kicker: string;
  title: string;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) {
  return (
    <>
      <div
        className={`drawer-veil${open ? " is-on" : ""}`}
        hidden={!open}
        onClick={onClose}
      />
      <aside
        className={`drawer account-plate${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        hidden={!open}
      >
        <div className="drawer-bar">
          <span>{kicker}</span>
          <button
            className="close-x"
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
        <h3 id={titleId}>{title}</h3>
        {children}
      </aside>
    </>
  );
}

function ProfilePlate({
  open,
  reader,
  onClose,
  closeRef,
  onReaderChange,
}: {
  open: boolean;
  reader: Reader;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
  onReaderChange?: (reader: Reader) => void;
}) {
  const titleId = useId();
  const [name, setName] = useState(reader.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setName(reader.name);
  }, [reader.name]);

  const kept = PLACES.filter((place) => reader.savedPlaceIds.includes(place.id));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await updateReaderNameAction(name);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    onReaderChange?.({ ...reader, name: result.name });
  };

  return (
    <OverlayPlate
      open={open}
      titleId={titleId}
      kicker="Reader"
      title="Profile"
      onClose={onClose}
      closeRef={closeRef}
    >
      <p className="account-lede">Your place in the volume. Name and kept plates — nothing more.</p>
      <form className="auth-form account-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor={`${titleId}-name`}>Name</label>
          <input
            id={`${titleId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${titleId}-email`}>Email</label>
          <input
            id={`${titleId}-email`}
            type="email"
            value={reader.email}
            readOnly
            tabIndex={-1}
            aria-readonly="true"
          />
        </div>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn" type="submit" disabled={pending || name.trim() === reader.name}>
          {pending ? "Saving…" : "Save name"}
        </button>
      </form>

      <div className="account-kept">
        <p className="kicker">Kept plates</p>
        {kept.length === 0 ? (
          <p className="account-muted">None yet. Open a place plate and keep it.</p>
        ) : (
          <ul>
            {kept.map((place) => (
              <li key={place.id}>
                <a href="/#places" onClick={onClose}>
                  {place.name}
                  <span>{place.plate}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="account-signout" action={signOutAction}>
        <button className="auth-link" type="submit">
          Sign out
        </button>
      </form>
    </OverlayPlate>
  );
}

function SettingsPlate({
  open,
  onClose,
  closeRef,
}: {
  open: boolean;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
}) {
  const titleId = useId();
  const { prefs, setType, setMotion, setContrast } = useReadingPrefs();

  return (
    <OverlayPlate
      open={open}
      titleId={titleId}
      kicker="Reading"
      title="Settings"
      onClose={onClose}
      closeRef={closeRef}
    >
      <p className="account-lede">Adjust how the volume reads on this device. Stored here only.</p>

      <fieldset className="reading-field">
        <legend>Type</legend>
        <div className="reading-options" role="radiogroup" aria-label="Type size">
          <button
            type="button"
            className={prefs.type === "regular" ? "is-on" : undefined}
            aria-pressed={prefs.type === "regular"}
            onClick={() => setType("regular")}
          >
            Regular
          </button>
          <button
            type="button"
            className={prefs.type === "large" ? "is-on" : undefined}
            aria-pressed={prefs.type === "large"}
            onClick={() => setType("large")}
          >
            Large
          </button>
        </div>
      </fieldset>

      <fieldset className="reading-field">
        <legend>Motion</legend>
        <div className="reading-options" role="radiogroup" aria-label="Motion">
          <button
            type="button"
            className={prefs.motion === "system" ? "is-on" : undefined}
            aria-pressed={prefs.motion === "system"}
            onClick={() => setMotion("system")}
          >
            Follow system
          </button>
          <button
            type="button"
            className={prefs.motion === "reduce" ? "is-on" : undefined}
            aria-pressed={prefs.motion === "reduce"}
            onClick={() => setMotion("reduce")}
          >
            Always reduce
          </button>
        </div>
      </fieldset>

      <fieldset className="reading-field">
        <legend>Contrast</legend>
        <div className="reading-options" role="radiogroup" aria-label="Type contrast">
          <button
            type="button"
            className={prefs.contrast === "regular" ? "is-on" : undefined}
            aria-pressed={prefs.contrast === "regular"}
            onClick={() => setContrast("regular")}
          >
            Regular
          </button>
          <button
            type="button"
            className={prefs.contrast === "strong" ? "is-on" : undefined}
            aria-pressed={prefs.contrast === "strong"}
            onClick={() => setContrast("strong")}
          >
            Stronger type
          </button>
        </div>
      </fieldset>
    </OverlayPlate>
  );
}

export default function SiteHeader({
  reader,
  variant,
  glass = true,
  wordmarkHref = "/",
  authNext,
  navLinks = [],
  mobileLinks = [],
  activeSection,
  authTitle,
  onReaderChange,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [readerMenuOpen, setReaderMenuOpen] = useState(false);
  const [plate, setPlate] = useState<"profile" | "settings" | null>(null);
  const [plateVisible, setPlateVisible] = useState(false);
  const [localReader, setLocalReader] = useState(reader);
  const lastFocus = useRef<HTMLElement | null>(null);
  const plateCloseRef = useRef<HTMLButtonElement | null>(null);
  const readerMenuRef = useRef<HTMLDivElement | null>(null);
  const chipRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const showMobileToggle = variant === "volume";

  useEffect(() => {
    setLocalReader(reader);
  }, [reader]);

  const closeMobile = useCallback(() => {
    setMenuOpen((open) => {
      if (open) setBodyLock(false);
      return false;
    });
  }, []);

  const toggleMobile = () => {
    setMenuOpen((open) => {
      setBodyLock(!open);
      return !open;
    });
  };

  const closeReaderMenu = useCallback(() => setReaderMenuOpen(false), []);

  const closePlate = useCallback(() => {
    if (!plateVisible && !plate) return;
    setPlateVisible(false);
    setBodyLock(false);
    window.setTimeout(() => setPlate(null), 400);
    lastFocus.current?.focus();
  }, [plate, plateVisible]);

  const openPlate = useCallback(
    (next: "profile" | "settings") => {
      closeReaderMenu();
      closeMobile();
      lastFocus.current = document.activeElement as HTMLElement | null;
      setPlate(next);
      requestAnimationFrame(() => {
        setPlateVisible(true);
        setBodyLock(true);
        plateCloseRef.current?.focus();
      });
    },
    [closeMobile, closeReaderMenu],
  );

  useEffect(() => {
    const desktopNav = window.matchMedia("(min-width: 980px)");
    const onViewport = () => {
      if (desktopNav.matches) closeMobile();
    };
    desktopNav.addEventListener("change", onViewport);
    return () => desktopNav.removeEventListener("change", onViewport);
  }, [closeMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (plate) {
        closePlate();
        return;
      }
      if (readerMenuOpen) {
        closeReaderMenu();
        chipRef.current?.focus();
        return;
      }
      closeMobile();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [plate, readerMenuOpen, closePlate, closeReaderMenu, closeMobile]);

  useEffect(() => {
    if (!readerMenuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!readerMenuRef.current?.contains(e.target as Node)) {
        closeReaderMenu();
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [readerMenuOpen, closeReaderMenu]);

  const handleReaderChange = (next: Reader) => {
    setLocalReader(next);
    onReaderChange?.(next);
  };

  const signInHref = authNext ? `/sign-in?next=${encodeURIComponent(authNext)}` : "/sign-in";
  const signUpHref = authNext ? `/sign-up?next=${encodeURIComponent(authNext)}` : "/sign-up";

  const authLinks: ReactNode = (() => {
    if (localReader) {
      return (
        <div className="reader-menu" ref={readerMenuRef}>
          <button
            ref={chipRef}
            className={`reader-chip${readerMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-expanded={readerMenuOpen}
            aria-controls={menuId}
            aria-haspopup="menu"
            onClick={() => setReaderMenuOpen((o) => !o)}
          >
            <span className="reader-chip-initials" aria-hidden="true">
              {readerInitials(localReader.name)}
            </span>
            <span className="sr-only">{localReader.name} — account</span>
          </button>
          <div
            className={`reader-menu-panel${readerMenuOpen ? " is-open" : ""}`}
            id={menuId}
            role="menu"
            hidden={!readerMenuOpen}
          >
            <button type="button" role="menuitem" onClick={() => openPlate("profile")}>
              Profile
            </button>
            <button type="button" role="menuitem" onClick={() => openPlate("settings")}>
              Settings
            </button>
            <form action={signOutAction}>
              <button type="submit" role="menuitem">
                Sign out
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (variant === "auth") {
      return (
        <>
          <button className="auth-link" type="button" onClick={() => openPlate("settings")}>
            Settings
          </button>
          {authTitle === "Sign in" ? (
            <a className="auth-link is-strong" href="/sign-up">
              Explore
            </a>
          ) : (
            <a className="auth-link is-strong" href="/sign-in">
              Sign in
            </a>
          )}
        </>
      );
    }

    return (
      <>
        <button className="auth-link" type="button" onClick={() => openPlate("settings")}>
          Settings
        </button>
        <a className="auth-link" href={signInHref}>
          Sign in
        </a>
        <a className="auth-link is-strong" href={signUpHref}>
          Explore
        </a>
      </>
    );
  })();

  return (
    <>
      <header className={`site-header${glass ? " is-glass" : ""}`} id="header">
        <Wordmark href={wordmarkHref} />
        <div className="header-end">
          {navLinks.length > 0 ? (
            <nav className="nav-desktop" aria-label="Primary">
              {navLinks.map((link) => {
                const active =
                  link.current ||
                  (link.id !== undefined && activeSection === link.id);
                return (
                  <a
                    key={link.href + link.label}
                    href={link.href}
                    className={active ? "is-active" : undefined}
                    aria-current={link.current ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          ) : null}
          <div className="nav-auth">
            {authLinks}
          </div>
          {showMobileToggle ? (
            <button
              className={`menu-toggle${menuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobileNav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobile}
            >
              <span />
            </button>
          ) : null}
        </div>
      </header>

      {showMobileToggle ? (
        <nav
          className={`nav-mobile${menuOpen ? " is-open" : ""}`}
          id="mobileNav"
          aria-label="Mobile"
          aria-hidden={!menuOpen}
        >
          {mobileLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMobile}>
              <em>{link.index}</em> {link.label}
            </a>
          ))}
          <div className="nav-mobile-auth">
            {localReader ? (
              <>
                <button type="button" onClick={() => openPlate("profile")}>
                  <em>Me</em> Profile
                </button>
                <button type="button" onClick={() => openPlate("settings")}>
                  <em>Set</em> Settings
                </button>
                <form action={signOutAction}>
                  <button type="submit">
                    <em>Out</em> Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <button type="button" onClick={() => openPlate("settings")}>
                  <em>Set</em> Settings
                </button>
                <a href={signInHref} onClick={closeMobile}>
                  <em>In</em> Sign in
                </a>
                <a href={signUpHref} onClick={closeMobile}>
                  <em>Go</em> Explore
                </a>
              </>
            )}
          </div>
        </nav>
      ) : null}

      {localReader && plate === "profile" ? (
        <ProfilePlate
          open={plateVisible}
          reader={localReader}
          onClose={closePlate}
          closeRef={plateCloseRef}
          onReaderChange={handleReaderChange}
        />
      ) : null}

      {plate === "settings" ? (
        <SettingsPlate open={plateVisible} onClose={closePlate} closeRef={plateCloseRef} />
      ) : null}
    </>
  );
}
