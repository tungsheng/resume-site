export const evidenceStyles = `
  .comparison-table-wrap {
    overflow-x: auto;
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--type-meta-size);
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
    font-size: var(--type-label-size);
    letter-spacing: var(--type-label-tracking);
    text-transform: uppercase;
  }

  .experiments-summary-copy {
    display: grid;
    gap: 14px;
  }

  .experiments-summary-lead {
    margin-top: 0;
  }

  .experiments-summary-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 12px;
    color: var(--muted);
    font-size: var(--type-meta-size);
    line-height: var(--type-meta-leading);
  }

  .experiments-summary-meta__label {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(22, 34, 45, 0.06);
    border: 1px solid rgba(22, 34, 45, 0.08);
    color: var(--ink);
    font-size: var(--type-label-size);
    font-weight: 700;
    line-height: var(--type-label-leading);
    letter-spacing: var(--type-label-tracking);
    text-transform: uppercase;
  }

  .experiments-summary-meta__text {
    max-width: 48rem;
  }

  .experiments-summary-grid {
    margin-top: 18px;
    align-items: stretch;
  }

  .experiments-summary-card {
    display: grid;
    gap: 12px;
    align-content: start;
  }

  .experiments-summary-card__eyebrow {
    margin-bottom: 0;
  }

  .experiments-summary-card__title {
    margin: 0;
    font-size: var(--type-title-md-size);
    line-height: var(--type-title-leading);
  }

  .experiments-summary-card__value {
    font-size: var(--type-stat-size);
    font-weight: 700;
    line-height: 1;
    color: var(--accent-deep);
  }

  .experiments-summary-card__detail {
    margin: 0;
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
  }

  .experiments-guide {
    margin-top: 18px;
  }

  .experiments-guide-grid {
    align-items: start;
  }

  .experiments-guide__copy {
    max-width: none;
  }

  .experiment-family-copy {
    max-width: 48rem;
  }

  .experiment-family-shell {
    margin-top: 18px;
    display: grid;
    gap: 14px;
  }

  .experiment-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .experiment-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    cursor: pointer;
    padding: 11px 16px;
    border-radius: 999px;
    border: 1px solid rgba(22, 34, 45, 0.12);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: none;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease;
  }

  .experiment-tab:hover,
  .experiment-tab:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(173, 123, 58, 0.22);
    background: rgba(255, 255, 255, 0.98);
  }

  .experiment-tab:focus-visible {
    outline: 2px solid rgba(136, 88, 29, 0.35);
    outline-offset: 2px;
  }

  .experiment-tab--active {
    border-color: rgba(136, 88, 29, 0.28);
    background: var(--ink);
    color: white;
  }

  .experiment-tab--active:hover,
  .experiment-tab--active:focus-visible {
    border-color: rgba(136, 88, 29, 0.42);
    background: linear-gradient(135deg, var(--ink), rgba(136, 88, 29, 0.92));
    color: white;
    box-shadow: 0 10px 24px rgba(22, 34, 45, 0.18);
  }

  .experiment-tab__title {
    display: block;
  }

  .experiment-tab__title {
    margin: 0;
    font-size: var(--type-meta-size);
    font-weight: 700;
    line-height: var(--type-title-leading);
  }

  .experiment-family-panel {
    display: grid;
    gap: 18px;
  }

  .experiment-family-panel__header {
    display: grid;
    gap: 10px;
  }

  .experiment-tab-panel__title {
    margin: 0;
    font-size: var(--type-panel-size);
    line-height: var(--type-panel-leading);
  }

  .experiment-tab-panel__copy {
    margin: 0;
    max-width: 48rem;
  }

  .experiment-overview {
    display: grid;
    gap: 18px;
    margin-top: 18px;
    background: linear-gradient(180deg, rgba(255, 252, 247, 0.98), rgba(173, 123, 58, 0.08));
    border-color: rgba(173, 123, 58, 0.18);
  }

  .experiment-overview__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .experiment-overview__block {
    display: grid;
    gap: 10px;
    align-content: start;
  }

  .experiment-overview__block--observation {
    padding-left: 18px;
    border-left: 1px solid rgba(22, 34, 45, 0.08);
  }

  .experiment-overview__title {
    margin: 0;
    font-size: var(--type-title-md-size);
    line-height: var(--type-title-leading);
  }

  .experiment-overview__copy {
    margin: 0;
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
  }

  .experiment-overview__copy--question {
    font-size: var(--type-body-size);
    color: var(--ink);
  }

  .experiment-support-panel {
    display: grid;
    gap: 14px;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .experiment-support-panel__header {
    display: grid;
    grid-template-columns: minmax(0, 11rem) minmax(0, 1fr);
    gap: 14px 18px;
    align-items: start;
  }

  .experiment-support-panel__copy {
    margin: 0;
    max-width: 46rem;
  }

  .comparison-surface {
    margin-top: 18px;
  }

  .comparison-surface__header {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 18px;
    align-items: start;
    margin-bottom: 18px;
  }

  .comparison-surface__copy {
    margin: 0;
    max-width: none;
  }

  .comparison-chart {
    display: grid;
    gap: 18px;
  }

  .comparison-chart__row {
    display: grid;
    gap: 12px;
  }

  .comparison-chart__row + .comparison-chart__row {
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .comparison-chart__row-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 16px;
  }

  .comparison-chart__metric {
    margin: 0;
    font-size: var(--type-title-sm-size);
    font-weight: 700;
    line-height: var(--type-title-leading);
  }

  .comparison-chart__meta {
    margin: 0;
    color: var(--muted);
    font-size: var(--type-meta-size);
  }

  .comparison-chart__series-list {
    display: grid;
    gap: 12px;
  }

  .comparison-chart__series {
    display: grid;
    gap: 8px;
  }

  .comparison-chart__series-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 16px;
    font-size: var(--type-meta-size);
  }

  .comparison-chart__series-label {
    color: var(--muted);
  }

  .comparison-chart__series-value {
    font-weight: 700;
    color: var(--ink);
  }

  .comparison-chart__track {
    height: 12px;
    border-radius: 999px;
    background: rgba(22, 34, 45, 0.08);
    overflow: hidden;
  }

  .comparison-chart__fill {
    display: block;
    height: 100%;
    border-radius: inherit;
  }

  .comparison-chart__fill--primary {
    background: linear-gradient(90deg, var(--accent), var(--accent-deep));
  }

  .comparison-chart__fill--secondary {
    background: linear-gradient(90deg, rgba(22, 34, 45, 0.4), rgba(22, 34, 45, 0.72));
  }

  .evidence-stack {
    display: grid;
    gap: 14px;
  }

  .proof-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .proof-entry {
    color: var(--ink);
    padding-top: 14px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .proof-entry:first-child {
    padding-top: 0;
    border-top: 0;
  }

  .proof-entry__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: start;
  }

  .proof-entry__title {
    margin: 0;
    font-size: var(--type-title-sm-size);
    font-weight: 700;
    line-height: var(--type-title-leading);
  }

  .proof-entry__subtitle {
    margin: 6px 0 0;
    color: var(--accent-deep);
    font-size: var(--type-label-size);
    line-height: var(--type-label-leading);
    letter-spacing: var(--type-label-tracking);
    text-transform: uppercase;
  }

  .report-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--accent-soft);
    font-size: var(--type-label-size);
    color: var(--accent-deep);
  }

  .proof-entry__command {
    display: block;
    margin-top: 12px;
    color: var(--accent-deep);
    font-size: var(--type-meta-size);
  }

  .proof-entry__log {
    margin: 14px 0 0;
    padding: 14px;
    border-radius: 16px;
    background: rgba(22, 34, 45, 0.94);
    white-space: pre-wrap;
    font-family: var(--font-mono);
    font-size: 0.88rem;
    line-height: 1.6;
    color: #d8e7f3;
    overflow-x: auto;
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

    .experiment-support-panel__header,
    .comparison-surface__header,
    .proof-grid,
    .timeline-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .experiment-overview__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .experiment-overview__block--observation {
      padding-left: 0;
      padding-top: 18px;
      border-left: 0;
      border-top: 1px solid rgba(22, 34, 45, 0.08);
    }
  }

  @media (max-width: 900px) {
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
    .timeline-card {
      padding: 20px;
    }

    .page-title {
      font-size: 2.6rem;
    }

    .experiments-summary-meta {
      align-items: start;
    }

    .comparison-chart__series-meta,
    .comparison-chart__row-header {
      display: grid;
      gap: 4px;
    }
  }
`;
