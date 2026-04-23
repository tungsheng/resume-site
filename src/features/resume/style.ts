// Resume page styles

import type React from "react";
import { siteStyles } from "../site/layout";

export const styles: Record<string, React.CSSProperties> = {
  app: {
    background: "linear-gradient(180deg, #fbf8f2 0%, #f8f4ec 50%, #ece3d4 100%)",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
};

const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export const resumePageCss = `
  ${siteStyles}
  ${spinKeyframes}
  .resume-site-main {
    padding-bottom: 40px;
  }

  .page-hero__links .resume-download-button {
    background: var(--ink);
    border-color: var(--ink);
    color: white;
    box-shadow: 0 10px 22px rgba(22, 34, 45, 0.16);
  }

  .page-hero__links .resume-download-button:hover,
  .page-hero__links .resume-download-button:focus-visible {
    background: #0f1923;
    border-color: #0f1923;
    color: white;
    box-shadow: 0 12px 26px rgba(22, 34, 45, 0.2);
  }

  .page-hero__links .resume-download-button:disabled {
    background: var(--ink);
    border-color: var(--ink);
    color: white;
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
  .resume-web-entry__date,
  .resume-web-entry__meta {
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

  .resume-web-contact-value,
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
