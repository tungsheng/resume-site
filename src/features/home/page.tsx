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

      <section className="section home-projects-section">
        <div className="section__header home-projects-section__header">
          <p className="section__kicker">Project</p>
        </div>

        <a className="card home-project-card home-project-card--link" href={PROJECT_PATH}>
          <h3 className="card__title home-project-card__title">gpu-inference-lab</h3>
          <p className="card__copy">
            AWS EKS + Karpenter + vLLM lab for comparing autoscaling policies from real serving
            pressure.
          </p>
          <span className="home-project-card__action">
            View project <span aria-hidden="true">→</span>
          </span>
        </a>
      </section>
    </PublicSiteLayout>
  );
}
