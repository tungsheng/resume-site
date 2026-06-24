import {
  decisionProjectPath,
  experimentCatalogContent,
  experimentDetailPath,
  getProjectById,
  projectPortfolioContent,
  type ProjectId,
} from "@site";
import type { BlogPostFrontmatter } from "./blog-schema";

// Resolve a Post's optional `related` frontmatter (#7) into concrete links.
// Resolves defensively: an author typo in an id is skipped, never a build crash
// — the underlying getProjectById()/decisionProjectPath() throw on unknown
// ProjectIds, so unknown ids are filtered out before they reach those helpers.
export type RelatedLink = {
  kind: "Project" | "Experiment" | "Decision";
  label: string;
  href: string;
};

const PROJECT_IDS = new Set<string>(projectPortfolioContent.projects.map((p) => p.id));

function isProjectId(value: string): value is ProjectId {
  return PROJECT_IDS.has(value);
}

export function resolveRelatedLinks(related: BlogPostFrontmatter["related"]): RelatedLink[] {
  if (!related) return [];

  const projectLinks: RelatedLink[] = (related.projects ?? [])
    .filter(isProjectId)
    .map((id) => {
      const project = getProjectById(id);
      return { kind: "Project", label: project.title, href: project.path };
    });

  const experimentLinks: RelatedLink[] = (related.experiments ?? []).flatMap((slug) => {
    const experiment = experimentCatalogContent.experiments.find((item) => item.slug === slug);
    return experiment
      ? [{ kind: "Experiment" as const, label: experiment.title, href: experimentDetailPath(slug) }]
      : [];
  });

  const decisionLinks: RelatedLink[] = (related.decisions ?? [])
    .filter(isProjectId)
    .map((id) => ({
      kind: "Decision",
      label: `${getProjectById(id).title} decisions`,
      href: decisionProjectPath(id),
    }));

  return [...projectLinks, ...experimentLinks, ...decisionLinks];
}
