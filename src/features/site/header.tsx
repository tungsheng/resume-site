import React from "react";
import { ABOUT_PATH, EXPERIMENTS_PATH, PROJECT_PATH } from "./content";
import type { PublicNavKey } from "./types";

interface PublicSiteHeaderProps {
  activeNav: PublicNavKey;
  actions?: React.ReactNode;
  contextLabel?: string;
}

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Project", href: PROJECT_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: "/resume/tony-lee" },
  { key: "about", label: "About", href: ABOUT_PATH },
];

export function PublicSiteHeader({
  activeNav,
  actions,
  contextLabel,
}: PublicSiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-brand" href="/">
          Tony Lee
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

          {(contextLabel || actions) && (
            <div className="site-header__actions">
              {contextLabel ? <span className="site-header__context">{contextLabel}</span> : null}
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
