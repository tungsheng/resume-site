import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
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
import { EXPERIMENTS_PATH, PROJECT_PATH, RESUME_PATH, siteProfile } from "./content";
import { monoStack } from "../../theme";

export type PublicNavKey = "home" | "project" | "experiments" | "resume";

const NAV_ITEMS: Array<{ key: PublicNavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "project", label: "Project", href: PROJECT_PATH },
  { key: "experiments", label: "Experiments", href: EXPERIMENTS_PATH },
  { key: "resume", label: "Resume", href: RESUME_PATH },
];

function getNavButtonStyles(theme: Theme, active: boolean) {
  return {
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    bgcolor: active ? alpha(theme.palette.warning.main, 0.06) : "transparent",
    borderColor: active ? alpha(theme.palette.warning.main, 0.18) : "transparent",
    flexShrink: 0,
    minHeight: 40,
    minWidth: "auto",
    px: { xs: 1.25, sm: 1.5 },
    "&:hover": {
      color: theme.palette.text.primary,
      bgcolor: active
        ? alpha(theme.palette.warning.main, 0.09)
        : alpha(theme.palette.text.primary, 0.04),
      borderColor: active
        ? alpha(theme.palette.warning.main, 0.24)
        : alpha(theme.palette.text.primary, 0.08),
    },
  };
}

function getNavButtonSx(active: boolean): SxProps<Theme> {
  return (theme) => getNavButtonStyles(theme, active);
}

function mergeSx(base: SxProps<Theme>, extra?: SxProps<Theme>): SxProps<Theme> {
  if (!extra) {
    return base;
  }

  return (Array.isArray(extra) ? [base, ...extra] : [base, extra]) as SxProps<Theme>;
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
        backdropFilter: "blur(18px)",
        backgroundColor: alpha(theme.palette.background.default, 0.82),
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: { xs: 1, md: 1.75 },
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
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                fontWeight: 600,
                letterSpacing: "-0.08em",
                lineHeight: 1,
              }}
            >
              T│L
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
                  sx={getNavButtonSx(item.key === activeNav)}
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
        bgcolor: "transparent",
      }}
    >
      <PublicSiteHeader activeNav={activeNav} />

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 3, md: 4 } }}>
        {children}
      </Container>

      <PublicSiteFooter />
    </Box>
  );
}

interface PageHeroProps {
  children: React.ReactNode;
  align?: "left" | "center";
  contentWidth?: React.CSSProperties["maxWidth"];
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

export function PageHero({
  children,
  align = "left",
  contentWidth = "58rem",
  sx,
  contentSx,
}: PageHeroProps) {
  const heroBaseSx: SxProps<Theme> = {
    p: { xs: 3, md: 4 },
    mb: { xs: 3, md: 4 },
    backgroundColor: "background.paper",
    overflow: "hidden",
    position: "relative",
  };
  const contentBaseSx: SxProps<Theme> = {
    maxWidth: contentWidth,
    alignItems: align === "center" ? "center" : "flex-start",
    textAlign: align,
    ...(align === "center" ? { mx: "auto" } : {}),
  };
  const heroSx = mergeSx(heroBaseSx, sx);
  const heroContentSx = mergeSx(contentBaseSx, contentSx);

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
    <Box component="section" sx={{ mb: { xs: 4, md: 5 } }}>
      <Stack spacing={3.5}>{children}</Stack>
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
        <Typography variant="overline" sx={{ color: "secondary.main" }}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography component="h2" variant="h3">
        {title}
      </Typography>
      {copy ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "46rem" }}>
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
