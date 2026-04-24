import React from "react";
import { Typography } from "@mui/material";
import { siteProfile } from "../site/content";
import { PageHero, PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Tony Lee | ML Inference & Distributed Systems";
const HOME_SUBTITLE = "ML inference, built to scale.";
const HOME_LEDE =
  "I build GPU serving platforms that turn traffic into measurable capacity.";

export function HomePage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="home">
      <PageHero align="center">
        <Typography variant="overline" color="primary">
          I&apos;m
        </Typography>
        <Typography component="h1" variant="h2">
          {siteProfile.name}
        </Typography>
        <Typography variant="h5">{HOME_SUBTITLE}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "40rem" }}>
          {HOME_LEDE}
        </Typography>
      </PageHero>
    </PublicSiteLayout>
  );
}
