import React from "react";
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

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(routes[window.location.pathname] ?? <HomePage />);
