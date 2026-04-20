import React from "react";
import { EXPERIMENTS_PATH, PROJECT_PATH, RESUME_PATH } from "./content";
import type { PublicNavKey } from "./types";

interface PublicSiteHeaderProps {
  activeNav: PublicNavKey;
}

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Project", href: PROJECT_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: RESUME_PATH },
];

export function PublicSiteHeader({ activeNav }: PublicSiteHeaderProps) {
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
