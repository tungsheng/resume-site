// Settings management

import { config } from "../config";
import { getDb } from "../db";
import { sanitizeName, isValidColor } from "../utils";

// Fallback in-memory store when database unavailable
export const memorySettings = new Map<string, string>();

export function getThemeColor(resumeName: string): string {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return config.defaultThemeColor;

  const db = getDb();
  if (db) {
    const stmt = db.prepare("SELECT theme_color FROM settings WHERE resume_name = ?");
    const result = stmt.get(sanitized) as { theme_color: string } | null;
    if (result) {
      return result.theme_color;
    }
  } else {
    const color = memorySettings.get(sanitized);
    if (color) return color;
  }

  return config.defaultThemeColor;
}

export function saveThemeColor(
  resumeName: string,
  themeColor: string
): boolean {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return false;
  if (!isValidColor(themeColor)) return false;

  const db = getDb();
  if (db) {
    const stmt = db.prepare(`
      INSERT INTO settings (resume_name, theme_color, updated_at)
      VALUES (?, ?, unixepoch())
      ON CONFLICT(resume_name) DO UPDATE SET
        theme_color = excluded.theme_color,
        updated_at = unixepoch()
    `);
    stmt.run(sanitized, themeColor);
  } else {
    memorySettings.set(sanitized, themeColor);
  }

  return true;
}
