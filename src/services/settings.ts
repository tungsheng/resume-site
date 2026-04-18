import {
  getPublicResumeFallbackSettings,
  type PublicResumeSettings,
} from "../features/resume/presentation";

export type ResumeSettings = PublicResumeSettings;

export function getResumeSettings(resumeName: string): ResumeSettings {
  return getPublicResumeFallbackSettings(resumeName);
}
