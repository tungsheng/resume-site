// Admin toolbar component

import React from "react";
import { COLOR_PRESETS, buttonStyles } from "../../../../styles";
import { Spinner, DownloadIcon } from "../../../../components";
import { styles } from "./style";

interface ToolbarProps {
  resumes: string[];
  currentResume: string;
  currentColor: string;
  onResumeChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onExport: () => void;
  onLogout: () => void;
  exporting: boolean;
}

export function Toolbar({
  resumes,
  currentResume,
  currentColor,
  onResumeChange,
  onColorChange,
  onExport,
  onLogout,
  exporting,
}: ToolbarProps) {
  return (
    <header style={styles.toolbar} role="banner">
      <h1 style={styles.title}>Resume Admin</h1>

      <div style={styles.group}>
        <label htmlFor="resume-select" style={styles.label}>Resume:</label>
        <select
          id="resume-select"
          value={currentResume}
          onChange={(e) => onResumeChange(e.target.value)}
          style={styles.select}
          aria-label="Select resume"
        >
          {resumes.length === 0 ? (
            <option value="">No resumes found</option>
          ) : (
            resumes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))
          )}
        </select>
      </div>

      <div style={styles.group}>
        <label htmlFor="color-picker" style={styles.label}>Theme:</label>
        <div style={styles.colorWrapper}>
          <input
            id="color-picker"
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            style={styles.colorPicker}
            aria-label="Choose theme color"
          />
          <div style={styles.presets} role="group" aria-label="Color presets">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                title={preset.title}
                onClick={() => onColorChange(preset.color)}
                style={{
                  ...styles.preset,
                  background: preset.color,
                  borderColor: preset.color === currentColor ? "#fff" : "transparent",
                }}
                aria-label={`${preset.title} theme`}
                aria-pressed={preset.color === currentColor}
              />
            ))}
          </div>
        </div>
      </div>

      <nav style={{ ...styles.group, marginLeft: "auto" }} aria-label="Admin actions">
        <button
          onClick={onExport}
          disabled={exporting}
          style={buttonStyles.btn}
          aria-label={exporting ? "Generating PDF" : "Export resume as PDF"}
          aria-busy={exporting}
        >
          {exporting ? (
            <>
              <Spinner size={16} color="#fff" />
              Generating...
            </>
          ) : (
            <>
              <DownloadIcon />
              Export PDF
            </>
          )}
        </button>
        <button
          onClick={onLogout}
          style={buttonStyles.btnSecondary}
          aria-label="Logout from admin"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
