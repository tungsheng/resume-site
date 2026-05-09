import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export const sansStack =
  '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
export const displayStack =
  '"Iowan Old Style", "Palatino Linotype", Georgia, serif';
export const monoStack =
  '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace';

const ink = "#16231f";
const muted = "#465750";
const accentText = "#007a5e";
const accentLive = "#00a878";
const accentSoft = "#e4f5ec";
const warningWarm = "#a95718";
const warningSoft = "#f5e0cb";
const supportCool = "#276f89";
const paper = "#ffffff";
const surfaceBorder = "#d8ded8";
const surfaceShadow = "0 1px 0 rgba(22, 35, 31, 0.04)";

let theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: ink,
      contrastText: "#ffffff",
    },
    secondary: {
      main: accentText,
      light: accentLive,
      dark: "#005f49",
      contrastText: "#ffffff",
    },
    warning: {
      main: warningWarm,
      light: warningSoft,
      dark: "#743914",
      contrastText: "#ffffff",
    },
    success: {
      main: accentText,
      light: accentSoft,
      dark: "#005f49",
      contrastText: "#ffffff",
    },
    info: {
      main: supportCool,
      light: "#d9edf2",
      dark: "#1f596e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f7f8f5",
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
      fontSize: "4.8rem",
      lineHeight: 1,
      letterSpacing: 0,
      textWrap: "balance",
    },
    h2: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "3.35rem",
      lineHeight: 1,
      letterSpacing: 0,
      textWrap: "balance",
    },
    h3: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "2.42rem",
      lineHeight: 1.06,
      letterSpacing: 0,
      textWrap: "balance",
    },
    h4: {
      fontFamily: displayStack,
      fontWeight: 600,
      fontSize: "1.85rem",
      lineHeight: 1.12,
      letterSpacing: 0,
      textWrap: "balance",
    },
    h5: {
      fontFamily: sansStack,
      fontWeight: 600,
      fontSize: "1.18rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: sansStack,
      fontWeight: 600,
      fontSize: "1.05rem",
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.64,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.58,
    },
    overline: {
      fontSize: "0.74rem",
      lineHeight: 1.35,
      letterSpacing: "0.1em",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.84rem",
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
          background: themeParam.palette.background.default,
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
          backgroundColor: alpha(themeParam.palette.warning.main, 0.2),
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
    MuiChip: {
      styleOverrides: {
        root: ({ theme: themeParam }) => ({
          fontWeight: 600,
          "&.MuiChip-outlined": {
            backgroundColor: alpha(themeParam.palette.secondary.light, 0.075),
            borderColor: alpha(themeParam.palette.secondary.main, 0.3),
          },
          "&.MuiChip-colorWarning.MuiChip-outlined": {
            backgroundColor: alpha(themeParam.palette.warning.light, 0.45),
            borderColor: alpha(themeParam.palette.warning.main, 0.38),
            color: themeParam.palette.warning.dark,
          },
          "&.MuiChip-colorSuccess.MuiChip-outlined": {
            backgroundColor: alpha(themeParam.palette.success.light, 0.08),
            borderColor: alpha(themeParam.palette.success.main, 0.28),
            color: themeParam.palette.success.dark,
          },
        }),
        label: {
          fontWeight: 600,
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
