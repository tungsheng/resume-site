// Resume page styles

import { siteStyles } from "../site/layout";

const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export const resumePageCss = `
  ${siteStyles}
  ${spinKeyframes}
  @keyframes resume-toast-slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .resume-page-app {
    background: linear-gradient(180deg, #fbf8f2 0%, #f8f4ec 50%, #ece3d4 100%);
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  .resume-site-main {
    padding-bottom: 40px;
  }

  .resume-toast-container {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 3000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .resume-toast {
    padding: 12px 20px;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: resume-toast-slide-in 0.2s ease-out;
    max-width: min(360px, calc(100vw - 40px));
    overflow-wrap: break-word;
  }

  .resume-toast--error {
    background: #e94560;
  }

  .resume-toast--success {
    background: #27ae60;
  }

  .page-hero__links .resume-download-button {
    background: var(--interactive-surface-active-bg);
    border-color: var(--interactive-surface-active-border);
    color: var(--interactive-surface-active-color);
    box-shadow: var(--interactive-surface-active-shadow);
  }

  .page-hero__links .resume-download-button:hover,
  .page-hero__links .resume-download-button:focus-visible {
    background: var(--interactive-surface-active-bg);
    border-color: var(--interactive-surface-active-border-strong);
    color: var(--interactive-surface-active-color);
    box-shadow: var(--interactive-surface-active-shadow);
  }

  .page-hero__links .resume-download-button:disabled {
    background: var(--interactive-surface-active-bg);
    border-color: var(--interactive-surface-active-border);
    color: var(--interactive-surface-active-color);
  }

  .resume-web-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.85fr);
    gap: 20px;
    align-items: start;
  }

  .resume-web-main,
  .resume-web-sidebar,
  .resume-web-stack {
    display: grid;
    gap: 16px;
    min-width: 0;
  }

  .resume-web-main,
  .resume-web-sidebar {
    align-content: start;
  }

  .resume-web-sidebar {
    align-self: start;
  }

  .resume-web-section {
    margin: 0;
  }

  .resume-web-section__title,
  .resume-web-card__title {
    margin: 0;
    font-size: var(--type-title-md-size);
    line-height: var(--type-title-leading);
  }

  .resume-web-section__title {
    margin-bottom: 14px;
  }

  .resume-web-card {
    background: var(--surface);
    border: 1px solid rgba(22, 34, 45, 0.08);
    box-shadow: var(--shadow);
    border-radius: var(--radius-lg);
    padding: 20px;
    min-width: 0;
  }

  .resume-web-card--compact {
    padding: 18px 20px;
  }

  .resume-web-card--entry {
    padding: 22px;
  }

  .resume-web-copy {
    margin: 12px 0 0;
    font-size: var(--type-body-size);
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
  }

  .resume-web-entry__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .resume-web-entry__title {
    margin: 0;
    font-size: var(--type-title-sm-size);
    line-height: var(--type-title-leading);
    overflow-wrap: break-word;
  }

  .resume-web-entry__subtitle,
  .resume-web-entry__date {
    margin: 6px 0 0;
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
  }

  .resume-web-entry__date {
    font-size: var(--type-meta-size);
    font-weight: 600;
    text-align: right;
    flex-shrink: 0;
  }

  .resume-web-entry__date--inline {
    text-align: left;
  }

  .resume-web-list {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: grid;
    gap: 10px;
  }

  .resume-web-list li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: start;
    line-height: var(--type-body-compact-leading);
  }

  .resume-web-list .resume-list-bullet {
    color: var(--accent-deep);
  }

  .resume-web-contact-list {
    display: grid;
    gap: 12px;
    margin-top: 12px;
  }

  .resume-web-contact-item {
    display: grid;
    gap: 4px;
  }

  .resume-web-contact-label {
    font-size: var(--type-label-size);
    font-weight: 700;
    line-height: var(--type-label-leading);
    letter-spacing: var(--type-label-tracking);
    text-transform: uppercase;
    color: var(--accent-deep);
  }

  .resume-web-contact-link {
    font-size: var(--type-body-size);
    color: var(--ink);
    text-decoration: none;
    line-height: var(--type-meta-leading);
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .resume-web-skill-list {
    display: grid;
    gap: 14px;
  }

  .resume-web-skill-row {
    display: grid;
    gap: 4px;
  }

  .resume-web-skill-row + .resume-web-skill-row {
    padding-top: 14px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
  }

  .resume-web-skill-label {
    margin: 0;
    font-size: var(--type-meta-size);
    line-height: var(--type-title-leading);
  }

  .resume-web-skill-items {
    margin: 0;
    font-size: var(--type-body-size);
    color: var(--muted);
    line-height: var(--type-body-compact-leading);
    overflow-wrap: break-word;
  }

  @media (max-width: 980px) {
    .resume-web-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 720px) {
    .resume-site-main {
      padding-bottom: 24px;
    }
    .page-hero__links {
      align-items: stretch;
    }
    .page-hero__links .resume-download-button {
      width: 100%;
      justify-content: center;
    }
    .page-hero__links a {
      flex: 1 1 auto;
      justify-content: center;
    }
    .resume-web-card,
    .resume-web-card--entry,
    .resume-web-card--compact {
      padding: 18px;
    }
    .resume-web-entry__header {
      grid-template-columns: minmax(0, 1fr);
      display: grid;
      gap: 8px;
    }
    .resume-web-entry__date {
      text-align: left;
    }
  }
  @media (max-width: 380px) {
    .resume-web-main,
    .resume-web-sidebar,
    .resume-web-stack {
      gap: 12px;
    }
    .resume-web-section__title {
      margin-bottom: 10px;
    }
    .resume-web-card,
    .resume-web-card--entry,
    .resume-web-card--compact {
      padding: 16px;
      border-radius: 18px;
    }
    .resume-web-list {
      gap: 8px;
    }
    .resume-web-list li {
      gap: 8px;
    }
  }
`;
