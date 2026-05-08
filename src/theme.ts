import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export const sansStack =
  '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
export const displayStack =
  '"Iowan Old Style", "Palatino Linotype", Georgia, serif';
export const monoStack =
  '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace';

const ink = "#16222d";
const muted = "#54616b";
const accentText = "#92530f";
const accentLive = "#d27a24";
const accentSoft = "#f3dfc8";
const supportCool = "#2f6f73";
const paper = "rgba(255, 255, 255, 0.82)";
const surfaceBorder = alpha(ink, 0.075);
const surfaceShadow = "0 14px 40px rgba(22, 34, 45, 0.05)";

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
      dark: "#70400c",
      contrastText: "#ffffff",
    },
    warning: {
      main: accentLive,
      light: accentSoft,
      dark: accentText,
      contrastText: ink,
    },
    info: {
      main: supportCool,
      light: "#d6e7e5",
      dark: "#245a5d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f7f3ec",
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
          background: `linear-gradient(180deg, #fdfaf5 0%, ${themeParam.palette.background.default} 48%, #f4eee3 100%)`,
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
