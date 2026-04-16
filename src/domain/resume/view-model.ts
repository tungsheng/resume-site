import type { ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

export interface ResumeSkillViewModel {
  category: string;
  categoryLabel: string;
  items: string[];
  itemsText: string;
}

export interface ResumeEducationViewModel {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  lineText: string;
}

export interface ResumeExperienceViewModel {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  highlights: string[];
}

export interface ResumeProjectViewModel {
  title: string;
  highlights: string[];
}

export interface ResumeViewModel {
  layoutTemplate: ResumeLayoutTemplate;
  isSingleColumnLayout: boolean;
  isTimelineLayout: boolean;
  header: ResumeData["header"];
  summary: string;
  skills: ResumeSkillViewModel[];
  projectsTitle: string;
  projects: ResumeProjectViewModel[];
  education: ResumeEducationViewModel[];
  certificates: ResumeData["certificates"];
  experience: ResumeExperienceViewModel[];
  hasBadges: boolean;
  hasSummary: boolean;
  hasSkills: boolean;
  hasProjects: boolean;
  hasEducation: boolean;
  hasCertificates: boolean;
  hasExperience: boolean;
}

export function buildResumeViewModel(
  data: ResumeData,
  layoutTemplate: ResumeLayoutTemplate
): ResumeViewModel {
  const summary = data.header.summary.trim();

  const skills = Object.entries(data.skills).map(([category, items]) => ({
    category,
    categoryLabel: capitalize(category),
    items,
    itemsText: items.join(" • "),
  }));

  const projectsTitle = data.projects?.title.trim() || "Projects";
  const projects = (data.projects?.items ?? []).map((entry) => ({
    ...entry,
  }));

  const education = data.education.map((entry) => {
    const dateRange = formatRange(entry.startDate, entry.endDate);
    return {
      ...entry,
      dateRange,
      lineText: `${entry.degree} • ${entry.school} • ${dateRange}`,
    };
  });

  const experience = data.experience.map((entry) => ({
    ...entry,
    dateRange: formatRange(entry.startDate, entry.endDate),
  }));

  return {
    layoutTemplate,
    isSingleColumnLayout: layoutTemplate === "single-column-ats",
    isTimelineLayout: layoutTemplate === "minimal-timeline",
    header: data.header,
    summary,
    skills,
    projectsTitle,
    projects,
    education,
    certificates: data.certificates,
    experience,
    hasBadges: data.header.badges.length > 0,
    hasSummary: summary.length > 0,
    hasSkills: skills.length > 0,
    hasProjects: projects.length > 0,
    hasEducation: education.length > 0,
    hasCertificates: data.certificates.length > 0,
    hasExperience: experience.length > 0,
  };
}
