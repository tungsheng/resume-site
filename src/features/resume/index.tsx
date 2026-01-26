// Public resume page

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { ResumeData } from "../../types";
import { downloadBlob, useToast } from "../../hooks";
import { spinKeyframes } from "../../styles";
import { ResumeView, Spinner, ToastContainer } from "../../components";
import { Toolbar } from "./components";
import { styles } from "./style";

function getResumeName(): string {
  const match = window.location.pathname.match(/\/resume\/(.+)/);
  return match?.[1] ?? "";
}

function Resume() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [themeColor, setThemeColor] = useState("#c9a86c");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const resumeName = getResumeName();

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const settingsRes = await fetch(`/api/settings/${encodeURIComponent(resumeName)}`);
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.themeColor) setThemeColor(settings.themeColor);
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

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/public-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resumeName }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      downloadBlob(blob, `${resumeName.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF downloaded successfully", "success");
    } catch (err) {
      console.error("Failed to download PDF:", err);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.app} role="main" aria-busy="true">
        <div style={styles.loading}>
          <Spinner size={32} />
          <span style={{ marginLeft: 12 }}>Loading resume...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.app} role="main">
        <div style={styles.loading} role="alert">
          {error || "Resume not found"}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{`
        ${spinKeyframes}
        @media print {
          .toolbar { display: none !important; }
          body { background: white; }
        }
        @media (max-width: 900px) {
          .page-wrapper > div {
            transform: scale(0.6);
            transform-origin: top center;
          }
        }
      `}</style>

      <Toolbar
        title={`${data.header.name}'s Resume`}
        onPrint={handlePrint}
        onDownload={handleDownload}
        downloading={downloading}
      />

      <main style={styles.pageWrapper} className="page-wrapper">
        <ResumeView data={data} themeColor={themeColor} />
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
