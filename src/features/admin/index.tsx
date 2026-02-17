// Admin dashboard page

import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import type { ResumeData } from "../../types";
import {
  DEFAULT_RESUME_TEMPLATE,
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";
import { getCSRFToken, setCSRFToken, clearCSRFToken, downloadBlob, useToast } from "../../hooks";
import { colors, spinKeyframes } from "../../styles";
import { ToastContainer } from "../../components";
import { LoginModal, Toolbar, ResumePreview } from "./components";
import { styles } from "./style";

function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [resumes, setResumes] = useState<string[]>([]);
  const [currentResume, setCurrentResume] = useState("");
  const [currentColor, setCurrentColor] = useState(colors.themeColor);
  const [currentTemplate, setCurrentTemplate] = useState<ResumeLayoutTemplate>(
    DEFAULT_RESUME_TEMPLATE
  );
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (currentResume) loadResume();
  }, [currentResume]);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      const csrfToken = res.headers.get("X-CSRF-Token");
      if (csrfToken) setCSRFToken(csrfToken);
      setAuthenticated(data.authenticated);
      if (data.authenticated) loadResumeList();
    } catch {
      setAuthenticated(false);
    }
  };

  const loadResumeList = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      setResumes(data.resumes || []);
      if (data.resumes?.length > 0) setCurrentResume(data.resumes[0]);
    } catch (err) {
      console.error("Failed to load resumes:", err);
      showToast("Failed to load resume list", "error");
    }
  };

  const loadResume = async () => {
    if (!currentResume) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/resume/${encodeURIComponent(currentResume)}`);
      if (!res.ok) throw new Error("Failed to load resume");
      const data = await res.json();
      setResumeData(data);
      await loadSettings();
    } catch (err) {
      console.error("Failed to load resume:", err);
      setResumeData(null);
      showToast("Failed to load resume", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    if (!currentResume) return;
    try {
      const res = await fetch(`/api/settings/${encodeURIComponent(currentResume)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.themeColor) setCurrentColor(data.themeColor);
        if (isResumeLayoutTemplate(data.layoutTemplate)) {
          setCurrentTemplate(data.layoutTemplate);
        } else {
          setCurrentTemplate(DEFAULT_RESUME_TEMPLATE);
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const saveSettings = useCallback(
    async (themeColor: string, layoutTemplate: ResumeLayoutTemplate) => {
      if (!currentResume) return;
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const csrfToken = getCSRFToken();
        if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
        await fetch(`/api/settings/${encodeURIComponent(currentResume)}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ themeColor, layoutTemplate }),
        });
      } catch (err) {
        console.error("Failed to save settings:", err);
        showToast("Failed to save settings", "error");
      }
    },
    [currentResume, showToast]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setCurrentColor(color);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        await saveSettings(color, currentTemplate);
      }, 500);
    },
    [currentTemplate, saveSettings]
  );

  const handleTemplateChange = useCallback(
    (template: ResumeLayoutTemplate) => {
      setCurrentTemplate(template);
      void saveSettings(currentColor, template);
    },
    [currentColor, saveSettings]
  );

  const handleExport = async () => {
    if (!currentResume) return;
    setExporting(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const csrfToken = getCSRFToken();
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: currentResume,
          themeColor: currentColor,
          layoutTemplate: currentTemplate,
        }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to export PDF");

      const blob = await res.blob();
      downloadBlob(blob, `${currentResume.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF exported successfully", "success");
    } catch (err) {
      console.error("Failed to export PDF:", err);
      showToast("Failed to export PDF. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    clearCSRFToken();
    setAuthenticated(false);
  };

  const handleLogin = () => {
    setAuthenticated(true);
    loadResumeList();
  };

  if (authenticated === null) return null;

  return (
    <div style={styles.app}>
      <style>{spinKeyframes}</style>

      {!authenticated && <LoginModal onLogin={handleLogin} />}

      {authenticated && (
        <>
          <Toolbar
            resumes={resumes}
            currentResume={currentResume}
            currentColor={currentColor}
            currentTemplate={currentTemplate}
            onResumeChange={setCurrentResume}
            onColorChange={handleColorChange}
            onTemplateChange={handleTemplateChange}
            onExport={handleExport}
            onLogout={handleLogout}
            exporting={exporting}
          />
          <main style={styles.mainContent}>
            <ResumePreview
              data={resumeData}
              themeColor={currentColor}
              layoutTemplate={currentTemplate}
              loading={loading}
            />
          </main>
        </>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// Mount with HMR support
const container = document.getElementById("root");
if (container) {
  const root = (globalThis as any).__ADMIN_ROOT__ ?? createRoot(container);
  (globalThis as any).__ADMIN_ROOT__ = root;
  root.render(<Admin />);
}
