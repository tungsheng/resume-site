import { DEFAULT_RESUME_TEMPLATE, type ResumeLayoutTemplate } from "./layouts";

export interface ResumePresentationSettings {
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
}

export const DEFAULT_RESUME_PRESENTATION: ResumePresentationSettings = {
  themeColor: "#c9a86c",
  layoutTemplate: DEFAULT_RESUME_TEMPLATE,
};

const READ_ONLY_RESUME_PRESENTATION: Record<string, ResumePresentationSettings> = {
  "tony-lee": {
    themeColor: "#27ae60",
    layoutTemplate: "minimal-timeline",
  },
};

export function getReadOnlyResumePresentation(
  resumeName: string
): ResumePresentationSettings | null {
  return READ_ONLY_RESUME_PRESENTATION[resumeName] ?? null;
}
