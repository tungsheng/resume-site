// Resume toolbar styles

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
    justifyContent: "space-between",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
};
