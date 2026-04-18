import { config } from "../config";
import type { ResumeLayoutTemplate } from "../layouts";
import {
  DEFAULT_RESUME_PRESENTATION,
  getReadOnlyResumePresentation,
} from "../resume-presentation";
import { sanitizeName } from "../utils";

export interface ResumeSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

function defaultSettings(): ResumeSettings {
  return {
    themeColor: DEFAULT_RESUME_PRESENTATION.themeColor ?? config.defaultThemeColor,
    layoutTemplate: DEFAULT_RESUME_PRESENTATION.layoutTemplate ?? config.defaultLayoutTemplate,
  };
}

export function getResumeSettings(resumeName: string): ResumeSettings {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return defaultSettings();

  const settings = getReadOnlyResumePresentation(sanitized);
  if (settings) return settings;

  return defaultSettings();
}
