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
    font-family: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
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
