import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export const sansStack =
  '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
export const displayStack =
  '"Iowan Old Style", "Palatino Linotype", Georgia, serif';
export const monoStack =
  '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace';

const ink = "#16222d";
const muted = "#54616b";
const accent = "#ad7b3a";
const accentDeep = "#88581d";
const paper = "rgba(255, 252, 247, 0.94)";
const surfaceBorder = alpha(ink, 0.08);
const surfaceShadow = "0 20px 60px rgba(30, 41, 47, 0.08)";

let theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: ink,
      contrastText: "#ffffff",
    },
    secondary: {
      main: accentDeep,
      light: accent,
      dark: "#6d4513",
      contrastText: "#ffffff",
    },
    warning: {
      main: accent,
      light: "#c99b65",
      dark: accentDeep,
      contrastText: ink,
    },
    background: {
      default: "#f8f4ec",
      paper,
    },
    text: {
      primary: ink,
      secondary: muted,
    },
    divider: surfaceBorder,
  },
  typography: {
    fontFamily: sansStack,
    h1: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "clamp(3.25rem, 8vw, 5.75rem)",
      lineHeight: 0.98,
      letterSpacing: "-0.03em",
      textWrap: "balance",
    },
    h2: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
      lineHeight: 0.98,
      letterSpacing: "-0.03em",
      textWrap: "balance",
    },
    h3: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
      lineHeight: 1.02,
      letterSpacing: "-0.03em",
      textWrap: "balance",
    },
    h4: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "clamp(1.55rem, 2.5vw, 2.1rem)",
      lineHeight: 1.08,
      letterSpacing: "-0.02em",
      textWrap: "balance",
    },
    h5: {
      fontFamily: sansStack,
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: sansStack,
      fontWeight: 600,
      fontSize: "1.05rem",
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.68,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    overline: {
      fontSize: "0.78rem",
      lineHeight: 1.35,
      letterSpacing: "0.14em",
      fontWeight: 700,
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.88rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          margin: 0,
          background: `radial-gradient(circle at top right, ${alpha(accent, 0.16)}, transparent 28%), linear-gradient(180deg, #fbf8f2 0%, ${themeParam.palette.background.default} 50%, #ece3d4 100%)`,
          color: themeParam.palette.text.primary,
          fontFamily: themeParam.typography.fontFamily,
        },
        "#root": {
          minHeight: "100vh",
        },
        a: {
          color: "inherit",
        },
        "code, pre": {
          maxWidth: "100%",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        },
        code: {
          fontFamily: monoStack,
        },
        pre: {
          overflowX: "auto",
        },
        "::selection": {
          backgroundColor: alpha(themeParam.palette.warning.main, 0.22),
        },
      }),
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: {
          borderColor: surfaceBorder,
          boxShadow: surfaceShadow,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderColor: surfaceBorder,
          boxShadow: surfaceShadow,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: surfaceBorder,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          textTransform: "none",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme, { disableAlign: true });

export { theme };
