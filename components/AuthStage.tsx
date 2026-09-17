import { MAP_VIEWBOX, MYANMAR_OUTLINE, PLACES } from "@/lib/places";

const BAGAN = PLACES.find((place) => place.id === "bagan")!;

function Balloon() {
  return (
    <svg viewBox="0 0 24 40" fill="currentColor">
      <ellipse cx="12" cy="11" rx="9" ry="11" />
      <path d="M7 20 L12 28 L17 20 Z" opacity="0.85" />
      <rect x="10.5" y="28" width="3" height="5" rx="0.5" opacity="0.7" />
      <path d="M8 35 H16 V37.5 H8 Z" opacity="0.55" />
    </svg>
  );
}

export default function AuthStage() {
  return (
    <div className="auth-stage" aria-hidden="true">
      <div className="dusk-field" />
      <div className="auth-stage-scrim" />
      <div className="auth-liquids">
        <span className="auth-liquid auth-liquid--gold" />
        <span className="auth-liquid auth-liquid--jade" />
        <span className="auth-liquid auth-liquid--mist" />
      </div>
      <svg className="auth-map" viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} fill="none">
        <path d={MYANMAR_OUTLINE} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx={BAGAN.x} cy={BAGAN.y} r="3.2" fill="#C59B27" />
        <circle cx={BAGAN.x} cy={BAGAN.y} r="7" stroke="#C59B27" strokeOpacity="0.45" />
      </svg>
      <figure className="auth-shard auth-shard--inle">
        <img src="/images/inle.png" width={640} height={420} alt="" />
        <figcaption>02 · Inle</figcaption>
      </figure>
      <figure className="auth-shard auth-shard--shwe">
        <img src="/images/shwedagon.png" width={640} height={420} alt="" />
        <figcaption>03 · Yangon</figcaption>
      </figure>
      <svg className="auth-pagoda" viewBox="0 0 48 48" fill="none">
        <path d="M8 34 H40 M10 34 V22 L24 12 L38 22 V34" stroke="currentColor" strokeWidth="1" />
        <path d="M24 12 V6" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="auth-compass" viewBox="0 0 88 88" fill="none">
        <circle cx="44" cy="44" r="38" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="44" cy="44" r="26" stroke="currentColor" strokeOpacity="0.22" />
        <path d="M44 10 V18 M44 70 V78 M10 44 H18 M70 44 H78" stroke="currentColor" strokeOpacity="0.45" />
        <path d="M44 22 L48 44 L44 66 L40 44 Z" fill="#C59B27" fillOpacity="0.85" />
        <path d="M22 44 L44 40 L66 44 L44 48 Z" fill="currentColor" fillOpacity="0.28" />
        <text x="44" y="16" textAnchor="middle" fill="currentColor" fontSize="7" letterSpacing="0.18em">N</text>
      </svg>
      <p className="auth-coord">21°10′N · 94°52′E</p>
      <p className="auth-stage-kicker">Plate I · Temples in the mist</p>
      <span className="hero-balloon hero-balloon--a auth-balloon">
        <Balloon />
      </span>
      <span className="hero-balloon hero-balloon--b auth-balloon">
        <Balloon />
      </span>
      <span className="hero-balloon hero-balloon--c auth-balloon">
        <Balloon />
      </span>
      <div className="reticle">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
