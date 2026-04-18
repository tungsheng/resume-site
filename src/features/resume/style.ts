// Resume page styles

import type React from "react";
import { spinKeyframes } from "../../styles";
import { siteStyles } from "../site/style";

export const LETTER_WIDTH_PX = 8.5 * 96;
export const LETTER_HEIGHT_PX = 11 * 96;

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
  },
  previewShell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flex: "0 0 auto",
  },
  previewSidebar: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: "0 0 auto",
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
      box-shadow: none !important;
      transform: none !important;
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
