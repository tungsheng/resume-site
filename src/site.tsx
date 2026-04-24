import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createRoot } from "react-dom/client";
import { theme } from "./theme";

export function renderSite(page: React.ReactNode): void {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Root element not found");
  }

  createRoot(root).render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {page}
    </ThemeProvider>
  );
}
