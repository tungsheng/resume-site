import { describe, expect, test } from "bun:test";
import { experimentCatalogContent } from "../../src/features/site/experiment-catalog-content";
import {
  getPostBySlug,
  getPostRelatedLinks,
  postPath,
  postRecords,
} from "../../src/features/site/post-content";
import { projectPortfolioContent } from "../../src/features/site/projects-content";

describe("post content", () => {
  test("keeps post slugs unique and canonical", () => {
    const slugs = new Set<string>();

    for (const post of postRecords) {
      expect(slugs.has(post.slug)).toBe(false);
      slugs.add(post.slug);

      expect(postPath(post.slug)).toBe(`/blog/${post.slug}`);
      expect(getPostBySlug(post.slug)).toBe(post);
    }
  });

  test("links posts only to known projects and experiments", () => {
    const projectIds = new Set(
      projectPortfolioContent.projects.map((project) => project.id),
    );
    const experimentSlugs = new Set(
      experimentCatalogContent.experiments.map((experiment) => experiment.slug),
    );

    for (const post of postRecords) {
      expect(post.relatedProjectIds.length).toBeGreaterThan(0);
      expect(post.relatedExperimentSlugs.length).toBeGreaterThan(0);
      expect(post.relatedDecisionProjectIds.length).toBeGreaterThan(0);

      for (const projectId of post.relatedProjectIds) {
        expect(projectIds.has(projectId)).toBe(true);
      }

      for (const slug of post.relatedExperimentSlugs) {
        expect(experimentSlugs.has(slug)).toBe(true);
      }

      for (const projectId of post.relatedDecisionProjectIds) {
        expect(projectIds.has(projectId)).toBe(true);
      }

      expect(getPostRelatedLinks(post).length).toBe(
        post.relatedProjectIds.length +
          post.relatedExperimentSlugs.length +
          post.relatedDecisionProjectIds.length,
      );
    }
  });
});
