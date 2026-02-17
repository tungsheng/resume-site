// Settings management

import type { Statement } from "bun:sqlite";
import { config } from "../config";
import {
  isResumeLayoutTemplate,
  normalizeResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../layouts";
import { getDb } from "../db";
import { sanitizeName, isValidColor } from "../utils";

export interface ResumeSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

// Fallback in-memory store when database unavailable
export const memorySettings = new Map<string, ResumeSettings>();

// Cached prepared statements
let stmtGet: Statement | null = null;
let stmtUpsert: Statement | null = null;

function getStatements() {
  const db = getDb();
  if (!db) return null;

  if (!stmtGet) {
    stmtGet = db.prepare(`
      SELECT theme_color, layout_template
      FROM settings
      WHERE resume_name = ?
    `);
    stmtUpsert = db.prepare(`
      INSERT INTO settings (resume_name, theme_color, layout_template, updated_at)
      VALUES (?, ?, ?, unixepoch())
      ON CONFLICT(resume_name) DO UPDATE SET
        theme_color = excluded.theme_color,
        layout_template = excluded.layout_template,
        updated_at = unixepoch()
    `);
  }

  return { stmtGet: stmtGet!, stmtUpsert: stmtUpsert! };
}

function defaultSettings(): ResumeSettings {
  return {
    themeColor: config.defaultThemeColor,
    layoutTemplate: config.defaultLayoutTemplate,
  };
}

export function getResumeSettings(resumeName: string): ResumeSettings {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return defaultSettings();

  const stmts = getStatements();
  if (stmts) {
    const result = stmts.stmtGet.get(sanitized) as
      | { theme_color: string; layout_template: string }
      | null;
    if (result) {
      return {
        themeColor: isValidColor(result.theme_color)
          ? result.theme_color
          : config.defaultThemeColor,
        layoutTemplate: normalizeResumeLayoutTemplate(result.layout_template),
      };
    }
  } else {
    const settings = memorySettings.get(sanitized);
    if (settings) return settings;
  }

  return defaultSettings();
}

export function saveResumeSettings(
  resumeName: string,
  themeColor: string,
  layoutTemplate: ResumeLayoutTemplate
): boolean {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return false;
  if (!isValidColor(themeColor)) return false;
  if (!isResumeLayoutTemplate(layoutTemplate)) return false;

  const stmts = getStatements();
  if (stmts) {
    stmts.stmtUpsert.run(sanitized, themeColor, layoutTemplate);
  } else {
    memorySettings.set(sanitized, { themeColor, layoutTemplate });
  }

  return true;
}

export function getThemeColor(resumeName: string): string {
  return getResumeSettings(resumeName).themeColor;
}

export function getLayoutTemplate(resumeName: string): ResumeLayoutTemplate {
  return getResumeSettings(resumeName).layoutTemplate;
}

export function saveThemeColor(
  resumeName: string,
  themeColor: string
): boolean {
  const current = getResumeSettings(resumeName);
  return saveResumeSettings(resumeName, themeColor, current.layoutTemplate);
}

export function saveLayoutTemplate(
  resumeName: string,
  layoutTemplate: ResumeLayoutTemplate
): boolean {
  const current = getResumeSettings(resumeName);
  return saveResumeSettings(resumeName, current.themeColor, layoutTemplate);
}
