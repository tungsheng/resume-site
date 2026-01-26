// Login modal styles

import type React from "react";
import { colors } from "../../../../styles";

export const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: colors.darkBlue,
    padding: 40,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  title: {
    color: colors.primary,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 600,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 12,
    background: colors.inputBg,
    border: "1px solid #333",
    borderRadius: 4,
    color: colors.text,
    fontSize: 14,
    boxSizing: "border-box",
  },
  error: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: 16,
  },
};
