import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PROJECT_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { ActionLinkRow, PageHero, PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Tony Lee | ML Inference Infrastructure Engineer";
const HOME_ROLE = "ML Inference Infrastructure Engineer";
const HOME_LEDE =
  "I design GPU-backed inference systems on Kubernetes, focused on scaling, latency, and cost under real workloads.";
const HOME_PROOF_POINTS = [
  {
    value: "1.10-1.15 req/s",
    label: "long-context knee",
  },
  {
    value: "7.41 req/s",
    label: "scheduler baseline",
  },
  {
    value: "1.37s vs 149ms",
    label: "p95 TTFT split",
  },
];

function HomeProofStrip() {
  return (
    <Box
      aria-label="Selected inference proof points"
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(3, minmax(0, 1fr))",
        },
        gap: 0.75,
        width: "100%",
        maxWidth: "42rem",
        p: 0.75,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.common.white, 0.58),
        border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
      })}
    >
      {HOME_PROOF_POINTS.map((point) => (
        <Box
          key={point.label}
          sx={(theme) => ({
            display: "grid",
            alignContent: "center",
            gap: 0.25,
            minWidth: 0,
            minHeight: "4.7rem",
            px: { xs: 1.15, sm: 1.25 },
            py: 0.95,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.common.white, 0.5),
            border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          })}
        >
          <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
            {point.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {point.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function HomePage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="home">
      <PageHero
        align="center"
        contentWidth="48rem"
        contentSx={{ gap: { xs: 5, md: 6.5 } }}
        sx={{
          py: { xs: 8.5, md: 11 },
          px: { xs: 3, md: 6 },
          minHeight: { md: "clamp(540px, 66vh, 720px)" },
          display: "grid",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={{ xs: 2.5, md: 3.25 }}
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
                xs: "clamp(3.2rem, 15vw, 4.5rem)",
                md: "clamp(4.5rem, 7vw, 6.5rem)",
              },
              lineHeight: 1,
            }}
          >
            {siteProfile.name}
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "secondary.main",
              fontSize: { xs: "1.16rem", md: "1.4rem" },
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {HOME_ROLE}
          </Typography>
        </Stack>
        <Stack
          spacing={{ xs: 2, md: 2.5 }}
          sx={{
            alignItems: "center",
            maxWidth: "40rem",
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "1.04rem", md: "1.16rem" },
              lineHeight: 1.8,
            }}
          >
            {HOME_LEDE}
          </Typography>
          <HomeProofStrip />
          <ActionLinkRow justifyContent="center">
            <Button href={PROJECT_PATH} variant="text">
              View project
            </Button>
            <Button href={RESUME_PATH} variant="text">
              View resume
            </Button>
          </ActionLinkRow>
        </Stack>
      </PageHero>
    </PublicSiteLayout>
  );
}
