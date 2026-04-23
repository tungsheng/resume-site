// Resume page styles

import type React from "react";
import { siteStyles } from "../site/layout";
import { getResumeDocumentCss, LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "./document-css";

export { LETTER_HEIGHT_PX, LETTER_WIDTH_PX };

export const styles: Record<string, React.CSSProperties> = {
  app: {
    background: "linear-gradient(180deg, #fbf8f2 0%, #f8f4ec 50%, #ece3d4 100%)",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  pageWrapper: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 16,
    paddingRight: 16,
    maxWidth: 1180,
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },
  previewLayout: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    width: "fit-content",
    maxWidth: "100%",
    position: "relative",
    isolation: "isolate",
  },
  previewShell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flex: "0 0 auto",
    position: "relative",
    zIndex: 1,
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#666",
    fontSize: 16,
  },
};

const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export const resumePageCss = `
  ${siteStyles}
  ${getResumeDocumentCss()}
  ${spinKeyframes}
  .resume-view-switch {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .resume-view-switch .button[aria-pressed="true"] {
    background: var(--ink);
    color: white;
    border-color: transparent;
  }

  .resume-view-switch .button[aria-pressed="false"] {
    background: rgba(255, 255, 255, 0.82);
    color: var(--ink);
    border-color: rgba(22, 34, 45, 0.12);
  }

  .resume-site-main {
    padding-bottom: 40px;
  }

  .resume-site-main--preview {
    padding-bottom: 14px;
  }

  .resume-web-view {
    display: none;
  }

  .resume-web-view--visible {
    display: block;
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
  }

  .resume-page-wrapper--screen-hidden {
    display: none !important;
  }

  .resume-page-wrapper--preview {
    padding-top: 6px !important;
  }

  @page {
    size: Letter;
    margin: 0;
  }
  @media print {
    html, body, #root {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    .resume-app {
      background: white !important;
      min-height: auto !important;
    }
    .resume-app > :not(.resume-page-wrapper) {
      display: none !important;
    }
    .resume-page-wrapper {
      margin: 0 !important;
      padding: 0 !important;
      min-height: auto !important;
    }
    .resume-page-wrapper--screen-hidden {
      display: flex !important;
    }
    .resume-web-view,
    .resume-view-switch {
      display: none !important;
    }
    .resume-preview-layout {
      display: block !important;
      width: auto !important;
    }
    .resume-preview-shell {
      width: auto !important;
    }
    .resume-preview-shell > :not(.resume-sheet) {
      display: none !important;
    }
    .resume-preview-shell > .resume-sheet {
      margin: 0 !important;
      min-height: auto !important;
    }
    .resume-preview-shell > .resume-sheet > .resume-sheet__page {
      margin: 0 !important;
      transform: none !important;
    }
    .resume-preview-shell > .resume-sheet > .resume-sheet__page > .resume-document {
      margin: 0 !important;
      box-shadow: none !important;
    }
  }
  @media (max-width: 980px) {
    .resume-web-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 720px) {
    .resume-page-hero__actions > .button,
    .resume-view-switch {
      width: 100%;
    }

    .resume-view-switch {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .resume-view-switch .button {
      justify-content: center;
    }

    .resume-site-main {
      padding-bottom: 24px;
    }
    .resume-site-main--preview {
      padding-bottom: 8px;
    }
    .resume-web-entry__header {
      grid-template-columns: minmax(0, 1fr);
      display: grid;
      gap: 8px;
    }
    .resume-web-entry__date {
      text-align: left;
    }
    .resume-preview-layout {
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }
  }
`;
