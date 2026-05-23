import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { CommandCodeBlock } from "../site/command-code-block";
import {
  DecisionReadoutStrip,
  type DecisionReadoutItem,
} from "../site/evidence-visuals";
import {
  CUDA_KERNEL_DECISIONS_PATH,
  CUDA_KERNEL_EXPERIMENTS_PATH,
  CUDA_KERNEL_PROJECT_PATH,
  GPU_INFERENCE_DECISIONS_PATH,
  EXPERIMENTS_PATH,
  GPU_INFERENCE_PROJECT_PATH,
  LEGACY_GPU_INFERENCE_PROJECT_PATH,
  PROJECTS_PATH,
} from "../site/content";
import { implementation, projectContent } from "../site/project-content";
import {
  cudaKernelProjectContent,
  getProjectById,
  projectPortfolioContent,
  type PortfolioProject,
} from "../site/projects-content";
import {
  ActionLinkRow,
  DetailPageHeader,
  IndexPageHeader,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import {
  accentPanelBaseSx,
  composeSx,
  mutedChipSx,
  softPanelBaseSx,
} from "../site/styles";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "GPU Inference Decision Lab | Tony Lee";
const PROJECTS_PAGE_TITLE = "Projects | Tony Lee";
const CUDA_PAGE_TITLE = "CUDA Kernel Lab | Tony Lee";
const GPU_INFERENCE_PROJECT = getProjectById("gpu-inference-lab");
const HOME_BREADCRUMB = { label: "Home", href: "/" };
const PROJECTS_BREADCRUMB = { label: "Projects", href: PROJECTS_PATH };
const CUDA_KERNEL_BREADCRUMB = {
  label: getProjectById("cuda-kernel-lab").title,
  href: CUDA_KERNEL_PROJECT_PATH,
};

type WorkflowNode = (typeof projectContent.workflowFoundation.nodes)[number];
type WorkflowTrack = (typeof projectContent.workflowPaths)[number];

const overviewFactGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: { xs: 1.25, md: 1.5 },
};

const overviewFactSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.55,
  alignContent: "start",
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
});

const projectIndexGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1.25, md: 1.5 },
};

const projectIndexCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.1, md: 1.25 },
  height: "100%",
  p: { xs: 1.4, sm: 1.6, md: 1.75 },
});

const projectIndexBodySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.7,
  minWidth: 0,
  minHeight: { lg: "10.25rem" },
  alignContent: "start",
};

const projectIndexActionsSx: SxProps<Theme> = {
  mt: "auto",
  pt: { xs: 0.25, md: 0.5 },
};

const projectMetaRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  alignItems: "center",
};

const projectEvidenceListSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.65,
  m: 0,
  p: 0,
  listStyle: "none",
};

const projectEvidenceItemSx: SxProps<Theme> = (theme) => ({
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

const projectIndexSummarySx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: 0.65,
  alignSelf: { md: "end" },
  p: { xs: 1.25, sm: 1.35 },
});

const projectIndexListSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 2, md: 2.25 },
};

const cudaWorkflowGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: { xs: 1.1, md: 1.25 },
};

const cudaWorkflowCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.9,
  alignContent: "start",
  height: "100%",
  p: { xs: 1.25, sm: 1.4 },
});

const cudaWorkflowStepSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "2rem",
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  color: theme.palette.secondary.dark,
  fontSize: "0.76rem",
  fontWeight: 800,
  lineHeight: 1,
});

const workflowSurfaceSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 1.75, md: 2 },
  display: "grid",
  gap: { xs: 1, md: 1.1 },
};

const workflowFoundationSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.05, md: 1.15 },
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
});

const workflowFoundationNodesSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 0.75, sm: 0.85 },
  "& .project-workflow-node": {
    justifyContent: "flex-start",
    width: { xs: "100%", sm: "auto" },
    minWidth: { sm: "12.25rem" },
  },
};

const workflowNodePillSx: SxProps<Theme> = (theme) => ({
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  justifySelf: "start",
  gap: 1,
  width: "fit-content",
  maxWidth: "100%",
  minHeight: "2.45rem",
  px: { xs: 1.1, md: 1.2 },
  py: 0.75,
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  boxShadow: "none",
  fontSize: "0.88rem",
  fontWeight: 600,
  lineHeight: 1.35,
});

const workflowNodeLabelSx: SxProps<Theme> = {
  minWidth: 0,
  overflowWrap: "anywhere",
};

const workflowNodeLinkSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "1.25rem",
  px: 0.875,
  py: 0.375,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.secondary.light, 0.04),
  border: `1px solid ${alpha(theme.palette.secondary.light, 0.12)}`,
  color: alpha(theme.palette.secondary.dark, 0.72),
  boxShadow: "none",
  fontSize: "0.72rem",
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap",
  transition:
    "transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
  "&:hover, &:focus-visible": {
    backgroundColor: theme.palette.background.paper,
    borderColor: alpha(theme.palette.secondary.light, 0.28),
    color: theme.palette.text.primary,
    boxShadow: `0 12px 24px ${alpha(theme.palette.text.primary, 0.08)}`,
    transform: "translateY(-1px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.secondary.light, 0.4)}`,
    outlineOffset: 2,
  },
});

const workflowFlowSx: SxProps<Theme> = (theme) => ({
  position: { xs: "relative", md: "static" },
  display: { xs: "grid", md: "flex" },
  flexWrap: "wrap",
  alignItems: { xs: "start", md: "center" },
  justifyItems: { xs: "start", md: "initial" },
  backgroundColor: "transparent",
  gap: { xs: 0.85, md: 0.55 },
  pl: { xs: 2.75, md: 0 },
  pr: { xs: 0.25, md: 0 },
  "&::before": {
    content: '""',
    display: { xs: "block", md: "none" },
    position: "absolute",
    left: 9,
    top: 4,
    bottom: 4,
    width: "1px",
    backgroundColor: alpha(theme.palette.secondary.light, 0.12),
  },
  "& .project-workflow-flow-arrow": {
    display: { xs: "none", md: "inline-flex" },
    flex: "0 0 auto",
    color: alpha(theme.palette.secondary.dark, 0.42),
    fontSize: "1rem",
    lineHeight: 1,
  },
  "& .project-workflow-step": {
    display: "inline-flex",
    alignItems: "center",
    gap: { xs: 0, md: 0.55 },
    maxWidth: "100%",
    minWidth: 0,
  },
  "& .project-workflow-node": {
    position: { xs: "relative", md: "static" },
    justifySelf: { xs: "start", md: "auto" },
    justifyContent: "flex-start",
    width: "fit-content",
    maxWidth: "100%",
    borderRadius: { xs: 1.75, md: 2 },
    "&::before": {
      content: '""',
      display: { xs: "block", md: "none" },
      position: "absolute",
      left: -18,
      top: "50%",
      width: "9px",
      height: "9px",
      borderRadius: "50%",
      backgroundColor: theme.palette.background.paper,
      border: `2px solid ${alpha(theme.palette.secondary.light, 0.42)}`,
      transform: "translateY(-50%)",
    },
  },
});

const workflowPathsSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1, md: 1.1 },
};

const workflowPathRowSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.05, md: 1.15 },
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
});

const workflowMetaSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.45,
  alignContent: "start",
};

const workflowRejoinSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.05, md: 1.15 },
  p: { xs: 1.25, sm: 1.4, md: 1.5 },
});

const quickStartCommandSx: SxProps<Theme> = {
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "pre",
  wordBreak: "normal",
  overflowWrap: "normal",
  fontSize: { xs: "0.78rem", sm: "0.84rem" },
  px: { xs: 1.2, sm: 1.4 },
  "& code, & span": {
    whiteSpace: "inherit",
  },
};

const quickStartStepListSx: SxProps<Theme> = (theme) => ({
  position: { xs: "relative", md: "static" },
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)",
  },
  gap: { xs: 1, md: 1.1 },
  alignItems: "stretch",
  pl: { xs: 2.75, md: 0 },
  pr: { xs: 0.25, md: 0 },
  "&::before": {
    content: '""',
    display: { xs: "block", md: "none" },
    position: "absolute",
    left: 9,
    top: 4,
    bottom: 4,
    width: "1px",
    backgroundColor: alpha(theme.palette.secondary.light, 0.12),
  },
});

const quickStartStepRowSx: SxProps<Theme> = composeSx(softPanelBaseSx, (theme) => ({
  position: "relative",
  display: "grid",
  gap: { xs: 1, md: 1.05 },
  alignContent: "start",
  p: { xs: 1.35, sm: 1.5, md: 1.6 },
  "&::before": {
    content: '""',
    display: { xs: "block", md: "none" },
    position: "absolute",
    left: -18,
    top: "2.35rem",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${alpha(theme.palette.secondary.light, 0.42)}`,
    transform: "translateY(-50%)",
  },
}));

const quickStartStepBadgeSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.7rem",
  height: "1.45rem",
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.secondary.light, 0.04),
  border: `1px solid ${alpha(theme.palette.secondary.light, 0.12)}`,
  color: alpha(theme.palette.secondary.dark, 0.58),
  fontSize: "0.66rem",
  fontWeight: 500,
  lineHeight: 1,
});

const quickStartStepHeaderSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: 1,
  alignItems: "center",
  minWidth: 0,
};

const quickStartStepCopySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.75,
  minWidth: 0,
};

const quickStartStepCommandSx: SxProps<Theme> = [
  quickStartCommandSx,
  {
    py: { xs: 1, md: 1.05 },
  },
];

const quickStartStepConnectorSx: SxProps<Theme> = (theme) => ({
  display: { xs: "none", md: "inline-flex" },
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  width: "1.35rem",
  color: alpha(theme.palette.secondary.dark, 0.42),
  "& svg": {
    fontSize: "1rem",
  },
});

const quickStartSupportBlockSx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
};

const quickStartProofListSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
  gap: { xs: 1, md: 1.25 },
};

const quickStartProofItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateColumns: "1.35rem minmax(0, 1fr)",
  gap: 0.85,
  alignItems: "start",
  p: { xs: 1.35, sm: 1.5 },
});

const quickStartCheckIconSx: SxProps<Theme> = (theme) => ({
  mt: 0.2,
  color: alpha(theme.palette.secondary.dark, 0.7),
  fontSize: "1rem",
});

const usageSurfaceSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 1.75, md: 2.25 },
  display: "grid",
  gap: { xs: 1.75, md: 2.25 },
};

const usageWorkflowGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(3, minmax(0, 1fr))" },
  gap: { xs: 1, md: 1.25 },
  alignItems: "stretch",
};

const usageWorkflowItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateRows: { xs: "auto auto auto", lg: "auto minmax(7.5rem, 1fr) auto" },
  gap: 1,
  alignContent: "stretch",
  height: "100%",
  p: { xs: 1.35, sm: 1.5, md: 1.6 },
});

const usageWorkflowHeaderSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.35,
  alignContent: "start",
  minWidth: 0,
};

const usageWorkflowBodySx: SxProps<Theme> = {
  display: "grid",
  alignContent: "start",
  gap: 0.75,
  minWidth: 0,
};

const usageWorkflowActionsSx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
  alignSelf: "end",
  minWidth: 0,
};

const usageDefaultPathSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.25, md: 1.5 },
  p: { xs: 1.35, sm: 1.5, md: 1.75 },
});

const usageDefaultHeaderSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.5,
  maxWidth: "52rem",
};

const usageConceptSx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: { xs: 1.25, md: 1.5 },
  p: { xs: 1.35, sm: 1.5, md: 1.75 },
});

const usageConceptHeaderSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.5,
  maxWidth: "52rem",
};

const usageConceptFlowSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 0.75, md: 1 },
  alignItems: "center",
  "& .project-usage-concept-arrow": {
    color: alpha(theme.palette.secondary.dark, 0.42),
    fontSize: "1rem",
  },
});

const usageConceptStepSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "2.35rem",
  px: { xs: 1.15, md: 1.35 },
  py: 0.75,
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.86rem",
  fontWeight: 600,
  lineHeight: 1.2,
});

const evidenceSurfaceSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 1.75, md: 2.25 },
  display: "grid",
  gap: { xs: 1.4, md: 1.75 },
};

const projectDetailSupportSx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: { xs: 0.85, md: 1 },
  p: { xs: 1.25, sm: 1.35 },
});

const projectDetailSupportMetaSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.65,
  alignItems: "center",
};

function resolveCurrentPathname(initialPath?: string): string {
  return initialPath ?? (typeof window === "undefined" ? PROJECTS_PATH : window.location.pathname);
}

function normalizeRoutePath(pathname: string): string {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  return normalizedPath || "/";
}

function isGpuInferenceProjectPath(pathname: string): boolean {
  const normalizedPath = normalizeRoutePath(pathname);

  return (
    normalizedPath === GPU_INFERENCE_PROJECT_PATH ||
    normalizedPath === LEGACY_GPU_INFERENCE_PROJECT_PATH
  );
}

function isCudaKernelProjectPath(pathname: string): boolean {
  return normalizeRoutePath(pathname) === CUDA_KERNEL_PROJECT_PATH;
}

function isProjectsIndexPath(pathname: string): boolean {
  return normalizeRoutePath(pathname) === PROJECTS_PATH;
}

function WorkflowNodePill({ node }: { node: WorkflowNode }) {
  const href = "href" in node ? node.href : undefined;
  const linkLabel =
    "linkLabel" in node && node.linkLabel ? node.linkLabel : "Code";

  return (
    <Box
      component="span"
      className="project-workflow-node"
      sx={workflowNodePillSx}
    >
      <Box component="span" sx={workflowNodeLabelSx}>
        {node.label}
      </Box>
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          underline="none"
          sx={workflowNodeLinkSx}
        >
          {linkLabel}
        </Link>
      ) : null}
    </Box>
  );
}

function WorkflowFlow({
  nodes,
  ariaLabel,
}: {
  nodes: WorkflowNode[];
  ariaLabel: string;
}) {
  return (
    <Box sx={workflowFlowSx} aria-label={ariaLabel}>
      {nodes.map((node, index) => (
        <Box
          component="span"
          className="project-workflow-step"
          key={`${node.label}-${index}`}
        >
          {index > 0 ? (
            <ArrowForwardIcon
              className="project-workflow-flow-arrow"
              aria-hidden="true"
            />
          ) : null}
          <WorkflowNodePill node={node} />
        </Box>
      ))}
    </Box>
  );
}

function WorkflowPathRow({ title, summary, nodes }: WorkflowTrack) {
  return (
    <Box component="section" sx={workflowPathRowSx}>
      <Box sx={workflowMetaSx}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
      </Box>
      <WorkflowFlow nodes={nodes} ariaLabel={`${title} workflow`} />
    </Box>
  );
}

function ProjectPortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <Box component="section" sx={projectIndexCardSx}>
      <Box sx={projectMetaRowSx}>
        <Chip label={project.layer} variant="outlined" sx={mutedChipSx} />
        <Chip label={project.status} color={project.statusTone === "supported" ? "success" : "info"} variant="outlined" />
        <Chip label={`${project.experimentCount} experiments`} variant="outlined" />
      </Box>

      <Box sx={projectIndexBodySx}>
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

      <Box component="ul" sx={projectEvidenceListSx}>
        {project.evidence.map((item) => (
          <Box key={item} component="li" sx={projectEvidenceItemSx}>
            {item}
          </Box>
        ))}
      </Box>

      <Box sx={projectIndexActionsSx}>
        <ActionLinkRow>
          <Button href={project.path} variant="contained">
            View project
          </Button>
          <Button href={project.primaryAction.href} variant="outlined">
            {project.primaryAction.label}
          </Button>
          <Button
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            GitHub
          </Button>
        </ActionLinkRow>
      </Box>
    </Box>
  );
}

function ProjectsIndexRoute() {
  useDocumentTitle(PROJECTS_PAGE_TITLE);

  return (
    <PublicSiteLayout
      activeNav="project"
      breadcrumbs={[HOME_BREADCRUMB, { label: "Projects" }]}
    >
      <PageSection>
        <Box sx={projectIndexListSx}>
          <IndexPageHeader
            title={projectPortfolioContent.title}
            copy={projectPortfolioContent.lede}
            support={
              <Box sx={projectIndexSummarySx}>
              <Typography variant="body2" color="text.secondary">
                {projectPortfolioContent.summary}
              </Typography>
              </Box>
            }
          />

          <Box sx={projectIndexGridSx}>
            {projectPortfolioContent.projects.map((project) => (
              <ProjectPortfolioCard key={project.id} project={project} />
            ))}
          </Box>
        </Box>
      </PageSection>
    </PublicSiteLayout>
  );
}

function ProjectDetailSupport({ project }: { project: PortfolioProject }) {
  return (
    <Box sx={projectDetailSupportSx}>
      <Box sx={projectDetailSupportMetaSx}>
        <Chip label={project.layer} size="small" variant="outlined" sx={mutedChipSx} />
        <Chip label={project.status} size="small" variant="outlined" />
        <Chip label={`${project.experimentCount} experiments`} size="small" variant="outlined" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {project.result}
      </Typography>
    </Box>
  );
}

function LabUsageSection() {
  return (
    <PageSection>
      <SectionHeader
        title={projectContent.usage.title}
        copy={projectContent.usage.lead}
      />

      <Paper variant="outlined" sx={usageSurfaceSx}>
        <Box sx={usageWorkflowGridSx}>
          {projectContent.usage.workflows.map((item) => (
            <Box key={item.title} component="section" sx={usageWorkflowItemSx}>
              <Box sx={usageWorkflowHeaderSx}>
                <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                  Workflow
                </Typography>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.body}
                </Typography>
              </Box>

              <Box sx={usageWorkflowBodySx}>
                <Typography variant="body2">
                  {item.when}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  {item.outputs.map((output) => (
                    <Chip
                      key={`${item.title}-${output}`}
                      label={output}
                      size="small"
                      variant="outlined"
                      sx={mutedChipSx}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={usageWorkflowActionsSx}>
                <CommandCodeBlock
                  command={item.command}
                  ariaLabel={`${item.title} command`}
                  sx={quickStartCommandSx}
                />

                <Button
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  endIcon={<OpenInNewRoundedIcon />}
                  sx={{ justifySelf: "start" }}
                >
                  Source
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        <Box component="section" sx={usageDefaultPathSx}>
          <Box sx={usageDefaultHeaderSx}>
            <Typography variant="overline" sx={{ color: "secondary.dark" }}>
              {implementation.defaultPathTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {implementation.defaultPathLead}
            </Typography>
          </Box>

          <Box sx={quickStartStepListSx} aria-label="Quick start default path">
            {implementation.defaultPathSteps.map((item, index) => (
              <React.Fragment key={item.title}>
                <Box component="section" sx={quickStartStepRowSx}>
                  <Box sx={quickStartStepHeaderSx}>
                    <Box
                      component="span"
                      aria-label={`Step ${index + 1}`}
                      sx={quickStartStepBadgeSx}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Box>
                    <Typography variant="h6">{item.title}</Typography>
                  </Box>
                  <Box sx={quickStartStepCopySx}>
                    <CommandCodeBlock
                      command={item.command}
                      ariaLabel={`${item.title} command`}
                      sx={quickStartStepCommandSx}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.body}
                    </Typography>
                  </Box>
                </Box>
                {index < implementation.defaultPathSteps.length - 1 ? (
                  <Box sx={quickStartStepConnectorSx} aria-hidden="true">
                    <ArrowForwardIcon />
                  </Box>
                ) : null}
              </React.Fragment>
            ))}
          </Box>

          <Box component="section" sx={quickStartSupportBlockSx}>
            <Typography variant="overline" sx={{ color: "secondary.dark" }}>
              {implementation.verifyProofTitle}
            </Typography>
            <Box sx={quickStartProofListSx}>
              {implementation.verifyProofs.map((item) => (
                <Box key={item.title} sx={quickStartProofItemSx}>
                  <CheckRoundedIcon aria-hidden="true" sx={quickStartCheckIconSx} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.body}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={usageConceptSx}>
          <Box sx={usageConceptHeaderSx}>
            <Typography variant="overline" sx={{ color: "secondary.dark" }}>
              {projectContent.usage.conceptTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {projectContent.usage.conceptLead}
            </Typography>
          </Box>

          <Box sx={usageConceptFlowSx} aria-label="Experiment concept flow">
            {projectContent.usage.conceptSteps.map((step, index) => (
              <React.Fragment key={step}>
                <Box component="span" sx={usageConceptStepSx}>
                  {step}
                </Box>
                {index < projectContent.usage.conceptSteps.length - 1 ? (
                  <ArrowForwardIcon
                    className="project-usage-concept-arrow"
                    aria-hidden="true"
                  />
                ) : null}
              </React.Fragment>
            ))}
          </Box>

          <ActionLinkRow>
            {projectContent.usage.links.map((link) => (
              <Button
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                size="small"
                endIcon={<OpenInNewRoundedIcon />}
              >
                {link.label}
              </Button>
            ))}
          </ActionLinkRow>
        </Box>
      </Paper>
    </PageSection>
  );
}

function ProjectEvidenceSection() {
  return (
    <PageSection>
      <SectionHeader
        title={projectContent.evidence.title}
        copy={projectContent.evidence.lead}
      />

      <Paper variant="outlined" sx={evidenceSurfaceSx}>
        <DecisionReadoutStrip
          ariaLabel="Architecture readout"
          items={projectContent.evidence.items.map((item) => ({
            label: item.title,
            statusLabel: item.statusLabel,
            value: item.call,
            detail: item.proof,
            tone: item.tone,
          })) as DecisionReadoutItem[]}
        />

        <ActionLinkRow>
          <Button href={GPU_INFERENCE_DECISIONS_PATH} variant="contained">
            Architecture decisions
          </Button>
          <Button href={EXPERIMENTS_PATH} variant="outlined">
            Experiment catalog
          </Button>
          {projectContent.evidence.links.map((link) => (
            <Button
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              size="small"
              endIcon={<OpenInNewRoundedIcon />}
            >
              {link.label}
            </Button>
          ))}
        </ActionLinkRow>
      </Paper>
    </PageSection>
  );
}

function CudaKernelWorkflowSection() {
  return (
    <PageSection>
      <SectionHeader
        eyebrow="Workflow"
        title="Optimization loop"
        copy="Every kernel claim moves through the same loop: profile first, isolate the bottleneck, change only that path, then re-profile before calling it a win."
      />

      <Box sx={cudaWorkflowGridSx}>
        {cudaKernelProjectContent.optimizationLoop.map((workflow) => (
          <Box key={workflow.title} component="section" sx={cudaWorkflowCardSx}>
            <Box sx={cudaWorkflowStepSx}>{workflow.step}</Box>
            <Box sx={{ display: "grid", gap: 0.45, minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                {workflow.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {workflow.body}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {workflow.evidence}
            </Typography>
          </Box>
        ))}
      </Box>
    </PageSection>
  );
}

function CudaKernelResultsSection() {
  return (
    <PageSection>
      <SectionHeader
        eyebrow="A10G evidence"
        title="Benchmark readout"
        copy="The selected runs show where custom kernels are useful, where profiler counters explain the result, and where decode replay is measured but still bounded as a synthetic resident-KV upper bound."
      />

      <Paper variant="outlined" sx={evidenceSurfaceSx}>
        <DecisionReadoutStrip
          ariaLabel="CUDA benchmark readout"
          items={cudaKernelProjectContent.results.map((item) => ({
            label: item.title,
            statusLabel: item.statusLabel,
            value: item.call,
            detail: item.proof,
            tone: item.tone,
          })) as DecisionReadoutItem[]}
        />

        <ActionLinkRow>
          <Button href={CUDA_KERNEL_EXPERIMENTS_PATH} variant="contained">
            Kernel experiments
          </Button>
          <Button
            href={`${getProjectById("cuda-kernel-lab").repositoryUrl}/blob/main/experiments/reports/aws-ec2/2026-05-21-strategy-next.md`}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            Strategy report
          </Button>
          <Button
            href={`${getProjectById("cuda-kernel-lab").repositoryUrl}/blob/main/experiments/reports/aws-ec2/2026-05-22-round12-kv-active-views.md`}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            Decode replay report
          </Button>
          <Button
            href={`${getProjectById("cuda-kernel-lab").repositoryUrl}/tree/main/profiling/reports/2026-05-21-strategy-next`}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
          >
            Profiler reports
          </Button>
        </ActionLinkRow>
      </Paper>
    </PageSection>
  );
}

function CudaKernelProjectRoute() {
  useDocumentTitle(CUDA_PAGE_TITLE);
  const project = getProjectById("cuda-kernel-lab");

  return (
    <PublicSiteLayout
      activeNav="project"
      breadcrumbs={[
        HOME_BREADCRUMB,
        PROJECTS_BREADCRUMB,
        { label: CUDA_KERNEL_BREADCRUMB.label },
      ]}
    >
      <DetailPageHeader
        title={cudaKernelProjectContent.title}
        copy={cudaKernelProjectContent.lede}
        support={<ProjectDetailSupport project={project} />}
        actions={
          <>
          <Button href={CUDA_KERNEL_EXPERIMENTS_PATH} variant="contained">
            View experiments
          </Button>
          <Button href={CUDA_KERNEL_DECISIONS_PATH} variant="outlined">
            View decisions
          </Button>
          <Button
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            endIcon={<OpenInNewRoundedIcon />}
          >
            GitHub
          </Button>
          </>
        }
      />

      <PageSection>
        <SectionHeader
          title="At a glance"
          copy={cudaKernelProjectContent.overviewSummary}
        />

        <Box sx={overviewFactGridSx}>
          {cudaKernelProjectContent.overviewFacts.map((item) => (
            <Box key={item.label} component="section" sx={overviewFactSx}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                {item.label}
              </Typography>
              <Typography variant="h6">{item.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </PageSection>

      <CudaKernelWorkflowSection />
      <CudaKernelResultsSection />
    </PublicSiteLayout>
  );
}

function ProjectOverviewRoute() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout
      activeNav="project"
      breadcrumbs={[
        HOME_BREADCRUMB,
        PROJECTS_BREADCRUMB,
        { label: GPU_INFERENCE_PROJECT.title },
      ]}
    >
      <DetailPageHeader
        title={projectContent.title}
        copy={projectContent.lede}
        support={<ProjectDetailSupport project={GPU_INFERENCE_PROJECT} />}
        actions={
          <>
          <Button href={EXPERIMENTS_PATH} variant="contained">
            View experiments
          </Button>
          <Button href={GPU_INFERENCE_DECISIONS_PATH} variant="outlined">
            View decisions
          </Button>
          <Button
            href={GPU_INFERENCE_PROJECT.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            endIcon={<OpenInNewRoundedIcon />}
          >
            GitHub
          </Button>
          </>
        }
      />

      <PageSection>
        <SectionHeader
          title="At a glance"
          copy={projectContent.overviewSummary}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Box sx={overviewFactGridSx}>
              {projectContent.overviewFacts.map((item) => (
                <Box key={item.label} component="section" sx={overviewFactSx}>
                  <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{item.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </PageSection>

      <LabUsageSection />

      <PageSection>
        <SectionHeader
          title={projectContent.workflowSectionTitle}
          copy={projectContent.workflowLead}
        />

        <Paper variant="outlined" sx={workflowSurfaceSx}>
          <Box component="section" sx={workflowFoundationSx}>
            <Box sx={workflowMetaSx}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                {projectContent.workflowFoundation.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {projectContent.workflowFoundation.summary}
              </Typography>
            </Box>
            <Box sx={workflowFoundationNodesSx} aria-label="Foundation workflow">
              {projectContent.workflowFoundation.nodes.map((node, index) => (
                <WorkflowNodePill node={node} key={`${node.label}-${index}`} />
              ))}
            </Box>
          </Box>

          <Box sx={workflowPathsSx}>
            {projectContent.workflowPaths.map((path) => (
              <WorkflowPathRow
                key={path.title}
                title={path.title}
                summary={path.summary}
                nodes={path.nodes}
              />
            ))}
          </Box>

          <Box component="section" sx={workflowRejoinSx}>
            <Box sx={workflowMetaSx}>
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                Rejoin point
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {projectContent.workflowRejoin.body}
              </Typography>
            </Box>
            <WorkflowFlow
              nodes={projectContent.workflowRejoin.nodes}
              ariaLabel="Rejoin workflow"
            />
          </Box>
        </Paper>
      </PageSection>

      <ProjectEvidenceSection />
    </PublicSiteLayout>
  );
}

export function ProjectPage({ initialPath }: { initialPath?: string } = {}) {
  const pathname = resolveCurrentPathname(initialPath);

  if (isGpuInferenceProjectPath(pathname)) {
    return <ProjectOverviewRoute />;
  }

  if (isCudaKernelProjectPath(pathname)) {
    return <CudaKernelProjectRoute />;
  }

  if (isProjectsIndexPath(pathname)) {
    return <ProjectsIndexRoute />;
  }

  return <ProjectsIndexRoute />;
}
