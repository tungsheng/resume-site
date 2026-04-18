import React from "react";
import {
  experimentsContent,
  PROJECT_PATH,
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
      <section className="page-hero">
        <p className="page-eyebrow">{experimentsContent.eyebrow}</p>
        <h1 className="page-title">{experimentsContent.title}</h1>
        <p className="page-lede">{experimentsContent.subtitle}</p>

        <div className="button-row">
          <a className="button button--primary" href={PROJECT_PATH}>
            View project walkthrough
          </a>
          <a className="button button--secondary" href="/resume/tony-lee">
            View resume
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Comparison</p>
          <h2 className="section__title">Zero-idle vs warm-1</h2>
        </div>
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
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Proof</p>
          <h2 className="section__title">Timeline excerpts</h2>
        </div>
        <div className="proof-grid">
          {experimentsContent.profiles.map((profile) => (
            <article key={profile.id} className="proof-card">
              <div className="proof-card__header">
                <div>
                  <p className="proof-card__title">{profile.label}</p>
                  <p className="proof-card__subtitle">{profile.proofExcerpt.title}</p>
                </div>
                <span className="report-badge">{profile.reportDate}</span>
              </div>
              <code className="proof-card__command">{profile.proofExcerpt.command}</code>
              <pre className="proof-card__log">{profile.proofExcerpt.lines.join("\n")}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Timelines</p>
          <h2 className="section__title">What changed between profiles</h2>
        </div>
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
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Observations</p>
          <h2 className="section__title">What these experiments show</h2>
        </div>
        <div className="grid-three">
          {experimentsContent.notes.map((note) => (
            <article key={note} className="detail-card">
              <h3 className="detail-card__title">Observation</h3>
              <p className="detail-copy">{note}</p>
            </article>
          ))}
        </div>
        <article className="about-card">
          <h3 className="about-card__title">Charts and screenshots</h3>
          <p className="detail-copy">{experimentsContent.screenshotPlaceholder}</p>
        </article>
      </section>
    </PublicSiteLayout>
  );
}
