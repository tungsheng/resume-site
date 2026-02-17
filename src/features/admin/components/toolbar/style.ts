// Admin toolbar styles

import type React from "react";
import { colors } from "../../../../styles";

export const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: colors.darkBlue,
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 600,
    marginRight: 20,
  },
  group: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  select: {
    background: colors.inputBg,
    color: colors.text,
    border: `1px solid ${colors.primary}`,
    padding: "8px 12px",
    borderRadius: 4,
    fontSize: 14,
    cursor: "pointer",
    minWidth: 165,
  },
  colorWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  colorPicker: {
    width: 36,
    height: 36,
    border: "2px solid #fff",
    borderRadius: 4,
    cursor: "pointer",
    padding: 0,
  },
  presets: {
    display: "flex",
    gap: 4,
  },
  preset: {
    width: 24,
    height: 24,
    borderRadius: 4,
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "transform 0.1s",
  },
};
