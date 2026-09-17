import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import { safeNextPath } from "@/lib/auth/paths";
import { getSessionReader } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Explore · Myanmar Discovery",
  description: "Begin looking: open the plates, the map, and the notes.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const reader = await getSessionReader();
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  if (reader) redirect(nextPath);

  return (
    <AuthShell title="Explore">
      <main className="auth-main" id="auth">
        <aside className="auth-aside">
          <p className="kicker">
            <i /> Vol. 01 · six plates
          </p>
          <p className="auth-aside-copy">A name, then the map. The country is learned by looking.</p>
        </aside>
        <article className="auth-plate">
          <p className="idx">Vol. 01</p>
          <h1>Begin looking.</h1>
          <p className="auth-lede">
            A name, an email, a password. Then the map, the plates, and the notes — a first looking, kept.
          </p>
          <AuthForm mode="sign-up" nextPath={nextPath} />
          <p className="auth-switch">
            Already been? <a href={nextPath === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(nextPath)}`}>Sign in</a>.
          </p>
        </article>
      </main>
    </AuthShell>
  );
}
