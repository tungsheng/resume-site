import React from "react";
import { siteProfile } from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Tony Lee | ML Inference & Distributed Systems";
const HOME_SUBTITLE = "ML inference, built to scale.";
const HOME_LEDE =
  "I build GPU serving platforms that turn traffic into measurable capacity.";

export function HomePage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="home">
      <section className="page-hero page-hero--header home-hero">
        <div className="page-hero__content">
          <h1 className="page-title home-hero-title">
            <span className="home-hero-title__lead">I&apos;m</span>
            <span className="home-hero-title__name">{siteProfile.name}</span>
          </h1>
          <p className="home-hero-subtitle">{HOME_SUBTITLE}</p>
          <p className="page-lede">{HOME_LEDE}</p>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
