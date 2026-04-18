export const siteStyles = `
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

  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(18px);
    background: rgba(251, 248, 242, 0.8);
    border-bottom: 1px solid rgba(22, 34, 45, 0.08);
  }

  .site-header__inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .site-header__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
  }

  .site-brand {
    text-decoration: none;
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .site-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .site-header__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .site-header__context {
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.4;
    white-space: nowrap;
  }

  .site-nav__link {
    text-decoration: none;
    color: var(--muted);
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 0.95rem;
  }

  .site-nav__link[aria-current="page"] {
    color: var(--ink);
    background: rgba(22, 34, 45, 0.06);
  }

  .site-main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  .page-hero,
  .card,
  .metric-card,
  .timeline-card,
  .proof-card,
  .detail-card,
  .about-card {
    background: var(--surface);
    border: 1px solid rgba(22, 34, 45, 0.08);
    box-shadow: var(--shadow);
  }

  .page-hero {
    border-radius: var(--radius-xl);
    padding: 34px;
    margin-bottom: 30px;
  }

  .page-hero--split {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.8fr);
    gap: 22px;
    align-items: stretch;
  }

  .page-hero__aside {
    padding: 24px;
    border-radius: var(--radius-lg);
    background: linear-gradient(145deg, rgba(22, 34, 45, 0.95), rgba(36, 55, 71, 0.96));
    color: #eef4f7;
  }

  .page-hero__aside .label {
    color: #efcf9d;
  }

  .page-eyebrow,
  .section__kicker,
  .label {
    margin: 0 0 10px;
    color: var(--accent-deep);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .page-title,
  .section__title {
    margin: 0;
    font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    line-height: 0.98;
    letter-spacing: -0.03em;
  }

  .page-title {
    font-size: clamp(2.8rem, 5vw, 4.8rem);
    margin-bottom: 14px;
  }

  .page-subtitle {
    margin: 0;
    font-size: clamp(1.05rem, 1.8vw, 1.4rem);
    font-weight: 600;
    color: #213748;
    line-height: 1.4;
  }

  .page-lede,
  .section__copy,
  .card__copy,
  .detail-copy {
    margin: 16px 0 0;
    max-width: 44rem;
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.68;
  }

  .button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    border-radius: 999px;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  }

  .button:hover,
  .button:focus-visible {
    transform: translateY(-1px);
  }

  .button--primary {
    background: var(--ink);
    color: white;
  }

  .button--secondary {
    background: rgba(255, 255, 255, 0.82);
    color: var(--ink);
    border-color: rgba(22, 34, 45, 0.12);
  }

  .button--ghost {
    background: transparent;
    color: var(--ink);
    border-color: rgba(22, 34, 45, 0.18);
  }

  .button--compact {
    padding: 10px 14px;
    font-size: 0.92rem;
  }

  .button:disabled {
    opacity: 0.75;
    cursor: wait;
    transform: none;
  }

  .inline-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .inline-links a,
  .inline-links button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 0;
    padding: 0;
    color: var(--accent-deep);
    text-decoration: none;
    cursor: pointer;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .chip {
    padding: 10px 14px;
    border-radius: 999px;
    background: var(--accent-soft);
    border: 1px solid rgba(173, 123, 58, 0.18);
    font-weight: 600;
  }

  .section {
    margin-top: 26px;
  }

  .section__header {
    margin-bottom: 16px;
  }

  .section__title {
    font-size: clamp(1.9rem, 3vw, 2.8rem);
  }

  .grid-two,
  .grid-three,
  .timeline-grid,
  .proof-grid {
    display: grid;
    gap: 18px;
  }

  .grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .card,
  .metric-card,
  .timeline-card,
  .detail-card,
  .about-card {
    border-radius: var(--radius-lg);
    padding: 24px;
  }

  .card__title,
  .metric-card__label,
  .timeline-card__title,
  .detail-card__title,
  .about-card__title {
    margin: 0;
    font-size: 1.12rem;
    line-height: 1.35;
  }

  .card__list,
  .detail-list,
  .about-list,
  .bullet-list,
  .resume-link-list {
    margin: 16px 0 0;
    padding-left: 20px;
    display: grid;
    gap: 10px;
    line-height: 1.6;
  }

  .stack-diagram {
    display: grid;
    gap: 8px;
    justify-items: center;
  }

  .stack-diagram__node {
    width: min(100%, 22rem);
    padding: 14px 18px;
    border-radius: 16px;
    background: var(--surface-strong);
    border: 1px solid var(--line);
    text-align: center;
    font-weight: 600;
  }

  .stack-diagram__arrow {
    color: var(--accent-deep);
    font-size: 1.4rem;
    line-height: 1;
  }

  .flow-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .flow-pill {
    padding: 10px 14px;
    border-radius: 999px;
    background: var(--accent-soft);
    border: 1px solid rgba(173, 123, 58, 0.16);
    font-weight: 600;
  }

  .flow-arrow {
    color: var(--accent-deep);
    font-weight: 700;
  }

  .steps-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 12px;
  }

  .steps-list__item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    align-items: start;
    padding: 16px 18px;
    border-radius: var(--radius-md);
    background: var(--surface);
    border: 1px solid rgba(22, 34, 45, 0.08);
    box-shadow: var(--shadow);
    line-height: 1.55;
  }

  .steps-list__index {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--ink);
    color: white;
    font-weight: 700;
    font-size: 0.92rem;
  }

  .metric-card__value {
    margin-top: 14px;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-deep);
    line-height: 1;
  }

  .metric-card__detail {
    margin-top: 10px;
    color: var(--muted);
    line-height: 1.55;
  }

  .comparison-table-wrap {
    overflow-x: auto;
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 13px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(22, 34, 45, 0.08);
    vertical-align: top;
  }

  .comparison-table thead th {
    color: var(--accent-deep);
    font-size: 0.82rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .proof-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .proof-card {
    padding: 18px;
    border-radius: var(--radius-lg);
    background: rgba(22, 34, 45, 0.96);
    color: #eef4f7;
  }

  .proof-card__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: start;
  }

  .proof-card__title {
    margin: 0;
    font-weight: 700;
  }

  .proof-card__subtitle {
    margin: 6px 0 0;
    color: #efcf9d;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .report-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 0.78rem;
    color: #efcf9d;
  }

  .proof-card__command {
    display: block;
    margin-top: 12px;
    color: #efcf9d;
    font-size: 0.86rem;
  }

  .proof-card__log {
    margin: 14px 0 0;
    white-space: pre-wrap;
    font-family: "SFMono-Regular", "Menlo", "Consolas", monospace;
    font-size: 0.88rem;
    line-height: 1.6;
    color: #d8e7f3;
  }

  .timeline-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .timeline-card__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: start;
    margin-bottom: 14px;
  }

  .timeline-card__copy {
    margin: 8px 0 0;
    color: var(--muted);
  }

  .timeline-events {
    display: grid;
    gap: 10px;
  }

  .timeline-event {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(22, 34, 45, 0.08);
  }

  .timeline-event--emphasis {
    background: var(--accent-soft);
    border-color: rgba(173, 123, 58, 0.24);
  }

  .timeline-event__time {
    font-weight: 700;
    color: var(--accent-deep);
  }

  .link-grid {
    display: grid;
    gap: 14px;
  }

  .resource-link {
    display: block;
    padding: 14px 16px;
    border-radius: 14px;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(22, 34, 45, 0.08);
  }

  .resource-link__label {
    display: block;
    font-weight: 700;
  }

  .resource-link__detail {
    display: block;
    margin-top: 6px;
    color: var(--muted);
    line-height: 1.55;
  }

  .site-footer {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 24px 34px;
    color: var(--muted);
    font-size: 0.94rem;
  }

  @media (max-width: 1024px) {
    .grid-three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .proof-grid,
    .timeline-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 900px) {
    .page-hero--split,
    .grid-two,
    .grid-three {
      grid-template-columns: minmax(0, 1fr);
    }

    .site-header__inner {
      display: grid;
      justify-content: stretch;
    }

    .site-header__controls {
      justify-content: flex-start;
    }

    .site-nav {
      gap: 8px;
    }
  }

  @media (max-width: 640px) {
    .site-main {
      padding: 24px 16px 48px;
    }

    .site-footer,
    .site-header__inner {
      padding-left: 16px;
      padding-right: 16px;
    }

    .page-hero,
    .card,
    .metric-card,
    .timeline-card,
    .detail-card,
    .about-card {
      padding: 20px;
    }

    .page-title {
      font-size: 2.6rem;
    }

    .flow-arrow {
      display: none;
    }

    .flow-pill {
      width: 100%;
      border-radius: 16px;
    }
  }
`;
