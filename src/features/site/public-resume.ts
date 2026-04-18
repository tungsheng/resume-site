import {
  DEFAULT_RESUME_TEMPLATE,
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";
import {
  DEFAULT_RESUME_PRESENTATION,
  getReadOnlyResumePresentation,
} from "../../resume-presentation";

export interface PublicResumeSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

export const DEFAULT_PUBLIC_RESUME_SETTINGS: PublicResumeSettings = {
  themeColor: DEFAULT_RESUME_PRESENTATION.themeColor,
  layoutTemplate: DEFAULT_RESUME_PRESENTATION.layoutTemplate ?? DEFAULT_RESUME_TEMPLATE,
};

export function getPublicResumeFallbackSettings(
  resumeName: string,
  fallback: PublicResumeSettings = DEFAULT_PUBLIC_RESUME_SETTINGS
): PublicResumeSettings {
  return getReadOnlyResumePresentation(resumeName) ?? fallback;
}

export async function loadPublicResumeSettings(
  resumeName: string,
  fallback: PublicResumeSettings = getPublicResumeFallbackSettings(resumeName)
): Promise<PublicResumeSettings> {
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
