export const contentStyles = `
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

  .page-hero--header {
    padding-top: 30px;
    padding-bottom: 28px;
    margin-bottom: 24px;
  }

  .page-hero--split {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.8fr);
    gap: 22px;
    align-items: start;
  }

  .page-hero__content {
    max-width: 58rem;
  }

  .page-hero--centered .page-hero__content {
    max-width: 56rem;
    margin: 0 auto;
    text-align: center;
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

  .page-hero--header .page-title {
    margin-bottom: 10px;
  }

  .page-hero--centered .page-title {
    font-size: clamp(4rem, 9vw, 7rem);
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
    font-size: clamp(1.3rem, 2.4vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--accent-deep);
  }

  .home-hero-title__name {
    font-size: clamp(4rem, 9vw, 7rem);
  }

  .page-subtitle {
    margin: 0;
    font-size: clamp(1.05rem, 1.8vw, 1.4rem);
    font-weight: 600;
    color: #213748;
    line-height: 1.4;
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

  .page-hero__links {
    gap: 10px 18px;
    margin-top: 12px;
    font-size: 0.92rem;
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
  .bullet-list {
    margin: 16px 0 0;
    padding-left: 20px;
    display: grid;
    gap: 10px;
    line-height: 1.6;
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
`;
