import React from "react";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PROJECT_PATH, RESUME_PATH } from "../site/content";
import { experimentsContent } from "../site/experiments-content";
import {
  formatCurrencyLabel,
  formatDurationLabel,
} from "../site/format";
import {
  ActionLinkRow,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

type ComparisonDirection = "lower" | "higher";
type DecisionTone = "strong" | "measured" | "provisional";
type ExperimentDetailView = "why" | "chart" | "proof";
type ExperimentFamilyId =
  | "profile-baselines"
  | "policy-compare"
  | "target-calibration";

const evidenceCodeSx = {
  display: "block",
  minWidth: 0,
  maxWidth: "100%",
  fontSize: "0.88rem",
  lineHeight: 1.55,
} as const;

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

function buildBarValue(value: number, maxValue: number): number {
  if (value === 0 || maxValue === 0) {
    return 0;
  }

  return Math.max((value / maxValue) * 100, 8);
}

function getDecisionChipColor(
  tone: DecisionTone
): "primary" | "warning" | "default" {
  if (tone === "strong") return "primary";
  if (tone === "provisional") return "warning";
  return "default";
}

function ComparisonChart({
  ariaLabel,
  rows,
}: {
  ariaLabel: string;
  rows: ComparisonChartRow[];
}) {
  return (
    <Stack spacing={2.5} role="group" aria-label={ariaLabel}>
      {rows.map((row) => {
        const maxValue = Math.max(...row.values.map((item) => item.value), 1);

        return (
          <Card key={row.label} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">{row.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Better when {row.betterWhen}
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {row.values.map((item) => (
                    <Stack key={`${row.label}-${item.label}`} spacing={0.75}>
                      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.display}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={buildBarValue(item.value, maxValue)}
                        color={item.tone === "primary" ? "primary" : "secondary"}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

function EvidenceCard({ excerpt }: { excerpt: EvidenceExcerpt }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <div>
              <Typography variant="subtitle1">{excerpt.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {excerpt.subtitle}
              </Typography>
            </div>
            <Chip label={formatEvidenceDate(excerpt.reportDate)} size="small" />
          </Stack>

          <Typography component="code" variant="body2" sx={evidenceCodeSx}>
            {excerpt.command}
          </Typography>

          <List dense disablePadding>
            {excerpt.lines.map((line) => (
              <ListItem key={`${excerpt.command}-${line}`} disableGutters>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {line}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="overline" color="primary">
              Problem statement
            </Typography>
            <Typography variant="h6" gutterBottom>
              {questionTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {question}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="overline" color="primary">
              Observed outcome
            </Typography>
            <Typography variant="h6" gutterBottom>
              {takeawayTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {takeaway}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
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
    <Stack spacing={2.5} aria-label="Evidence">
      <div>
        <Typography variant="overline" color="primary">
          Measured proof
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy}
        </Typography>
      </div>
      {children}
    </Stack>
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
    <Stack spacing={2.5} aria-label="Decision map">
      <Typography variant="body1" color="text.secondary">
        {lead}
      </Typography>
      <Box
        aria-label="Experiment family choices"
        sx={{ display: { xs: "grid", sm: "none" }, gap: 1 }}
      >
        {cards.map((item) => {
          const selected = item.id === activeExperimentId;

          return (
            <Button
              key={item.id}
              type="button"
              aria-controls={panelId}
              aria-pressed={selected}
              onClick={() => onSelect(item.id)}
              variant="outlined"
              sx={(theme) => ({
                justifyContent: "flex-start",
                px: 1.5,
                py: 1.25,
                textAlign: "left",
                color: "text.primary",
                bgcolor: selected
                  ? alpha(theme.palette.warning.main, 0.08)
                  : "transparent",
                borderColor: selected
                  ? alpha(theme.palette.warning.main, 0.36)
                  : theme.palette.divider,
                "&:hover": {
                  bgcolor: selected
                    ? alpha(theme.palette.warning.main, 0.12)
                    : alpha(theme.palette.text.primary, 0.04),
                  borderColor: selected
                    ? alpha(theme.palette.warning.main, 0.48)
                    : alpha(theme.palette.text.primary, 0.12),
                },
              })}
            >
              <Stack spacing={0.35} sx={{ alignItems: "flex-start", minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  {item.recommendation}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {item.readout}
                </Typography>
              </Stack>
            </Button>
          );
        })}
      </Box>
      <Tabs
        value={activeExperimentId}
        onChange={(_event, value) => onSelect(value as ExperimentFamilyId)}
        aria-label="Experiment family tabs"
        variant="fullWidth"
        sx={{
          display: { xs: "none", sm: "flex" },
          "& .MuiTab-root": {
            alignItems: "stretch",
            maxWidth: "none",
            minHeight: 72,
            py: 1.25,
          },
        }}
      >
        {cards.map((item) => (
          <Tab
            key={item.id}
            id={`experiment-tab-${item.id}`}
            aria-controls={panelId}
            value={item.id}
            label={
              <Stack
                spacing={0.5}
                sx={{
                  alignItems: "flex-start",
                  minWidth: 0,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  {item.recommendation}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {item.readout}
                </Typography>
              </Stack>
            }
            wrapped
          />
        ))}
      </Tabs>
      <Typography variant="body2" color="text.secondary">
        {legend}
      </Typography>
    </Stack>
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
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <div>
            <Typography variant="overline" color="primary">
              Current call
            </Typography>
            <Typography variant="subtitle1">{title}</Typography>
          </div>
          <Chip label={status} color={getDecisionChipColor(tone)} />
        </Stack>

        <Typography variant="h5">{recommendation}</Typography>
        <Typography variant="h6" color="primary">
          {readout}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          aria-label="Key facts"
          sx={{ flexWrap: "wrap" }}
        >
          {stats.map((item) => (
            <Chip
              key={`${title}-${item.label}`}
              label={`${item.label}: ${item.value}`}
              variant="outlined"
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function TabPanel({
  currentValue,
  value,
  id,
  labelledBy,
  children,
}: {
  currentValue: string;
  value: string;
  id: string;
  labelledBy: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      hidden={currentValue !== value}
      sx={{ pt: 3 }}
    >
      {currentValue === value ? children : null}
    </Box>
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
    <Stack spacing={1}>
      <Tabs
        value={detailView}
        onChange={(_event, value) => onSelectDetailView(value as ExperimentDetailView)}
        aria-label="Decision detail views"
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            minHeight: 44,
          },
        }}
      >
        {[
          { id: "why", label: "Why" },
          { id: "chart", label: "Compact chart" },
          { id: "proof", label: "Measured proof" },
        ].map((item) => (
          <Tab
            key={item.id}
            id={`experiment-detail-tab-${item.id}`}
            aria-controls={`experiment-detail-panel-${item.id}`}
            value={item.id}
            label={item.label}
          />
        ))}
      </Tabs>

      <TabPanel
        currentValue={detailView}
        value="why"
        id="experiment-detail-panel-why"
        labelledBy="experiment-detail-tab-why"
      >
        <ExperimentOverview
          questionTitle={comparison.questionTitle}
          question={comparison.question}
          takeawayTitle={comparison.takeawayTitle}
          takeaway={comparison.takeaway}
        />
      </TabPanel>

      <TabPanel
        currentValue={detailView}
        value="chart"
        id="experiment-detail-panel-chart"
        labelledBy="experiment-detail-tab-chart"
      >
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2.5}>
            <div>
              <Typography variant="overline" color="primary">
                Compact chart
              </Typography>
              <Typography variant="h6" gutterBottom>
                {chartTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comparison.note}
              </Typography>
            </div>

            <ComparisonChart ariaLabel={chartAriaLabel} rows={rows} />
          </Stack>
        </Paper>
      </TabPanel>

      <TabPanel
        currentValue={detailView}
        value="proof"
        id="experiment-detail-panel-proof"
        labelledBy="experiment-detail-tab-proof"
      >
        <ExperimentEvidenceSection copy={evidenceCopy}>
          {children}
        </ExperimentEvidenceSection>
      </TabPanel>
    </Stack>
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
            <Grid container spacing={2}>
              {experimentsContent.profiles.map((profile) => (
                <Grid key={profile.id} size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <div>
                          <Typography variant="h6">{profile.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            First public response in{" "}
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              {formatDurationLabel(profile.firstPublicResponseSeconds)}
                            </Box>
                          </Typography>
                        </div>

                        <List dense disablePadding>
                          {profile.timeline
                            .filter((event) =>
                              (profileTimelineEventLabels[profile.id] ?? []).includes(event.label)
                            )
                            .map((event) => (
                              <ListItem key={`${profile.id}-${event.label}`} disableGutters>
                                <ListItemText
                                  primary={
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      sx={{ alignItems: "center" }}
                                    >
                                      <Chip
                                        label={`${event.seconds}s`}
                                        size="small"
                                        color={event.emphasis ? "primary" : "default"}
                                      />
                                      <Typography variant="body2">{event.label}</Typography>
                                    </Stack>
                                  }
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              {profileProofs.map((excerpt) => (
                <Grid key={`${excerpt.title}-${excerpt.command}`} size={{ xs: 12, md: 6 }}>
                  <EvidenceCard excerpt={excerpt} />
                </Grid>
              ))}
            </Grid>
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
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <EvidenceCard excerpt={policyProof} />
              </Grid>
            </Grid>
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
            <Grid container spacing={2}>
              {calibrationProofs.map((excerpt) => (
                <Grid key={`${excerpt.title}-${excerpt.command}`} size={{ xs: 12, md: 8 }}>
                  <EvidenceCard excerpt={excerpt} />
                </Grid>
              ))}
            </Grid>
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
      <PageHero>
        <Typography component="h1" variant="h3">
          {experimentsContent.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "56rem" }}>
          {experimentsContent.subtitle}
        </Typography>

        <ActionLinkRow>
          <Button href={PROJECT_PATH} variant="contained">
            View project
          </Button>
          <Button href={RESUME_PATH} variant="outlined">
            View resume
          </Button>
        </ActionLinkRow>
      </PageHero>

      <PageSection>
        <SectionHeader
          eyebrow="Experiment purpose"
          title="Why these experiments exist"
          copy={experimentsContent.summaryIntro}
        />

        <Grid container spacing={3}>
          {experimentsContent.tradeoffCards.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: "center", justifyContent: "space-between" }}
                      role="group"
                      aria-label={`${item.title} trade-off`}
                    >
                      <Typography variant="subtitle1">{item.left}</Typography>
                      <Stack spacing={0.5} sx={{ alignItems: "center" }} aria-hidden="true">
                        <Chip label="Trade-off" size="small" />
                        <CompareArrowsRoundedIcon color="action" />
                      </Stack>
                      <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
                        {item.right}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Compare by question"
          title="Choose what you&apos;re deciding"
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <ExperimentDecisionMapSection
                lead={experimentsContent.decisionLead}
                cards={experimentDecisionCards}
                legend={experimentsContent.decisionLegend}
                activeExperimentId={activeExperimentId}
                panelId={activeExperimentPanelId}
                onSelect={setActiveExperimentId}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <ExperimentVerdictStrip
              title={activeDecision.title}
              recommendation={activeDecision.recommendation}
              readout={activeDecision.readout}
              summary={activeExperiment.summary}
              status={activeDecision.status}
              tone={activeDecision.tone}
              stats={activeExperimentComparison.spotlightStats}
            />
          </Grid>
        </Grid>

        <Paper
          variant="outlined"
          role="tabpanel"
          id={activeExperimentPanelId}
          aria-labelledby={activeExperimentTabId}
          sx={{ p: { xs: 2.5, md: 3 } }}
        >
          {activeExperimentPanel}
        </Paper>
      </PageSection>
    </PublicSiteLayout>
  );
}
