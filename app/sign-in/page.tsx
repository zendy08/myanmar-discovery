import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import { safeNextPath } from "@/lib/auth/paths";
import { getSessionReader } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in · Myanmar Discovery",
  description: "Sign in to open the plates, the map, and the rest of the volume.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const reader = await getSessionReader();
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  if (reader) redirect(nextPath);

  return (
    <AuthShell title="Sign in">
      <main className="auth-main" id="auth">
        <aside className="auth-aside">
          <p className="kicker">
            <i /> 21°10′N · 94°52′E · Bagan
          </p>
          <p className="auth-aside-copy">The mist still holds the shapes. Sign in, and the plates open.</p>
        </aside>
        <article className="auth-plate">
          <p className="idx">Reader</p>
          <h1>Return to the volume.</h1>
          <p className="auth-lede">
            History, the map, six plates, and the notes wait here. Glance stays open either way.
          </p>
          <AuthForm mode="sign-in" nextPath={nextPath} />
          <p className="auth-switch">
            New to the looking? <a href={nextPath === "/" ? "/sign-up" : `/sign-up?next=${encodeURIComponent(nextPath)}`}>Explore</a>.
          </p>
        </article>
      </main>
    </AuthShell>
  );
}
