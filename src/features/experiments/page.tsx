import React from "react";
import { PROJECT_PATH, RESUME_PATH } from "../site/content";
import { experimentsContent } from "../site/experiments-content";
import {
  formatCurrencyLabel,
  formatDurationLabel,
} from "../site/format";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

type ComparisonDirection = "lower" | "higher";
type DecisionTone = "strong" | "measured" | "provisional";
type ExperimentDetailView = "why" | "chart" | "proof";
type ExperimentFamilyId =
  | "profile-baselines"
  | "policy-compare"
  | "target-calibration";

interface EvidenceExcerpt {
  title: string;
  subtitle: string;
  reportDate: string;
  command: string;
  lines: string[];
}

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

interface ExperimentComparisonCopy {
  questionTitle: string;
  question: string;
  takeawayTitle: string;
  takeaway: string;
  note: string;
  spotlightStats: Array<{
    label: string;
    value: string;
    context: string;
  }>;
}

interface ExperimentDecisionCard {
  id: ExperimentFamilyId;
  title: string;
  summary: string;
  recommendation: string;
  readout: string;
  status: string;
  tone: DecisionTone;
}

const profileTimelineEventLabels: Record<string, string[]> = {
  "zero-idle": [
    "First GPU node",
    "First ready replica",
    "First public response",
    "Second ready replica",
  ],
  "warm-1": [
    "Warm baseline already present",
    "First ready replica",
    "First public response",
    "Second ready replica",
  ],
};

const profileProofLineFragments: Record<string, string[]> = {
  "zero-idle": [
    "First GPU node registered",
    "First ready replica",
    "First public response",
    "Second ready replica",
  ],
  "warm-1": [
    "Warm baseline already present",
    "First ready replica",
    "First public response",
    "Second ready replica",
  ],
};

function getProfile(id: string) {
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
      <ul className="proof-entry__facts">
        {excerpt.lines.map((line) => (
          <li key={`${excerpt.command}-${line}`} className="proof-entry__fact">
            {line}
          </li>
        ))}
      </ul>
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
    <article className="experiment-overview">
      <div className="experiment-overview__grid">
        <section className="experiment-overview__block">
          <p className="label">Problem statement</p>
          <p className="experiment-overview__title">{questionTitle}</p>
          <p className="experiment-overview__copy experiment-overview__copy--question">
            {question}
          </p>
        </section>

        <section className="experiment-overview__block experiment-overview__block--observation">
          <p className="label">Observed outcome</p>
          <p className="experiment-overview__title">{takeawayTitle}</p>
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
        <p className="label">Measured proof</p>
        <p className="detail-copy experiment-support-panel__copy">{copy}</p>
      </div>
      <div className="evidence-stack">{children}</div>
    </section>
  );
}

function TradeoffArrowIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="experiments-tradeoff-card__icon-svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 11H22M22 11L18.5 7.5M22 11L18.5 14.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d="M25 21H10M10 21L13.5 17.5M10 21L13.5 24.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function ExperimentDecisionMapSection({
  lead,
  cards,
  legend,
  activeExperimentId,
  panelId,
  onSelect,
}: {
  lead: string;
  cards: ExperimentDecisionCard[];
  legend: string;
  activeExperimentId: ExperimentFamilyId;
  panelId: string;
  onSelect: (id: ExperimentFamilyId) => void;
}) {
  return (
    <div className="experiment-decision-map" aria-label="Decision map">
      <p className="section__copy experiment-family-copy">{lead}</p>
      <div
        className="experiment-decision-grid"
        role="tablist"
        aria-label="Experiment family tabs"
        aria-orientation="horizontal"
      >
        {cards.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`experiment-tab-${item.id}`}
            aria-selected={item.id === activeExperimentId}
            aria-controls={panelId}
            tabIndex={item.id === activeExperimentId ? 0 : -1}
            className={
              item.id === activeExperimentId
                ? "experiment-decision-card experiment-decision-card--active"
                : "experiment-decision-card"
            }
            onClick={() => onSelect(item.id)}
          >
            <span className="experiment-decision-card__title">{item.title}</span>
            <span className="experiment-decision-card__recommendation">
              {item.recommendation}
            </span>
            <span className="experiment-decision-card__readout">{item.readout}</span>
          </button>
        ))}
      </div>
      <p className="experiment-decision-legend">{legend}</p>
    </div>
  );
}

function ExperimentVerdictStrip({
  title,
  recommendation,
  readout,
  summary,
  status,
  tone,
  stats,
}: {
  title: string;
  recommendation: string;
  readout: string;
  summary: string;
  status: string;
  tone: DecisionTone;
  stats: ExperimentComparisonCopy["spotlightStats"];
}) {
  return (
    <article className="card experiment-verdict">
      <div className="experiment-verdict__header">
        <div className="experiment-verdict__intro">
          <p className="label">Current call</p>
          <p className="experiment-verdict__eyebrow">{title}</p>
        </div>
        <span className={`decision-status decision-status--${tone}`}>{status}</span>
      </div>
      <h3 className="experiment-verdict__title">{recommendation}</h3>
      <div className="experiment-verdict__readout">{readout}</div>
      <p className="experiment-verdict__summary">{summary}</p>
      <div className="experiment-verdict__facts" aria-label="Key facts">
        {stats.map((item) => (
          <span key={`${title}-${item.label}`} className="experiment-verdict__fact">
            <span className="experiment-verdict__fact-label">{item.label}:</span>{" "}
            <span className="experiment-verdict__fact-value">{item.value}</span>
          </span>
        ))}
      </div>
    </article>
  );
}

function ExperimentComparisonPanel({
  comparison,
  chartTitle,
  chartAriaLabel,
  rows,
  evidenceCopy,
  detailView,
  onSelectDetailView,
  children,
}: {
  comparison: ExperimentComparisonCopy;
  chartTitle: string;
  chartAriaLabel: string;
  rows: ComparisonChartRow[];
  evidenceCopy: string;
  detailView: ExperimentDetailView;
  onSelectDetailView: (view: ExperimentDetailView) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="experiment-detail-shell">
      <div
        className="experiment-detail-nav"
        role="tablist"
        aria-label="Decision detail views"
      >
        {[
          { id: "why", label: "Why" },
          { id: "chart", label: "Compact chart" },
          { id: "proof", label: "Measured proof" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`experiment-detail-tab-${item.id}`}
            aria-selected={detailView === item.id}
            aria-controls={`experiment-detail-panel-${item.id}`}
            tabIndex={detailView === item.id ? 0 : -1}
            className={
              detailView === item.id
                ? "experiment-detail-tab experiment-detail-tab--active"
                : "experiment-detail-tab"
            }
            onClick={() => onSelectDetailView(item.id as ExperimentDetailView)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section
        className="experiment-detail-panel"
        role="tabpanel"
        id="experiment-detail-panel-why"
        aria-labelledby="experiment-detail-tab-why"
        hidden={detailView !== "why"}
      >
        <ExperimentOverview
          questionTitle={comparison.questionTitle}
          question={comparison.question}
          takeawayTitle={comparison.takeawayTitle}
          takeaway={comparison.takeaway}
        />
      </section>

      <section
        className="experiment-detail-panel"
        role="tabpanel"
        id="experiment-detail-panel-chart"
        aria-labelledby="experiment-detail-tab-chart"
        hidden={detailView !== "chart"}
      >
        <article className="comparison-surface">
          <div className="comparison-surface__header">
            <div>
              <p className="label">Compact chart</p>
              <h3 className="card__title">{chartTitle}</h3>
            </div>
            <p className="detail-copy comparison-surface__copy">
              {comparison.note}
            </p>
          </div>

          <ComparisonChart ariaLabel={chartAriaLabel} rows={rows} />
        </article>
      </section>

      <section
        className="experiment-detail-panel"
        role="tabpanel"
        id="experiment-detail-panel-proof"
        aria-labelledby="experiment-detail-tab-proof"
        hidden={detailView !== "proof"}
      >
        <ExperimentEvidenceSection copy={evidenceCopy}>
          {children}
        </ExperimentEvidenceSection>
      </section>
    </div>
  );
}

export function ExperimentsPage() {
  const [activeExperimentId, setActiveExperimentId] =
    React.useState<ExperimentFamilyId>("profile-baselines");
  const [activeDetailView, setActiveDetailView] =
    React.useState<ExperimentDetailView>("why");
  const experimentDecisionCards = experimentsContent.decisionCards as ExperimentDecisionCard[];
  const zeroIdleProfile = getProfile("zero-idle");
  const warmOneProfile = getProfile("warm-1");
  const policyProof = experimentsContent.evidenceExcerpts.find(
    (excerpt) => excerpt.title === "Warm baseline compare"
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
    lines: profile.proofExcerpt.lines.filter((line) =>
      (profileProofLineFragments[profile.id] ?? []).some((fragment) => line.includes(fragment))
    ),
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
  ];

  const policyChartRows: ComparisonChartRow[] = experimentsContent.policyComparison.rows.map((row) => ({
    label: row.label,
    betterWhen: row.betterWhen as ComparisonDirection,
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
  ];

  const activeExperiment = experimentsContent.experimentSets.find(
    (item) => item.id === activeExperimentId
  );

  if (!activeExperiment) {
    throw new Error("Missing active experiment family");
  }

  const activeDecision = experimentDecisionCards.find((item) => item.id === activeExperimentId);

  if (!activeDecision) {
    throw new Error("Missing active decision card");
  }

  React.useEffect(() => {
    setActiveDetailView("why");
  }, [activeExperimentId]);

  const activeExperimentTabId = `experiment-tab-${activeExperimentId}`;
  const activeExperimentPanelId = "experiment-panel";

  const activeExperimentPanel = (() => {
    switch (activeExperimentId) {
      case "profile-baselines":
        return (
          <ExperimentComparisonPanel
            comparison={experimentsContent.profileComparison}
            chartTitle="Where latency and cost move"
            chartAriaLabel="Profile baseline comparison chart"
            rows={profileChartRows}
            evidenceCopy="Sequence view shows where zero-idle waits before first response. The stored run excerpts confirm the checkpoints."
            detailView={activeDetailView}
            onSelectDetailView={setActiveDetailView}
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
                    {profile.timeline
                      .filter((event) =>
                        (profileTimelineEventLabels[profile.id] ?? []).includes(event.label)
                      )
                      .map((event) => (
                      <div
                        key={`${profile.id}-${event.label}`}
                        className={
                          event.emphasis
                            ? "timeline-event timeline-event--emphasis"
                            : "timeline-event"
                        }
                      >
                        <span className="timeline-event__time">
                          {event.seconds}s
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
          </ExperimentComparisonPanel>
        );
      case "policy-compare":
        return (
          <ExperimentComparisonPanel
            comparison={experimentsContent.policyComparison}
            chartTitle="Where scale-out improves"
            chartAriaLabel="Warm baseline policy comparison chart"
            rows={policyChartRows}
            evidenceCopy="This stored compare excerpt backs the scale-out recommendation. It uses active target 8; the target-tuning tab covers the later sweep."
            detailView={activeDetailView}
            onSelectDetailView={setActiveDetailView}
          >
            <div className="proof-grid">
              <EvidenceCard excerpt={policyProof} />
            </div>
          </ExperimentComparisonPanel>
        );
      case "target-calibration":
        return (
          <ExperimentComparisonPanel
            comparison={experimentsContent.targetCalibration}
            chartTitle="How the targets trade time for cost"
            chartAriaLabel="Zero-idle target calibration chart"
            rows={targetChartRows}
            evidenceCopy="This April 21, 2026 sweep shows why 6 is the recommendation while the checked-in manifest still stays at 4."
            detailView={activeDetailView}
            onSelectDetailView={setActiveDetailView}
          >
            <div className="proof-grid">
              {calibrationProofs.map((excerpt) => (
                <EvidenceCard key={`${excerpt.title}-${excerpt.command}`} excerpt={excerpt} />
              ))}
            </div>
          </ExperimentComparisonPanel>
        );
    }
  })();

  const activeExperimentComparison =
    activeExperimentId === "profile-baselines"
      ? experimentsContent.profileComparison
      : activeExperimentId === "policy-compare"
        ? experimentsContent.policyComparison
        : experimentsContent.targetCalibration;

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
          <p className="section__kicker">Experiment purpose</p>
          <h2 className="section__title">Why these experiments exist</h2>
        </div>
        <p className="section__copy experiments-summary-intro">{experimentsContent.summaryIntro}</p>
        <div className="experiments-tradeoff-grid">
          {experimentsContent.tradeoffCards.map((item) => (
            <article key={item.title} className="card experiments-tradeoff-card">
              <h3 className="experiments-tradeoff-card__title">{item.title}</h3>
              <div
                className="experiments-tradeoff-card__pair"
                role="group"
                aria-label={`${item.title} trade-off`}
              >
                <div className="experiments-tradeoff-card__side">
                  <span className="experiments-tradeoff-card__side-value">{item.left}</span>
                </div>
                <div className="experiments-tradeoff-card__center" aria-hidden="true">
                  <span className="experiments-tradeoff-card__badge">Trade-off</span>
                  <span className="experiments-tradeoff-card__icon">
                    <TradeoffArrowIcon />
                  </span>
                </div>
                <div className="experiments-tradeoff-card__side experiments-tradeoff-card__side--right">
                  <span className="experiments-tradeoff-card__side-value">{item.right}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Compare by question</p>
          <h2 className="section__title">Choose what you&apos;re deciding</h2>
        </div>
        <div className="experiment-decision-shell">
          <ExperimentDecisionMapSection
            lead={experimentsContent.decisionLead}
            cards={experimentDecisionCards}
            legend={experimentsContent.decisionLegend}
            activeExperimentId={activeExperimentId}
            panelId={activeExperimentPanelId}
            onSelect={setActiveExperimentId}
          />
          <ExperimentVerdictStrip
            title={activeDecision.title}
            recommendation={activeDecision.recommendation}
            readout={activeDecision.readout}
            summary={activeExperiment.summary}
            status={activeDecision.status}
            tone={activeDecision.tone}
            stats={activeExperimentComparison.spotlightStats}
          />
        </div>
        <div className="experiment-family-shell">
          <article
            className="card experiment-family-panel"
            role="tabpanel"
            id={activeExperimentPanelId}
            aria-labelledby={activeExperimentTabId}
          >
            {activeExperimentPanel}
          </article>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
