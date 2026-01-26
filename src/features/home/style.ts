// Home page styles

import type React from "react";
import { colors } from "../../styles";

export const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darkBlue} 100%)`,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  content: {
    textAlign: "center",
    padding: 40,
  },
  title: {
    fontSize: 72,
    fontWeight: 300,
    color: colors.text,
    margin: 0,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textMuted,
    marginTop: 16,
    marginBottom: 40,
    letterSpacing: 2,
  },
  link: {
    display: "inline-block",
    padding: "14px 32px",
    background: colors.primary,
    color: colors.text,
    textDecoration: "none",
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    transition: "background 0.2s",
  },
};
