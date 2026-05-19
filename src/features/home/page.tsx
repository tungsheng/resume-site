import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { EXPERIMENTS_PATH, PROJECTS_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { ActionLinkRow, PageHero, PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Tony Lee | ML Inference Systems Performance Optimization";
const HOME_ROLE = "ML Inference Systems Performance Optimization";
const HOME_LEDE =
  "I optimize GPU serving paths from Kubernetes scheduling to CUDA kernels with reproducible latency, throughput, and cost measurements.";

export function HomePage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="home">
      <PageHero
        align="center"
        contentWidth="48rem"
        variant="home"
        contentSx={{ gap: { xs: 3.25, md: 4.25 } }}
      >
        <Stack
          spacing={{ xs: 2, md: 2.5 }}
          sx={{
            alignItems: "center",
            maxWidth: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: {
                xs: "3.05rem",
                sm: "3.8rem",
                md: "4.8rem",
                lg: "5rem",
              },
              lineHeight: 1.02,
            }}
          >
            {siteProfile.name}
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "secondary.dark",
              fontSize: { xs: "1.05rem", md: "1.22rem" },
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {HOME_ROLE}
          </Typography>
        </Stack>
        <Stack
          spacing={{ xs: 1.75, md: 2.25 }}
          sx={{
            alignItems: "center",
            maxWidth: "40rem",
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "1rem", md: "1.08rem" },
              lineHeight: 1.72,
            }}
          >
            {HOME_LEDE}
          </Typography>
          <ActionLinkRow justifyContent="center">
            <Button href={PROJECTS_PATH} variant="contained">
              View projects
            </Button>
            <Button href={EXPERIMENTS_PATH} variant="outlined">
              View experiments
            </Button>
            <Button href={RESUME_PATH} variant="outlined">
              View resume
            </Button>
          </ActionLinkRow>
        </Stack>
      </PageHero>
    </PublicSiteLayout>
  );
}
