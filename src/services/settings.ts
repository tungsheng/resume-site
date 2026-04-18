import { config } from "../config";
import type { ResumeLayoutTemplate } from "../layouts";
import { sanitizeName } from "../utils";

export interface ResumeSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

const READ_ONLY_SETTINGS: Record<string, ResumeSettings> = {
  // Preserve the current public tony-lee presentation that was configured in admin.
  "tony-lee": {
    themeColor: "#27ae60",
    layoutTemplate: "minimal-timeline",
  },
};

function defaultSettings(): ResumeSettings {
  return {
    themeColor: config.defaultThemeColor,
    layoutTemplate: config.defaultLayoutTemplate,
  };
}

export function getResumeSettings(resumeName: string): ResumeSettings {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return defaultSettings();

  const settings = READ_ONLY_SETTINGS[sanitized];
  if (settings) return settings;

  return defaultSettings();
}

export function getThemeColor(resumeName: string): string {
  return getResumeSettings(resumeName).themeColor;
}

export function getLayoutTemplate(resumeName: string): ResumeLayoutTemplate {
  return getResumeSettings(resumeName).layoutTemplate;
}
