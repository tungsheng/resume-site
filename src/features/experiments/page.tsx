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
      <section className="page-hero page-hero--split page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{experimentsContent.title}</h1>
          <p className="page-lede">{experimentsContent.subtitle}</p>

          <div className="inline-links page-hero__links">
            <a href={PROJECT_PATH}>View case study</a>
            <a href={RESUME_PATH}>View resume</a>
          </div>
        </div>

        <aside className="page-hero__aside">
          <p className="label">Decision summary</p>
          <ul className="bullet-list">
            {experimentsContent.decisionBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Headline results</p>
          <h2 className="section__title">What changed between the two profiles</h2>
        </div>
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
          <p className="section__kicker">Comparison</p>
          <h2 className="section__title">Zero-idle vs warm-1</h2>
        </div>
        <p className="section__copy">
          For cold-start behavior, the headline metrics are first ready replica and first public
          response. TTFT is included as a secondary serving metric once capacity is already warm
          enough to accept work.
        </p>
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
          <p className="section__kicker">Methodology</p>
          <h2 className="section__title">How to read these runs</h2>
        </div>
        <div className="grid-three">
          {experimentsContent.methodology.map((item) => (
            <article key={item.title} className="detail-card">
              <h3 className="detail-card__title">{item.title}</h3>
              <p className="detail-copy">{item.body}</p>
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
          <p className="section__kicker">Raw proof</p>
          <h2 className="section__title">Checked-in evaluate excerpts</h2>
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
          <p className="section__kicker">Interpretation</p>
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
      </section>
    </PublicSiteLayout>
  );
}
