import {
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";

export interface ResumePresentationSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

const PUBLIC_RESUME_SETTINGS: ResumePresentationSettings = {
  themeColor: "#27ae60",
  layoutTemplate: "minimal-timeline",
};

export function getResumeSettings(): ResumePresentationSettings {
  return PUBLIC_RESUME_SETTINGS;
}

export async function loadResumeSettings(
  fallback: ResumePresentationSettings = getResumeSettings()
): Promise<ResumePresentationSettings> {
  try {
    const res = await fetch("/api/settings");
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

export async function requestPublicResumePdf(
  input: ResumePresentationSettings
): Promise<Blob> {
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
