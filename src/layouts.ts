// Resume layout template definitions shared by backend and frontend.

export const RESUME_TEMPLATE_OPTIONS = [
  {
    id: "single-column-ats",
    label: "Concise Single Column",
    description: "Linear and intuitive from top to bottom",
  },
  {
    id: "minimal-timeline",
    label: "Timeline Minimal",
    description: "Simple chronological rail for work history",
  },
] as const;

export type ResumeLayoutTemplate = (typeof RESUME_TEMPLATE_OPTIONS)[number]["id"];

export const DEFAULT_RESUME_TEMPLATE: ResumeLayoutTemplate = "single-column-ats";

const TEMPLATE_ID_SET = new Set<string>(
  RESUME_TEMPLATE_OPTIONS.map((template) => template.id)
);

export function isResumeLayoutTemplate(
  value: unknown
): value is ResumeLayoutTemplate {
  return typeof value === "string" && TEMPLATE_ID_SET.has(value);
}

export function normalizeResumeLayoutTemplate(
  value: unknown
): ResumeLayoutTemplate {
  return isResumeLayoutTemplate(value) ? value : DEFAULT_RESUME_TEMPLATE;
}
