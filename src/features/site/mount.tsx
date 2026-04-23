import React from "react";
import { createRoot } from "react-dom/client";

type RootContainer = HTMLElement & {
  __resumeSiteRoot__?: ReturnType<typeof createRoot>;
};

export function mountPage(node: React.ReactNode): void {
  const container = document.getElementById("root");
  if (!container) return;

  const rootContainer = container as RootContainer;
  const root = rootContainer.__resumeSiteRoot__ ?? createRoot(rootContainer);
  rootContainer.__resumeSiteRoot__ = root;
  root.render(node);
}
