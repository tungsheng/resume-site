import {
  DEFAULT_RESUME_TEMPLATE,
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";
import { sanitizeName } from "../../utils";

export interface ResumePresentationSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

export const DEFAULT_RESUME_SETTINGS: ResumePresentationSettings = {
  themeColor: "#c9a86c",
  layoutTemplate: DEFAULT_RESUME_TEMPLATE,
};

const READ_ONLY_RESUME_SETTINGS: Record<string, ResumePresentationSettings> = {
  "tony-lee": {
    themeColor: "#27ae60",
    layoutTemplate: "minimal-timeline",
  },
};

export function getResumeSettings(
  resumeName: string,
  fallback: ResumePresentationSettings = DEFAULT_RESUME_SETTINGS
): ResumePresentationSettings {
  const sanitized = sanitizeName(resumeName);
  if (!sanitized) return fallback;

  return READ_ONLY_RESUME_SETTINGS[sanitized] ?? fallback;
}

export async function loadResumeSettings(
  resumeName: string,
  fallback: ResumePresentationSettings = getResumeSettings(resumeName)
): Promise<ResumePresentationSettings> {
  try {
    const res = await fetch(`/api/settings/${encodeURIComponent(resumeName)}`);
    if (!res.ok) return fallback;

    const settings = (await res.json()) as {
      themeColor?: unknown;
      layoutTemplate?: unknown;
    };

    return {
      themeColor:
        typeof settings.themeColor === "string"
          ? settings.themeColor
          : fallback.themeColor,
      layoutTemplate: isResumeLayoutTemplate(settings.layoutTemplate)
        ? settings.layoutTemplate
        : fallback.layoutTemplate,
    };
  } catch {
    return fallback;
  }
}

export async function requestPublicResumePdf(input: {
  name: string;
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}): Promise<Blob> {
  const res = await fetch("/api/public-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const errorBody = (await res.json()) as { error?: string };
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // Keep the fallback error message when the response is not JSON.
    }
    throw new Error(message);
  }

  return res.blob();
}
