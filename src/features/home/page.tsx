import React from "react";
import { PROJECT_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Tony Lee | ML Inference & Distributed Systems";

export function HomePage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="home">
      <section className="page-hero page-hero--header page-hero--centered">
        <div className="page-hero__content">
          <h1 className="page-title home-hero-title">
            <span className="home-hero-title__lead">I&apos;m</span>
            <span className="home-hero-title__name">{siteProfile.name}</span>
          </h1>
          <p className="page-subtitle">I design and evaluate GPU-backed inference systems.</p>
          <p className="page-lede">{siteProfile.summary}</p>

          <div className="inline-links page-hero__links">
            <a href={PROJECT_PATH}>View System Design</a>
            <a href={RESUME_PATH}>View resume</a>
            <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
