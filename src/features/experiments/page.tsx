import React from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { EXPERIMENTS_PATH, PROJECTS_PATH } from "../site/content";
import {
  experimentCatalogContent,
  experimentDetailPath,
  experimentSourceLink,
  getExperimentBySlug,
  type ExperimentCatalogItem,
  type ExperimentReadinessSignal,
  type ExperimentReadinessTone,
  type ExperimentResultEvidenceTable,
} from "../site/experiment-catalog-content";
import {
  decisionProjectPath,
  getDecisionRecordsByExperimentSlug,
  type DecisionRecord,
} from "../site/decision-content";
import { getProjectById, projectPortfolioContent, type ProjectId } from "../site/projects-content";
import {
  ActionLinkRow,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import {
  accentChipSx,
  accentPanelBaseSx,
  composeSx,
  mutedChipSx,
  softPanelBaseSx,
  successPanelBaseSx,
  warningPanelBaseSx,
} from "../site/styles";
import { CommandCodeBlock } from "../site/command-code-block";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

const EXPERIMENT_DETAIL_PREFIX = `${EXPERIMENTS_PATH}/`;
const DEFAULT_EXPERIMENT_PROJECT_ID: ProjectId = "gpu-inference-lab";
const HOME_BREADCRUMB = { label: "Home", href: "/" };
const EXPERIMENTS_BREADCRUMB = { label: "Experiments", href: EXPERIMENTS_PATH };

const catalogStatusNoteSx: SxProps<Theme> = composeSx(softPanelBaseSx, (theme) => ({
  position: "relative",
  display: "grid",
  gap: { xs: 0.75, md: 0.85 },
  alignContent: "start",
  width: "100%",
  overflow: "hidden",
  p: { xs: 1.15, sm: 1.25, md: 1.35 },
  pl: { xs: 1.4, sm: 1.5, md: 1.65 },
  "&::before": {
    content: '""',
    position: "absolute",
    insetBlock: 0,
    left: 0,
    width: "0.28rem",
    backgroundColor: theme.palette.secondary.main,
  },
}));

const catalogStatusHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  alignItems: "center",
  justifyContent: "space-between",
};

const heroSplitSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 0.95fr) minmax(23rem, 0.75fr)" },
  gap: { xs: 1.75, md: 2.5 },
  alignItems: "start",
  width: "100%",
};

const heroPrimarySx: SxProps<Theme> = {
  display: "grid",
  gap: 2,
  alignContent: "start",
  minWidth: 0,
  maxWidth: "58rem",
};

const heroSupportSx: SxProps<Theme> = {
  display: "grid",
  gap: 1.25,
  alignContent: "start",
  minWidth: 0,
  width: "100%",
};

const catalogFactStripSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 0.65, md: 0.75 },
  alignItems: "center",
  width: "100%",
};

const catalogFactChipSx: SxProps<Theme> = composeSx(mutedChipSx, {
  minHeight: 30,
  height: "auto",
  "& .MuiChip-label": {
    display: "block",
    px: 1,
    py: 0.35,
    overflowWrap: "anywhere",
    whiteSpace: "normal",
    fontSize: "0.76rem",
    fontWeight: 600,
    lineHeight: 1.25,
  },
});

const relatedDecisionGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1, md: 1.15 },
};

const relatedDecisionCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.75,
  alignContent: "start",
  p: { xs: 1.2, sm: 1.35 },
});

const catalogListSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 2, md: 2.25 },
};

const catalogListHeaderSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "minmax(0, 1fr) minmax(20rem, 0.5fr)",
  },
  gap: { xs: 1.15, md: 2 },
  alignItems: "end",
  width: "100%",
};

const catalogListHeadingSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 0.9, md: 1.05 },
  maxWidth: "56rem",
};

const catalogListControlsSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1, md: 1.15 },
};

const experimentIndexGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1.25, md: 1.5 },
};

const experimentIndexCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.1, md: 1.25 },
  height: "100%",
  p: { xs: 1.4, sm: 1.6, md: 1.75 },
});

const experimentIndexBodySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.7,
  minWidth: 0,
  minHeight: { lg: "10.25rem" },
  alignContent: "start",
};

const experimentIndexActionsSx: SxProps<Theme> = {
  mt: "auto",
  pt: { xs: 0.25, md: 0.5 },
};

const experimentIndexSummarySx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: 0.65,
  alignSelf: { md: "end" },
  p: { xs: 1.25, sm: 1.35 },
});

const experimentEvidenceListSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.65,
  m: 0,
  p: 0,
  listStyle: "none",
};

const experimentEvidenceItemSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: "0.55rem minmax(0, 1fr)",
  gap: 0.65,
  alignItems: "baseline",
  color: theme.palette.text.secondary,
  fontSize: "0.92rem",
  lineHeight: 1.5,
  "&::before": {
    content: '""',
    width: "0.45rem",
    height: "0.45rem",
    borderRadius: "50%",
    backgroundColor: alpha(theme.palette.secondary.main, 0.9),
    transform: "translateY(-0.08rem)",
  },
});

const browseRowColumns = {
  xs: "minmax(0, 1fr)",
  md: "minmax(14rem, 1fr) minmax(11rem, 0.75fr) minmax(12rem, 1fr) minmax(11rem, 0.85fr) 8rem",
};

const browseSurfaceSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  overflow: "hidden",
});

const browseHeaderSx: SxProps<Theme> = (theme) => ({
  display: { xs: "none", md: "grid" },
  gridTemplateColumns: browseRowColumns.md,
  gap: 1.25,
  alignItems: "center",
  px: 1.5,
  py: 1,
  backgroundColor: alpha(theme.palette.text.primary, 0.035),
  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  color: theme.palette.text.secondary,
  fontSize: "0.72rem",
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: "uppercase",
});

const browseRowSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: browseRowColumns,
  gap: { xs: 0.9, md: 1.25 },
  alignItems: "stretch",
  minWidth: 0,
  minHeight: { md: "5.25rem" },
  px: { xs: 1.25, md: 1.35 },
  py: { xs: 1.2, md: 1.05 },
  "& + &": {
    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  },
});

const browseFieldSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.35,
  alignContent: { xs: "start", md: "center" },
  minWidth: 0,
  height: "100%",
};

const mobileFieldLabelSx: SxProps<Theme> = {
  display: { xs: "block", md: "none" },
  mb: 0.25,
  fontSize: "0.68rem",
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: "uppercase",
  color: "text.secondary",
};

const experimentCategoryLabelSx: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.74rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const browseActionSx: SxProps<Theme> = {
  justifySelf: { xs: "start", md: "end" },
  alignSelf: "center",
  minWidth: { md: "7rem" },
};

const platformValidationBandSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto" },
  gap: { xs: 1, md: 1.5 },
  alignItems: "center",
  p: { xs: 1.15, sm: 1.25, md: 1.35 },
});

const experimentMetaRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  alignItems: "center",
};

const detailSummaryStripSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: 0.75,
  alignItems: "stretch",
  gridAutoRows: "1fr",
  width: "100%",
};

const detailSummaryItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  alignContent: "center",
  gap: 0.2,
  minHeight: "4rem",
  height: "100%",
  px: { xs: 1.25, md: 1.4 },
  py: { xs: 1, md: 1.1 },
});

const metricGroupSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.8,
  alignContent: "start",
  height: "100%",
  minHeight: "7.5rem",
  p: { xs: 1.2, sm: 1.35 },
});

type CatalogStatusTone = "ready" | ExperimentReadinessTone;

const catalogStatusStackSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.35,
  alignContent: "center",
  minWidth: 0,
  maxWidth: { md: "12rem" },
};

function catalogStatusLineSx(tone: CatalogStatusTone): SxProps<Theme> {
  return (theme) => {
    const toneColor =
      tone === "supported"
        ? theme.palette.success.main
        : tone === "selected"
          ? theme.palette.info.main
          : tone === "rejected"
            ? theme.palette.error.main
            : tone === "pending" || tone === "blocked"
              ? theme.palette.warning.main
              : theme.palette.secondary.main;

    return {
      display: "flex",
      gap: 0.55,
      alignItems: "baseline",
      minWidth: 0,
      color: toneColor,
    };
  };
}

function readinessChipColor(tone: ExperimentReadinessTone): "success" | "info" | "warning" | "error" {
  if (tone === "supported") return "success";
  if (tone === "selected") return "info";
  if (tone === "rejected") return "error";
  return "warning";
}

const catalogStatusDotSx: SxProps<Theme> = {
  width: "0.45rem",
  height: "0.45rem",
  mt: "0.15rem",
  borderRadius: "50%",
  backgroundColor: "currentColor",
  flexShrink: 0,
};

const catalogStatusTextSx: SxProps<Theme> = {
  minWidth: 0,
  fontSize: "0.78rem",
  fontWeight: 600,
  lineHeight: 1.3,
  overflowWrap: "anywhere",
};

const catalogStatusMutedSx: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.74rem",
  fontWeight: 600,
  lineHeight: 1.3,
  overflowWrap: "anywhere",
};

const detailIntroSx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: { xs: 1, md: 1.25 },
  p: { xs: 1.25, sm: 1.5, md: 1.65 },
});

const runMatrixSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" },
  gap: { xs: 1.5, md: 1.75 },
  alignItems: "stretch",
};

const matrixListSx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
  alignContent: "start",
  minWidth: 0,
};

const matrixColumnHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  alignItems: "baseline",
  justifyContent: "space-between",
};

const matrixItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.6,
  alignContent: "start",
  minHeight: "7rem",
  p: { xs: 1.2, sm: 1.35 },
});

const commandListSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gap: 1,
  height: "100%",
  minWidth: 0,
};

const pendingResultSx: SxProps<Theme> = composeSx(warningPanelBaseSx, {
  display: "grid",
  gap: 1,
  p: { xs: 1.5, sm: 1.75, md: 2 },
});

const measuredResultSx: SxProps<Theme> = composeSx(successPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.15, md: 1.3 },
  p: { xs: 1.3, sm: 1.5, md: 1.7 },
});

const resultStatGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(3, minmax(0, 1fr))",
  },
  gap: { xs: 0.85, md: 1 },
};

const resultStatSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.25,
  minHeight: "5.4rem",
  p: { xs: 1.15, sm: 1.25 },
});

const resultTableSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  overflow: "hidden",
});

const resultTableGroupSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.85,
  minWidth: 0,
};

const resultTableRowSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(7rem, 0.9fr) minmax(10rem, 1fr) repeat(3, minmax(5.5rem, 0.7fr))",
  },
  gap: { xs: 0.45, md: 1 },
  alignItems: "center",
  minWidth: 0,
  px: { xs: 1.15, md: 1.35 },
  py: { xs: 1, md: 0.9 },
  "& + &": {
    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  },
});

const resultTableHeaderSx: SxProps<Theme> = (theme) => ({
  ...resultTableRowSx(theme),
  display: { xs: "none", md: "grid" },
  backgroundColor: alpha(theme.palette.text.primary, 0.035),
  color: theme.palette.text.secondary,
  fontSize: "0.72rem",
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: "uppercase",
});

const resultTableCellSx: SxProps<Theme> = {
  minWidth: 0,
  overflowWrap: "anywhere",
};

const resultMobileLabelSx: SxProps<Theme> = {
  display: { xs: "inline", md: "none" },
  mr: 0.5,
  color: "text.secondary",
  fontSize: "0.7rem",
  fontWeight: 600,
  textTransform: "uppercase",
};

const resultBoundarySx: SxProps<Theme> = composeSx(warningPanelBaseSx, {
  p: { xs: 1.15, sm: 1.25 },
});

const resultBoundaryListSx: SxProps<Theme> = {
  m: 0,
  pl: 2.25,
  color: "text.secondary",
  "& li": {
    pl: 0.25,
  },
  "& li + li": {
    mt: 0.45,
  },
};

const resultReportPanelSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.85,
  p: { xs: 1.15, sm: 1.25 },
});

const pendingNextRunGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: 1,
};

const pendingNextRunSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.85,
  p: { xs: 1.15, sm: 1.25 },
});

export function getExperimentSlugFromPath(pathname: string): string | null {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  if (normalizedPath === EXPERIMENTS_PATH) {
    return null;
  }

  if (!normalizedPath.startsWith(EXPERIMENT_DETAIL_PREFIX)) {
    return null;
  }

  const slug = normalizedPath.slice(EXPERIMENT_DETAIL_PREFIX.length);
  if (!slug || slug.includes("/")) {
    return null;
  }

  const decodedSlug = decodeURIComponent(slug);
  return isExperimentProjectId(decodedSlug) ? null : decodedSlug;
}

function isExperimentProjectId(value: string): value is ProjectId {
  return projectPortfolioContent.projects.some((project) => project.id === value);
}

export function experimentProjectCatalogPath(projectId: ProjectId): string {
  return `${EXPERIMENTS_PATH}/${projectId}`;
}

export function getExperimentProjectIdFromPath(pathname: string): ProjectId | null {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  if (!normalizedPath.startsWith(EXPERIMENT_DETAIL_PREFIX)) {
    return null;
  }

  const segment = normalizedPath.slice(EXPERIMENT_DETAIL_PREFIX.length);
  if (!segment || segment.includes("/")) {
    return null;
  }

  const decodedSegment = decodeURIComponent(segment);
  return isExperimentProjectId(decodedSegment) ? decodedSegment : null;
}

function resolveCurrentPathname(initialPath?: string): string {
  return initialPath ?? (typeof window === "undefined" ? EXPERIMENTS_PATH : window.location.pathname);
}

function isExperimentsIndexPath(pathname: string): boolean {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  return normalizedPath === EXPERIMENTS_PATH;
}

function CatalogStatusNote({ selectedProjectId }: { selectedProjectId: ProjectId }) {
  return (
    <Box role="note" sx={catalogStatusNoteSx}>
      <Box sx={catalogStatusHeaderSx}>
        <Chip label="Catalog ready" variant="outlined" sx={accentChipSx} />
        <Button
          href={decisionProjectPath(selectedProjectId)}
          size="small"
          endIcon={<ArrowForwardRoundedIcon />}
        >
          View project decisions
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {experimentCatalogContent.statusNote}
      </Typography>
    </Box>
  );
}

function CatalogFactStrip() {
  const primaryReadiness = experimentCatalogContent.experiments.map(
    (experiment) => experiment.readiness.primary,
  );
  const countPrimaryTone = (tone: ExperimentReadinessTone) =>
    primaryReadiness.filter((item) => item.tone === tone).length;
  const projectCount = new Set(
    experimentCatalogContent.experiments.map((experiment) => experiment.projectId),
  ).size;
  const facts = [
    `${experimentCatalogContent.experiments.length} experiments`,
    `${projectCount} projects`,
    "Run-ready",
    `${countPrimaryTone("supported")} supported`,
    `${countPrimaryTone("selected")} selected`,
    `${countPrimaryTone("rejected")} rejected`,
    `${countPrimaryTone("pending")} pending`,
    `${countPrimaryTone("blocked")} blocked`,
  ];

  return (
    <Box sx={catalogFactStripSx} aria-label="Experiment catalog status facts">
      {facts.map((fact) => (
        <Chip key={fact} label={fact} size="small" variant="outlined" sx={catalogFactChipSx} />
      ))}
    </Box>
  );
}

function BrowseField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={browseFieldSx}>
      <Box component="span" sx={mobileFieldLabelSx}>
        {label}
      </Box>
      {children}
    </Box>
  );
}

function ExperimentStatusChips({ experiment }: { experiment: ExperimentCatalogItem }) {
  const readinessSignals: ExperimentReadinessSignal[] = [
    experiment.readiness.primary,
    ...(experiment.readiness.secondary ? [experiment.readiness.secondary] : []),
  ];

  return (
    <Box sx={catalogStatusStackSx} aria-label={`${experiment.title} status`}>
      <Box component="span" sx={catalogStatusLineSx("ready")}>
        <Box component="span" sx={catalogStatusDotSx} aria-hidden="true" />
        <Box component="span" sx={catalogStatusTextSx}>
          Run ready
        </Box>
      </Box>
      {readinessSignals.map((signal) => (
        <Box key={`${signal.label}-${signal.detail}`} component="span" sx={catalogStatusLineSx(signal.tone)}>
          <Box component="span" sx={catalogStatusDotSx} aria-hidden="true" />
          <Box component="span" sx={catalogStatusTextSx}>
            {signal.label}
            <Box component="span" sx={catalogStatusMutedSx}>
              {" "}
              · {signal.detail}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function ExperimentBrowseRow({ experiment }: { experiment: ExperimentCatalogItem }) {
  return (
    <Box component="section" sx={browseRowSx}>
      <BrowseField label="Experiment">
        <Box component="span" sx={experimentCategoryLabelSx}>
          {experiment.category}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {experiment.title}
        </Typography>
      </BrowseField>
      <BrowseField label="Purpose">
        <Typography variant="body2" color="text.secondary">
          {experiment.cardSummary}
        </Typography>
      </BrowseField>
      <BrowseField label="Focus">
        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
          {experiment.metricFocus.map((metric) => (
            <Chip
              key={`${experiment.slug}-${metric}`}
              label={metric}
              size="small"
              variant="outlined"
              sx={accentChipSx}
            />
          ))}
        </Stack>
      </BrowseField>
      <BrowseField label="Status">
        <ExperimentStatusChips experiment={experiment} />
      </BrowseField>
      <Button
        href={experimentDetailPath(experiment.slug)}
        size="small"
        endIcon={<ArrowForwardRoundedIcon />}
        sx={browseActionSx}
      >
        View details
      </Button>
    </Box>
  );
}

function RelatedProjectEvidenceBand() {
  const item = experimentCatalogContent.platformValidation;

  return (
    <Box component="section" sx={platformValidationBandSx}>
      <Box sx={{ display: "grid", gap: 0.4, minWidth: 0 }}>
        <Typography variant="overline" sx={{ color: "secondary.dark" }}>
          {item.status}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Decisions live in the project decision record
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.question}
        </Typography>
      </Box>

      <Button
        href={item.href}
        size="small"
        endIcon={<ArrowForwardRoundedIcon />}
        sx={browseActionSx}
      >
        View project decisions
      </Button>
    </Box>
  );
}

function ExperimentProjectCard({ projectId }: { projectId: ProjectId }) {
  const project = getProjectById(projectId);
  const projectExperiments = experimentCatalogContent.experiments.filter(
    (experiment) => experiment.projectId === projectId,
  );
  const categories = new Set(projectExperiments.map((experiment) => experiment.category));

  return (
    <Box component="section" sx={experimentIndexCardSx}>
      <Box sx={experimentMetaRowSx}>
        <Chip label={project.layer} variant="outlined" sx={mutedChipSx} />
        <Chip label={`${projectExperiments.length} experiments`} variant="outlined" />
        <Chip label={`${categories.size} focus areas`} variant="outlined" />
      </Box>

      <Box sx={experimentIndexBodySx}>
        <Typography component="h2" variant="h4">
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.summary}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {project.result}
        </Typography>
      </Box>

      <Box component="ul" sx={experimentEvidenceListSx}>
        {project.evidence.map((item) => (
          <Box key={item} component="li" sx={experimentEvidenceItemSx}>
            {item}
          </Box>
        ))}
      </Box>

      <Box sx={experimentIndexActionsSx}>
        <ActionLinkRow>
          <Button href={experimentProjectCatalogPath(project.id)} variant="contained">
            View experiments
          </Button>
          <Button href={decisionProjectPath(project.id)} variant="outlined">
            Project decisions
          </Button>
          <Button href={project.path} size="small">
            Project overview
          </Button>
        </ActionLinkRow>
      </Box>
    </Box>
  );
}

function ExperimentsIndexRoute() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout
      activeNav="experiments"
      breadcrumbs={[HOME_BREADCRUMB, { label: "Experiments" }]}
    >
      <PageSection>
        <Box sx={catalogListSx}>
          <Box sx={catalogListHeaderSx}>
            <Box sx={catalogListHeadingSx}>
              <Typography component="h1" variant="h3">
                Experiments
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Project-linked catalogs that turn GPU serving and kernel questions into evidence-backed decisions.
              </Typography>
              <CatalogFactStrip />
            </Box>
            <Box sx={experimentIndexSummarySx}>
              <Typography variant="body2" color="text.secondary">
                Choose a project to browse its experiment table. Detail routes stay available for individual run shape, evidence, and commands.
              </Typography>
            </Box>
          </Box>

          <Box sx={experimentIndexGridSx}>
            {projectPortfolioContent.projects.map((project) => (
              <ExperimentProjectCard key={project.id} projectId={project.id} />
            ))}
          </Box>
        </Box>
      </PageSection>
    </PublicSiteLayout>
  );
}

function ExperimentCatalogListSection({
  selectedProjectId,
}: {
  selectedProjectId: ProjectId;
}) {
  const selectedExperiments = experimentCatalogContent.experiments.filter(
    (experiment) => experiment.projectId === selectedProjectId,
  );

  return (
    <PageSection>
      <Box sx={catalogListSx}>
        <Box id="experiment-catalog-list" sx={catalogListHeaderSx}>
          <Box sx={catalogListHeadingSx}>
            <Typography component="h1" variant="h3">
              {experimentCatalogContent.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {experimentCatalogContent.subtitle}
            </Typography>
            <CatalogFactStrip />
          </Box>

          <CatalogStatusNote selectedProjectId={selectedProjectId} />
        </Box>

        <Box sx={catalogListControlsSx}>
          <Box sx={browseSurfaceSx}>
            <Box sx={browseHeaderSx} aria-hidden="true">
              <span>Experiment</span>
              <span>Purpose</span>
              <span>Focus</span>
              <span>Status</span>
              <span>Details</span>
            </Box>
            {selectedExperiments.map((experiment) => (
              <ExperimentBrowseRow key={experiment.slug} experiment={experiment} />
            ))}
          </Box>

          {selectedProjectId === "gpu-inference-lab" ? <RelatedProjectEvidenceBand /> : null}
        </Box>
      </Box>
    </PageSection>
  );
}

function ExperimentCatalogRoute({ selectedProjectId }: { selectedProjectId: ProjectId }) {
  useDocumentTitle(PAGE_TITLE);
  const selectedProject = getProjectById(selectedProjectId);

  return (
    <PublicSiteLayout
      activeNav="experiments"
      breadcrumbs={[HOME_BREADCRUMB, EXPERIMENTS_BREADCRUMB, { label: selectedProject.title }]}
    >
      <ExperimentCatalogListSection
        selectedProjectId={selectedProjectId}
      />
    </PublicSiteLayout>
  );
}

function ExperimentMetricGroupList({ experiment }: { experiment: ExperimentCatalogItem }) {
  return (
    <Grid container spacing={2}>
      {experiment.metricGroups.map((group) => (
        <Grid key={group.label} size={{ xs: 12, md: 4 }}>
          <Box sx={metricGroupSx}>
            <Typography variant="h6">{group.label}</Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
              {group.metrics.map((metric) => (
                <Chip key={`${group.label}-${metric}`} label={metric} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

function ExperimentPendingNextRuns({ experiment }: { experiment: ExperimentCatalogItem }) {
  if (!experiment.pendingNextRuns || experiment.pendingNextRuns.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      <Typography variant="overline" sx={{ color: "secondary.dark" }}>
        Next runs to curate
      </Typography>
      <Box sx={pendingNextRunGridSx}>
        {experiment.pendingNextRuns.map((run) => (
          <Box key={run.label} sx={pendingNextRunSx}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {run.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {run.reason}
            </Typography>
            <CommandCodeBlock command={run.command} ariaLabel={`${run.label} next run command`} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ExperimentPendingResult({ experiment }: { experiment: ExperimentCatalogItem }) {
  const isBlocked = experiment.readiness.primary.tone === "blocked";
  const blockedTitle =
    experiment.projectId === "gpu-inference-lab"
      ? "Blackwell capacity blocked"
      : `${experiment.readiness.primary.detail} blocked`;
  const blockedCopy =
    experiment.projectId === "gpu-inference-lab"
      ? "Blackwell capacity blocked the live run. Store generated Markdown, JSON, and client logs in docs/reports/ until a comparable result is selected."
      : `${experiment.readiness.primary.detail} blocked this proof. Store compact profiler notes with the project until comparable counters are selected.`;

  return (
    <Box sx={pendingResultSx}>
      <Typography variant="h6">
        {isBlocked ? blockedTitle : "Live result pending"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {isBlocked
          ? blockedCopy
          : `${experiment.resultsPath} is still a template. Store generated Markdown, JSON, and client logs in docs/reports/ until a representative run is selected.`}
      </Typography>
      <ExperimentPendingNextRuns experiment={experiment} />
      <ActionLinkRow>
        <Button
          href={experimentSourceLink(experiment.projectId, experiment.resultsPath)}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Results template
        </Button>
        <Button
          href={experimentSourceLink(experiment.projectId, experimentReportRulesPath(experiment))}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Report rules
        </Button>
      </ActionLinkRow>
    </Box>
  );
}

const defaultResultTableColumns = {
  target: "Target",
  outcome: "Outcome",
  p95Latency: "p95 latency",
  peakWaiting: "Peak waiting",
  gpuMax: "GPU max",
};
const resultTableColumnKeys = [
  "target",
  "outcome",
  "p95Latency",
  "peakWaiting",
  "gpuMax",
] as const;

function ExperimentResultTable({
  experiment,
  table,
}: {
  experiment: ExperimentCatalogItem;
  table: ExperimentResultEvidenceTable;
}) {
  const tableColumns = {
    ...defaultResultTableColumns,
    ...table.columns,
  };

  return (
    <Box sx={resultTableGroupSx}>
      <Box sx={{ display: "grid", gap: 0.35, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {table.title}
        </Typography>
        {table.summary ? (
          <Typography variant="body2" color="text.secondary">
            {table.summary}
          </Typography>
        ) : null}
      </Box>

      <Box role="table" aria-label={`${experiment.title} ${table.title}`} sx={resultTableSx}>
        <Box role="row" sx={resultTableHeaderSx}>
          {resultTableColumnKeys.map((key) => (
            <span key={key}>{tableColumns[key]}</span>
          ))}
        </Box>
        {table.rows.map((row) => (
          <Box key={row.target} role="row" sx={resultTableRowSx}>
            {resultTableColumnKeys.map((key, index) => (
              <Typography
                key={key}
                role="cell"
                variant="body2"
                sx={{ ...resultTableCellSx, ...(index === 0 ? { fontWeight: 600 } : {}) }}
              >
                <Box component="span" sx={resultMobileLabelSx}>
                  {tableColumns[key]}
                </Box>
                {row[key]}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function buildEvidenceTables(experiment: ExperimentCatalogItem): ExperimentResultEvidenceTable[] {
  const evidence = experiment.resultEvidence;
  if (!evidence) return [];

  if (evidence.tables && evidence.tables.length > 0) {
    return evidence.tables;
  }

  if (!evidence.rows || evidence.rows.length === 0) {
    return [];
  }

  return [
    {
      title: `${evidence.title} table`,
      columns: evidence.tableColumns,
      rows: evidence.rows,
    },
  ];
}

function ExperimentEvidenceBoundary({ experiment }: { experiment: ExperimentCatalogItem }) {
  const evidence = experiment.resultEvidence;
  if (!evidence) return null;

  return (
    <Box sx={resultBoundarySx}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.45 }}>
        Evidence boundary
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {evidence.boundary}
      </Typography>
      {evidence.boundaryPoints && evidence.boundaryPoints.length > 0 ? (
        <Box component="ul" sx={resultBoundaryListSx}>
          {evidence.boundaryPoints.map((point) => (
            <li key={point}>
              <Typography component="span" variant="body2">
                {point}
              </Typography>
            </li>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function ExperimentSourceReports({ experiment }: { experiment: ExperimentCatalogItem }) {
  const evidence = experiment.resultEvidence;
  const reports = evidence?.sourceReports ?? [];
  const resultsLinkLabel = evidence?.curatedResults === false ? "Results template" : "Results summary";

  return (
    <Box sx={resultReportPanelSx}>
      {reports.length > 0 ? (
        <Box sx={{ display: "grid", gap: 0.45, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Selected reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generated reports behind this summary.
          </Typography>
        </Box>
      ) : null}
      <ActionLinkRow>
        {reports.map((report) => (
          <Button
            key={report.path}
            href={experimentSourceLink(experiment.projectId, report.path)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            {report.label}
          </Button>
        ))}
        <Button
          href={experimentSourceLink(experiment.projectId, experiment.resultsPath)}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          {resultsLinkLabel}
        </Button>
        <Button
          href={experimentSourceLink(experiment.projectId, experimentReportRulesPath(experiment))}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Report rules
        </Button>
      </ActionLinkRow>
    </Box>
  );
}

function ExperimentMeasuredResult({ experiment }: { experiment: ExperimentCatalogItem }) {
  const evidence = experiment.resultEvidence;

  if (!evidence) {
    return <ExperimentPendingResult experiment={experiment} />;
  }

  const tables = buildEvidenceTables(experiment);

  return (
    <Box sx={measuredResultSx}>
      <Box sx={experimentMetaRowSx}>
        <Chip
          label={`${experiment.readiness.primary.label}: ${experiment.readiness.primary.detail}`}
          color={readinessChipColor(experiment.readiness.primary.tone)}
          variant="outlined"
        />
        <Chip label={`Latest reports: ${evidence.reportDate}`} size="small" variant="outlined" />
        {experiment.readiness.secondary ? (
          <Chip
            label={`${experiment.readiness.secondary.label}: ${experiment.readiness.secondary.detail}`}
            color="error"
            size="small"
            variant="outlined"
          />
        ) : null}
      </Box>

      <Box sx={{ display: "grid", gap: 0.7, minWidth: 0 }}>
        <Typography variant="h6">{evidence.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {evidence.summary}
        </Typography>
      </Box>

      <Box sx={resultStatGridSx} aria-label={`${experiment.title} measured result highlights`}>
        {evidence.stats.map((stat) => (
          <Box key={stat.label} sx={resultStatSx}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {stat.label}
            </Typography>
            <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stat.context}
            </Typography>
          </Box>
        ))}
      </Box>

      {tables.map((table) => (
        <ExperimentResultTable
          key={table.title}
          experiment={experiment}
          table={table}
        />
      ))}

      <ExperimentEvidenceBoundary experiment={experiment} />
      <ExperimentSourceReports experiment={experiment} />
    </Box>
  );
}

function ExperimentResultSection({ experiment }: { experiment: ExperimentCatalogItem }) {
  const hasMeasuredResult = Boolean(experiment.resultEvidence);
  const readiness = experiment.readiness.primary;

  return (
    <PageSection>
      <SectionHeader
        eyebrow={readiness.label}
        title={hasMeasuredResult ? "Result evidence" : "Result status"}
        copy={
          hasMeasuredResult
            ? "Selected live-cluster runs, readiness state, and evidence boundary are shown together."
            : readiness.tone === "blocked"
              ? "Definition is ready; the live attempt stopped before a comparable result."
              : "Artifacts stay separate from conclusions until a run is selected."
        }
      />

      <ExperimentMeasuredResult experiment={experiment} />
    </PageSection>
  );
}

function formatCount(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function formatTokenRange(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return min.toLocaleString("en-US");
  }

  return `${min.toLocaleString("en-US")}-${max.toLocaleString("en-US")}`;
}

function experimentReportRulesPath(experiment: ExperimentCatalogItem): string {
  return experiment.projectId === "cuda-kernel-lab"
    ? "docs/optimization-strategies.md"
    : "docs/reports/README.md";
}

function formatRunShapeCopy(experiment: ExperimentCatalogItem): string {
  if (experiment.runShapeSummary) {
    return experiment.runShapeSummary;
  }

  const promptTokenValues = experiment.cases
    .map((item) => item.promptTokens)
    .filter((value): value is number => typeof value === "number");
  const outputTokenValues = experiment.cases
    .map((item) => item.outputTokens)
    .filter((value): value is number => typeof value === "number");

  if (promptTokenValues.length === experiment.cases.length && outputTokenValues.length === experiment.cases.length) {
    return `${formatCount(experiment.cases.length, "case")} across ${formatTokenRange(promptTokenValues)} prompt tokens and ${formatTokenRange(outputTokenValues)} output tokens, paired with ${formatCount(experiment.servingProfiles.length, "run profile")}.`;
  }

  return `${formatCount(experiment.cases.length, "case")} paired with ${formatCount(experiment.servingProfiles.length, "run profile")}.`;
}

function getCaseMeasureLabels(item: ExperimentCatalogItem["cases"][number]): string[] {
  const labels: string[] = [];

  if (item.primaryMeasure) {
    labels.push(item.primaryMeasure);
  } else if (typeof item.promptTokens === "number") {
    labels.push(`${item.promptTokens.toLocaleString("en-US")} prompt tokens`);
  }

  if (item.secondaryMeasure) {
    labels.push(item.secondaryMeasure);
  } else if (typeof item.outputTokens === "number") {
    labels.push(`${item.outputTokens.toLocaleString("en-US")} output tokens`);
  }

  return labels;
}

function ExperimentDetailSummaryStrip({ experiment }: { experiment: ExperimentCatalogItem }) {
  const project = getProjectById(experiment.projectId);
  const facts = [
    {
      label: "Project",
      value: project.title,
    },
    {
      label: "Category",
      value: experiment.category,
    },
    {
      label: "Cases",
      value: formatCount(experiment.cases.length, "case"),
    },
    {
      label: "Profiles",
      value: formatCount(experiment.servingProfiles.length, "profile"),
    },
    {
      label: "Runner",
      value: experiment.runner,
    },
    {
      label: "Endpoint",
      value: experiment.endpoint,
    },
    {
      label: "Readiness",
      value: `${experiment.readiness.primary.label}: ${experiment.readiness.primary.detail}`,
    },
    ...(experiment.readiness.secondary
      ? [
          {
            label: experiment.readiness.secondary.label,
            value: experiment.readiness.secondary.detail,
          },
        ]
      : []),
  ];

  return (
    <Box sx={detailSummaryStripSx} aria-label={`${experiment.title} summary facts`}>
      {facts.map((fact) => (
        <Box key={fact.label} sx={detailSummaryItemSx}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {fact.label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
            {fact.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function RelatedDecisionCard({ decision }: { decision: DecisionRecord }) {
  return (
    <Box component="section" sx={relatedDecisionCardSx}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
        <Chip label={decision.status} size="small" variant="outlined" sx={accentChipSx} />
        <Typography variant="overline" sx={{ color: "secondary.dark" }}>
          {decision.domain}
        </Typography>
      </Box>
      <Typography variant="h6">{decision.title}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {decision.call}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {decision.evidence}
      </Typography>
      <Button
        href={decisionProjectPath(decision.projectId)}
        size="small"
        endIcon={<ArrowForwardRoundedIcon />}
        sx={{ justifySelf: "start" }}
      >
        View decision record
      </Button>
    </Box>
  );
}

function RelatedDecisionsSection({ experiment }: { experiment: ExperimentCatalogItem }) {
  const relatedDecisions = getDecisionRecordsByExperimentSlug(experiment.slug);

  if (relatedDecisions.length === 0) {
    return null;
  }

  return (
    <PageSection>
      <SectionHeader
        eyebrow="Decision links"
        title="Supports decisions"
        copy="Decision records own the project conclusions; this experiment supplies evidence for the calls below."
      />
      <Box sx={relatedDecisionGridSx}>
        {relatedDecisions.map((decision) => (
          <RelatedDecisionCard key={decision.id} decision={decision} />
        ))}
      </Box>
    </PageSection>
  );
}

function RunShapeColumn({
  title,
  count,
  children,
}: {
  title: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={matrixListSx}>
      <Box sx={matrixColumnHeaderSx}>
        <Typography variant="overline" sx={{ color: "secondary.dark" }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {count}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

function ExperimentDetailRoute({ experiment }: { experiment: ExperimentCatalogItem }) {
  useDocumentTitle(`${experiment.title} | Tony Lee`);
  const localCommand = experiment.localCommands[0];
  const liveCommand = experiment.liveCommands[0];
  const resultLinkLabel =
    experiment.resultEvidence?.curatedResults === false
      ? "Results template"
      : experiment.resultEvidence
        ? "Results summary"
        : "Results template";
  const runShapeCopy = formatRunShapeCopy(experiment);
  const project = getProjectById(experiment.projectId);

  return (
    <PublicSiteLayout
      activeNav="experiments"
      breadcrumbs={[
        HOME_BREADCRUMB,
        EXPERIMENTS_BREADCRUMB,
        { label: project.title, href: experimentProjectCatalogPath(project.id) },
        { label: experiment.title },
      ]}
    >
      <PageHero contentWidth="100%">
        <Box sx={heroSplitSx}>
          <Box sx={heroPrimarySx}>
            <Typography component="h1" variant="h3">
              {experiment.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "58rem" }}>
              {experiment.question}
            </Typography>

            <ActionLinkRow>
              <Button href={EXPERIMENTS_PATH} variant="contained" startIcon={<ArrowBackRoundedIcon />}>
                Experiment catalog
              </Button>
              <Button
                href={experimentSourceLink(experiment.projectId, experiment.sourcePath)}
                target="_blank"
                rel="noreferrer"
                endIcon={<OpenInNewRoundedIcon />}
              >
                Source
              </Button>
            </ActionLinkRow>
          </Box>

          <Box sx={heroSupportSx}>
            <ExperimentDetailSummaryStrip experiment={experiment} />
          </Box>
        </Box>
      </PageHero>

      <PageSection>
        <SectionHeader title="Why it matters" copy={experiment.summary} />
        <Box sx={detailIntroSx}>
          <Typography variant="body1">{experiment.whyItMatters}</Typography>
        </Box>
      </PageSection>

      <ExperimentResultSection experiment={experiment} />

      <RelatedDecisionsSection experiment={experiment} />

      <PageSection>
        <SectionHeader
          eyebrow="Run shape"
          title="Run shape"
          copy={runShapeCopy}
        />

        <Box sx={runMatrixSx}>
          <RunShapeColumn
            title="Cases"
            count={formatCount(experiment.cases.length, "case")}
          >
            {experiment.cases.map((item) => (
              <Box key={item.id} sx={matrixItemSx}>
                <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
                  {item.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Box sx={experimentMetaRowSx}>
                  {getCaseMeasureLabels(item).map((label) => (
                    <Chip key={`${item.id}-${label}`} label={label} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            ))}
          </RunShapeColumn>

          <RunShapeColumn
            title="Run profiles"
            count={formatCount(experiment.servingProfiles.length, "profile")}
          >
            {experiment.servingProfiles.map((profile) => (
              <Box key={profile.id} sx={matrixItemSx}>
                <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
                  {profile.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.description}
                </Typography>
              </Box>
            ))}
          </RunShapeColumn>
        </Box>
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Measurement focus"
          title="Metrics to capture"
          copy="Metric groups show the signal this experiment needs."
        />
        <ExperimentMetricGroupList experiment={experiment} />
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Usage"
          title="How to run"
          copy="Examples show one local render path and one live-cluster path."
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={commandListSx}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                Example local command
              </Typography>
              {localCommand ? (
                <CommandCodeBlock
                  command={localCommand}
                  ariaLabel={`${experiment.title} example local command`}
                />
              ) : null}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={commandListSx}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                Example live command
              </Typography>
              {liveCommand ? (
                <CommandCodeBlock
                  command={liveCommand}
                  ariaLabel={`${experiment.title} example live command`}
                />
              ) : null}
            </Box>
          </Grid>
        </Grid>

        <ActionLinkRow>
          <Button
            href={experimentSourceLink(experiment.projectId, experiment.sourcePath)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            Source
          </Button>
          <Button
            href={experimentSourceLink(experiment.projectId, experiment.resultsPath)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            {resultLinkLabel}
          </Button>
        </ActionLinkRow>
      </PageSection>
    </PublicSiteLayout>
  );
}

function UnknownExperimentRoute({ slug }: { slug: string }) {
  useDocumentTitle("Experiment Not Found | Tony Lee");

  return (
    <PublicSiteLayout
      activeNav="experiments"
      breadcrumbs={[HOME_BREADCRUMB, EXPERIMENTS_BREADCRUMB, { label: "Not found" }]}
    >
      <PageHero>
        <Typography component="h1" variant="h3">
          Experiment not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "54rem" }}>
          No experiment is published for "{slug}". Choose from the catalog.
        </Typography>
        <ActionLinkRow>
          <Button href={EXPERIMENTS_PATH} variant="contained" startIcon={<ArrowBackRoundedIcon />}>
            Experiment catalog
          </Button>
          <Button href={PROJECTS_PATH} variant="outlined">
            View projects
          </Button>
        </ActionLinkRow>
      </PageHero>
    </PublicSiteLayout>
  );
}

export function ExperimentsPage({ initialPath }: { initialPath?: string } = {}) {
  const pathname = resolveCurrentPathname(initialPath);

  if (isExperimentsIndexPath(pathname)) {
    return <ExperimentsIndexRoute />;
  }

  const projectId = getExperimentProjectIdFromPath(pathname);
  const slug = getExperimentSlugFromPath(pathname);

  if (projectId) {
    return <ExperimentCatalogRoute selectedProjectId={projectId} />;
  }

  if (slug) {
    const experiment = getExperimentBySlug(slug);

    if (!experiment) {
      return <UnknownExperimentRoute slug={slug} />;
    }

    return <ExperimentDetailRoute experiment={experiment} />;
  }

  return <ExperimentCatalogRoute selectedProjectId={DEFAULT_EXPERIMENT_PROJECT_ID} />;
}
