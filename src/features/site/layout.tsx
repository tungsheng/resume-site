import React from "react";
import { EXPERIMENTS_PATH, PROJECT_PATH, RESUME_PATH, siteProfile } from "./content";
import { baseStyles } from "./styles/base";
import { contentStyles } from "./styles/content";
import { evidenceStyles } from "./styles/evidence";
import { shellStyles } from "./styles/shell";

export type PublicNavKey = "home" | "project" | "experiments" | "resume";

export const siteStyles = [
  baseStyles,
  shellStyles,
  contentStyles,
  evidenceStyles,
].join("\n");

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Project", href: PROJECT_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: RESUME_PATH },
];

export function PublicSiteHeader({ activeNav }: { activeNav: PublicNavKey }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-brand" href="/" aria-label="Tony Lee home">
          <svg
            className="site-brand__logo"
            width="160"
            height="48"
            viewBox="0 0 160 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <text
              x="0"
              y="34"
              fontFamily="JetBrains Mono, Fira Code, monospace"
              fontSize="30"
              fontWeight="600"
              fill="currentColor"
              letterSpacing="-1"
            >
              T│L
            </text>
          </svg>
        </a>

        <div className="site-header__controls">
          <nav className="site-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                className="site-nav__link"
                href={item.href}
                aria-current={item.key === activeNav ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function PublicSiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-footer__name">{siteProfile.name}</span>
      <span className="site-footer__divider" aria-hidden="true">
        •
      </span>
      <span>ML inference infrastructure</span>
    </footer>
  );
}

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
