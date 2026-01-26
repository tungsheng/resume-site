// Admin page styles

import type React from "react";
import { colors } from "../../styles";

export const styles: Record<string, React.CSSProperties> = {
  app: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: colors.dark,
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  mainContent: {
    paddingTop: 80,
    display: "flex",
    justifyContent: "center",
    paddingBottom: 40,
  },
};
