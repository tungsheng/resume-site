export const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f8f4ec;
    --bg-accent: #ece3d4;
    --surface: rgba(255, 252, 247, 0.94);
    --ink: #16222d;
    --muted: #54616b;
    --accent: #ad7b3a;
    --accent-deep: #88581d;
    --accent-soft: rgba(173, 123, 58, 0.12);
    --shadow: 0 20px 60px rgba(30, 41, 47, 0.12);
    --interactive-surface-bg: rgba(255, 255, 255, 0.74);
    --interactive-surface-hover-bg: rgba(255, 255, 255, 0.98);
    --interactive-surface-border: rgba(22, 34, 45, 0.1);
    --interactive-surface-hover-border: rgba(173, 123, 58, 0.24);
    --interactive-surface-shadow: inset 0 -1px 0 rgba(22, 34, 45, 0.04);
    --interactive-surface-hover-shadow: 0 8px 18px rgba(22, 34, 45, 0.08);
    --interactive-surface-active-bg: var(--ink);
    --interactive-surface-active-border: rgba(136, 88, 29, 0.28);
    --interactive-surface-active-border-strong: rgba(136, 88, 29, 0.42);
    --interactive-surface-active-color: #fff;
    --interactive-surface-active-shadow: 0 8px 18px rgba(22, 34, 45, 0.12);
    --interactive-surface-hover-transform: translate3d(0, -1px, 0);
    --interactive-outline: 2px solid rgba(136, 88, 29, 0.35);
    --radius-xl: 30px;
    --radius-lg: 22px;
    --max-width: 1180px;
    --font-sans: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
    --font-display: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    --font-mono: "SFMono-Regular", "Menlo", "Consolas", monospace;
    --type-label-size: 0.78rem;
    --type-label-leading: 1.35;
    --type-label-tracking: 0.14em;
    --type-meta-size: 0.92rem;
    --type-meta-leading: 1.55;
    --type-body-size: 1rem;
    --type-body-leading: 1.68;
    --type-body-compact-leading: 1.6;
    --type-title-sm-size: 1.02rem;
    --type-title-md-size: 1.12rem;
    --type-title-leading: 1.35;
    --type-panel-size: clamp(1.45rem, 2vw, 1.9rem);
    --type-panel-leading: 1.15;
    --type-section-size: clamp(1.9rem, 3vw, 2.8rem);
    --type-page-size: clamp(2.8rem, 5vw, 4.8rem);
    --type-display-size: clamp(4rem, 9vw, 7rem);
    --type-stat-size: 2rem;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at top right, rgba(173, 123, 58, 0.16), transparent 28%),
      linear-gradient(180deg, #fbf8f2 0%, var(--bg) 50%, var(--bg-accent) 100%);
    color: var(--ink);
    font-family: var(--font-sans);
  }

  a {
    color: inherit;
  }

  button {
    font: inherit;
  }

  .site-app {
    min-height: 100vh;
  }
`;
