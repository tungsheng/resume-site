import { useState } from "react";
import { downloadBlob, useToast } from "../../hooks";
import type { ResumeLayoutTemplate } from "../../layouts";
import { requestPublicResumePdf } from "./presentation";

interface UseResumePdfDownloadInput {
  resumeName: string;
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
  filename?: string;
  successMessage?: string;
  failureMessage?: string;
}

export function useResumePdfDownload({
  resumeName,
  themeColor,
  layoutTemplate,
  filename,
  successMessage = "Resume PDF downloaded",
  failureMessage = "Failed to download the resume PDF. Please try again.",
}: UseResumePdfDownloadInput) {
  const [downloading, setDownloading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  async function downloadPdf(): Promise<void> {
    setDownloading(true);
    try {
      const blob = await requestPublicResumePdf({
        name: resumeName,
        themeColor,
        layoutTemplate,
      });
      downloadBlob(blob, filename ?? `${resumeName.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast(successMessage, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : failureMessage;
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  }

  return {
    downloading,
    downloadPdf,
    toasts,
    removeToast,
  };
}
