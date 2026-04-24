export const evidenceStyles = `
  .experiments-summary-intro {
    margin-top: 0;
    margin-bottom: 0;
    max-width: 56rem;
  }

  .experiments-tradeoff-grid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .experiments-tradeoff-card {
    display: grid;
    gap: 16px;
    align-content: start;
    min-width: 0;
    height: 100%;
  }

  .experiments-tradeoff-card__title {
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
    color: var(--muted);
    max-width: none;
  }

  .experiments-tradeoff-card__pair {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 18px;
    align-items: stretch;
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .experiments-tradeoff-card__side {
    display: grid;
    align-content: center;
    justify-items: start;
    min-height: 5rem;
    padding: 0;
  }

  .experiments-tradeoff-card__side--right {
    justify-items: end;
    text-align: right;
  }

  .experiments-tradeoff-card__side-value {
    display: block;
    font-size: 1.12rem;
    font-weight: 700;
    line-height: 1.24;
    color: var(--ink);
    text-wrap: balance;
    max-width: 9ch;
  }

  .experiments-tradeoff-card__center {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 0;
    min-width: 4.5rem;
  }

  .experiments-tradeoff-card__center::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: rgba(22, 34, 45, 0.08);
    transform: translateX(-50%);
  }

  .experiments-tradeoff-card__badge {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.45rem;
    padding: 0.04rem 0.48rem;
    border-radius: 999px;
    background: var(--surface);
    color: var(--accent-deep);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .experiments-tradeoff-card__icon {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin-top: -0.15rem;
    background: var(--surface);
    color: var(--accent-deep);
  }

  .experiments-tradeoff-card__icon-svg {
    width: 1.05rem;
    height: 1.05rem;
  }

  .experiment-family-copy {
    max-width: 48rem;
  }

  .experiment-decision-map {
    margin-top: 0;
    display: grid;
    gap: 10px;
  }

  .experiment-decision-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .experiment-decision-card {
    appearance: none;
    width: 100%;
    text-align: left;
    font: inherit;
    cursor: pointer;
    display: grid;
    gap: 8px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid var(--interactive-surface-border);
    box-shadow: var(--interactive-surface-shadow);
    color: var(--muted);
    min-width: 0;
    transform: translate3d(0, 0, 0);
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .experiment-decision-card:hover,
  .experiment-decision-card:focus-visible {
    transform: var(--interactive-surface-hover-transform);
    border-color: var(--interactive-surface-hover-border);
    background: rgba(255, 255, 255, 0.96);
    color: var(--muted);
    box-shadow: var(--interactive-surface-hover-shadow);
  }

  .experiment-decision-card:focus-visible {
    outline: var(--interactive-outline);
    outline-offset: 2px;
  }

  .experiment-decision-card--active {
    border-color: var(--interactive-surface-active-border);
    background: var(--interactive-surface-active-bg);
    color: var(--interactive-surface-active-color);
    box-shadow: var(--interactive-surface-active-shadow);
  }

  .experiment-decision-card--active:hover,
  .experiment-decision-card--active:focus-visible {
    transform: var(--interactive-surface-hover-transform);
    border-color: var(--interactive-surface-active-border-strong);
    background: var(--interactive-surface-active-bg);
    color: var(--interactive-surface-active-color);
    box-shadow: var(--interactive-surface-active-shadow);
  }

  .experiment-decision-card--active .experiment-decision-card__title,
  .experiment-decision-card--active .experiment-decision-card__recommendation {
    color: var(--interactive-surface-active-color);
  }

  .experiment-decision-card--active .experiment-decision-card__readout {
    color: rgba(255, 255, 255, 0.88);
  }

  .experiment-decision-card__title {
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
    color: rgba(22, 34, 45, 0.82);
  }

  .experiment-decision-card__recommendation {
    font-size: 1.28rem;
    font-weight: 700;
    line-height: 1.2;
    color: rgba(22, 34, 45, 0.9);
  }

  .experiment-decision-card__readout {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1;
    color: rgba(136, 88, 29, 0.82);
  }

  .experiment-decision-legend {
    margin: 0;
    color: var(--muted);
    font-size: var(--type-meta-size);
    line-height: var(--type-meta-leading);
  }

  .decision-status {
    display: inline-flex;
    align-items: center;
    padding: 5px 9px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(22, 34, 45, 0.1);
    background: rgba(22, 34, 45, 0.05);
    color: var(--ink);
    white-space: nowrap;
  }

  .decision-status--strong {
    background: rgba(173, 123, 58, 0.12);
    border-color: rgba(173, 123, 58, 0.18);
    color: var(--accent-deep);
  }

  .decision-status--measured {
    background: rgba(22, 34, 45, 0.08);
    border-color: rgba(22, 34, 45, 0.12);
    color: var(--ink);
  }

  .decision-status--provisional {
    background: rgba(112, 92, 61, 0.12);
    border-color: rgba(112, 92, 61, 0.16);
    color: #6f5530;
  }

  .experiment-decision-shell {
    margin-top: 18px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .experiment-verdict {
    display: grid;
    gap: 12px;
    background: linear-gradient(180deg, rgba(255, 253, 249, 0.98), rgba(173, 123, 58, 0.08));
    border-color: rgba(173, 123, 58, 0.18);
  }

  .experiment-verdict__header {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: space-between;
    gap: 10px 14px;
  }

  .experiment-verdict__intro {
    display: grid;
    gap: 6px;
  }

  .experiment-verdict__eyebrow {
    margin: 0;
    color: var(--muted);
    font-size: var(--type-meta-size);
    line-height: var(--type-meta-leading);
  }

  .experiment-verdict__title {
    margin: 0;
    font-size: clamp(1.75rem, 4vw, 2.6rem);
    line-height: 0.98;
  }

  .experiment-verdict__readout {
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: 700;
    line-height: 1;
    color: var(--accent-deep);
  }

  .experiment-verdict__summary {
    margin: 0;
    max-width: 42rem;
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
  }

  .experiment-verdict__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    color: var(--muted);
    font-size: var(--type-meta-size);
    line-height: var(--type-meta-leading);
  }

  .experiment-verdict__fact {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .experiment-verdict__fact-label {
    font-weight: 700;
  }

  .experiment-verdict__fact-value {
    color: var(--ink);
    font-weight: 700;
  }

  .experiment-family-shell {
    margin-top: 14px;
    display: grid;
    gap: 14px;
  }

  .experiment-family-panel {
    display: grid;
    gap: 16px;
  }

  .experiment-detail-shell {
    margin-top: 0;
    display: grid;
    gap: 14px;
  }

  .experiment-detail-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(22, 34, 45, 0.08);
  }

  .experiment-detail-tab {
    appearance: none;
    border: 1px solid rgba(22, 34, 45, 0.1);
    background: rgba(255, 255, 255, 0.7);
    color: var(--muted);
    border-radius: 999px;
    padding: 9px 14px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition:
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .experiment-detail-tab:hover,
  .experiment-detail-tab:focus-visible {
    border-color: rgba(173, 123, 58, 0.22);
    background: rgba(255, 255, 255, 0.95);
    color: var(--ink);
    box-shadow: 0 8px 20px rgba(22, 34, 45, 0.05);
  }

  .experiment-detail-tab:focus-visible {
    outline: var(--interactive-outline);
    outline-offset: 2px;
  }

  .experiment-detail-tab--active {
    border-color: rgba(173, 123, 58, 0.28);
    background: rgba(255, 250, 244, 1);
    color: var(--accent-deep);
  }

  .experiment-detail-panel[hidden] {
    display: none;
  }

  .experiment-overview {
    display: grid;
    gap: 12px;
    margin-top: 0;
  }

  .experiment-overview__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .experiment-overview__block {
    display: grid;
    gap: 8px;
    align-content: start;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .experiment-overview__block--observation {
    padding-left: 18px;
    border-left: 1px solid rgba(22, 34, 45, 0.08);
  }

  .experiment-overview__title {
    margin: 0;
    font-size: var(--type-title-sm-size);
    font-weight: 700;
    line-height: var(--type-title-leading);
  }

  .experiment-overview__copy {
    margin: 0;
    color: var(--muted);
    font-size: 0.98rem;
    line-height: var(--type-body-compact-leading);
  }

  .experiment-overview__copy--question {
    font-size: var(--type-body-size);
    color: var(--ink);
  }

  .experiment-support-panel {
    display: grid;
    gap: 12px;
    margin-top: 0;
    padding-top: 0;
  }

  .experiment-support-panel__header {
    display: grid;
    gap: 6px;
    align-items: start;
  }

  .experiment-support-panel__copy {
    margin: 0;
    max-width: 46rem;
  }

  .comparison-surface {
    margin-top: 0;
    display: grid;
    gap: 12px;
  }

  .comparison-surface__header {
    display: grid;
    gap: 10px;
    align-items: start;
    margin-bottom: 14px;
  }

  .comparison-surface__copy {
    margin: 0;
    max-width: none;
  }

  .comparison-chart {
    display: grid;
    gap: 12px;
  }

  .comparison-chart__row {
    display: grid;
    gap: 8px;
  }

  .comparison-chart__row + .comparison-chart__row {
    padding-top: 12px;
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
    gap: 10px;
  }

  .comparison-chart__series {
    display: grid;
    gap: 6px;
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
    height: 10px;
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
    gap: 12px;
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
    overflow-wrap: break-word;
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
    white-space: nowrap;
  }

  .proof-entry__command {
    display: block;
    margin-top: 10px;
    color: var(--accent-deep);
    font-size: var(--type-meta-size);
    overflow-wrap: anywhere;
  }

  .proof-entry__facts {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }

  .proof-entry__fact {
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(22, 34, 45, 0.04);
    border: 1px solid rgba(22, 34, 45, 0.08);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--ink);
    overflow-wrap: anywhere;
  }

  .timeline-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .timeline-card__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: start;
    margin-bottom: 12px;
  }

  .timeline-card__copy {
    margin: 8px 0 0;
    color: var(--muted);
  }

  .timeline-events {
    display: grid;
    gap: 8px;
  }

  .timeline-event {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
    padding: 8px 10px;
    border-radius: 12px;
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

  @media (max-width: 1120px) {
    .experiments-tradeoff-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .experiments-tradeoff-card:last-child {
      grid-column: 1 / -1;
    }

    .experiment-decision-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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
      padding-top: 14px;
      border-left: 0;
      border-top: 1px solid rgba(22, 34, 45, 0.08);
    }
  }

  @media (max-width: 820px) {
    .proof-entry__header,
    .comparison-chart__series-meta,
    .comparison-chart__row-header,
    .experiment-verdict__header {
      display: grid;
      gap: 4px;
    }

    .proof-entry__header {
      gap: 8px;
    }
  }

  @media (max-width: 900px) {
    .grid-two,
    .grid-three,
    .experiment-decision-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 640px) {
    .page-hero,
    .card,
    .metric-card,
    .timeline-card {
      padding: 20px;
    }

    .page-title {
      font-size: clamp(2.15rem, 12vw, 2.6rem);
      line-height: 1.02;
    }

    .experiments-tradeoff-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .experiments-tradeoff-card:last-child {
      grid-column: auto;
    }

    .experiments-tradeoff-card__pair {
      gap: 12px;
      padding-top: 16px;
    }

    .experiments-tradeoff-card__side,
    .experiments-tradeoff-card__side--right {
      min-height: 0;
    }

    .proof-entry__header {
      display: grid;
      gap: 8px;
    }

    .experiment-detail-nav {
      gap: 8px;
    }

    .report-badge {
      justify-self: start;
    }

    .timeline-event {
      grid-template-columns: minmax(3rem, auto) minmax(0, 1fr);
      gap: 10px;
    }

  }

  @media (max-width: 380px) {
    .page-hero,
    .card,
    .metric-card,
    .timeline-card {
      padding: 18px;
      border-radius: 20px;
    }

    .proof-entry__fact {
      font-size: 0.76rem;
      line-height: 1.45;
    }
  }
`;
