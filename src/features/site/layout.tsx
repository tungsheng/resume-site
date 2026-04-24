import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { EXPERIMENTS_PATH, PROJECT_PATH, RESUME_PATH, siteProfile } from "./content";

export type PublicNavKey = "home" | "project" | "experiments" | "resume";

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Project", href: PROJECT_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: RESUME_PATH },
];

export function PublicSiteHeader({ activeNav }: { activeNav: PublicNavKey }) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: 1.5,
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Link
            href="/"
            underline="none"
            color="inherit"
            aria-label="Tony Lee home"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mr: { md: "auto" },
            }}
          >
            <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
              T│L
            </Typography>
          </Link>

          <Box
            component="nav"
            aria-label="Primary"
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.key}
                  href={item.href}
                  color="inherit"
                  variant={item.key === activeNav ? "outlined" : "text"}
                  aria-current={item.key === activeNav ? "page" : undefined}
                  sx={item.key === activeNav ? { borderColor: "currentColor" } : undefined}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export function PublicSiteFooter() {
  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {siteProfile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ML inference infrastructure
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

interface PublicSiteLayoutProps {
  activeNav: PublicNavKey;
  children: React.ReactNode;
}

export function PublicSiteLayout({
  activeNav,
  children,
}: PublicSiteLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <PublicSiteHeader activeNav={activeNav} />

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        {children}
      </Container>

      <PublicSiteFooter />
    </Box>
  );
}

export function PageHero({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mb: { xs: 4, md: 6 } }}>
      <Stack
        spacing={2}
        sx={{
          alignItems: align === "center" ? "center" : "flex-start",
          textAlign: align,
        }}
      >
        {children}
      </Stack>
    </Paper>
  );
}

export function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <Box component="section" sx={{ mb: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>{children}</Stack>
    </Box>
  );
}

export function SectionHeader({
  title,
  eyebrow,
  copy,
}: {
  title: string;
  eyebrow?: string;
  copy?: string;
}) {
  return (
    <Stack spacing={1}>
      {eyebrow ? (
        <Typography variant="overline" color="primary">
          {eyebrow}
        </Typography>
      ) : null}
      <Typography component="h2" variant="h4">
        {title}
      </Typography>
      {copy ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "56rem" }}>
          {copy}
        </Typography>
      ) : null}
    </Stack>
  );
}

export function ActionLinkRow({
  children,
  justifyContent = "flex-start",
}: {
  children: React.ReactNode;
  justifyContent?: React.CSSProperties["justifyContent"];
}) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ flexWrap: "wrap", justifyContent }}
    >
      {children}
    </Stack>
  );
}
