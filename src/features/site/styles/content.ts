export const contentStyles = `
  .page-hero,
  .card,
  .metric-card,
  .timeline-card {
    background: var(--surface);
    border: 1px solid rgba(22, 34, 45, 0.08);
    box-shadow: var(--shadow);
  }

  .page-hero {
    border-radius: var(--radius-xl);
    padding: 34px;
    margin-bottom: 30px;
  }

  .page-hero--header {
    padding-top: 30px;
    padding-bottom: 28px;
    margin-bottom: 24px;
  }

  .page-hero__content {
    max-width: 58rem;
  }

  .page-hero--centered .page-hero__content {
    max-width: 56rem;
    margin: 0 auto;
    text-align: center;
  }

  .section__kicker,
  .label {
    margin: 0 0 10px;
    color: var(--accent-deep);
    font-size: var(--type-label-size);
    font-weight: 700;
    line-height: var(--type-label-leading);
    letter-spacing: var(--type-label-tracking);
    text-transform: uppercase;
  }

  .page-title,
  .section__title {
    margin: 0;
    font-family: var(--font-display);
    line-height: 0.98;
    letter-spacing: -0.03em;
  }

  .page-title {
    font-size: var(--type-page-size);
    margin-bottom: 14px;
  }

  .page-hero--header .page-title {
    margin-bottom: 10px;
  }

  .page-hero--centered .page-title {
    font-size: var(--type-display-size);
    margin-bottom: 14px;
  }

  .home-hero-title {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    column-gap: 0.5rem;
    row-gap: 0.2rem;
  }

  .home-hero-title__lead {
    font-size: var(--type-display-accent-size);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--accent-deep);
  }

  .home-hero-title__name {
    font-size: var(--type-display-size);
  }

  .page-subtitle {
    margin: 0;
    font-size: var(--type-subtitle-size);
    font-weight: 600;
    color: #213748;
    line-height: var(--type-subtitle-leading);
  }

  .page-hero--header .page-subtitle {
    max-width: 46rem;
  }

  .page-hero--centered .page-subtitle,
  .page-hero--centered .page-lede,
  .page-hero--centered .detail-copy {
    margin-left: auto;
    margin-right: auto;
  }

  .page-lede,
  .section__copy,
  .card__copy,
  .detail-copy {
    margin: 16px 0 0;
    max-width: 44rem;
    font-size: var(--type-body-size);
    color: var(--muted);
    line-height: var(--type-body-leading);
  }

  .page-hero__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-top: 18px;
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
    font-size: var(--type-meta-size);
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
    font-size: var(--type-meta-size);
  }

  .page-hero__links {
    gap: 10px 18px;
    margin-top: 12px;
    font-size: var(--type-meta-size);
  }

  .page-hero--centered .page-hero__links {
    justify-content: center;
    margin-top: 18px;
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

  .page-hero__links a,
  .page-hero__links button {
    color: var(--muted);
  }

  .page-hero__links a:hover,
  .page-hero__links a:focus-visible,
  .page-hero__links button:hover,
  .page-hero__links button:focus-visible {
    color: var(--accent-deep);
  }

  @media (max-width: 640px) {
    .page-hero--header {
      padding: 24px 22px;
    }

    .home-hero-title {
      row-gap: 0.1rem;
    }

    .page-hero__actions {
      gap: 10px;
      margin-top: 16px;
    }

    .page-hero__actions > .button {
      width: 100%;
      justify-content: center;
    }

    .page-hero__links {
      gap: 8px 14px;
      margin-top: 10px;
    }
  }

  .section {
    margin-top: 26px;
  }

  .section__header {
    margin-bottom: 16px;
  }

  .section__title {
    font-size: var(--type-section-size);
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
  .timeline-card {
    border-radius: var(--radius-lg);
    padding: 24px;
  }

  .card__title,
  .timeline-card__title {
    margin: 0;
    font-size: var(--type-title-md-size);
    line-height: var(--type-title-leading);
  }

  .home-projects-section {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }

  .home-projects-section__inner {
    width: min(100%, 28rem);
    display: grid;
    justify-items: center;
  }

  .home-projects-section__header {
    width: 100%;
    margin: 0 0 12px;
    text-align: center;
  }

  .home-project-card {
    width: 100%;
    margin: 0;
    text-align: center;
  }

  .home-project-card--link {
    display: block;
    color: inherit;
    text-decoration: none;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .home-project-card--link:hover,
  .home-project-card--link:focus-visible {
    transform: translateY(-2px);
    border-color: rgba(173, 123, 58, 0.24);
    background: rgba(255, 255, 255, 0.98);
  }

  .home-project-card__title {
    font-size: var(--type-title-md-size);
  }

  .home-project-card .card__copy {
    max-width: 24rem;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
  }

  .home-project-card__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 14px;
    color: var(--accent-deep);
    font-size: var(--type-meta-size);
    font-weight: 600;
  }

  .home-project-card--link:hover .home-project-card__action,
  .home-project-card--link:focus-visible .home-project-card__action {
    transform: translateX(2px);
  }

  .project-hero-links {
    gap: 10px 12px;
    margin-top: 16px;
  }

  .project-hero-links a {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(22, 34, 45, 0.1);
    background: rgba(255, 255, 255, 0.74);
    color: var(--ink);
    text-decoration: none;
    box-shadow: inset 0 -1px 0 rgba(22, 34, 45, 0.04);
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .project-hero-links a:hover,
  .project-hero-links a:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(173, 123, 58, 0.24);
    background: rgba(255, 255, 255, 0.98);
    color: var(--accent-deep);
    box-shadow: 0 8px 18px rgba(22, 34, 45, 0.08);
  }

  .project-overview-summary {
    margin: 0;
    max-width: 46rem;
  }

  .project-overview-story-item {
    display: grid;
    gap: 8px;
    align-content: start;
  }

  .project-overview-card__copy {
    margin: 0;
    max-width: none;
  }

  .project-overview-grid {
    margin-top: 18px;
    gap: 16px 18px;
    align-items: start;
  }

  .project-overview-grid .project-overview-story-item + .project-overview-story-item {
    padding-left: 18px;
    border-left: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-overview-signals {
    display: grid;
    gap: 14px;
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-overview-signals__intro {
    display: grid;
    gap: 8px;
    max-width: 46rem;
  }

  .project-overview-signals__copy {
    margin: 0;
    max-width: none;
  }

  .project-overview-signals-grid {
    margin-top: 0;
    gap: 14px 18px;
    align-items: start;
  }

  .project-signal {
    display: grid;
    gap: 8px;
    align-items: start;
    padding: 0 12px 0 0;
  }

  .project-signal__title {
    margin: 0;
    font-size: var(--type-title-sm-size);
    line-height: var(--type-title-leading);
  }

  .project-signal__detail {
    margin-top: 0;
  }

  .project-signal .project-stat-value {
    margin-top: 0;
    font-size: 1.55rem;
    white-space: nowrap;
  }

  .project-overview-signals-grid .project-signal + .project-signal {
    border-left: 1px solid rgba(22, 34, 45, 0.08);
    padding-left: 18px;
  }

  .project-workflow-lead {
    max-width: 48rem;
  }

  .project-workflow-surface {
    margin-top: 18px;
    display: grid;
    gap: 20px;
  }

  .project-workflow-foundation {
    display: grid;
    gap: 12px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-workflow-foundation__header {
    display: grid;
    gap: 8px;
    max-width: 48rem;
  }

  .project-workflow-foundation__summary {
    margin: 0;
    max-width: none;
  }

  .project-workflow-foundation__nodes {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .project-workflow-paths {
    display: grid;
    gap: 0;
  }

  .project-workflow-path {
    display: grid;
    grid-template-columns: minmax(180px, 0.44fr) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
    padding: 16px 0;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-workflow-path:first-child {
    padding-top: 0;
    border-top: 0;
  }

  .project-workflow-path:last-child {
    padding-bottom: 0;
  }

  .project-workflow-path__meta {
    display: grid;
    gap: 8px;
    align-content: start;
  }

  .project-workflow-path__summary {
    margin: 0;
    max-width: none;
  }

  .project-workflow-path__flow,
  .project-workflow-rejoin__flow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .project-workflow-node {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    max-width: 100%;
    min-height: 2.5rem;
    padding: 9px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(22, 34, 45, 0.08);
    font-size: var(--type-meta-size);
    font-weight: 600;
    line-height: 1.35;
  }

  .project-workflow-node__label {
    min-width: 0;
  }

  .project-workflow-node__link {
    display: inline-flex;
    align-items: center;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(173, 123, 58, 0.12);
    border: 1px solid rgba(173, 123, 58, 0.18);
    color: var(--accent-deep);
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }

  .project-workflow-node__link:hover,
  .project-workflow-node__link:focus-visible {
    background: rgba(173, 123, 58, 0.18);
    border-color: rgba(173, 123, 58, 0.26);
    color: var(--ink);
  }

  .project-workflow-flow-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1rem;
    color: var(--accent-deep);
    font-weight: 600;
  }

  .project-workflow-rejoin {
    display: grid;
    gap: 12px;
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-workflow-rejoin__meta {
    display: grid;
    gap: 8px;
    max-width: 46rem;
  }

  .project-workflow-rejoin__copy {
    margin: 0;
    max-width: none;
  }

  .project-workflow-explainers {
    margin-top: 0;
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
    gap: 16px 18px;
    align-items: start;
  }

  .project-workflow-explainer {
    display: grid;
    gap: 8px;
    align-content: start;
  }

  .project-workflow-explainer__copy {
    margin: 0;
    max-width: none;
  }

  .project-workflow-explainers .project-workflow-explainer + .project-workflow-explainer {
    padding-left: 18px;
    border-left: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-stat-value {
    margin-top: 10px;
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--accent-deep);
    line-height: 1;
  }

  .project-stat-detail {
    margin: 8px 0 0;
    color: var(--muted);
    line-height: 1.55;
  }

  .project-implementation-surface {
    margin-top: 18px;
    display: grid;
    gap: 20px;
  }

  .project-implementation-primary,
  .project-implementation-proof,
  .project-implementation-measure {
    display: grid;
    gap: 14px;
  }

  .project-implementation-support {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 18px 20px;
    align-items: start;
    padding-top: 18px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-implementation-primary__intro,
  .project-implementation-proof__intro,
  .project-implementation-measure__intro {
    display: grid;
    gap: 8px;
    max-width: 48rem;
  }

  .project-implementation-primary__copy,
  .project-implementation-measure__copy {
    margin: 0;
    max-width: none;
  }

  .project-implementation-default-flow {
    --project-implementation-default-flow-gap: 36px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
    gap: var(--project-implementation-default-flow-gap);
  }

  .project-implementation-default-step {
    min-width: 0;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    gap: 10px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(22, 34, 45, 0.08);
    position: relative;
    min-height: 100%;
  }

  .project-implementation-default-step[data-continues="true"]::after {
    content: "→";
    position: absolute;
    top: 50%;
    right: calc(var(--project-implementation-default-flow-gap) / -2);
    transform: translate(50%, -50%);
    color: var(--accent-deep);
    font-weight: 600;
    font-size: 1.05rem;
    line-height: 1;
    background: transparent;
  }

  .project-implementation-default-step__index {
    margin-bottom: 0;
  }

  .project-implementation-default-step__title {
    font-size: var(--type-title-sm-size);
  }

  .project-implementation-default-step__command,
  .project-implementation-measure__command {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    min-height: 2.25rem;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(22, 34, 45, 0.08);
    color: var(--accent-deep);
    font-family: var(--font-mono);
    font-size: 0.84rem;
    line-height: 1.35;
    white-space: nowrap;
  }

  .project-implementation-default-step__copy,
  .project-implementation-proof-item__copy {
    margin: 0;
    max-width: none;
  }

  .project-implementation-proof-list {
    display: grid;
    gap: 10px;
  }

  .project-implementation-proof-item {
    display: grid;
    gap: 8px;
    align-content: start;
    padding: 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-implementation-proof-item__title,
  .project-implementation-measure__title {
    font-size: var(--type-title-sm-size);
  }

  .project-implementation-measure {
    padding: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(22, 34, 45, 0.08);
  }

  .project-implementation-measure__detail {
    display: grid;
    gap: 12px;
    justify-items: start;
    align-content: start;
  }

  .project-implementation-measure__outputs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .project-implementation-measure__output {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(173, 123, 58, 0.12);
    border: 1px solid rgba(173, 123, 58, 0.18);
    color: var(--accent-deep);
    font-size: var(--type-meta-size);
    font-weight: 600;
    line-height: 1.3;
  }

  .project-implementation-measure__links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    margin-top: 2px;
  }

  .project-implementation-measure__source-link {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 6px 10px;
    border-radius: 999px;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(22, 34, 45, 0.08);
    color: var(--muted);
    font-size: var(--type-meta-size);
    font-weight: 600;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .project-implementation-measure__source-link:hover,
  .project-implementation-measure__source-link:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(173, 123, 58, 0.2);
    background: rgba(255, 255, 255, 0.94);
    color: var(--accent-deep);
    box-shadow: 0 8px 18px rgba(22, 34, 45, 0.08);
  }

  @media (max-width: 900px) {
    .project-overview-grid,
    .project-overview-signals-grid,
    .project-workflow-explainers,
    .project-implementation-support {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-implementation-default-flow {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .project-implementation-default-step[data-continues="true"]::after {
      display: none;
    }

    .project-implementation-measure__command {
      white-space: normal;
    }

    .project-overview-grid .project-overview-story-item + .project-overview-story-item,
    .project-overview-signals-grid .project-signal + .project-signal {
      border-left: 0;
      border-top: 1px solid rgba(22, 34, 45, 0.08);
      padding-left: 0;
      padding-top: 14px;
    }

    .project-workflow-path {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      padding: 14px 0;
    }

    .project-workflow-path__flow,
    .project-workflow-rejoin__flow {
      position: relative;
      display: grid;
      gap: 10px;
      padding-left: 20px;
      align-items: start;
    }

    .project-workflow-path__flow::before,
    .project-workflow-rejoin__flow::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background: rgba(22, 34, 45, 0.14);
    }

    .project-workflow-path__flow .project-workflow-node,
    .project-workflow-rejoin__flow .project-workflow-node {
      position: relative;
      justify-self: start;
      justify-content: flex-start;
      border-radius: 14px;
    }

    .project-workflow-path__flow .project-workflow-node::before,
    .project-workflow-rejoin__flow .project-workflow-node::before {
      content: "";
      position: absolute;
      left: -16px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-deep);
      transform: translateY(-50%);
    }

    .project-workflow-flow-arrow {
      display: none;
    }

    .project-workflow-explainers .project-workflow-explainer + .project-workflow-explainer {
      border-left: 0;
      border-top: 1px solid rgba(22, 34, 45, 0.08);
      padding-left: 0;
      padding-top: 14px;
    }
  }

  @media (max-width: 640px) {
    .project-workflow-surface {
      padding: 20px;
    }

    .project-workflow-foundation__nodes {
      gap: 8px;
    }

    .project-implementation-default-step__command {
      white-space: normal;
    }
  }
`;
