import React from "react";
import { createRoot } from "react-dom/client";

export function mountPage(cacheKey: string, node: React.ReactNode): void {
  const container = document.getElementById("root");
  if (!container) return;

  const globalKey = `__${cacheKey}_ROOT__`;
  const root = (globalThis as any)[globalKey] ?? createRoot(container);
  (globalThis as any)[globalKey] = root;
  root.render(node);
}
