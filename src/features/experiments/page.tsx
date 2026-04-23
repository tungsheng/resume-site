import React from "react";
import { PROJECT_PATH, RESUME_PATH } from "../site/content";
import { experimentsContent } from "../site/experiments-content";
import {
  formatBurstTtftLabel,
  formatCurrencyLabel,
  formatDurationLabel,
  formatTimelineSeconds,
} from "../site/format";
import { PublicSiteLayout } from "../site/layout";
import type {
  ComparisonDirection,
  EvidenceExcerpt,
  ExperimentFamilyId,
  ExperimentProfile,
} from "../site/types";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

const evidenceDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

interface ComparisonChartValue {
  label: string;
  value: number;
  display: string;
  tone: "primary" | "secondary";
}

interface ComparisonChartRow {
  label: string;
  betterWhen: ComparisonDirection;
  values: ComparisonChartValue[];
}

function getProfile(id: ExperimentProfile["id"]): ExperimentProfile {
  const match = experimentsContent.profiles.find((profile) => profile.id === id);
  if (!match) {
    throw new Error(`Missing experiment profile: ${id}`);
  }
  return match;
}

function formatEvidenceDate(reportDate: string): string {
  return evidenceDateFormatter.format(new Date(`${reportDate}T00:00:00Z`));
}

function buildBarWidth(value: number, maxValue: number): React.CSSProperties {
  if (value === 0 || maxValue === 0) {
    return { width: "0%" };
  }

  return {
    width: `${Math.max((value / maxValue) * 100, 8)}%`,
  };
}

function ComparisonChart({
  ariaLabel,
  rows,
}: {
  ariaLabel: string;
  rows: ComparisonChartRow[];
}) {
  return (
    <div className="comparison-chart" role="group" aria-label={ariaLabel}>
      {rows.map((row) => {
        const maxValue = Math.max(...row.values.map((item) => item.value), 1);

        return (
          <section key={row.label} className="comparison-chart__row">
            <div className="comparison-chart__row-header">
              <p className="comparison-chart__metric">{row.label}</p>
              <p className="comparison-chart__meta">Better when {row.betterWhen}</p>
            </div>

            <div className="comparison-chart__series-list">
              {row.values.map((item) => (
                <div key={`${row.label}-${item.label}`} className="comparison-chart__series">
                  <div className="comparison-chart__series-meta">
                    <span className="comparison-chart__series-label">{item.label}</span>
                    <span className="comparison-chart__series-value">{item.display}</span>
                  </div>
                  <div className="comparison-chart__track" aria-hidden="true">
                    <span
                      className={
                        item.tone === "primary"
                          ? "comparison-chart__fill comparison-chart__fill--primary"
                          : "comparison-chart__fill comparison-chart__fill--secondary"
                      }
                      style={buildBarWidth(item.value, maxValue)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function EvidenceCard({ excerpt }: { excerpt: EvidenceExcerpt }) {
  return (
    <article className="proof-entry">
      <div className="proof-entry__header">
        <div>
          <p className="proof-entry__title">{excerpt.title}</p>
          <p className="proof-entry__subtitle">{excerpt.subtitle}</p>
        </div>
        <span className="report-badge">{formatEvidenceDate(excerpt.reportDate)}</span>
      </div>
      <code className="proof-entry__command">{excerpt.command}</code>
      <pre className="proof-entry__log">{excerpt.lines.join("\n")}</pre>
    </article>
  );
}

function ExperimentOverview({
  questionTitle,
  question,
  takeawayTitle,
  takeaway,
}: {
  questionTitle: string;
  question: string;
  takeawayTitle: string;
  takeaway: string;
}) {
  return (
    <article className="card experiment-overview">
      <div className="experiment-overview__grid">
        <section className="experiment-overview__block">
          <p className="label">Question</p>
          <h3 className="experiment-overview__title">{questionTitle}</h3>
          <p className="experiment-overview__copy experiment-overview__copy--question">
            {question}
          </p>
        </section>

        <section className="experiment-overview__block experiment-overview__block--observation">
          <p className="label">Observation</p>
          <h3 className="experiment-overview__title">{takeawayTitle}</h3>
          <p className="experiment-overview__copy">{takeaway}</p>
        </section>
      </div>
    </article>
  );
}

function ExperimentEvidenceSection({
  copy,
  children,
}: {
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="experiment-support-panel" aria-label="Evidence">
      <div className="experiment-support-panel__header">
        <p className="label">Evidence</p>
        <p className="detail-copy experiment-support-panel__copy">{copy}</p>
      </div>
      <div className="evidence-stack">{children}</div>
    </section>
  );
}

export function ExperimentsPage() {
  const [activeExperimentId, setActiveExperimentId] = React.useState<ExperimentFamilyId>(
    experimentsContent.experimentSets[0]?.id ?? "profile-baselines"
  );
  const zeroIdleProfile = getProfile("zero-idle");
  const warmOneProfile = getProfile("warm-1");
  const policyProof = experimentsContent.evidenceExcerpts.find(
    (excerpt) => excerpt.title === "Warm-1 compare"
  );
  const calibrationProofs = experimentsContent.evidenceExcerpts.filter((excerpt) =>
    excerpt.title.startsWith("Zero-idle sweep")
  );

  if (!policyProof) {
    throw new Error("Missing policy comparison proof excerpt");
  }

  const profileProofs: EvidenceExcerpt[] = experimentsContent.profiles.map((profile) => ({
    title: profile.label,
    subtitle: profile.proofExcerpt.title,
    reportDate: profile.reportDate,
    command: profile.proofExcerpt.command,
    lines: profile.proofExcerpt.lines,
  }));

  const profileChartRows: ComparisonChartRow[] = [
    {
      label: "First public response",
      betterWhen: "lower",
      values: [
        {
          label: zeroIdleProfile.label,
          value: zeroIdleProfile.firstPublicResponseSeconds,
          display: formatDurationLabel(zeroIdleProfile.firstPublicResponseSeconds),
          tone: "secondary",
        },
        {
          label: warmOneProfile.label,
          value: warmOneProfile.firstPublicResponseSeconds,
          display: formatDurationLabel(warmOneProfile.firstPublicResponseSeconds),
          tone: "primary",
        },
      ],
    },
    {
      label: "Second ready replica",
      betterWhen: "lower",
      values: [
        {
          label: zeroIdleProfile.label,
          value: zeroIdleProfile.secondReadySeconds,
          display: formatDurationLabel(zeroIdleProfile.secondReadySeconds),
          tone: "secondary",
        },
        {
          label: warmOneProfile.label,
          value: warmOneProfile.secondReadySeconds,
          display: formatDurationLabel(warmOneProfile.secondReadySeconds),
          tone: "primary",
        },
      ],
    },
    {
      label: "Idle cost / hour",
      betterWhen: "lower",
      values: [
        {
          label: zeroIdleProfile.label,
          value: zeroIdleProfile.idleCostPerHour,
          display: formatCurrencyLabel(zeroIdleProfile.idleCostPerHour),
          tone: "secondary",
        },
        {
          label: warmOneProfile.label,
          value: warmOneProfile.idleCostPerHour,
          display: formatCurrencyLabel(warmOneProfile.idleCostPerHour),
          tone: "primary",
        },
      ],
    },
    {
      label: "Burst cost / run",
      betterWhen: "lower",
      values: [
        {
          label: zeroIdleProfile.label,
          value: zeroIdleProfile.burstCost,
          display: formatCurrencyLabel(zeroIdleProfile.burstCost),
          tone: "secondary",
        },
        {
          label: warmOneProfile.label,
          value: warmOneProfile.burstCost,
          display: formatCurrencyLabel(warmOneProfile.burstCost),
          tone: "primary",
        },
      ],
    },
    {
      label: "Burst TTFT",
      betterWhen: "lower",
      values: [
        {
          label: zeroIdleProfile.label,
          value: zeroIdleProfile.burstTimeToFirstTokenSeconds * 1000,
          display: formatBurstTtftLabel(zeroIdleProfile.burstTimeToFirstTokenSeconds),
          tone: "secondary",
        },
        {
          label: warmOneProfile.label,
          value: warmOneProfile.burstTimeToFirstTokenSeconds * 1000,
          display: formatBurstTtftLabel(warmOneProfile.burstTimeToFirstTokenSeconds),
          tone: "primary",
        },
      ],
    },
  ];

  const policyChartRows: ComparisonChartRow[] = experimentsContent.policyComparison.rows.map((row) => ({
    label: row.label,
    betterWhen: row.betterWhen,
    values: [
      {
        label: "Running",
        value: row.runningValue,
        display: row.running,
        tone: "secondary",
      },
      {
        label: "Active-pressure",
        value: row.activePressureValue,
        display: row.activePressure,
        tone: "primary",
      },
    ],
  }));

  const targetChartRows: ComparisonChartRow[] = [
    {
      label: "Second ready replica",
      betterWhen: "lower",
      values: experimentsContent.targetCalibration.runs.map((run) => ({
        label: run.label,
        value: run.secondReadySeconds,
        display: formatDurationLabel(run.secondReadySeconds),
        tone: run.label === "Active target 6" ? "primary" : "secondary",
      })),
    },
    {
      label: "Burst cost / run",
      betterWhen: "lower",
      values: experimentsContent.targetCalibration.runs.map((run) => ({
        label: run.label,
        value: run.burstCost,
        display: formatCurrencyLabel(run.burstCost),
        tone: run.label === "Active target 6" ? "primary" : "secondary",
      })),
    },
    {
      label: "Peak active requests / GPU node",
      betterWhen: "lower",
      values: experimentsContent.targetCalibration.runs.map((run) => ({
        label: run.label,
        value: run.peakActiveRequestsPerGpuNode,
        display: run.peakActiveRequestsPerGpuNode.toFixed(3),
        tone: run.label === "Active target 6" ? "primary" : "secondary",
      })),
    },
  ];

  const activeExperiment = experimentsContent.experimentSets.find(
    (item) => item.id === activeExperimentId
  );

  if (!activeExperiment) {
    throw new Error("Missing active experiment family");
  }

  const activeExperimentTabId = `experiment-tab-${activeExperimentId}`;
  const activeExperimentPanelId = `experiment-panel-${activeExperimentId}`;

  const activeExperimentPanelTitle =
    activeExperimentId === "profile-baselines"
      ? experimentsContent.profileComparison.title
      : activeExperimentId === "policy-compare"
        ? experimentsContent.policyComparison.title
        : experimentsContent.targetCalibration.title;

  const activeExperimentPanel = (() => {
    switch (activeExperimentId) {
      case "profile-baselines":
        return (
          <>
            <ExperimentOverview
              questionTitle={experimentsContent.profileComparison.questionTitle}
              question={experimentsContent.profileComparison.question}
              takeawayTitle={experimentsContent.profileComparison.takeawayTitle}
              takeaway={experimentsContent.profileComparison.takeaway}
            />

            <article className="card comparison-surface">
              <div className="comparison-surface__header">
                <div>
                  <p className="label">Visual comparison</p>
                  <h3 className="card__title">Where latency and cost move</h3>
                </div>
                <p className="detail-copy comparison-surface__copy">
                  {experimentsContent.profileComparison.note}
                </p>
              </div>

              <ComparisonChart
                ariaLabel="Profile baseline comparison chart"
                rows={profileChartRows}
              />
            </article>

            <ExperimentEvidenceSection
              copy="Use the sequence view to see where the first delay appears, then confirm the recorded checkpoints from the stored run excerpts."
            >
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
              <div className="proof-grid">
                {profileProofs.map((excerpt) => (
                  <EvidenceCard key={`${excerpt.title}-${excerpt.command}`} excerpt={excerpt} />
                ))}
              </div>
            </ExperimentEvidenceSection>
          </>
        );
      case "policy-compare":
        return (
          <>
            <ExperimentOverview
              questionTitle={experimentsContent.policyComparison.questionTitle}
              question={experimentsContent.policyComparison.question}
              takeawayTitle={experimentsContent.policyComparison.takeawayTitle}
              takeaway={experimentsContent.policyComparison.takeaway}
            />

            <article className="card comparison-surface">
              <div className="comparison-surface__header">
                <div>
                  <p className="label">Visual comparison</p>
                  <h3 className="card__title">Where scale-out improves</h3>
                </div>
                <p className="detail-copy comparison-surface__copy">
                  {experimentsContent.policyComparison.note}
                </p>
              </div>

              <ComparisonChart
                ariaLabel="Warm-1 policy comparison chart"
                rows={policyChartRows}
              />
            </article>

            <ExperimentEvidenceSection
              copy="This warm-1 compare report is the direct proof behind the policy recommendation."
            >
              <div className="proof-grid">
                <EvidenceCard excerpt={policyProof} />
              </div>
            </ExperimentEvidenceSection>
          </>
        );
      case "target-calibration":
        return (
          <>
            <ExperimentOverview
              questionTitle={experimentsContent.targetCalibration.questionTitle}
              question={experimentsContent.targetCalibration.question}
              takeawayTitle={experimentsContent.targetCalibration.takeawayTitle}
              takeaway={experimentsContent.targetCalibration.takeaway}
            />

            <article className="card comparison-surface">
              <div className="comparison-surface__header">
                <div>
                  <p className="label">Visual comparison</p>
                  <h3 className="card__title">How the targets trade time for cost</h3>
                </div>
                <p className="detail-copy comparison-surface__copy">
                  {experimentsContent.targetCalibration.note}
                </p>
              </div>

              <ComparisonChart
                ariaLabel="Zero-idle target calibration chart"
                rows={targetChartRows}
              />
            </article>

            <ExperimentEvidenceSection
              copy="This April 21, 2026 sweep excerpt shows why target 6 is the current default and why target 8 remains provisional."
            >
              <div className="proof-grid">
                {calibrationProofs.map((excerpt) => (
                  <EvidenceCard key={`${excerpt.title}-${excerpt.command}`} excerpt={excerpt} />
                ))}
              </div>
            </ExperimentEvidenceSection>
          </>
        );
    }
  })();

  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="experiments">
      <section className="page-hero page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{experimentsContent.title}</h1>
          <p className="page-lede">{experimentsContent.subtitle}</p>

          <div className="inline-links page-hero__links">
            <a href={PROJECT_PATH}>View project</a>
            <a href={RESUME_PATH}>View resume</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Decision summary</p>
          <h2 className="section__title">What the current runs suggest</h2>
        </div>
        <div className="experiments-summary-copy">
          <p className="section__copy experiments-summary-lead">{experimentsContent.summaryLead}</p>
          <div className="experiments-summary-meta" aria-label="Latest experiment artifacts metadata">
            <span className="experiments-summary-meta__label">Artifacts updated</span>
            <span className="experiments-summary-meta__text">{experimentsContent.readoutsMeta}</span>
          </div>
        </div>
        <div className="grid-three experiments-summary-grid">
          {experimentsContent.conclusionPoints.map((item) => (
            <article key={item.label} className="metric-card experiments-summary-card">
              <p className="label experiments-summary-card__eyebrow">{item.eyebrow}</p>
              <h3 className="experiments-summary-card__title">{item.label}</h3>
              <div className="experiments-summary-card__value">{item.value}</div>
              <p className="experiments-summary-card__detail">{item.detail}</p>
            </article>
          ))}
        </div>

        <article className="card experiments-guide">
          <div className="grid-two experiments-guide-grid">
            {experimentsContent.guideCards.map((item) => (
              <section key={item.title}>
                <h3 className="card__title">{item.title}</h3>
                <p className="detail-copy experiments-guide__copy">{item.body}</p>
              </section>
            ))}
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Compare by question</p>
          <h2 className="section__title">Choose what you&apos;re deciding</h2>
        </div>
        <p className="section__copy experiment-family-copy">
          Tabs are the only controls here. Open one to see the question, the observed result, the
          visual comparison, and the checked-in proof in one container.
        </p>
        <div className="experiment-family-shell">
          <div
            className="experiment-tabs"
            role="tablist"
            aria-label="Experiment family tabs"
            aria-orientation="horizontal"
          >
            {experimentsContent.experimentSets.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`experiment-tab-${item.id}`}
                aria-selected={item.id === activeExperimentId}
                aria-controls={`experiment-panel-${item.id}`}
                tabIndex={item.id === activeExperimentId ? 0 : -1}
                className={
                  item.id === activeExperimentId
                    ? "experiment-tab experiment-tab--active"
                    : "experiment-tab"
                }
                onClick={() => setActiveExperimentId(item.id)}
              >
                <span className="experiment-tab__title">{item.title}</span>
              </button>
            ))}
          </div>
          <article
            className="card experiment-family-panel"
            role="tabpanel"
            id={activeExperimentPanelId}
            aria-labelledby={activeExperimentTabId}
          >
            <div className="experiment-family-panel__header">
              <h3 className="experiment-tab-panel__title">{activeExperimentPanelTitle}</h3>
              <p className="detail-copy experiment-tab-panel__copy">{activeExperiment.summary}</p>
            </div>
            {activeExperimentPanel}
          </article>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
