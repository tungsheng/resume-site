export const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f8f4ec;
    --bg-accent: #ece3d4;
    --surface: rgba(255, 252, 247, 0.94);
    --surface-strong: rgba(255, 255, 255, 0.98);
    --ink: #16222d;
    --muted: #54616b;
    --line: rgba(22, 34, 45, 0.12);
    --accent: #ad7b3a;
    --accent-deep: #88581d;
    --accent-soft: rgba(173, 123, 58, 0.12);
    --shadow: 0 20px 60px rgba(30, 41, 47, 0.12);
    --radius-xl: 30px;
    --radius-lg: 22px;
    --radius-md: 16px;
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
    --type-subtitle-size: clamp(1.05rem, 1.8vw, 1.4rem);
    --type-subtitle-leading: 1.4;
    --type-section-size: clamp(1.9rem, 3vw, 2.8rem);
    --type-page-size: clamp(2.8rem, 5vw, 4.8rem);
    --type-display-size: clamp(4rem, 9vw, 7rem);
    --type-display-accent-size: clamp(1.3rem, 2.4vw, 2rem);
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
