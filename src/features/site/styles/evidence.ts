export const evidenceStyles = `
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

  .evidence-stack {
    display: grid;
    gap: 18px;
    margin-top: 18px;
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
