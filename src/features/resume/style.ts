// Resume page styles

import type React from "react";

export const styles: Record<string, React.CSSProperties> = {
  app: {
    background: "#f5f5f5",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  pageWrapper: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#666",
    fontSize: 16,
  },
};
