import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
      <PageHero
        align="center"
        sx={(theme) => ({
          py: { xs: 5.5, md: 8 },
          px: { xs: 2.5, md: 6 },
          minHeight: { md: "clamp(420px, 52vh, 620px)" },
          display: "grid",
          alignItems: "center",
          backgroundImage: `radial-gradient(circle at 50% 35%, ${alpha(theme.palette.warning.main, 0.18)}, transparent 35%), linear-gradient(145deg, rgba(255, 252, 247, 0.98), rgba(246, 238, 224, 0.92))`,
          boxShadow: "0 20px 60px rgba(30, 41, 47, 0.12)",
        })}
        contentSx={{ maxWidth: "56rem", mx: "auto" }}
      >
        <Box
          sx={{
            display: "grid",
            justifyItems: "center",
            gap: { xs: 0.25, md: 0.5 },
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="overline" sx={{ color: "secondary.main", mb: 0 }}>
            I&apos;m
          </Typography>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: {
                xs: "clamp(3.25rem, 17vw, 4.4rem)",
                md: "clamp(4rem, 9vw, 7rem)",
              },
              lineHeight: 0.95,
            }}
          >
            {siteProfile.name}
          </Typography>
        </Box>
        <Typography
          component="p"
          sx={{
            color: "secondary.main",
            fontSize: {
              xs: "clamp(1.25rem, 6.5vw, 1.5rem)",
              md: "clamp(1.3rem, 2.4vw, 2rem)",
            },
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: "-0.03em",
            maxWidth: { xs: "18rem", md: "none" },
            mt: { xs: 3, md: "5rem" },
          }}
        >
          {HOME_SUBTITLE}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "38rem" }}>
          {HOME_LEDE}
        </Typography>
      </PageHero>
    </PublicSiteLayout>
  );
}
