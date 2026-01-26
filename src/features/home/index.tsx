// Home page - public landing page

import React from "react";
import { createRoot } from "react-dom/client";
import { styles } from "./style";

function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Tony Lee</h1>
        <p style={styles.subtitle}>Cross-Functional Engineering Leader</p>
        <a href="/resume/tony-lee" style={styles.link} aria-label="View resume">
          View Resume →
        </a>
      </div>
    </main>
  );
}

// Mount with HMR support
const container = document.getElementById("root");
if (container) {
  const root = (globalThis as any).__HOME_ROOT__ ?? createRoot(container);
  (globalThis as any).__HOME_ROOT__ = root;
  root.render(<Home />);
}
