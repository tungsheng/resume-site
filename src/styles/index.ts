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
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    fontSize: "9pt",
    lineHeight: 1.36,
    color: "#1f2937",
  },
  header: {
    padding: "0.3in 0.48in 0.12in",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.21in",
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    display: "grid",
    rowGap: 6,
  },
  headerSubtitle: {
    margin: 0,
    fontSize: "9.8pt",
    letterSpacing: 0.14,
    color: "#3f3b37",
    fontWeight: 500,
    lineHeight: 1.24,
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  },
  name: {
    fontSize: "25.2pt",
    fontWeight: 500,
    letterSpacing: 0.28,
    lineHeight: 1.02,
    textTransform: "none",
    color: "#8c6239",
    margin: 0,
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  },
  contact: {
    minWidth: "2.12in",
    maxWidth: "2.28in",
    paddingTop: 4,
    display: "grid",
    rowGap: 5,
    textAlign: "right",
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  },
  contactRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "baseline",
    gap: 8,
  },
  contactRowIcon: {
    gap: 6,
    alignItems: "center",
  },
  contactLabel: {
    fontSize: "7pt",
    textTransform: "uppercase",
    letterSpacing: 0.92,
    color: "#6b7280",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  contactValue: {
    fontSize: "8.5pt",
    color: "#1f2937",
    maxWidth: "1.95in",
    lineHeight: 1.28,
    wordBreak: "break-word",
  },
  contactLink: {
    fontSize: "8.5pt",
    color: "#1f2937",
    maxWidth: "1.95in",
    lineHeight: 1.28,
    textAlign: "right",
    wordBreak: "break-word",
    textDecoration: "none",
  },
  contactIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    width: 11,
    height: 11,
    lineHeight: 0,
    flexShrink: 0,
  },
  headerDivider: {
    marginTop: 12,
    borderTop: "1px solid",
  },
  link: { color: "#1f2937", textDecoration: "none" },
  body: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    padding: "0.17in 0.48in",
    gap: "0.17in",
  },
  singleColumnFlow: {
    width: "100%",
  },
  sidebar: {
    width: "1.85in",
    flexShrink: 0,
    order: 0,
  },
  main: {
    flex: 1,
    order: 0,
  },
  section: {
    marginBottom: "0.22in",
    breakInside: "avoid",
  },
  sectionTitle: {
    fontSize: "9.4pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.15,
    color: "#1f2937",
    marginBottom: 9,
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  },
  eduItem: { marginBottom: 9 },
  eduLine: {
    marginBottom: 6,
    fontSize: "8.6pt",
    lineHeight: 1.35,
    color: "#374151",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  eduDegree: { fontWeight: 600, fontSize: "9.6pt", color: "#4b5563" },
  eduSchool: { fontSize: "8.1pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  eduDate: { fontSize: "7.7pt", color: "#4b5563", fontStyle: "italic", letterSpacing: 0.18 },
  skills: { fontSize: "8.6pt", lineHeight: 1.35 },
  skillCat: { marginBottom: 7 },
  skillLine: {
    marginBottom: 6,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "8.6pt",
    lineHeight: 1.35,
  },
  skillTitle: {
    fontWeight: 600,
    fontSize: "8.1pt",
    color: "#4b5563",
    marginBottom: 2,
    letterSpacing: 0.22,
  },
  skillCategoryInline: {
    display: "inline",
    fontWeight: 600,
    fontSize: "8.1pt",
    color: "#4b5563",
    letterSpacing: 0.22,
    marginBottom: 0,
  },
  skillItems: { color: "#374151" },
  certItem: { marginBottom: 7 },
  certTitle: { fontWeight: 600, fontSize: "9.6pt", color: "#1f2937" },
  certIssuer: { fontSize: "8.1pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  certDate: { fontSize: "7.7pt", color: "#6b7280", fontStyle: "italic", letterSpacing: 0.18 },
  summary: {
    fontSize: "8.7pt",
    lineHeight: 1.38,
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
  expItem: { marginBottom: "0.11in", position: "relative" },
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
    gap: 10,
    marginBottom: 3,
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
  expTitle: { fontWeight: 600, fontSize: "9.6pt", color: "#4b5563" },
  expSeparator: { color: "#9ca3af", fontSize: "8.2pt" },
  expDate: {
    fontSize: "7.7pt",
    color: "#4b5563",
    fontStyle: "italic",
    letterSpacing: 0.18,
    whiteSpace: "nowrap",
    minWidth: "1.12in",
    textAlign: "right",
    marginLeft: 8,
  },
  expCompany: { fontSize: "8.1pt", color: "#4b5563", fontWeight: 600, letterSpacing: 0.22 },
  expHighlights: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    rowGap: 2,
    fontSize: "8.6pt",
    lineHeight: 1.33,
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
    header: { padding: "0.27in 0.46in 0.1in" },
    body: {
      display: "flex",
      flexDirection: "column",
      padding: "0.16in 0.46in",
      gap: "0.14in",
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
    name: { fontSize: "24pt", letterSpacing: 0.26 },
    main: { order: 1 },
    section: { marginBottom: "0.2in" },
    contact: { minWidth: "2in", maxWidth: "2.18in" },
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
    expItem: { marginBottom: "0.13in", position: "relative", paddingLeft: 22 },
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
