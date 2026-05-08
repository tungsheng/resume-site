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
import { EXPERIMENTS_PATH, PROJECT_PATH } from "../site/content";
import {
  experimentCatalogContent,
  experimentDetailPath,
  experimentSourceLink,
  getExperimentBySlug,
  type ExperimentCatalogItem,
  type ExperimentResultEvidenceTable,
} from "../site/experiment-catalog-content";
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
  subtlePanelBaseSx,
  successPanelBaseSx,
  warningPanelBaseSx,
} from "../site/styles";
import { CommandCodeBlock } from "../site/command-code-block";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Experiments | Tony Lee";

const EXPERIMENT_DETAIL_PREFIX = `${EXPERIMENTS_PATH}/`;

const catalogStatusNoteSx: SxProps<Theme> = composeSx(warningPanelBaseSx, {
  display: "grid",
  gap: { xs: 0.85, md: 1 },
  alignContent: "start",
  width: "100%",
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
});

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
  gap: { xs: 2.25, md: 3 },
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

const catalogHeroTopSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(20rem, 0.52fr)",
  },
  gap: { xs: 1.75, md: 2.5 },
  alignItems: "start",
  width: "100%",
};

const catalogHeroPrimarySx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1.25, md: 1.5 },
  alignContent: "start",
  minWidth: 0,
  maxWidth: "61rem",
};

const catalogHeroSupportSx: SxProps<Theme> = {
  display: "grid",
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

const conceptSurfaceSx: SxProps<Theme> = composeSx(softPanelBaseSx, (theme) => ({
  "--experiment-concept-rail-x": "1.45rem",
  "--experiment-concept-step-indent": "3.05rem",
  "--experiment-concept-marker-size": "0.6rem",
  position: "relative",
  display: { xs: "grid", sm: "flex" },
  gridTemplateColumns: { xs: "minmax(0, 1fr)" },
  flexWrap: "wrap",
  gap: { xs: 0.85, sm: 0.75, md: 1 },
  alignItems: { xs: "stretch", sm: "center" },
  p: { xs: 1.25, sm: 1.5, md: 1.75 },
  pl: { xs: "var(--experiment-concept-step-indent)", sm: 1.5, md: 1.75 },
  "&::before": {
    content: '""',
    display: { xs: "block", sm: "none" },
    position: "absolute",
    left: "var(--experiment-concept-rail-x)",
    top: "1.75rem",
    bottom: "1.75rem",
    width: "1px",
    backgroundColor: alpha(theme.palette.secondary.light, 0.16),
  },
}));

const conceptStepItemSx: SxProps<Theme> = (theme) => ({
  position: { xs: "relative", sm: "static" },
  display: "inline-flex",
  alignItems: "center",
  minWidth: 0,
  justifySelf: { xs: "start", sm: "auto" },
  "&::before": {
    content: '""',
    display: { xs: "block", sm: "none" },
    position: "absolute",
    left:
      "calc(var(--experiment-concept-rail-x) - var(--experiment-concept-step-indent) - (var(--experiment-concept-marker-size) / 2))",
    top: "50%",
    zIndex: 1,
    width: "var(--experiment-concept-marker-size)",
    height: "var(--experiment-concept-marker-size)",
    borderRadius: "50%",
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${alpha(theme.palette.secondary.light, 0.46)}`,
    transform: "translateY(-50%)",
  },
});

const conceptStepSx: SxProps<Theme> = composeSx(subtlePanelBaseSx, {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "2.35rem",
  width: "fit-content",
  maxWidth: "100%",
  px: { xs: 1.1, sm: 1.25 },
  py: 0.75,
  borderRadius: 999,
  fontSize: "0.86rem",
  fontWeight: 600,
  lineHeight: 1.2,
});

const conceptArrowSx: SxProps<Theme> = (theme) => ({
  color: alpha(theme.palette.secondary.dark, 0.42),
  fontSize: "1rem",
  flexShrink: 0,
  display: { xs: "none", sm: "inline-flex" },
});

function buildBrowseRowColumns() {
  return {
    xs: "minmax(0, 1fr)",
    md: "minmax(14rem, 1fr) minmax(11rem, 0.75fr) minmax(12rem, 1fr) minmax(11rem, 0.85fr) 8rem",
  };
}

const browseSurfaceSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  overflow: "hidden",
});

const browseHeaderSx: SxProps<Theme> = (theme) => ({
  display: { xs: "none", md: "grid" },
  gridTemplateColumns: buildBrowseRowColumns().md,
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
  gridTemplateColumns: buildBrowseRowColumns(),
  gap: { xs: 0.9, md: 1.25 },
  alignItems: "stretch",
  minWidth: 0,
  minHeight: { md: "5.9rem" },
  px: { xs: 1.35, md: 1.5 },
  py: { xs: 1.35, md: 1.2 },
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
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
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
  minHeight: "4.35rem",
  height: "100%",
  px: { xs: 1.25, md: 1.4 },
  py: { xs: 1, md: 1.1 },
});

const metricGroupSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.8,
  alignContent: "start",
  height: "100%",
  minHeight: "8.75rem",
  p: { xs: 1.35, sm: 1.5 },
});

const compactMetricChipSx: SxProps<Theme> = accentChipSx;

type CatalogStatusTone = "ready" | "measured" | "pending";

const catalogStatusStackSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.35,
  alignContent: "center",
  minWidth: 0,
  maxWidth: { md: "12rem" },
};

const catalogStatusLineSx: SxProps<Theme> = {
  display: "flex",
  gap: 0.55,
  alignItems: "baseline",
  minWidth: 0,
  color: "text.secondary",
};

function catalogStatusDotSx(tone: CatalogStatusTone): SxProps<Theme> {
  return (theme) => {
    const toneColor =
      tone === "pending"
        ? theme.palette.warning.dark
        : tone === "measured"
          ? theme.palette.success.dark
          : theme.palette.success.main;

    return {
      width: "0.45rem",
      height: "0.45rem",
      mt: "0.15rem",
      borderRadius: "50%",
      backgroundColor: alpha(toneColor, tone === "pending" ? 0.72 : 0.78),
      flexShrink: 0,
    };
  };
}

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
  gap: { xs: 1.25, md: 1.5 },
  p: { xs: 1.5, sm: 1.75, md: 2 },
});

const runMatrixSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" },
  gap: { xs: 2, md: 2.5 },
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
  minHeight: "8.25rem",
  p: { xs: 1.35, sm: 1.5 },
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
  gap: { xs: 1.35, md: 1.5 },
  p: { xs: 1.5, sm: 1.75, md: 2 },
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

  return decodeURIComponent(slug);
}

function resolveCurrentPathname(initialPath?: string): string {
  if (initialPath) {
    return initialPath;
  }

  if (typeof window === "undefined") {
    return EXPERIMENTS_PATH;
  }

  return window.location.pathname;
}

function CatalogStatusNote() {
  const item = experimentCatalogContent.platformValidation;

  return (
    <Box role="note" sx={catalogStatusNoteSx}>
      <Box sx={catalogStatusHeaderSx}>
        <Chip label="Catalog ready" color="warning" variant="outlined" />
        <Button href={item.href} size="small" endIcon={<ArrowForwardRoundedIcon />}>
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
  const measuredExperimentCount = experimentCatalogContent.experiments.filter(
    (experiment) => experiment.resultEvidence,
  ).length;
  const pendingExperimentCount =
    experimentCatalogContent.experiments.length - measuredExperimentCount;
  const facts = [
    {
      label: `${experimentCatalogContent.experiments.length} experiments`,
    },
    {
      label: "Local render",
    },
    {
      label: "Live runners",
    },
    {
      label: `${measuredExperimentCount} measured`,
    },
    {
      label: `${pendingExperimentCount} pending`,
    },
  ];

  return (
    <Box sx={catalogFactStripSx} aria-label="Experiment catalog status facts">
      {facts.map((fact) => (
        <Chip key={fact.label} label={fact.label} size="small" variant="outlined" sx={catalogFactChipSx} />
      ))}
    </Box>
  );
}

function ExperimentCatalogConceptSection() {
  return (
    <PageSection>
      <SectionHeader
        eyebrow="Experiment model"
        title="How experiments work"
        copy={experimentCatalogContent.conceptLead}
      />

      <Box component="section" sx={conceptSurfaceSx}>
        {experimentCatalogContent.conceptSteps.map((step, index) => (
          <React.Fragment key={step.label}>
            <Box component="span" className="experiment-concept-step" sx={conceptStepItemSx}>
              <Box component="span" sx={conceptStepSx} title={step.body}>
                {step.label}
              </Box>
            </Box>
            {index < experimentCatalogContent.conceptSteps.length - 1 ? (
              <ArrowForwardRoundedIcon aria-hidden="true" sx={conceptArrowSx} />
            ) : null}
          </React.Fragment>
        ))}
      </Box>
    </PageSection>
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
  const hasMeasuredResult = Boolean(experiment.resultEvidence);
  const evidenceValue = hasMeasuredResult ? "Result measured" : "Result pending";
  const evidenceDetail = hasMeasuredResult
    ? experiment.resultEvidence?.statusLabel.replace(/^Measured\s+/i, "") ?? experiment.status.result
    : null;
  const evidenceTone: CatalogStatusTone = hasMeasuredResult ? "measured" : "pending";

  return (
    <Box sx={catalogStatusStackSx} aria-label={`${experiment.title} status`}>
      <Box component="span" sx={catalogStatusLineSx}>
        <Box component="span" sx={catalogStatusDotSx("ready")} aria-hidden="true" />
        <Box component="span" sx={catalogStatusTextSx}>
          Run ready
        </Box>
      </Box>
      <Box component="span" sx={catalogStatusLineSx}>
        <Box component="span" sx={catalogStatusDotSx(evidenceTone)} aria-hidden="true" />
        <Box component="span" sx={catalogStatusTextSx}>
          {evidenceValue}
          {evidenceDetail ? (
            <Box component="span" sx={catalogStatusMutedSx}>
              {" "}
              · {evidenceDetail}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

function ExperimentBrowseRow({ experiment }: { experiment: ExperimentCatalogItem }) {
  return (
    <Box component="section" sx={browseRowSx}>
      <BrowseField label="Experiment">
        <Box sx={{ mb: 0.55 }}>
          <Chip label={experiment.category} size="small" variant="outlined" />
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
              sx={compactMetricChipSx}
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
        <Typography variant="overline" color="secondary">
          {item.status}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Platform decisions live with the project
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

function ExperimentCatalogListSection() {
  return (
    <PageSection>
      <Box id="experiment-catalog-list" sx={{ scrollMarginTop: { xs: 88, md: 112 } }}>
        <SectionHeader
          eyebrow="Catalog"
          title="Browse experiments"
          copy="Scan by purpose and metric focus, then open the detail page for the full question, run shape, and commands."
        />
      </Box>

      <Stack spacing={2.25}>
        <Box sx={browseSurfaceSx}>
          <Box sx={browseHeaderSx} aria-hidden="true">
            <span>Experiment</span>
            <span>Purpose</span>
            <span>Focus</span>
            <span>Status</span>
            <span>Details</span>
          </Box>
          {experimentCatalogContent.experiments.map((experiment) => (
            <ExperimentBrowseRow key={experiment.slug} experiment={experiment} />
          ))}
        </Box>

        <RelatedProjectEvidenceBand />
      </Stack>
    </PageSection>
  );
}

function ExperimentCatalogRoute() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="experiments">
      <PageHero
        contentWidth="100%"
        variant="compact"
        contentSx={{ gap: { xs: 1.75, md: 2 } }}
      >
        <Box sx={catalogHeroTopSx}>
          <Box sx={catalogHeroPrimarySx}>
            <Typography component="h1" variant="h3">
              {experimentCatalogContent.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "56rem" }}>
              {experimentCatalogContent.subtitle}
            </Typography>
            <CatalogFactStrip />

            <ActionLinkRow>
              <Button href="#experiment-catalog-list" variant="contained">
                Browse experiments
              </Button>
              <Button href={PROJECT_PATH} variant="outlined">
                View project
              </Button>
            </ActionLinkRow>
          </Box>

          <Box sx={catalogHeroSupportSx}>
            <CatalogStatusNote />
          </Box>
        </Box>
      </PageHero>

      <ExperimentCatalogConceptSection />
      <ExperimentCatalogListSection />
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
      <Typography variant="overline" color="secondary">
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
  return (
    <Box sx={pendingResultSx}>
      <Typography variant="h6">Curated live results pending</Typography>
      <Typography variant="body2" color="text.secondary">
        The source repo currently treats {experiment.resultsPath} as a result template. Generated Markdown, JSON, and client logs belong under docs/reports/ until representative results are chosen.
      </Typography>
      <ExperimentPendingNextRuns experiment={experiment} />
      <ActionLinkRow>
        <Button
          href={experimentSourceLink(experiment.resultsPath)}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Results template
        </Button>
        <Button
          href={experimentSourceLink("docs/reports/README.md")}
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
          <span>{tableColumns.target}</span>
          <span>{tableColumns.outcome}</span>
          <span>{tableColumns.p95Latency}</span>
          <span>{tableColumns.peakWaiting}</span>
          <span>{tableColumns.gpuMax}</span>
        </Box>
        {table.rows.map((row) => (
          <Box key={row.target} role="row" sx={resultTableRowSx}>
            <Typography role="cell" variant="body2" sx={{ ...resultTableCellSx, fontWeight: 600 }}>
              <Box component="span" sx={resultMobileLabelSx}>
                {tableColumns.target}
              </Box>
              {row.target}
            </Typography>
            <Typography role="cell" variant="body2" sx={resultTableCellSx}>
              <Box component="span" sx={resultMobileLabelSx}>
                {tableColumns.outcome}
              </Box>
              {row.outcome}
            </Typography>
            <Typography role="cell" variant="body2" sx={resultTableCellSx}>
              <Box component="span" sx={resultMobileLabelSx}>
                {tableColumns.p95Latency}
              </Box>
              {row.p95Latency}
            </Typography>
            <Typography role="cell" variant="body2" sx={resultTableCellSx}>
              <Box component="span" sx={resultMobileLabelSx}>
                {tableColumns.peakWaiting}
              </Box>
              {row.peakWaiting}
            </Typography>
            <Typography role="cell" variant="body2" sx={resultTableCellSx}>
              <Box component="span" sx={resultMobileLabelSx}>
                {tableColumns.gpuMax}
              </Box>
              {row.gpuMax}
            </Typography>
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
            These generated reports are the concrete evidence behind the curated summary.
          </Typography>
        </Box>
      ) : null}
      <ActionLinkRow>
        {reports.map((report) => (
          <Button
            key={report.path}
            href={experimentSourceLink(report.path)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            {report.label}
          </Button>
        ))}
        <Button
          href={experimentSourceLink(experiment.resultsPath)}
          target="_blank"
          rel="noreferrer"
          size="small"
          endIcon={<OpenInNewRoundedIcon />}
        >
          {resultsLinkLabel}
        </Button>
        <Button
          href={experimentSourceLink("docs/reports/README.md")}
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
        <Chip label={evidence.statusLabel} color="success" variant="outlined" />
        <Chip label={`Latest reports: ${evidence.reportDate}`} size="small" variant="outlined" />
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

  return (
    <PageSection>
      <SectionHeader
        eyebrow={hasMeasuredResult ? "Measured result" : "Artifacts"}
        title={hasMeasuredResult ? "Result evidence" : "Result status"}
        copy={
          hasMeasuredResult
            ? "A selected live-cluster run set is now part of this experiment story, with its evidence boundary kept explicit."
            : "Generated artifacts stay separate from curated conclusions until a run is selected for the project narrative."
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

function ExperimentDetailSummaryStrip({ experiment }: { experiment: ExperimentCatalogItem }) {
  const facts = [
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
      label: "Result",
      value: experiment.status.result,
    },
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
        <Typography variant="overline" color="secondary">
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
  const promptTokenRange = formatTokenRange(
    experiment.cases.map((item) => item.promptTokens),
  );
  const outputTokenRange = formatTokenRange(
    experiment.cases.map((item) => item.outputTokens),
  );

  return (
    <PublicSiteLayout activeNav="experiments">
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
                href={experimentSourceLink(experiment.sourcePath)}
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

      <PageSection>
        <SectionHeader
          eyebrow="Run shape"
          title="Run shape"
          copy={`${formatCount(experiment.cases.length, "case")} across ${promptTokenRange} prompt tokens and ${outputTokenRange} output tokens, paired with ${formatCount(experiment.servingProfiles.length, "serving profile")}.`}
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
                  <Chip label={`${item.promptTokens} prompt tokens`} size="small" variant="outlined" />
                  <Chip label={`${item.outputTokens} output tokens`} size="small" variant="outlined" />
                </Box>
              </Box>
            ))}
          </RunShapeColumn>

          <RunShapeColumn
            title="Serving profiles"
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
          copy="Metric groups show the signal this experiment needs without repeating the catalog contract."
        />
        <ExperimentMetricGroupList experiment={experiment} />
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Usage"
          title="How to run"
          copy="These examples show the local render path and the live cluster runner without pretending to list every valid combination."
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={commandListSx}>
              <Typography variant="overline" color="secondary">
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
              <Typography variant="overline" color="secondary">
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
            href={experimentSourceLink(experiment.sourcePath)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            Source
          </Button>
          <Button
            href={experimentSourceLink(experiment.resultsPath)}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            {resultLinkLabel}
          </Button>
        </ActionLinkRow>
      </PageSection>

      <ExperimentResultSection experiment={experiment} />
    </PublicSiteLayout>
  );
}

function UnknownExperimentRoute({ slug }: { slug: string }) {
  useDocumentTitle("Experiment Not Found | Tony Lee");

  return (
    <PublicSiteLayout activeNav="experiments">
      <PageHero>
        <Typography component="h1" variant="h3">
          Experiment not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "54rem" }}>
          No experiment is published for "{slug}". Use the catalog to choose a current experiment page.
        </Typography>
        <ActionLinkRow>
          <Button href={EXPERIMENTS_PATH} variant="contained" startIcon={<ArrowBackRoundedIcon />}>
            Experiment catalog
          </Button>
          <Button href={PROJECT_PATH} variant="outlined">
            View project
          </Button>
        </ActionLinkRow>
      </PageHero>
    </PublicSiteLayout>
  );
}

export function ExperimentsPage({ initialPath }: { initialPath?: string } = {}) {
  const pathname = resolveCurrentPathname(initialPath);
  const slug = getExperimentSlugFromPath(pathname);

  if (slug) {
    const experiment = getExperimentBySlug(slug);

    if (!experiment) {
      return <UnknownExperimentRoute slug={slug} />;
    }

    return <ExperimentDetailRoute experiment={experiment} />;
  }

  return <ExperimentCatalogRoute />;
}
