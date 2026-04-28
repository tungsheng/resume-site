import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { CommandCodeBlock } from "../site/command-code-block";
import { EXPERIMENTS_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { implementation, projectContent } from "../site/project-content";
import {
  ActionLinkRow,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Cloud Inference Platform | Tony Lee";

type WorkflowNode = (typeof projectContent.workflowFoundation.nodes)[number];
type WorkflowTrack = (typeof projectContent.workflowPaths)[number];

const workflowSurfaceSx: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5, md: 3 },
  display: "grid",
  gap: { xs: 1.25, md: 1.35 },
};

const workflowFoundationSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.35, md: 1.5 },
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.54),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.65)}`,
});

const workflowFoundationNodesSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 1, sm: 1.25 },
  "& .project-workflow-node": {
    justifyContent: "flex-start",
    width: "100%",
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
  minHeight: "2.7rem",
  px: { xs: 1.25, md: 1.5 },
  py: 1,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.56),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.085)}`,
  color: theme.palette.text.primary,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.62)}`,
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
  backgroundColor: alpha(theme.palette.secondary.main, 0.04),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
  color: alpha(theme.palette.secondary.dark, 0.72),
  boxShadow: "none",
  fontSize: "0.72rem",
  fontWeight: 700,
  lineHeight: 1,
  whiteSpace: "nowrap",
  transition:
    "transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
  "&:hover, &:focus-visible": {
    backgroundColor: alpha(theme.palette.common.white, 0.96),
    borderColor: alpha(theme.palette.secondary.main, 0.28),
    color: theme.palette.text.primary,
    boxShadow: `0 12px 24px ${alpha(theme.palette.text.primary, 0.08)}`,
    transform: "translateY(-1px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
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
  gap: { xs: 0.85, md: 1 },
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
    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  },
  "& .project-workflow-flow-arrow": {
    display: { xs: "none", md: "inline-flex" },
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
      border: `2px solid ${alpha(theme.palette.secondary.main, 0.42)}`,
      transform: "translateY(-50%)",
    },
  },
});

const workflowFlowArrowSx: SxProps<Theme> = (theme) => ({
  color: alpha(theme.palette.secondary.dark, 0.42),
  flexShrink: 0,
  fontSize: "1rem",
});

const workflowPathsSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1.25, md: 1.35 },
};

const workflowPathRowSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.35, md: 1.5 },
  minWidth: 0,
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.54),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.65)}`,
});

const workflowMetaSx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
  alignContent: "start",
};

const workflowRejoinSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gap: { xs: 1.35, md: 1.5 },
  minWidth: 0,
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.54),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.65)}`,
});

const workflowExplainersSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
  gap: { xs: 1, md: 1.25 },
  alignItems: "start",
  "& > section": {
    display: "grid",
    gap: 1,
    alignContent: "start",
    minWidth: 0,
    p: { xs: 1.35, sm: 1.5 },
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.text.primary, 0.025),
    border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  },
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

const quickStartRunbookSurfaceSx: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5, md: 3 },
  display: "grid",
  gap: { xs: 2.5, md: 3 },
};

const quickStartMainSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1.75, md: 2 },
  minWidth: 0,
};

const quickStartIntroSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.5,
  maxWidth: "50rem",
};

const quickStartStepListSx: SxProps<Theme> = (theme) => ({
  position: { xs: "relative", md: "static" },
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)",
  },
  gap: { xs: 1.25, md: 1.35 },
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
    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  },
});

const quickStartStepRowSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  display: "grid",
  gap: { xs: 1.15, md: 1.2 },
  alignContent: "start",
  minWidth: 0,
  p: { xs: 1.5, sm: 1.65, md: 1.75 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.54),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.65)}`,
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
    border: `2px solid ${alpha(theme.palette.secondary.main, 0.42)}`,
    transform: "translateY(-50%)",
  },
});

const quickStartStepBadgeSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.7rem",
  height: "1.45rem",
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.secondary.main, 0.04),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
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
  gap: 1.25,
};

const quickStartProofListSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
  gap: { xs: 1, md: 1.25 },
};

const quickStartProofItemSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: "1.35rem minmax(0, 1fr)",
  gap: 0.85,
  alignItems: "start",
  minWidth: 0,
  p: { xs: 1.35, sm: 1.5 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.text.primary, 0.025),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
});

const quickStartCheckIconSx: SxProps<Theme> = (theme) => ({
  mt: 0.2,
  color: alpha(theme.palette.secondary.dark, 0.7),
  fontSize: "1rem",
});

const quickStartMeasureCalloutSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 0.88fr) minmax(20rem, 1.12fr)" },
  gap: { xs: 1.5, md: 2.25 },
  alignItems: "start",
  minWidth: 0,
  p: { xs: 1.5, sm: 1.75, md: 2 },
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.secondary.main, 0.035),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.62)}`,
});

const quickStartMeasureCopySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.75,
  minWidth: 0,
};

const quickStartMeasureActionsSx: SxProps<Theme> = {
  display: "grid",
  gap: 1.15,
  minWidth: 0,
};

const quickStartOutputChipSx: SxProps<Theme> = (theme) => ({
  backgroundColor: alpha(theme.palette.text.primary, 0.035),
  borderColor: alpha(theme.palette.text.primary, 0.1),
  color: alpha(theme.palette.text.primary, 0.72),
  fontWeight: 600,
});

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

function WorkflowFoundationFlow({
  nodes,
  ariaLabel,
}: {
  nodes: WorkflowNode[];
  ariaLabel: string;
}) {
  return (
    <Box sx={workflowFoundationNodesSx} aria-label={ariaLabel}>
      {nodes.map((node, index) => (
        <WorkflowNodePill node={node} key={`${node.label}-${index}`} />
      ))}
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
        <React.Fragment key={`${node.label}-${index}`}>
          <WorkflowNodePill node={node} />
          {index < nodes.length - 1 ? (
            <ArrowForwardIcon
              className="project-workflow-flow-arrow"
              aria-hidden="true"
              sx={workflowFlowArrowSx}
            />
          ) : null}
        </React.Fragment>
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

export function ProjectPage() {
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
          {projectContent.overviewCards.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection>
        <SectionHeader
          title={projectContent.workflowSectionTitle}
          copy={projectContent.workflowLead}
        />

        <Paper variant="outlined" sx={workflowSurfaceSx}>
          <Box component="section" sx={workflowFoundationSx}>
            <Box sx={workflowMetaSx}>
              <Typography variant="overline" color="primary">
                {projectContent.workflowFoundation.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {projectContent.workflowFoundation.summary}
              </Typography>
            </Box>
            <WorkflowFoundationFlow
              nodes={projectContent.workflowFoundation.nodes}
              ariaLabel="Foundation workflow"
            />
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

          <Box sx={workflowExplainersSx}>
            {projectContent.workflowExplainers.map((item) => (
              <Box key={item.title} component="section">
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </PageSection>

      <PageSection>
        <SectionHeader title={implementation.title} copy={implementation.lead} />

        <Paper variant="outlined" sx={quickStartRunbookSurfaceSx}>
          <Box component="section" sx={quickStartMainSx}>
            <Box sx={quickStartIntroSx}>
              <Typography variant="overline" color="primary">
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
          </Box>

          <Box component="section" sx={quickStartSupportBlockSx}>
            <Typography variant="overline" color="primary">
              {implementation.verifyProofTitle}
            </Typography>
            <Box sx={quickStartProofListSx}>
              {implementation.verifyProofs.map((item) => (
                <Box key={item.title} sx={quickStartProofItemSx}>
                  <CheckRoundedIcon aria-hidden="true" sx={quickStartCheckIconSx} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
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

          <Box component="section" sx={quickStartMeasureCalloutSx}>
            <Box sx={quickStartMeasureCopySx}>
              <Typography variant="overline" color="primary">
                {implementation.measurement.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {implementation.measurement.body}
              </Typography>
            </Box>

            <Box sx={quickStartMeasureActionsSx}>
              <CommandCodeBlock
                command={implementation.measurement.command}
                ariaLabel={`${implementation.measurement.title} command`}
              />

              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {implementation.measurement.outputs.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    variant="outlined"
                    sx={quickStartOutputChipSx}
                  />
                ))}
              </Stack>

              <ActionLinkRow>
                {implementation.measurement.links.map((link) => (
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
          </Box>
        </Paper>
      </PageSection>
    </PublicSiteLayout>
  );
}
