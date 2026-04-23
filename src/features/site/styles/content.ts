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
    text-wrap: balance;
  }

  .page-title {
    font-size: var(--type-page-size);
    margin-bottom: 14px;
  }

  .page-hero--header .page-title {
    margin-bottom: 10px;
  }

  .home-hero-title {
    display: grid;
    justify-items: center;
    gap: 0.55rem;
  }

  .home-hero .home-hero-title {
    margin-bottom: clamp(38px, 4vw, 68px);
  }

  .home-hero-title__lead {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: var(--accent-deep);
    font-family: var(--font-sans);
    font-size: var(--type-meta-size);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .home-hero-title__name {
    display: block;
    font-size: var(--type-display-size);
  }

  .home-hero .page-hero__content {
    max-width: 56rem;
    margin: 0 auto;
    text-align: center;
  }

  @media (min-width: 721px) {
    .home-hero {
      position: relative;
      display: grid;
      align-items: center;
      justify-items: center;
      min-height: clamp(420px, 52vh, 620px);
      padding: clamp(42px, 9vw, 120px) 48px;
      margin-bottom: 34px;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 50% 35%, rgba(173, 123, 58, 0.2), transparent 35%),
        linear-gradient(145deg, rgba(255, 252, 247, 0.98), rgba(246, 238, 224, 0.9));
      box-shadow:
        var(--shadow),
        inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .home-hero::after {
      content: "";
      position: absolute;
      right: 12%;
      bottom: 18%;
      z-index: -1;
      width: 10rem;
      height: 10rem;
      border-radius: 999px;
      background: rgba(22, 34, 45, 0.04);
      filter: blur(2px);
    }
  }

  .home-hero .page-lede {
    margin-left: auto;
    margin-right: auto;
    max-width: 38rem;
  }

  .home-hero-subtitle {
    margin: 0 auto;
    color: var(--accent-deep);
    font-size: clamp(1.3rem, 2.4vw, 2rem);
    font-weight: 620;
    line-height: 1.18;
    letter-spacing: -0.03em;
  }

  .home-hero-subtitle + .page-lede {
    margin-top: 18px;
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
    overflow-wrap: break-word;
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
    gap: 10px 12px;
    margin-top: 16px;
    font-size: var(--type-meta-size);
  }

  .inline-links a,
  .inline-links button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    appearance: none;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
    line-height: inherit;
    color: var(--accent-deep);
    text-decoration: none;
    cursor: pointer;
  }

  .page-hero__links a,
  .page-hero__links button {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(22, 34, 45, 0.1);
    background: rgba(255, 255, 255, 0.74);
    color: var(--ink);
    box-shadow: inset 0 -1px 0 rgba(22, 34, 45, 0.04);
    min-height: 2.35rem;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .page-hero__links a:hover,
  .page-hero__links a:focus-visible,
  .page-hero__links button:hover,
  .page-hero__links button:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(173, 123, 58, 0.24);
    background: rgba(255, 255, 255, 0.98);
    color: var(--accent-deep);
    box-shadow: 0 8px 18px rgba(22, 34, 45, 0.08);
  }

  .page-hero__links button:disabled {
    cursor: progress;
    opacity: 0.72;
    transform: none;
    box-shadow: inset 0 -1px 0 rgba(22, 34, 45, 0.04);
  }

  @media (max-width: 640px) {
    .page-hero {
      border-radius: 24px;
      margin-bottom: 24px;
    }

    .home-hero {
      padding: 44px 20px;
    }

    .home-hero .home-hero-title {
      margin-bottom: 30px;
    }

    .home-hero-title__lead {
      font-size: 0.82rem;
    }

    .home-hero-title__name {
      font-size: clamp(3.25rem, 17vw, 4.4rem);
      line-height: 0.95;
    }

    .home-hero-subtitle {
      max-width: 18rem;
      font-size: clamp(1.25rem, 6.5vw, 1.5rem);
    }

    .page-hero--header {
      padding: 24px 22px;
    }

    .home-hero-title {
      row-gap: 0.1rem;
    }

    .page-hero__links {
      gap: 8px 14px;
      margin-top: 10px;
    }

    .page-hero__links a,
    .page-hero__links button {
      justify-content: center;
      min-height: 2.5rem;
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
    overflow-wrap: anywhere;
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
    overflow-wrap: anywhere;
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

  .project-implementation-proof-item__title {
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
    overflow-wrap: anywhere;
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

    .project-workflow-node {
      width: 100%;
      justify-content: flex-start;
    }

    .project-workflow-foundation__nodes {
      gap: 8px;
    }

    .project-implementation-default-step,
    .project-implementation-measure {
      padding: 14px;
    }

    .project-implementation-default-step__command,
    .project-implementation-measure__command {
      width: 100%;
      white-space: normal;
    }
  }

  @media (max-width: 380px) {
    .home-hero {
      padding: 36px 18px;
    }

    .home-hero .home-hero-title {
      margin-bottom: 24px;
    }

    .home-hero-title__name {
      font-size: clamp(3rem, 16vw, 3.8rem);
    }

    .page-hero__links {
      gap: 8px;
    }

    .project-workflow-surface,
    .project-implementation-surface {
      gap: 16px;
    }

    .project-implementation-default-step,
    .project-implementation-measure {
      padding: 12px;
    }
  }
`;
