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
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
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
import { CommandCodeBlock } from "../site/command-code-block";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

type ComparisonDirection = "lower" | "higher";
type DecisionTone = "strong" | "measured" | "provisional";
type ExperimentDetailView = "why" | "chart" | "proof";
type ExperimentFamilyId =
  | "profile-baselines"
  | "policy-compare"
  | "target-calibration";

interface TradeoffCardItem {
  title: string;
  left: string;
  right: string;
}

const tradeoffCardSx: SxProps<Theme> = (theme) => ({
  height: "100%",
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
});

const tradeoffCardContentSx: SxProps<Theme> = {
  height: "100%",
  p: { xs: 2, sm: 2.25, md: 2.5 },
  "&:last-child": {
    pb: { xs: 2, sm: 2.25, md: 2.5 },
  },
};

const tradeoffTitleSx: SxProps<Theme> = (theme) => ({
  pb: 1.5,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 600,
  letterSpacing: 0,
});

const tradeoffPairSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr) minmax(0.75rem, 1.25rem) 4rem minmax(0.75rem, 1.25rem) minmax(0, 1fr)",
    sm: "minmax(8rem, 1fr) minmax(1.25rem, 2rem) 4.5rem minmax(1.25rem, 2rem) minmax(8rem, 1fr)",
    md: "minmax(0, 1fr) minmax(0.6rem, 1.1rem) 4rem minmax(0.6rem, 1.1rem) minmax(0, 1fr)",
  },
  gap: { xs: 0.75, sm: 1, md: 0.65 },
  alignItems: "center",
  minHeight: { xs: "4.75rem", sm: "5rem" },
  pt: 1.5,
});

function buildTradeoffEndpointSx(theme: Theme) {
  return {
    position: "relative",
    zIndex: 1,
    display: "block",
    minWidth: 0,
    color: theme.palette.text.primary,
    fontSize: { xs: "1rem", sm: "1.06rem" },
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.3,
    textWrap: "balance",
    overflowWrap: "anywhere",
  };
}

const tradeoffEndpointSx: SxProps<Theme> = (theme) =>
  buildTradeoffEndpointSx(theme);

const tradeoffEndpointRightSx: SxProps<Theme> = (theme) => ({
  ...buildTradeoffEndpointSx(theme),
  justifySelf: "stretch",
  textAlign: "right",
});

const tradeoffSignalSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  zIndex: 2,
  display: "inline-grid",
  alignItems: "center",
  justifyContent: "center",
  justifyItems: "center",
  justifySelf: "center",
  gap: 0.35,
  minWidth: "100%",
  px: 0.35,
  backgroundColor: theme.palette.background.paper,
  color: "secondary.main",
});

const tradeoffRailSx: SxProps<Theme> = (theme) => ({
  display: "block",
  width: "100%",
  height: "1px",
  backgroundColor: alpha(theme.palette.text.primary, 0.1),
});

const tradeoffSignalLabelSx: SxProps<Theme> = {
  color: "secondary.main",
  fontSize: { xs: "0.64rem", sm: "0.68rem" },
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const tradeoffSignalIconSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: { xs: "1.9rem", sm: "2rem" },
  height: { xs: "1.9rem", sm: "2rem" },
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.secondary.main, 0.06),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.18)}`,
});

const decisionWorkspaceSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 2, md: 2.5 },
});

const decisionSelectorSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.5, md: 1.75 },
});

const decisionSelectorCopySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.75,
  maxWidth: "58rem",
};

const decisionMobileChoicesSx: SxProps<Theme> = {
  display: { xs: "grid", sm: "none" },
  gap: 1,
};

const decisionTabsSx: SxProps<Theme> = (theme) => ({
  display: { xs: "none", sm: "flex" },
  minHeight: "auto",
  p: 0.75,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.text.primary, 0.035),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  "& .MuiTabs-flexContainer": {
    gap: 1,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTab-root": {
    alignItems: "stretch",
    flex: "1 1 0",
    maxWidth: "none",
    minHeight: 96,
    minWidth: 0,
    px: { sm: 1.5, md: 2 },
    py: 1.25,
    border: "1px solid transparent",
    borderRadius: 1.5,
    color: theme.palette.text.secondary,
  },
  "& .MuiTab-root.Mui-selected": {
    backgroundColor: alpha(theme.palette.common.white, 0.74),
    borderColor: alpha(theme.palette.warning.main, 0.26),
    color: theme.palette.text.primary,
  },
});

const decisionPanelSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 2.25, md: 3 },
};

const decisionSummarySx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.35, md: 1.5 },
  p: { xs: 1.5, md: 2 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.7),
  border: `1px solid ${alpha(theme.palette.warning.main, 0.16)}`,
});

const decisionSummaryHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  alignItems: "center",
  justifyContent: "space-between",
};

const decisionSummaryTitleSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  columnGap: 1,
  rowGap: 0.25,
  alignItems: "baseline",
  minWidth: 0,
};

const decisionSummaryBodySx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  columnGap: { xs: 1, md: 1.25 },
  rowGap: 0.35,
  alignItems: "baseline",
  maxWidth: "54rem",
};

const decisionReadoutSx: SxProps<Theme> = {
  pl: 1,
  borderLeft: 1,
  borderColor: "divider",
  fontWeight: 700,
  lineHeight: 1.35,
};

const decisionSummaryCopySx: SxProps<Theme> = {
  maxWidth: "46rem",
};

const decisionSummaryStatsSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
  gap: 0,
  pt: { xs: 0.25, md: 0.75 },
  borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  "& .experiment-decision-summary__stat": {
    minWidth: 0,
    display: "grid",
    gap: 0.1,
    py: { xs: 0.85, md: 0.15 },
    px: { xs: 0, md: 1.5 },
  },
  "& .experiment-decision-summary__stat:first-of-type": {
    pt: { xs: 0.25, md: 0.15 },
    pl: 0,
  },
  "& .experiment-decision-summary__stat + .experiment-decision-summary__stat": {
    borderTop: { xs: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`, md: 0 },
    borderLeft: { xs: 0, md: `1px solid ${alpha(theme.palette.text.primary, 0.08)}` },
  },
});

const decisionSummaryStatSx: SxProps<Theme> = {};

const supportPanelSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: 2,
  pt: { xs: 2, md: 2.5 },
  borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
});

const supportHeaderSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(8rem, 0.3fr) minmax(0, 0.7fr)" },
  gap: { xs: 1.25, md: 2 },
  alignItems: "center",
};

const supportTabsSx: SxProps<Theme> = (theme) => ({
  minHeight: "auto",
  p: 0.5,
  borderRadius: 1.5,
  backgroundColor: alpha(theme.palette.text.primary, 0.035),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTab-root": {
    minHeight: 38,
    minWidth: 0,
    border: "1px solid transparent",
    borderRadius: 1,
    color: theme.palette.text.secondary,
    fontWeight: 700,
  },
  "& .MuiTab-root.Mui-selected": {
    backgroundColor: alpha(theme.palette.common.white, 0.74),
    borderColor: alpha(theme.palette.text.primary, 0.1),
    color: theme.palette.text.primary,
  },
});

const chartPanelSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 2, md: 2.25 },
};

const chartHeaderSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.5,
  maxWidth: "54rem",
};

const chartRowsSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
});

const chartRowSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.25, md: 1.5 },
  py: { xs: 1.75, md: 2 },
  "& + &": {
    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  },
});

const chartRowHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  alignItems: "baseline",
  justifyContent: "space-between",
};

const chartDirectionBadgeSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.35,
  px: 0.75,
  py: 0.3,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.secondary.main, 0.045),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
  color: alpha(theme.palette.text.primary, 0.76),
  fontSize: "0.76rem",
  fontWeight: 600,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  "& strong": {
    color: theme.palette.secondary.main,
    fontWeight: 700,
  },
});

const chartValuesSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1, md: 1.1 },
};

const chartValueLabelSx: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  alignItems: "baseline",
  justifyContent: "space-between",
};

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

function getDecisionStatusChipSx(tone: DecisionTone): SxProps<Theme> {
  return (theme) => {
    const palette = {
      strong: {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        borderColor: alpha(theme.palette.primary.main, 0.18),
        color: theme.palette.primary.main,
      },
      measured: {
        backgroundColor: alpha("#0f6674", 0.08),
        borderColor: alpha("#0f6674", 0.22),
        color: "#0f6674",
      },
      provisional: {
        backgroundColor: alpha(theme.palette.warning.light, 0.2),
        borderColor: alpha(theme.palette.warning.dark, 0.34),
        color: theme.palette.warning.dark,
      },
    }[tone];

    return {
      ...palette,
      minHeight: 28,
      height: "auto",
      border: "1px solid",
      borderRadius: 999,
      "& .MuiChip-label": {
        px: 1,
        py: 0.3,
        fontSize: "0.74rem",
        fontWeight: 700,
        lineHeight: 1.35,
        overflowWrap: "anywhere",
        whiteSpace: "normal",
      },
    };
  };
}

function getDecisionChoiceSx(selected: boolean): SxProps<Theme> {
  return (theme) => ({
    justifyContent: "flex-start",
    px: 1.5,
    py: 1.25,
    minHeight: 0,
    textAlign: "left",
    color: "text.primary",
    bgcolor: selected ? alpha(theme.palette.common.white, 0.84) : "transparent",
    borderColor: selected
      ? alpha(theme.palette.warning.main, 0.36)
      : theme.palette.divider,
    boxShadow: selected
      ? `0 10px 24px ${alpha(theme.palette.text.primary, 0.08)}`
      : "none",
    "&:hover": {
      bgcolor: selected
        ? alpha(theme.palette.common.white, 0.92)
        : alpha(theme.palette.text.primary, 0.04),
      borderColor: selected
        ? alpha(theme.palette.warning.main, 0.48)
        : alpha(theme.palette.text.primary, 0.12),
    },
  });
}

function ComparisonChart({
  ariaLabel,
  rows,
}: {
  ariaLabel: string;
  rows: ComparisonChartRow[];
}) {
  return (
    <Box className="experiment-chart-rows" sx={chartRowsSx} role="group" aria-label={ariaLabel}>
      {rows.map((row) => {
        const maxValue = Math.max(...row.values.map((item) => item.value), 1);

        return (
          <Box key={row.label} className="experiment-chart-row" sx={chartRowSx}>
            <Box sx={chartRowHeaderSx}>
              <Typography variant="subtitle1">{row.label}</Typography>
              <Box
                component="span"
                className="experiment-chart-row__direction"
                sx={chartDirectionBadgeSx}
              >
                Better when <strong>{row.betterWhen}</strong>
              </Box>
            </Box>

            <Box sx={chartValuesSx}>
              {row.values.map((item) => (
                <Box key={`${row.label}-${item.label}`}>
                  <Box sx={chartValueLabelSx}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.display}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={buildBarValue(item.value, maxValue)}
                    color={item.tone === "primary" ? "primary" : "secondary"}
                    sx={{ mt: 0.75 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
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

          <CommandCodeBlock
            command={excerpt.command}
            ariaLabel={`${excerpt.title} command`}
          />

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

function TradeoffCard({ item }: { item: TradeoffCardItem }) {
  return (
    <Card
      variant="outlined"
      className="experiment-tradeoff-card"
      sx={tradeoffCardSx}
    >
      <CardContent sx={tradeoffCardContentSx}>
        <Stack spacing={0}>
          <Typography
            variant="h6"
            className="experiment-tradeoff-card__title"
            sx={tradeoffTitleSx}
          >
            {item.title}
          </Typography>
          <Box
            className="experiment-tradeoff-card__pair"
            sx={tradeoffPairSx}
            role="group"
            aria-label={`${item.title} trade-off`}
          >
            <Typography
              component="span"
              variant="subtitle1"
              className="experiment-tradeoff-card__endpoint"
              sx={tradeoffEndpointSx}
            >
              {item.left}
            </Typography>
            <Box
              component="span"
              className="experiment-tradeoff-card__rail"
              sx={tradeoffRailSx}
              aria-hidden="true"
            />
            <Box
              component="span"
              className="experiment-tradeoff-card__signal"
              sx={tradeoffSignalSx}
              aria-hidden="true"
            >
              <Typography
                component="span"
                className="experiment-tradeoff-card__signal-label"
                sx={tradeoffSignalLabelSx}
              >
                Trade-off
              </Typography>
              <Box component="span" sx={tradeoffSignalIconSx}>
                <CompareArrowsRoundedIcon sx={{ fontSize: "1rem" }} />
              </Box>
            </Box>
            <Box
              component="span"
              className="experiment-tradeoff-card__rail"
              sx={tradeoffRailSx}
              aria-hidden="true"
            />
            <Typography
              component="span"
              variant="subtitle1"
              className="experiment-tradeoff-card__endpoint experiment-tradeoff-card__endpoint--right"
              sx={tradeoffEndpointRightSx}
            >
              {item.right}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
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
    <Box component="section" className="experiment-decision-selector" sx={decisionSelectorSx}>
      <Box sx={decisionSelectorCopySx}>
        <Typography variant="body1" color="text.secondary">
          {lead}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {legend}
        </Typography>
      </Box>
      <Box aria-label="Experiment family choices" sx={decisionMobileChoicesSx}>
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
              disableRipple
              className="experiment-decision-choice"
              sx={getDecisionChoiceSx(selected)}
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
        className="experiment-decision-tabs"
        sx={decisionTabsSx}
      >
        {cards.map((item) => (
          <Tab
            key={item.id}
            id={`experiment-tab-${item.id}`}
            aria-controls={panelId}
            value={item.id}
            disableRipple
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
    </Box>
  );
}

function ExperimentDecisionSummary({
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
    <Box component="section" className="experiment-decision-summary" sx={decisionSummarySx}>
      <Box sx={decisionSummaryHeaderSx}>
        <Box sx={decisionSummaryTitleSx}>
          <Typography variant="caption" color="secondary" sx={{ fontWeight: 700 }}>
            Current call
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        <Chip
          label={status}
          className="experiment-decision-status"
          sx={getDecisionStatusChipSx(tone)}
        />
      </Box>

      <Box sx={decisionSummaryBodySx}>
        <Typography variant="h6">{recommendation}</Typography>
        <Typography variant="body2" color="text.secondary" sx={decisionReadoutSx}>
          {readout}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={decisionSummaryCopySx}>
          {summary}
        </Typography>
      </Box>

      <Box aria-label="Key facts" sx={decisionSummaryStatsSx}>
        {stats.map((item) => (
          <Box
            key={`${title}-${item.label}`}
            className="experiment-decision-summary__stat"
            sx={decisionSummaryStatSx}
          >
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {item.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.context}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
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
    <Box role="tabpanel" id={id} aria-labelledby={labelledBy} hidden={currentValue !== value}>
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
    <Box component="section" className="experiment-support-panel" sx={supportPanelSx}>
      <Box sx={supportHeaderSx}>
        <Typography variant="overline" color="secondary">
          Support detail
        </Typography>
        <Tabs
          value={detailView}
          onChange={(_event, value) => onSelectDetailView(value as ExperimentDetailView)}
          aria-label="Decision detail views"
          variant="fullWidth"
          sx={supportTabsSx}
        >
          {[
            { id: "why", label: "Why" },
            { id: "chart", label: "Chart" },
            { id: "proof", label: "Proof" },
          ].map((item) => (
            <Tab
              key={item.id}
              id={`experiment-detail-tab-${item.id}`}
              aria-controls={`experiment-detail-panel-${item.id}`}
              value={item.id}
              disableRipple
              label={item.label}
            />
          ))}
        </Tabs>
      </Box>

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
        <Box className="experiment-chart-panel" sx={chartPanelSx}>
          <Box sx={chartHeaderSx}>
            <Typography variant="overline" color="primary">
              Compact chart
            </Typography>
            <Typography variant="h6">{chartTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {comparison.note}
            </Typography>
          </Box>

          <ComparisonChart ariaLabel={chartAriaLabel} rows={rows} />
        </Box>
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
    </Box>
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
        tone: run.label === "Target 6" ? "primary" : "secondary",
      })),
    },
    {
      label: "Burst cost / run",
      betterWhen: "lower",
      values: experimentsContent.targetCalibration.runs.map((run) => ({
        label: run.label,
        value: run.burstCost,
        display: formatCurrencyLabel(run.burstCost),
        tone: run.label === "Target 6" ? "primary" : "secondary",
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
            evidenceCopy="Sequence view shows where zero-idle waits before first response. The report excerpts confirm the checkpoints."
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
            evidenceCopy="This compare excerpt backs the scale-out recommendation. It uses target 8; the target-tuning tab covers the later sweep."
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
            evidenceCopy="This April 21, 2026 sweep shows why target 6 is recommended while target 4 remains the baseline setting."
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
              <TradeoffCard item={item} />
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Compare by question"
          title="Choose what you&apos;re deciding"
        />

        <Box className="experiment-decision-workspace" sx={decisionWorkspaceSx}>
          <ExperimentDecisionMapSection
            lead={experimentsContent.decisionLead}
            cards={experimentDecisionCards}
            legend={experimentsContent.decisionLegend}
            activeExperimentId={activeExperimentId}
            panelId={activeExperimentPanelId}
            onSelect={setActiveExperimentId}
          />

          <Box
            role="tabpanel"
            id={activeExperimentPanelId}
            aria-labelledby={activeExperimentTabId}
            sx={decisionPanelSx}
          >
            <ExperimentDecisionSummary
              title={activeDecision.title}
              recommendation={activeDecision.recommendation}
              readout={activeDecision.readout}
              summary={activeExperiment.summary}
              status={activeDecision.status}
              tone={activeDecision.tone}
              stats={activeExperimentComparison.spotlightStats}
            />

            {activeExperimentPanel}
          </Box>
        </Box>
      </PageSection>
    </PublicSiteLayout>
  );
}
