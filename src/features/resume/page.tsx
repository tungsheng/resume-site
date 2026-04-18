import React, { useEffect, useState } from "react";
import { DownloadIcon, ResumeView, Spinner, ToastContainer, type Toast } from "../../components";
import { downloadBlob, useToast } from "../../hooks";
import type { ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";
import { PublicSiteHeader } from "../site/header";
import {
  DEFAULT_PUBLIC_RESUME_SETTINGS,
  loadPublicResumeSettings,
  requestPublicResumePdf,
} from "../site/public-resume";
import { useDocumentTitle } from "../site/use-document-title";
import { calculateResumePreviewScale } from "./preview-scale";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX, resumePageCss, styles } from "./style";

function getResumeName(): string {
  const match = window.location.pathname.match(/\/resume\/(.+)/);
  return match?.[1] ?? "";
}

interface ResumePageContentProps {
  data: ResumeData;
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
  previewScale: number;
  downloading: boolean;
  onDownload: () => void;
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export function ResumePageContent({
  data,
  themeColor,
  layoutTemplate,
  previewScale,
  downloading,
  onDownload,
  toasts,
  onRemoveToast,
}: ResumePageContentProps) {
  return (
    <div style={styles.app} className="resume-app">
      <style>{resumePageCss}</style>

      <PublicSiteHeader activeNav="resume" />

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
            />
          </div>

          <div style={styles.previewSidebar} className="resume-preview-sidebar">
            <button
              type="button"
              onClick={onDownload}
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

      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
    </div>
  );
}

function ResumeStatusView({ message, busy = false }: { message: string; busy?: boolean }) {
  return (
    <div style={styles.app} className="resume-app" role="main" aria-busy={busy || undefined}>
      <div style={styles.loading} role={busy ? undefined : "alert"}>
        {busy ? (
          <>
            <Spinner size={32} />
            <span style={{ marginLeft: 12 }}>{message}</span>
          </>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

export function ResumePage() {
  const resumeName = getResumeName();
  const [data, setData] = useState<ResumeData | null>(null);
  const [themeColor, setThemeColor] = useState(DEFAULT_PUBLIC_RESUME_SETTINGS.themeColor);
  const [layoutTemplate, setLayoutTemplate] = useState(
    DEFAULT_PUBLIC_RESUME_SETTINGS.layoutTemplate
  );
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  useDocumentTitle(data ? `${data.header.name} - Resume` : "Resume");

  useEffect(() => {
    void loadResume();
  }, [resumeName]);

  useEffect(() => {
    const updateScale = () => {
      setPreviewScale(calculateResumePreviewScale(window.innerWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  async function loadResume(): Promise<void> {
    try {
      const settings = await loadPublicResumeSettings(resumeName);
      setThemeColor(settings.themeColor);
      setLayoutTemplate(settings.layoutTemplate);

      const res = await fetch(`/api/resume/${encodeURIComponent(resumeName)}`);
      if (!res.ok) {
        setError("Resume not found");
        return;
      }

      const resumeData = (await res.json()) as ResumeData;
      setData(resumeData);
      setError(null);
    } catch {
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(): Promise<void> {
    setDownloading(true);
    try {
      const blob = await requestPublicResumePdf({
        name: resumeName,
        themeColor,
        layoutTemplate,
      });
      downloadBlob(blob, `${resumeName.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF downloaded successfully", "success");
    } catch (err) {
      console.error("Failed to download PDF:", err);
      const message =
        err instanceof Error ? err.message : "Failed to download PDF. Please try again.";
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <ResumeStatusView message="Loading resume..." busy />;
  }

  if (error || !data) {
    return <ResumeStatusView message={error || "Resume not found"} />;
  }

  return (
    <ResumePageContent
      data={data}
      themeColor={themeColor}
      layoutTemplate={layoutTemplate}
      previewScale={previewScale}
      downloading={downloading}
      onDownload={() => {
        void handleDownload();
      }}
      toasts={toasts}
      onRemoveToast={removeToast}
    />
  );
}
