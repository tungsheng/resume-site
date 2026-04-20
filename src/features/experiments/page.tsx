import React from "react";
import {
  experimentsContent,
  PROJECT_PATH,
  RESUME_PATH,
} from "../site/content";
import {
  buildExperimentComparisonRows,
  formatDurationLabel,
  formatTimelineSeconds,
} from "../site/format";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

export function ExperimentsPage() {
  const comparisonRows = buildExperimentComparisonRows(experimentsContent.profiles);

  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="experiments">
      <section className="page-hero page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{experimentsContent.title}</h1>
          <p className="page-lede">{experimentsContent.subtitle}</p>

          <div className="inline-links page-hero__links">
            <a href={PROJECT_PATH}>View case study</a>
            <a href={RESUME_PATH}>View resume</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Latest readouts</p>
          <h2 className="section__title">What the current runs show</h2>
        </div>
        <p className="detail-copy project-results-meta">{experimentsContent.readoutsMeta}</p>
        <div className="grid-three">
          {experimentsContent.conclusionPoints.map((item) => (
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
          <p className="section__kicker">Experiment sets</p>
          <h2 className="section__title">What each run family answers</h2>
        </div>
        <div className="grid-three">
          {experimentsContent.experimentSets.map((item) => (
            <article key={item.title} className="detail-card">
              <h3 className="detail-card__title">{item.title}</h3>
              <p className="detail-copy">{item.summary}</p>
              <div className="inline-links">
                <a href={item.href}>{item.ctaLabel}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="profile-comparison" className="section">
        <div className="section__header">
          <p className="section__kicker">Profile baselines</p>
          <h2 className="section__title">Zero-idle vs warm-1</h2>
        </div>
        <p className="section__copy">
          This pair answers the baseline question: how much first-response time does one warm
          serving path buy, and what does it cost to keep online between bursts?
        </p>
        <div className="evidence-stack">
          <article className="card">
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Zero Idle</th>
                    <th scope="col">Warm-1</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.zeroIdle}</td>
                      <td>{row.warmOne}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="timeline-grid">
            {experimentsContent.profiles.map((profile) => (
              <article key={profile.id} className="timeline-card">
                <div className="timeline-card__header">
                  <div>
                    <h3 className="timeline-card__title">{profile.label}</h3>
                    <p className="timeline-card__copy">
                      First public response in{" "}
                      <strong>{formatDurationLabel(profile.firstPublicResponseSeconds)}</strong>
                    </p>
                  </div>
                </div>
                <div className="timeline-events">
                  {profile.timeline.map((event) => (
                    <div
                      key={`${profile.id}-${event.label}`}
                      className={
                        event.emphasis
                          ? "timeline-event timeline-event--emphasis"
                          : "timeline-event"
                      }
                    >
                      <span className="timeline-event__time">
                        {formatTimelineSeconds(event.seconds)}
                      </span>
                      <span>{event.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="policy-compare" className="section">
        <div className="section__header">
          <p className="section__kicker">Policy compare</p>
          <h2 className="section__title">{experimentsContent.policyComparison.title}</h2>
        </div>
        <p className="section__copy">{experimentsContent.policyComparison.subtitle}</p>
        <article className="card">
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Running</th>
                  <th scope="col">Active-pressure</th>
                </tr>
              </thead>
              <tbody>
                {experimentsContent.policyComparison.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.running}</td>
                    <td>{row.activePressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section id="target-calibration" className="section">
        <div className="section__header">
          <p className="section__kicker">Target calibration</p>
          <h2 className="section__title">{experimentsContent.targetCalibration.title}</h2>
        </div>
        <p className="section__copy">{experimentsContent.targetCalibration.subtitle}</p>
        <div className="grid-two">
          {experimentsContent.targetCalibration.runs.map((run) => (
            <article key={run.label} className="metric-card">
              <h3 className="metric-card__label">{run.label}</h3>
              <div className="metric-card__value">{run.value}</div>
              <p className="metric-card__detail">{run.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Raw proof</p>
          <h2 className="section__title">Checked-in evaluate excerpts</h2>
        </div>
        <div className="proof-grid">
          {experimentsContent.evidenceExcerpts.map((excerpt) => (
            <article key={excerpt.title} className="proof-card">
              <div className="proof-card__header">
                <div>
                  <p className="proof-card__title">{excerpt.title}</p>
                  <p className="proof-card__subtitle">{excerpt.subtitle}</p>
                </div>
                <span className="report-badge">{excerpt.reportDate}</span>
              </div>
              <code className="proof-card__command">{excerpt.command}</code>
              <pre className="proof-card__log">{excerpt.lines.join("\n")}</pre>
            </article>
          ))}
        </div>
      </section>
    </PublicSiteLayout>
  );
}
