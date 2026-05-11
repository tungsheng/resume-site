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
  EXPERIMENTS_PATH,
  PROJECT_PATH,
  PROJECT_VALIDATION_PATH,
  RESUME_PATH,
  siteProfile,
} from "../site/content";
import { implementation, projectContent } from "../site/project-content";
import {
  ActionLinkRow,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import {
  accentPanelBaseSx,
  composeSx,
  mutedChipSx,
  softPanelBaseSx,
  warningPanelBaseSx,
} from "../site/styles";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Cloud Inference Platform | Tony Lee";

type WorkflowNode = (typeof projectContent.workflowFoundation.nodes)[number];
type WorkflowTrack = (typeof projectContent.workflowPaths)[number];
type ValidationDecision = (typeof projectContent.validation.decisions)[number];

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

const evidenceGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
  gap: { xs: 1.25, md: 1.5 },
};

const evidenceItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.75,
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
});

const validationHeroFactsSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  alignItems: "center",
};

const validationSurfaceSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 1.75, md: 2.25 },
  display: "grid",
  gap: { xs: 1.25, md: 1.5 },
};

const validationDecisionSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(12rem, 0.36fr) minmax(0, 0.64fr)",
  },
  gap: { xs: 1.25, md: 2 },
  alignItems: "start",
  p: { xs: 1.45, sm: 1.6, md: 1.75 },
  "& + &": {
    mt: { xs: 1.2, md: 1.35 },
  },
});

const validationDecisionMetaSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.45,
  minWidth: 0,
};

const validationDecisionBodySx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
  minWidth: 0,
};

const validationProofSx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: 0.2,
  alignContent: "center",
  width: "fit-content",
  maxWidth: "100%",
  px: 1.25,
  py: 1,
});

const validationCaveatSx: SxProps<Theme> = composeSx(warningPanelBaseSx, {
  p: 1.15,
});

const validationSourceStripSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(3, minmax(0, 1fr))",
  },
  gap: { xs: 1, md: 1.25 },
};

const validationSourceFactSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.2,
  p: { xs: 1.2, sm: 1.3 },
});

function resolveCurrentPathname(initialPath?: string): string {
  return initialPath ?? (typeof window === "undefined" ? PROJECT_PATH : window.location.pathname);
}

function isProjectValidationPath(pathname: string): boolean {
  return (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "") === PROJECT_VALIDATION_PATH;
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
                <Typography variant="overline" color="secondary">
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
            <Typography variant="overline" color="secondary">
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
            <Typography variant="overline" color="secondary">
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
            <Typography variant="overline" color="secondary">
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

function ProjectValidationDecision({ decision }: { decision: ValidationDecision }) {
  return (
    <Box component="section" sx={validationDecisionSx}>
      <Box sx={validationDecisionMetaSx}>
        <Typography variant="overline" color="secondary">
          Decision
        </Typography>
        <Typography variant="h6">{decision.title}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {decision.call}
        </Typography>
      </Box>

      <Box sx={validationDecisionBodySx}>
        <Box sx={validationProofSx}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {decision.proofLabel}
          </Typography>
          <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
            {decision.proofValue}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {decision.body}
        </Typography>
        <Box sx={validationCaveatSx}>
          <Typography variant="body2" color="text.secondary">
            {decision.caveat}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function ProjectValidationRoute() {
  useDocumentTitle(`${projectContent.validation.title} | Tony Lee`);

  return (
    <PublicSiteLayout activeNav="project">
      <PageHero>
        <Typography component="h1" variant="h3">
          {projectContent.validation.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "58rem" }}>
          {projectContent.validation.lede}
        </Typography>
        <Box sx={validationHeroFactsSx}>
          {projectContent.validation.sourceFacts.map((fact) => (
            <Chip
              key={fact.label}
              label={`${fact.label}: ${fact.value}`}
              variant="outlined"
            />
          ))}
        </Box>

        <ActionLinkRow>
          <Button href={PROJECT_PATH} variant="contained">
            Project overview
          </Button>
          <Button href={EXPERIMENTS_PATH} variant="outlined">
            Experiment catalog
          </Button>
        </ActionLinkRow>
      </PageHero>

      <PageSection>
        <SectionHeader
          eyebrow="Operational validation"
          title="Decision record"
          copy={projectContent.validation.summary}
        />

        <Paper variant="outlined" sx={validationSurfaceSx}>
          <Box>
            {projectContent.validation.decisions.map((decision) => (
              <ProjectValidationDecision key={decision.title} decision={decision} />
            ))}
          </Box>

          <Box sx={validationSourceStripSx} aria-label="Validation source facts">
            {projectContent.validation.sourceFacts.map((fact) => (
              <Box key={fact.label} sx={validationSourceFactSx}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {fact.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                  {fact.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <ActionLinkRow>
            <Button
              href="https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/reports/README.md"
              target="_blank"
              rel="noreferrer"
              size="small"
              endIcon={<OpenInNewRoundedIcon />}
            >
              Report rules
            </Button>
            <Button
              href="https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/evaluate"
              target="_blank"
              rel="noreferrer"
              size="small"
              endIcon={<OpenInNewRoundedIcon />}
            >
              Evaluate runner
            </Button>
          </ActionLinkRow>
        </Paper>
      </PageSection>
    </PublicSiteLayout>
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
        <Box sx={evidenceGridSx}>
          {projectContent.evidence.items.map((item) => (
            <Box key={item.title} component="section" sx={evidenceItemSx}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.body}
              </Typography>
            </Box>
          ))}
        </Box>

        <ActionLinkRow>
          <Button href={PROJECT_VALIDATION_PATH} variant="contained">
            Platform decisions
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

function ProjectOverviewRoute() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="project">
      <PageHero>
        <Typography component="h1" variant="h3">
          {projectContent.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "56rem" }}>
          {projectContent.lede}
        </Typography>

        <ActionLinkRow>
          <Button href={EXPERIMENTS_PATH} variant="contained">
            View experiments
          </Button>
          <Button href={RESUME_PATH} variant="outlined">
            View resume
          </Button>
          <Button
            href={siteProfile.githubUrl}
            target="_blank"
            rel="noreferrer"
            endIcon={<OpenInNewRoundedIcon />}
          >
            GitHub
          </Button>
        </ActionLinkRow>
      </PageHero>

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
                  <Typography variant="overline" color="secondary">
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
              <Typography variant="overline" color="secondary">
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
              <Typography variant="overline" color="secondary">
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

  if (isProjectValidationPath(pathname)) {
    return <ProjectValidationRoute />;
  }

  return <ProjectOverviewRoute />;
}
