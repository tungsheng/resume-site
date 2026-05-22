import React from "react";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import {
  CUDA_KERNEL_DECISIONS_PATH,
  DECISIONS_PATH,
  GPU_INFERENCE_DECISIONS_PATH,
  GPU_INFERENCE_PROJECT_VALIDATION_PATH,
  LEGACY_GPU_INFERENCE_PROJECT_VALIDATION_PATH,
} from "../site/content";
import {
  decisionProjectSummaries,
  getDecisionDomains,
  getDecisionExperimentTitle,
  getDecisionProjectSummary,
  getDecisionRecordsByProject,
  type DecisionRecord,
  type DecisionStatus,
} from "../site/decision-content";
import { experimentDetailPath } from "../site/experiment-catalog-content";
import {
  TwoMetricEvidenceMatrix,
  type EvidenceMatrixColumn,
  type EvidenceMatrixRow,
} from "../site/evidence-visuals";
import {
  ActionLinkRow,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import { projectContent } from "../site/project-content";
import { getProjectById, type ProjectId } from "../site/projects-content";
import { composeSx, softPanelBaseSx, warningPanelBaseSx } from "../site/styles";
import { useDocumentTitle } from "../site/use-document-title";

const DEFAULT_DECISION_PROJECT_ID: ProjectId = "gpu-inference-lab";
const HOME_BREADCRUMB = { label: "Home", href: "/" };
const DECISIONS_BREADCRUMB = { label: "Decisions", href: DECISIONS_PATH };

const statusDashboardSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(auto-fit, minmax(9.5rem, 1fr))",
  },
  gap: { xs: 0.9, md: 1 },
};

const statusDashboardItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.25,
  p: { xs: 1.05, md: 1.15 },
});

const decisionGroupSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1, md: 1.15 },
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
});

const decisionCardGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1, md: 1.15 },
};

const decisionCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
  gap: 0.95,
  alignContent: "stretch",
  minHeight: "16rem",
  p: { xs: 1.2, sm: 1.35 },
});

const decisionCardHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  alignItems: "flex-start",
  justifyContent: "space-between",
  minWidth: 0,
};

const decisionCardBodySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.75,
  alignContent: "start",
  minWidth: 0,
};

const relatedExperimentSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.65,
  alignItems: "center",
};

const nextEvidenceSx: SxProps<Theme> = composeSx(warningPanelBaseSx, {
  p: 1,
});

const validationVisualGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1.25, md: 1.5 },
};

function statusColor(theme: Theme, status: DecisionStatus) {
  if (status === "Supported") return theme.palette.success.main;
  if (status === "Rejected") return theme.palette.error.main;
  if (status === "Blocked") return theme.palette.warning.dark;
  if (status === "Partial") return theme.palette.info.main;
  if (status === "Measured") return theme.palette.success.dark;
  return theme.palette.warning.dark;
}

function decisionStatusChipSx(status: DecisionStatus): SxProps<Theme> {
  return (theme) => {
    const color = statusColor(theme, status);

    return {
      borderColor: alpha(color, 0.35),
      backgroundColor: alpha(color, 0.055),
      color,
      fontWeight: 700,
    };
  };
}

function resolveCurrentPathname(initialPath?: string): string {
  return initialPath ?? (typeof window === "undefined" ? DECISIONS_PATH : window.location.pathname);
}

function isDecisionProjectId(value: string): value is ProjectId {
  return decisionProjectSummaries.some((summary) => summary.projectId === value);
}

export function getDecisionProjectIdFromPath(pathname: string): ProjectId | null {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  if (
    normalizedPath === DECISIONS_PATH ||
    normalizedPath === GPU_INFERENCE_PROJECT_VALIDATION_PATH ||
    normalizedPath === LEGACY_GPU_INFERENCE_PROJECT_VALIDATION_PATH
  ) {
    return DEFAULT_DECISION_PROJECT_ID;
  }

  if (!normalizedPath.startsWith(`${DECISIONS_PATH}/`)) {
    return null;
  }

  const segment = normalizedPath.slice(`${DECISIONS_PATH}/`.length);
  if (!segment || segment.includes("/")) {
    return null;
  }

  const decodedSegment = decodeURIComponent(segment);
  return isDecisionProjectId(decodedSegment) ? decodedSegment : null;
}

function getStatusCounts(decisions: DecisionRecord[]): Array<{ status: DecisionStatus; count: number }> {
  const statuses: DecisionStatus[] = [
    "Supported",
    "Measured",
    "Caveated",
    "Partial",
    "Rejected",
    "Blocked",
  ];

  return statuses
    .map((status) => ({
      status,
      count: decisions.filter((decision) => decision.status === status).length,
    }))
    .filter((item) => item.count > 0);
}

function DecisionStatusDashboard({ decisions }: { decisions: DecisionRecord[] }) {
  return (
    <Box sx={statusDashboardSx} aria-label="Decision status dashboard">
      {getStatusCounts(decisions).map((item) => (
        <Box key={item.status} sx={statusDashboardItemSx}>
          <Typography variant="overline" sx={{ color: "secondary.dark" }}>
            {item.status}
          </Typography>
          <Typography variant="h5">{item.count}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function DecisionCard({ decision }: { decision: DecisionRecord }) {
  return (
    <Box component="section" sx={decisionCardSx}>
      <Box sx={decisionCardHeaderSx}>
        <Box sx={{ display: "grid", gap: 0.35, minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: "secondary.dark" }}>
            {decision.domain}
          </Typography>
          <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
            {decision.title}
          </Typography>
        </Box>
        <Chip
          label={decision.status}
          size="small"
          variant="outlined"
          sx={decisionStatusChipSx(decision.status)}
        />
      </Box>

      <Box sx={decisionCardBodySx}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {decision.call}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {decision.evidence}
        </Typography>
        {decision.nextEvidence ? (
          <Box sx={nextEvidenceSx}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Next evidence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {decision.nextEvidence}
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Box sx={relatedExperimentSx} aria-label={`${decision.title} related experiments`}>
        {decision.experimentSlugs.map((slug) => (
          <Button
            key={`${decision.id}-${slug}`}
            href={experimentDetailPath(slug)}
            size="small"
            variant="outlined"
          >
            {getDecisionExperimentTitle(slug)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function DecisionGroups({
  projectId,
  decisions,
}: {
  projectId: ProjectId;
  decisions: DecisionRecord[];
}) {
  return (
    <Stack spacing={{ xs: 1.5, md: 1.75 }}>
      {getDecisionDomains(projectId).map((domain) => {
        const domainDecisions = decisions.filter((decision) => decision.domain === domain);

        return (
          <Box key={domain} component="section" sx={decisionGroupSx}>
            <Box sx={{ display: "grid", gap: 0.35 }}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                Domain
              </Typography>
              <Typography component="h3" variant="h5">
                {domain}
              </Typography>
            </Box>
            <Box sx={decisionCardGridSx}>
              {domainDecisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

function GpuEvidenceVisualsSection() {
  return (
    <PageSection>
      <SectionHeader
        eyebrow="Evidence visuals"
        title="Decision evidence visuals"
        copy="Local MUI visuals recreate the key proof points without depending on the lab repository at runtime."
      />

      <Box sx={validationVisualGridSx}>
        {projectContent.validation.evidenceVisuals.map((visual) => (
          <TwoMetricEvidenceMatrix
            key={visual.title}
            title={visual.title}
            takeaway={visual.takeaway}
            sourceLabel={visual.sourceLabel}
            columns={visual.columns as EvidenceMatrixColumn[]}
            rows={visual.rows as EvidenceMatrixRow[]}
          />
        ))}
      </Box>
    </PageSection>
  );
}

function UnknownDecisionProjectRoute() {
  useDocumentTitle("Decision Project Not Found | Tony Lee");

  return (
    <PublicSiteLayout
      activeNav="decisions"
      breadcrumbs={[HOME_BREADCRUMB, DECISIONS_BREADCRUMB, { label: "Not found" }]}
    >
      <PageHero>
        <Typography component="h1" variant="h3">
          Decision project not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "54rem" }}>
          Choose one of the published decision records.
        </Typography>
        <ActionLinkRow>
          <Button href={GPU_INFERENCE_DECISIONS_PATH} variant="contained">
            GPU inference decisions
          </Button>
          <Button href={CUDA_KERNEL_DECISIONS_PATH} variant="outlined">
            CUDA kernel decisions
          </Button>
        </ActionLinkRow>
      </PageHero>
    </PublicSiteLayout>
  );
}

function DecisionProjectRoute({ projectId }: { projectId: ProjectId }) {
  const summary = getDecisionProjectSummary(projectId);
  const project = getProjectById(projectId);
  const decisions = getDecisionRecordsByProject(projectId);

  useDocumentTitle(`${summary.title} | Tony Lee`);

  return (
    <PublicSiteLayout
      activeNav="decisions"
      breadcrumbs={[
        HOME_BREADCRUMB,
        DECISIONS_BREADCRUMB,
        { label: project.title },
      ]}
    >
      <PageHero
        variant="compact"
        contentWidth="64rem"
        sx={{ mb: { xs: 2.5, md: 3 } }}
      >
        <Box sx={{ display: "grid", gap: { xs: 1.35, md: 1.55 }, minWidth: 0 }}>
          <Box sx={{ display: "grid", gap: 1, maxWidth: "62rem" }}>
            <Typography component="h1" variant="h3">
              {summary.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "58rem" }}>
              {summary.lead}
            </Typography>
          </Box>
          <DecisionStatusDashboard decisions={decisions} />
          <ActionLinkRow>
            <Button href={summary.experimentsPath} variant="contained">
              View experiments
            </Button>
            <Button href={project.path} variant="outlined">
              Project overview
            </Button>
            <Button
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewRoundedIcon />}
            >
              GitHub
            </Button>
          </ActionLinkRow>
        </Box>
      </PageHero>

      <PageSection>
        <SectionHeader
          eyebrow="Decision matrix"
          title={summary.sectionTitle}
          copy="Each decision is grouped by domain and links back to the experiments that produced the evidence."
        />
        <DecisionGroups projectId={projectId} decisions={decisions} />
      </PageSection>

      {projectId === "gpu-inference-lab" ? <GpuEvidenceVisualsSection /> : null}
    </PublicSiteLayout>
  );
}

export function DecisionsPage({ initialPath }: { initialPath?: string } = {}) {
  const projectId = getDecisionProjectIdFromPath(resolveCurrentPathname(initialPath));

  if (!projectId) {
    return <UnknownDecisionProjectRoute />;
  }

  return <DecisionProjectRoute projectId={projectId} />;
}
