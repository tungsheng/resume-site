// Shared style constants

import type React from "react";
import {
  DEFAULT_RESUME_TEMPLATE,
  type ResumeLayoutTemplate,
} from "../layouts";

export const colors = {
  primary: "#e94560",
  primaryHover: "#ff6b6b",
  dark: "#1a1a2e",
  darkBlue: "#16213e",
  inputBg: "#0f3460",
  text: "#fff",
  textMuted: "#a0a0a0",
  themeColor: "#c9a86c",
};

export const COLOR_PRESETS = [
  { color: "#c9a86c", title: "Gold" },
  { color: "#2c3e50", title: "Navy" },
  { color: "#27ae60", title: "Green" },
  { color: "#e74c3c", title: "Red" },
  { color: "#9b59b6", title: "Purple" },
  { color: "#3498db", title: "Blue" },
];

export const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export const buttonStyles: Record<string, React.CSSProperties> = {
  btn: {
    background: colors.primary,
    color: colors.text,
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  btnSecondary: {
    background: "transparent",
    color: colors.text,
    border: `1px solid ${colors.primary}`,
    padding: "8px 16px",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

const baseResumeStyles: Record<string, React.CSSProperties> = {
  page: {
    width: "8.5in",
    minHeight: "11in",
    margin: "20px auto",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Aptos', 'Calibri', 'Arial', sans-serif",
    fontSize: "8.45pt",
    lineHeight: 1.32,
    color: "#1f2937",
  },
  header: {
    padding: "0.35in 0.54in 0.21in",
    borderBottom: "2px solid",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: "22.4pt",
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "none",
    color: "#222",
    marginBottom: 8,
    fontFamily: "'Aptos Display', 'Calibri', 'Arial', sans-serif",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  badge: {
    color: "white",
    padding: "3px 11px",
    borderRadius: 999,
    fontSize: "7.2pt",
    fontFamily: "'Aptos', 'Calibri', 'Arial', sans-serif",
  },
  contact: {
    textAlign: "right",
    fontSize: "8.1pt",
    lineHeight: 1.4,
    fontFamily: "'Aptos', 'Calibri', 'Arial', sans-serif",
  },
  link: {
    color: "#333",
    textDecoration: "none",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    padding: "0.24in 0.54in",
    gap: "0.22in",
  },
  singleColumnFlow: {
    width: "100%",
  },
  sidebar: {
    width: "1.9in",
    flexShrink: 0,
    order: 0,
  },
  main: {
    flex: 1,
    order: 0,
  },
  section: {
    marginBottom: "0.15in",
    breakInside: "avoid",
  },
  sectionTitle: {
    fontSize: "7.65pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.15,
    color: "#1f2937",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1px solid",
    fontFamily: "'Aptos', 'Calibri', 'Arial', sans-serif",
  },
  eduItem: { marginBottom: 10 },
  eduLine: {
    marginBottom: 6,
    fontSize: "8.1pt",
    lineHeight: 1.3,
    color: "#374151",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  eduDegree: { fontWeight: 600, fontSize: "8.9pt", color: "#1f2937" },
  eduSchool: { fontSize: "7.55pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  eduDate: { fontSize: "7.2pt", color: "#6b7280", fontStyle: "italic", letterSpacing: 0.18 },
  skills: { fontSize: "8.1pt", lineHeight: 1.32 },
  skillCat: { marginBottom: 8 },
  skillLine: {
    marginBottom: 6,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "8.1pt",
    lineHeight: 1.3,
  },
  skillTitle: {
    fontWeight: 600,
    fontSize: "7.55pt",
    color: "#4b5563",
    marginBottom: 2,
    letterSpacing: 0.22,
  },
  skillCategoryInline: {
    display: "inline",
    fontWeight: 600,
    fontSize: "7.55pt",
    color: "#4b5563",
    letterSpacing: 0.22,
    marginBottom: 0,
  },
  skillItems: { color: "#374151" },
  certItem: { marginBottom: 9 },
  certTitle: { fontWeight: 600, fontSize: "8.9pt", color: "#1f2937" },
  certIssuer: { fontSize: "7.55pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  certDate: { fontSize: "7.2pt", color: "#6b7280", fontStyle: "italic", letterSpacing: 0.18 },
  summary: {
    fontSize: "8.2pt",
    lineHeight: 1.33,
    textAlign: "left",
    color: "#374151",
    margin: 0,
  },
  expList: {
    position: "relative",
  },
  expRail: {
    display: "none",
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 5,
    width: 2,
    background: "#a8b8cc",
  },
  expItem: { marginBottom: "0.12in", position: "relative" },
  expDot: {
    display: "none",
    position: "absolute",
    left: 1,
    top: 3,
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "2px solid #c9a86c",
    background: "#fff",
  },
  expContent: {
    minWidth: 0,
  },
  expHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 2,
  },
  expMeta: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 4,
    flex: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  expTitle: { fontWeight: 600, fontSize: "8.9pt", color: "#1f2937" },
  expSeparator: { color: "#9ca3af", fontSize: "7.8pt" },
  expDate: {
    fontSize: "7.2pt",
    color: "#6b7280",
    fontStyle: "italic",
    letterSpacing: 0.18,
    whiteSpace: "nowrap",
    minWidth: "1.12in",
    textAlign: "right",
    marginLeft: 8,
  },
  expCompany: { fontSize: "7.55pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  expHighlights: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    rowGap: 2,
    fontSize: "8.1pt",
    lineHeight: 1.3,
    color: "#374151",
  },
};

type ResumeStyleMap = Record<string, React.CSSProperties>;
type ResumeStyleOverrides = Record<string, React.CSSProperties>;

const templateResumeStyleOverrides: Record<
  ResumeLayoutTemplate,
  ResumeStyleOverrides
> = {
  "single-column-ats": {
    header: { padding: "0.34in 0.52in 0.18in" },
    body: {
      display: "flex",
      flexDirection: "column",
      padding: "0.22in 0.52in",
      gap: "0.18in",
    },
    singleColumnFlow: { width: "100%" },
    sidebar: {
      width: "auto",
      order: 2,
      display: "block",
      columnGap: 0,
      rowGap: 0,
      flexShrink: 1,
    },
    main: { order: 1 },
    section: { marginBottom: "0.14in" },
    expDate: { minWidth: "auto", textAlign: "left", marginLeft: 8 },
  },
  "minimal-timeline": {
    expList: { position: "relative", paddingLeft: 0 },
    expRail: {
      display: "block",
      left: 5,
      top: 8,
      bottom: 8,
      width: 2,
      background: "#a8b8cc",
    },
    expItem: { marginBottom: "0.12in", position: "relative", paddingLeft: 22 },
    expDot: {
      display: "block",
      left: 1,
      top: 3,
      width: 10,
      height: 10,
      borderRadius: "50%",
      border: "2px solid #c9a86c",
      background: "#fff",
    },
  },
};

export function getResumeStyles(
  layoutTemplate: ResumeLayoutTemplate = DEFAULT_RESUME_TEMPLATE
): ResumeStyleMap {
  const overrides =
    templateResumeStyleOverrides[layoutTemplate] ??
    templateResumeStyleOverrides[DEFAULT_RESUME_TEMPLATE];

  const merged: ResumeStyleMap = {};
  const keys = Object.keys(baseResumeStyles);
  for (const key of keys) {
    merged[key] = {
      ...baseResumeStyles[key],
      ...((overrides[key] ?? {}) as React.CSSProperties),
    };
  }

  return merged;
}

export const resumeStyles = getResumeStyles();
