import React from "react";
import { PublicSiteHeader } from "./header";
import { siteStyles } from "./style";
import type { PublicNavKey } from "./types";

interface PublicSiteLayoutProps {
  activeNav: PublicNavKey;
  children: React.ReactNode;
}

export function PublicSiteLayout({
  activeNav,
  children,
}: PublicSiteLayoutProps) {
  return (
    <div className="site-app">
      <style>{siteStyles}</style>

      <PublicSiteHeader activeNav={activeNav} />

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        Guided portfolio for ML inference systems, experiments, and platform work.
      </footer>
    </div>
  );
}
