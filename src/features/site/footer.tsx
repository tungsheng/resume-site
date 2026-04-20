import React from "react";
import { siteProfile } from "./content";

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
