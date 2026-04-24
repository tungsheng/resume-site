import React from "react";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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

function WorkflowNodeCard({ node }: { node: WorkflowNode }) {
  const href = "href" in node ? node.href : undefined;
  const linkLabel =
    "linkLabel" in node && node.linkLabel ? node.linkLabel : "Code";

  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, minWidth: { xs: "100%", sm: 180 }, maxWidth: 240 }}
    >
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {node.label}
        </Typography>
        {href ? (
          <Button
            href={href}
            target="_blank"
            rel="noreferrer"
            size="small"
            endIcon={<OpenInNewRoundedIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {linkLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
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
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ flexWrap: "wrap", alignItems: "center" }}
      aria-label={ariaLabel}
    >
      {nodes.map((node, index) => (
        <React.Fragment key={`${node.label}-${index}`}>
          <WorkflowNodeCard node={node} />
          {index < nodes.length - 1 ? (
            <NavigateNextRoundedIcon color="action" aria-hidden="true" />
          ) : null}
        </React.Fragment>
      ))}
    </Stack>
  );
}

function WorkflowPathRow({ title, summary, nodes }: WorkflowTrack) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {summary}
            </Typography>
          </div>
          <WorkflowFlow nodes={nodes} ariaLabel={`${title} workflow`} />
        </Stack>
      </CardContent>
    </Card>
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

        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <div>
                    <Typography variant="h6" gutterBottom>
                      {projectContent.workflowFoundation.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {projectContent.workflowFoundation.summary}
                    </Typography>
                  </div>
                  <WorkflowFlow
                    nodes={projectContent.workflowFoundation.nodes}
                    ariaLabel="Foundation workflow"
                  />
                </Stack>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              {projectContent.workflowPaths.map((path) => (
                <Grid key={path.title} size={{ xs: 12, md: 6 }}>
                  <WorkflowPathRow
                    title={path.title}
                    summary={path.summary}
                    nodes={path.nodes}
                  />
                </Grid>
              ))}
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <div>
                    <Typography variant="overline" color="primary">
                      Rejoin point
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {projectContent.workflowRejoin.body}
                    </Typography>
                  </div>
                  <WorkflowFlow
                    nodes={projectContent.workflowRejoin.nodes}
                    ariaLabel="Rejoin workflow"
                  />
                </Stack>
              </CardContent>
            </Card>

            <Grid container spacing={2}>
              {projectContent.workflowExplainers.map((item) => (
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
          </Stack>
        </Paper>
      </PageSection>

      <PageSection>
        <SectionHeader title={implementation.title} copy={implementation.lead} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Stack spacing={2.5}>
                <div>
                  <Typography variant="overline" color="primary">
                    {implementation.defaultPathTitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {implementation.defaultPathLead}
                  </Typography>
                </div>

                <Grid container spacing={2}>
                  {implementation.defaultPathSteps.map((item, index) => (
                    <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Chip
                              label={`Step ${index + 1}`}
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            />
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography component="code" variant="body2">
                              {item.command}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.body}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <Typography variant="overline" color="primary">
                    {implementation.verifyProofTitle}
                  </Typography>
                  {implementation.verifyProofs.map((item) => (
                    <Card key={item.title} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.body}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <div>
                    <Typography variant="overline" color="primary">
                      {implementation.measurement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {implementation.measurement.body}
                    </Typography>
                  </div>

                  <Typography component="code" variant="body2">
                    {implementation.measurement.command}
                  </Typography>

                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    {implementation.measurement.outputs.map((item) => (
                      <Chip key={item} label={item} />
                    ))}
                  </Stack>

                  <ActionLinkRow>
                    {implementation.measurement.links.map((link) => (
                      <Button
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        endIcon={<OpenInNewRoundedIcon />}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </ActionLinkRow>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </PageSection>
    </PublicSiteLayout>
  );
}
