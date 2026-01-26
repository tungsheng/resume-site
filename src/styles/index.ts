// Shared style constants

import type React from "react";

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

export const resumeStyles: Record<string, React.CSSProperties> = {
  page: {
    width: "8.5in",
    minHeight: "11in",
    margin: "20px auto",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: "10pt",
    lineHeight: 1.4,
    color: "#333",
  },
  header: {
    padding: "0.5in 0.6in 0.3in",
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
    fontSize: "36pt",
    fontWeight: "normal",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#222",
    marginBottom: 8,
  },
  badges: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    color: "white",
    padding: "3px 10px",
    fontSize: "8pt",
    fontFamily: "'Helvetica', 'Arial', sans-serif",
  },
  contact: {
    textAlign: "right",
    fontSize: "9pt",
    lineHeight: 1.6,
    fontFamily: "'Helvetica', 'Arial', sans-serif",
  },
  link: {
    color: "#333",
    textDecoration: "none",
  },
  body: {
    display: "flex",
    padding: "0.4in 0.6in",
    gap: "0.4in",
  },
  sidebar: {
    width: "2.2in",
    flexShrink: 0,
  },
  main: {
    flex: 1,
  },
  section: {
    marginBottom: "0.25in",
  },
  sectionTitle: {
    fontSize: "9pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#222",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: "1px solid",
    fontFamily: "'Helvetica', 'Arial', sans-serif",
  },
  eduItem: { marginBottom: 12 },
  eduDegree: { fontWeight: "bold", fontSize: "9pt" },
  eduSchool: { fontSize: "9pt", color: "#555" },
  eduDate: { fontSize: "8pt", color: "#777", fontStyle: "italic" },
  skills: { fontSize: "9pt", lineHeight: 1.6 },
  skillCat: { marginBottom: 8 },
  skillTitle: { fontWeight: "bold", fontSize: "8pt", color: "#555", marginBottom: 2 },
  skillItems: { color: "#444" },
  certItem: { marginBottom: 10 },
  certTitle: { fontWeight: "bold", fontSize: "9pt" },
  certIssuer: { fontSize: "8pt", color: "#555" },
  certDate: { fontSize: "8pt", color: "#777", fontStyle: "italic" },
  summary: {
    fontSize: "9.5pt",
    lineHeight: 1.5,
    textAlign: "justify",
    color: "#444",
    margin: 0,
  },
  expItem: { marginBottom: "0.2in" },
  expHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  expTitle: { fontWeight: "bold", fontSize: "10pt" },
  expDate: { fontSize: "8pt", color: "#666", fontStyle: "italic" },
  expCompany: { fontSize: "9pt", color: "#555", marginBottom: 6 },
  expHighlights: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
};
