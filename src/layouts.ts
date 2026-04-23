export const RESUME_TEMPLATE_OPTIONS = [
  "single-column-ats",
  "minimal-timeline",
] as const;

export type ResumeLayoutTemplate = (typeof RESUME_TEMPLATE_OPTIONS)[number];

export const DEFAULT_RESUME_TEMPLATE: ResumeLayoutTemplate = "single-column-ats";

const TEMPLATE_ID_SET = new Set<string>(RESUME_TEMPLATE_OPTIONS);

export function isResumeLayoutTemplate(
  value: unknown
): value is ResumeLayoutTemplate {
  return typeof value === "string" && TEMPLATE_ID_SET.has(value);
}
