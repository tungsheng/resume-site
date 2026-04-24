import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createRoot } from "react-dom/client";
import { ExperimentsPage } from "./features/experiments/page";
import { HomePage } from "./features/home/page";
import { ProjectPage } from "./features/project/page";
import { ResumePage } from "./features/resume/page";

const routes: Record<string, React.ReactNode> = {
  "/": <HomePage />,
  "/project/cloud-inference-platform": <ProjectPage />,
  "/experiments": <ExperimentsPage />,
  "/resume": <ResumePage />,
};

const theme = createTheme({
  cssVariables: true,
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {routes[window.location.pathname] ?? <HomePage />}
  </ThemeProvider>
);
