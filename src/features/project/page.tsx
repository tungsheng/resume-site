import React from "react";
import {
  capacityModel,
  implementation,
  projectContent,
  tradeoffs,
  EXPERIMENTS_PATH,
  siteProfile,
} from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Cloud Inference Platform | Tony Lee";

export function ProjectPage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="project">
      <section className="page-hero page-hero--split">
        <div>
          <p className="page-eyebrow">{projectContent.eyebrow}</p>
          <h1 className="page-title">{projectContent.title}</h1>
          <p className="page-subtitle">{siteProfile.title}</p>
          <p className="page-lede">{projectContent.lede}</p>

          <div className="button-row">
            <a className="button button--primary" href={siteProfile.githubUrl} target="_blank" rel="noreferrer">
              GitHub repo
            </a>
            <a className="button button--secondary" href={EXPERIMENTS_PATH}>
              View experiments
            </a>
            <a className="button button--ghost" href="/resume/tony-lee">
              View resume
            </a>
          </div>
        </div>

        <aside className="page-hero__aside">
          <p className="label">What this project explores</p>
          <ul className="bullet-list">
            {projectContent.explores.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Architecture</p>
          <h2 className="section__title">{projectContent.architectureTitle}</h2>
        </div>
        <div className="grid-two">
          <article className="card">
            <h3 className="card__title">System path</h3>
            <div className="stack-diagram" aria-label="Architecture diagram">
              {projectContent.architectureNodes.map((node, index) => (
                <React.Fragment key={node}>
                  <div className="stack-diagram__node">{node}</div>
                  {index < projectContent.architectureNodes.length - 1 && (
                    <div className="stack-diagram__arrow" aria-hidden="true">
                      ↓
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </article>

          <article className="card">
            <h3 className="card__title">Why this shape matters</h3>
            {projectContent.architectureExplanation.map((paragraph) => (
              <p key={paragraph} className="card__copy">
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Control loop</p>
          <h2 className="section__title">How Autoscaling Works</h2>
        </div>
        <div className="grid-two">
          <article className="card">
            <h3 className="card__title">Scaling path</h3>
            <div className="flow-row" aria-label="Control loop diagram">
              {projectContent.controlLoopNodes.map((node, index) => (
                <React.Fragment key={node}>
                  <div className="flow-pill">{node}</div>
                  {index < projectContent.controlLoopNodes.length - 1 && (
                    <span className="flow-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </article>

          <article className="card">
            <h3 className="card__title">Step-by-step flow</h3>
            <ol className="steps-list">
              {projectContent.autoscalingSteps.map((step, index) => (
                <li key={step} className="steps-list__item">
                  <span className="steps-list__index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="card__copy">{projectContent.autoscalingInsight}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Key results</p>
          <h2 className="section__title">What happened under load</h2>
        </div>
        <div className="grid-three">
          {projectContent.resultsSummary.map((item) => (
            <article key={item.label} className="metric-card">
              <h3 className="metric-card__label">{item.label}</h3>
              <div className="metric-card__value">{item.value}</div>
              <p className="metric-card__detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Tradeoffs and lessons</p>
          <h2 className="section__title">What the system teaches</h2>
        </div>
        <div className="grid-three">
          {tradeoffs.map((item) => (
            <article key={item.title} className="detail-card">
              <h3 className="detail-card__title">{item.title}</h3>
              <ul className="detail-list">
                <li>
                  <strong>{item.leftLabel}:</strong> {item.leftBody}
                </li>
                <li>
                  <strong>{item.rightLabel}:</strong> {item.rightBody}
                </li>
              </ul>
            </article>
          ))}
        </div>
        <div className="grid-three">
          {projectContent.lessons.map((lesson) => (
            <article key={lesson} className="detail-card">
              <h3 className="detail-card__title">Lesson</h3>
              <p className="detail-copy">{lesson}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Capacity reasoning</p>
          <h2 className="section__title">{capacityModel.title}</h2>
        </div>
        <article className="card">
          <p className="section__copy">{capacityModel.lead}</p>
          <pre className="proof-card__log">{capacityModel.formula}</pre>
          <p className="section__copy">{capacityModel.note}</p>
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
