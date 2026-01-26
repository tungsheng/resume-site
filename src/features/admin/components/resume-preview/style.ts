// Resume preview styles

import type React from "react";

export const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#fff",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    margin: 20,
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "11in",
    width: "8.5in",
    color: "#666",
    fontSize: 16,
  },
};
