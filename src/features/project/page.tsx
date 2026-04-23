import React from "react";
import { EXPERIMENTS_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { implementation, projectContent } from "../site/project-content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";
import type { WorkflowNode, WorkflowTrack } from "../site/types";

const PAGE_TITLE = "Cloud Inference Platform | Tony Lee";

function WorkflowNodePill({ label, href, linkLabel = "Code" }: WorkflowNode) {
  return (
    <span className="project-workflow-node">
      <span className="project-workflow-node__label">{label}</span>
      {href ? (
        <a
          className="project-workflow-node__link"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {linkLabel}
        </a>
      ) : null}
    </span>
  );
}

function WorkflowPathRow({
  title,
  summary,
  nodes,
}: WorkflowTrack) {
  return (
    <section className="project-workflow-path">
      <div className="project-workflow-path__meta">
        <h3 className="card__title project-workflow-path__title">{title}</h3>
        <p className="detail-copy project-workflow-path__summary">{summary}</p>
      </div>
      <div className="project-workflow-path__flow" aria-label={`${title} workflow`}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.label}>
            <WorkflowNodePill
              label={node.label}
              href={node.href}
              linkLabel={node.linkLabel}
            />
            {index < nodes.length - 1 && (
              <span className="project-workflow-flow-arrow" aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export function ProjectPage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="project">
      <section className="page-hero page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{projectContent.title}</h1>
          <p className="page-lede">{projectContent.lede}</p>

          <div className="inline-links page-hero__links project-hero-links">
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
          <h2 className="section__title">At a glance</h2>
        </div>
        <p className="section__copy project-overview-summary">
          {projectContent.overviewSummary}
        </p>
        <div className="grid-three project-overview-grid">
          {projectContent.overviewCards.map((item) => (
            <section key={item.title} className="project-overview-story-item">
              <h3 className="card__title project-overview-story-item__title">{item.title}</h3>
              <p className="detail-copy project-overview-card__copy">{item.body}</p>
            </section>
          ))}
        </div>
        <section className="project-overview-signals">
          <div className="project-overview-signals__intro">
            <p className="label">Signals in plain English</p>
            <p className="detail-copy project-overview-signals__copy">{projectContent.overviewSignalsLead}</p>
          </div>
          <div className="grid-three project-overview-signals-grid">
            {projectContent.overviewMetrics.map((item) => (
              <section key={item.label} className="project-signal">
                <h3 className="project-signal__title">{item.label}</h3>
                <div className="project-stat-value">{item.value}</div>
                <p className="project-stat-detail project-signal__detail">{item.detail}</p>
              </section>
            ))}
          </div>
        </section>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">{projectContent.workflowSectionTitle}</h2>
        </div>
        <p className="section__copy project-workflow-lead">{projectContent.workflowLead}</p>
        <article className="card project-workflow-surface">
          <section className="project-workflow-foundation">
            <div className="project-workflow-foundation__header">
              <h3 className="card__title project-workflow-foundation__title">
                {projectContent.workflowFoundation.title}
              </h3>
              <p className="detail-copy project-workflow-foundation__summary">
                {projectContent.workflowFoundation.summary}
              </p>
            </div>
            <div className="project-workflow-foundation__nodes">
              {projectContent.workflowFoundation.nodes.map((node) => (
                <WorkflowNodePill
                  key={node.label}
                  label={node.label}
                  href={node.href}
                  linkLabel={node.linkLabel}
                />
              ))}
            </div>
          </section>
          <div className="project-workflow-paths">
            {projectContent.workflowPaths.map((path) => (
              <WorkflowPathRow
                key={path.title}
                title={path.title}
                summary={path.summary}
                nodes={path.nodes}
              />
            ))}
          </div>
          <section className="project-workflow-rejoin">
            <div className="project-workflow-rejoin__meta">
              <p className="label">Rejoin point</p>
              <p className="detail-copy project-workflow-rejoin__copy">
                {projectContent.workflowRejoin.body}
              </p>
            </div>
            <div className="project-workflow-rejoin__flow" aria-label="Rejoin workflow">
              {projectContent.workflowRejoin.nodes.map((node, index) => (
                <React.Fragment key={node.label}>
                  <WorkflowNodePill
                    label={node.label}
                    href={node.href}
                    linkLabel={node.linkLabel}
                  />
                  {index < projectContent.workflowRejoin.nodes.length - 1 && (
                    <span className="project-workflow-flow-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
          <div className="grid-three project-workflow-explainers">
            {projectContent.workflowExplainers.map((item) => (
              <section key={item.title} className="project-workflow-explainer">
                <h3 className="card__title project-workflow-explainer__title">{item.title}</h3>
                <p className="detail-copy project-workflow-explainer__copy">{item.body}</p>
              </section>
            ))}
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">{implementation.title}</h2>
        </div>
        <p className="section__copy">{implementation.lead}</p>
        <article className="card project-implementation-surface">
          <section className="project-implementation-primary">
            <div className="project-implementation-primary__intro">
              <p className="label">{implementation.defaultPathTitle}</p>
              <p className="detail-copy project-implementation-primary__copy">
                {implementation.defaultPathLead}
              </p>
            </div>
            <div className="project-implementation-default-flow" aria-label="Default repo flow">
              {implementation.defaultPathSteps.map((item, index) => (
                <section
                  key={item.title}
                  className="project-implementation-default-step"
                  data-continues={
                    index < implementation.defaultPathSteps.length - 1 ? "true" : "false"
                  }
                >
                  <p className="label project-implementation-default-step__index">
                    Step {index + 1}
                  </p>
                  <h3 className="card__title project-implementation-default-step__title">
                    {item.title}
                  </h3>
                  <code className="project-implementation-default-step__command">
                    {item.command}
                  </code>
                  <p className="detail-copy project-implementation-default-step__copy">
                    {item.body}
                  </p>
                </section>
              ))}
            </div>
          </section>
          <div className="project-implementation-support">
            <section className="project-implementation-proof">
              <div className="project-implementation-proof__intro">
                <p className="label">{implementation.verifyProofTitle}</p>
              </div>
              <div className="project-implementation-proof-list">
                {implementation.verifyProofs.map((item) => (
                  <section key={item.title} className="project-implementation-proof-item">
                    <h3 className="card__title project-implementation-proof-item__title">
                      {item.title}
                    </h3>
                    <p className="detail-copy project-implementation-proof-item__copy">
                      {item.body}
                    </p>
                  </section>
                ))}
              </div>
            </section>
            <section className="project-implementation-measure">
              <div className="project-implementation-measure__intro">
                <p className="label">{implementation.measurement.title}</p>
                <p className="detail-copy project-implementation-measure__copy">
                  {implementation.measurement.body}
                </p>
              </div>
              <div className="project-implementation-measure__detail">
                <code className="project-implementation-measure__command">
                  {implementation.measurement.command}
                </code>
              <div className="project-implementation-measure__outputs">
                {implementation.measurement.outputs.map((item) => (
                  <span key={item} className="project-implementation-measure__output">
                    {item}
                  </span>
                ))}
              </div>
                <div className="project-implementation-measure__links">
                  {implementation.measurement.links.map((link) => (
                    <a
                      key={link.href}
                      className="project-implementation-measure__source-link"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </article>
      </section>
    </PublicSiteLayout>
  );
}
