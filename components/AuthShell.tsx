import type { ReactNode } from "react";
import AuthStage from "@/components/AuthStage";
import SiteHeader from "@/components/SiteHeader";
import { getSessionReader } from "@/lib/auth/session";

type AuthShellProps = {
  title: string;
  skipHref?: string;
  skipLabel?: string;
  children: ReactNode;
};

export default async function AuthShell({
  title,
  skipHref = "#auth",
  skipLabel = "Skip to form",
  children,
}: AuthShellProps) {
  const reader = await getSessionReader();

  return (
    <div className="auth-shell">
      <a className="skip" href={skipHref}>
        {skipLabel}
      </a>
      <AuthStage />
      <SiteHeader reader={reader} variant="auth" authTitle={title} wordmarkHref="/" />
      {children}
      <footer className="site-footer is-glass">
        <div>
          <p className="colophon">Myanmar Discovery · not a booking desk.</p>
          <p>A reader account keeps the plates, nothing more.</p>
        </div>
        <p>Vol. 01 · Plates from Bagan, Inle, Yangon</p>
      </footer>
    </div>
  );
}
