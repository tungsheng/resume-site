import React from "react";
import {
  implementation,
  projectContent,
  tradeoffs,
  EXPERIMENTS_PATH,
  RESUME_PATH,
  siteProfile,
} from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Cloud Inference Platform | Tony Lee";

export function ProjectPage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="project">
      <section className="page-hero page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{projectContent.title}</h1>
          <p className="page-lede">{projectContent.lede}</p>
          <p className="detail-copy project-hero-proof">{projectContent.heroProof}</p>

          <div className="inline-links page-hero__links">
            <a href={EXPERIMENTS_PATH}>View experiments</a>
            <a href={RESUME_PATH}>View resume</a>
            <a href={siteProfile.githubUrl} target="_blank" rel="noreferrer">
              GitHub repo
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Latest evidence</p>
          <h2 className="section__title">What matters most</h2>
        </div>
        <p className="section__copy project-results-lead">{projectContent.resultsLead}</p>
        <p className="detail-copy project-results-meta">{projectContent.resultsMeta}</p>
        <div className="project-results-layout">
          <article className="about-card project-results-featured">
            <p className="label">Featured result</p>
            <h3 className="about-card__title">{projectContent.featuredResult.title}</h3>
            <div className="metric-card__value">{projectContent.featuredResult.value}</div>
            <p className="detail-copy">{projectContent.featuredResult.detail}</p>
          </article>

          <div className="project-results-supporting">
            {projectContent.supportingResults.map((item) => (
              <article key={item.label} className="metric-card project-results-supporting-card">
                <h3 className="metric-card__label">{item.label}</h3>
                <div className="project-stat-value">{item.value}</div>
                <p className="project-stat-detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <article className="card project-results-summary">
          <div className="project-results-summary-grid">
            <section>
              <h3 className="card__title">What changed</h3>
              <ul className="bullet-list">
                {projectContent.resultTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="project-results-next">
              <h3 className="card__title">Next step</h3>
              <p className="detail-copy">{projectContent.resultsNextStep}</p>
              <div className="inline-links">
                <a href={EXPERIMENTS_PATH}>View experiments</a>
              </div>
            </section>
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">System design</p>
          <h2 className="section__title">How the system is organized</h2>
        </div>
        <div className="grid-two">
          <article className="card">
            <h3 className="card__title">{projectContent.requestPathTitle}</h3>
            <div className="stack-diagram" aria-label="Request path diagram">
              {projectContent.requestPathNodes.map((node, index) => (
                <React.Fragment key={node}>
                  <div className="stack-diagram__node">{node}</div>
                  {index < projectContent.requestPathNodes.length - 1 && (
                    <div className="stack-diagram__arrow" aria-hidden="true">
                      ↓
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </article>

          <article className="card">
            <h3 className="card__title">{projectContent.capacityPathTitle}</h3>
            <div className="stack-diagram" aria-label="Capacity path diagram">
              {projectContent.capacityPathNodes.map((node, index) => (
                <React.Fragment key={node}>
                  <div className="stack-diagram__node">{node}</div>
                  {index < projectContent.capacityPathNodes.length - 1 && (
                    <div className="stack-diagram__arrow" aria-hidden="true">
                      ↓
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </article>
        </div>
        <div className="project-system-notes">
          {projectContent.architectureExplanation.map((paragraph) => (
            <p key={paragraph} className="section__copy">
              {paragraph}
            </p>
          ))}
          <ul className="bullet-list project-inline-list">
            {projectContent.loadSpikeBullets.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Tradeoffs</p>
          <h2 className="section__title">Where the design is strong and where it still needs work</h2>
        </div>
        <article className="card">
          <div className="project-compare-list">
            {tradeoffs.map((item) => (
              <section key={item.title} className="project-compare-row">
                <h3 className="card__title">{item.title}</h3>
                <div className="grid-two project-compare-columns">
                  <div>
                    <p className="label">{item.leftLabel}</p>
                    <p className="detail-copy project-compare-copy">{item.leftBody}</p>
                  </div>
                  <div>
                    <p className="label">{item.rightLabel}</p>
                    <p className="detail-copy project-compare-copy">{item.rightBody}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>
          <div className="project-next-step">
            <h3 className="card__title">Current limitation and next step</h3>
            <ul className="bullet-list">
              {projectContent.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Implementation</p>
          <h2 className="section__title">{implementation.title}</h2>
        </div>
        <div className="grid-two">
          <article className="card">
            <h3 className="card__title">Stack</h3>
            <ul className="card__list">
              {implementation.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3 className="card__title">Links</h3>
            <div className="link-grid">
              {implementation.links.map((link) => (
                <a
                  key={link.href}
                  className="resource-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="resource-link__label">{link.label}</span>
                  <span className="resource-link__detail">{link.detail}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
