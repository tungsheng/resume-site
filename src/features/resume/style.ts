// Resume page styles

import type React from "react";

export const styles: Record<string, React.CSSProperties> = {
  app: {
    background: "linear-gradient(180deg, #fbf8f2 0%, #f8f4ec 50%, #ece3d4 100%)",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  pageWrapper: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 16,
    paddingRight: 16,
    maxWidth: 1180,
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },
  previewLayout: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    width: "fit-content",
    maxWidth: "100%",
  },
  previewShell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flex: "0 0 auto",
  },
  previewSidebar: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: "0 0 auto",
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
