import React from "react";
import { PublicSiteFooter } from "./footer";
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

      <PublicSiteFooter />
    </div>
  );
}
