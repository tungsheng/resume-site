import type { ResumeData } from "../../types";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

export function buildResumeViewModel(data: ResumeData) {
  const summary = data.header.summary.trim();

  const skills = Object.entries(data.skills).map(([category, items]) => ({
    category,
    categoryLabel: capitalize(category),
    itemsText: items.join(" • "),
  }));

  const projectsTitle = data.projects?.title.trim() || "Projects";
  const projects = (data.projects?.items ?? []).map((entry) => ({
    ...entry,
  }));

  const education = data.education.map(({ degree, school, startDate, endDate }) => ({
    degree,
    school,
    dateRange: formatRange(startDate, endDate),
  }));

  const experience = data.experience.map(
    ({ title, company, startDate, endDate, highlights }) => ({
      title,
      company,
      dateRange: formatRange(startDate, endDate),
      highlights,
    })
  );

  return {
    header: data.header,
    summary,
    skills,
    projectsTitle,
    projects,
    education,
    experience,
  };
}
