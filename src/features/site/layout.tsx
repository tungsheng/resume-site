import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { EXPERIMENTS_PATH, PROJECTS_PATH, RESUME_PATH, siteProfile } from "./content";
import { composeSx } from "./styles";
import { monoStack } from "../../theme";

export type PublicNavKey = "home" | "project" | "experiments" | "resume";

export type SiteBreadcrumbItem = {
  label: string;
  href?: string;
};

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Projects", href: PROJECTS_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: RESUME_PATH },
];

function getNavButtonStyles(theme: Theme, active: boolean) {
  return {
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    bgcolor: active ? alpha(theme.palette.secondary.light, 0.055) : "transparent",
    borderColor: active ? alpha(theme.palette.secondary.light, 0.2) : "transparent",
    flexShrink: 0,
    minHeight: 38,
    minWidth: "auto",
    px: { xs: 1.25, sm: 1.5 },
    fontWeight: active ? 600 : 500,
    "&:hover": {
      color: theme.palette.text.primary,
      bgcolor: active
        ? alpha(theme.palette.secondary.light, 0.075)
        : alpha(theme.palette.text.primary, 0.04),
      borderColor: active
        ? alpha(theme.palette.secondary.light, 0.26)
        : alpha(theme.palette.text.primary, 0.08),
    },
  };
}

export function PublicSiteHeader({ activeNav }: { activeNav: PublicNavKey }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={(theme) => ({
        top: 0,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
      })}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: { xs: 0.8, md: 1.35 },
            gap: { xs: 1, md: 2.5 },
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            underline="none"
            color="text.primary"
            aria-label="Tony Lee home"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 40, md: 44 },
              height: { xs: 40, md: 44 },
              minWidth: { xs: 40, md: 44 },
              mr: "auto",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: monoStack,
                fontSize: { xs: "1.05rem", md: "1.28rem" },
                fontWeight: 650,
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              TL
            </Typography>
          </Link>

          <Box
            component="nav"
            aria-label="Primary"
            sx={{
              display: { xs: "none", sm: "block" },
              overflowX: "visible",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.key}
                  href={item.href}
                  variant={item.key === activeNav ? "outlined" : "text"}
                  size="small"
                  aria-current={item.key === activeNav ? "page" : undefined}
                  sx={(theme) => getNavButtonStyles(theme, item.key === activeNav)}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <IconButton
            type="button"
            color="inherit"
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setMobileNavOpen((open) => !open)}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              flexShrink: 0,
              height: 40,
              width: 40,
            }}
          >
            {mobileNavOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </Toolbar>

        <Collapse in={mobileNavOpen} mountOnEnter unmountOnExit>
          <Box
            id="mobile-primary-navigation"
            component="nav"
            aria-label="Primary"
            sx={{ display: { xs: "block", sm: "none" }, pb: 1.5 }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.key}
                  href={item.href}
                  variant={item.key === activeNav ? "outlined" : "text"}
                  size="small"
                  aria-current={item.key === activeNav ? "page" : undefined}
                  onClick={() => setMobileNavOpen(false)}
                  sx={(theme) => ({
                    ...getNavButtonStyles(theme, item.key === activeNav),
                    justifyContent: "center",
                    width: "100%",
                  })}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
}

export function PublicSiteFooter() {
  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2.5, md: 3.5 },
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
            {siteProfile.name}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
          />
          <Typography variant="caption" color="text.secondary">
            ML Inference Performance Engineering
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function SiteBreadcrumbs({ items }: { items: SiteBreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs
      aria-label="Breadcrumb"
      sx={{
        mb: { xs: 1.5, md: 2 },
        color: "text.secondary",
        fontSize: "0.86rem",
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "wrap",
          rowGap: 0.35,
        },
        "& .MuiBreadcrumbs-separator": {
          mx: 0.75,
        },
      }}
    >
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1 || !item.href;

        return isCurrent ? (
          <Typography
            key={`${item.label}-${index}`}
            color="text.primary"
            aria-current="page"
            sx={{
              fontSize: "inherit",
              fontWeight: 650,
              lineHeight: 1.4,
            }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            underline="hover"
            color="text.secondary"
            sx={{
              fontSize: "inherit",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export function PublicSiteLayout({
  activeNav,
  breadcrumbs = [],
  children,
}: {
  activeNav: PublicNavKey;
  breadcrumbs?: SiteBreadcrumbItem[];
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent",
      }}
    >
      <PublicSiteHeader activeNav={activeNav} />

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 3, md: 4 } }}>
        <SiteBreadcrumbs items={breadcrumbs} />
        {children}
      </Container>

      <PublicSiteFooter />
    </Box>
  );
}

export function PageHero({
  children,
  align = "left",
  contentWidth = "58rem",
  variant = "default",
  sx,
  contentSx,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  contentWidth?: React.CSSProperties["maxWidth"];
  variant?: "default" | "home" | "compact";
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}) {
  const heroBaseSx: SxProps<Theme> = {
    p: { xs: 2.25, sm: 2.75, md: 3 },
    mb: { xs: 3, md: 3.5 },
    backgroundColor: "background.paper",
    overflow: "hidden",
    position: "relative",
  };
  const heroVariantSx: SxProps<Theme> =
    variant === "home"
      ? {
          py: { xs: 6.5, sm: 7.5, md: 9 },
          px: { xs: 2.5, md: 5 },
          minHeight: {
            xs: "clamp(400px, calc(100svh - 260px), 560px)",
            md: "clamp(460px, 58vh, 580px)",
          },
          display: "grid",
          alignItems: "center",
        }
      : variant === "compact"
        ? {
            p: { xs: 2.25, md: 3 },
          }
        : {};
  const contentBaseSx: SxProps<Theme> = {
    maxWidth: contentWidth,
    alignItems: align === "center" ? "center" : "flex-start",
    textAlign: align,
    ...(align === "center" ? { mx: "auto" } : {}),
  };
  const heroSx = composeSx(heroBaseSx, heroVariantSx, sx);
  const heroContentSx = composeSx(contentBaseSx, contentSx);

  return (
    <Paper
      variant="outlined"
      sx={heroSx}
    >
      <Stack
        spacing={2}
        sx={heroContentSx}
      >
        {children}
      </Stack>
    </Paper>
  );
}

export function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <Box component="section" sx={{ mb: { xs: 3.5, md: 4.25 } }}>
      <Stack spacing={{ xs: 2.5, md: 3 }}>{children}</Stack>
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
    <Stack spacing={1.25}>
      {eyebrow ? (
        <Typography variant="overline" sx={{ color: "secondary.dark" }}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography component="h2" variant="h4">
        {title}
      </Typography>
      {copy ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "44rem" }}>
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
      sx={{
        flexWrap: "wrap",
        rowGap: 1,
        justifyContent,
        "& .MuiButton-root": {
          minHeight: 40,
        },
      }}
    >
      {children}
    </Stack>
  );
}
