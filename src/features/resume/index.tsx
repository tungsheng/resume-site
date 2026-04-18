// Public resume page

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { ResumeData } from "../../types";
import {
  DEFAULT_RESUME_TEMPLATE,
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";
import { downloadBlob, useToast } from "../../hooks";
import { spinKeyframes } from "../../styles";
import { ResumeView, Spinner, ToastContainer, DownloadIcon } from "../../components";
import { siteStyles } from "../site/style";
import { calculateResumePreviewScale } from "./preview-scale";
import { Toolbar } from "./components";
import { styles } from "./style";

const LETTER_WIDTH_PX = 8.5 * 96;
const LETTER_HEIGHT_PX = 11 * 96;

function getResumeName(): string {
  const match = window.location.pathname.match(/\/resume\/(.+)/);
  return match?.[1] ?? "";
}

function Resume() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [themeColor, setThemeColor] = useState("#c9a86c");
  const [layoutTemplate, setLayoutTemplate] = useState<ResumeLayoutTemplate>(
    DEFAULT_RESUME_TEMPLATE
  );
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const resumeName = getResumeName();

  useEffect(() => {
    loadResume();
  }, []);

  useEffect(() => {
    const updateScale = () => {
      setPreviewScale(calculateResumePreviewScale(window.innerWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const loadResume = async () => {
    try {
      const settingsRes = await fetch(`/api/settings/${encodeURIComponent(resumeName)}`);
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.themeColor) setThemeColor(settings.themeColor);
        if (isResumeLayoutTemplate(settings.layoutTemplate)) {
          setLayoutTemplate(settings.layoutTemplate);
        }
      }

      const res = await fetch(`/api/resume/${encodeURIComponent(resumeName)}`);
      if (!res.ok) {
        setError("Resume not found");
        return;
      }

      const resumeData = await res.json();
      setData(resumeData);
      document.title = `${resumeData.header.name} - Resume`;
    } catch {
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/public-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resumeName,
          themeColor,
          layoutTemplate,
        }),
      });

      if (!res.ok) {
        let message = "Failed to generate PDF";
        try {
          const errorBody = await res.json() as { error?: string };
          if (errorBody?.error) message = errorBody.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await res.blob();
      downloadBlob(blob, `${resumeName.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF downloaded successfully", "success");
    } catch (err) {
      console.error("Failed to download PDF:", err);
      const message = err instanceof Error ? err.message : "Failed to download PDF. Please try again.";
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.app} className="resume-app" role="main" aria-busy="true">
        <div style={styles.loading}>
          <Spinner size={32} />
          <span style={{ marginLeft: 12 }}>Loading resume...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.app} className="resume-app" role="main">
        <div style={styles.loading} role="alert">
          {error || "Resume not found"}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app} className="resume-app">
      <style>{`
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
      `}</style>

      <Toolbar />

      <main
        style={{
          ...styles.pageWrapper,
          minHeight: Math.ceil(LETTER_HEIGHT_PX * previewScale) + 16,
        }}
        className="page-wrapper resume-page-wrapper"
      >
        <div style={styles.previewLayout} className="resume-preview-layout">
          <div
            style={{
              ...styles.previewShell,
              width: Math.ceil(LETTER_WIDTH_PX * previewScale),
            }}
            className="resume-preview-shell"
          >
            <ResumeView
              data={data}
              themeColor={themeColor}
              layoutTemplate={layoutTemplate}
              scale={previewScale}
              outerMargin={0}
            />
          </div>

          <div style={styles.previewSidebar} className="resume-preview-sidebar">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="button button--secondary button--compact"
              aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
              aria-busy={downloading}
              title="Download resume PDF"
            >
              {downloading ? (
                <>
                  <Spinner size={16} color="#fff" />
                  PDF
                </>
              ) : (
                <>
                  <DownloadIcon />
                  PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// Mount with HMR support
const container = document.getElementById("root");
if (container) {
  const root = (globalThis as any).__RESUME_ROOT__ ?? createRoot(container);
  (globalThis as any).__RESUME_ROOT__ = root;
  root.render(<Resume />);
}
