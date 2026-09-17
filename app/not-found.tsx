import AuthShell from "@/components/AuthShell";

export default function NotFound() {
  return (
    <AuthShell title="Plate not found" skipLabel="Skip to plate">
      <main className="auth-main" id="auth">
        <aside className="auth-aside">
          <p className="kicker">
            <i /> Vol. 01
          </p>
          <p className="auth-aside-copy">The looking is a single route. This plate is not in it.</p>
        </aside>
        <article className="auth-plate">
          <p className="idx">Plate not found</p>
          <h1>This page is not in the volume.</h1>
          <p className="auth-lede">
            The guide is a single looking — start again from the opening plate.
          </p>
          <a className="btn is-ghost" href="/">
            Return home <span className="arrow" aria-hidden="true" />
          </a>
        </article>
      </main>
    </AuthShell>
  );
}
