// Resume page styles

import type React from "react";
import { spinKeyframes } from "../../styles";
import { siteStyles } from "../site/style";
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
  previewSidebar: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: "0 0 auto",
    position: "relative",
    zIndex: 2,
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

export const resumePageCss = `
  ${siteStyles}
  ${getResumeDocumentCss()}
  ${spinKeyframes}
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
    .resume-preview-layout {
      display: block !important;
      width: auto !important;
    }
    .resume-preview-sidebar {
      display: none !important;
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
  @media (max-width: 720px) {
    .resume-preview-layout {
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .resume-preview-sidebar {
      width: 100% !important;
      justify-content: flex-end !important;
      margin-top: 0 !important;
    }
    .resume-preview-sidebar .button {
      min-width: 0 !important;
      padding: 10px 12px !important;
    }
  }
`;
