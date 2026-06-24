import { describe, expect, test } from "bun:test";
import {
  decisionProjectPath,
  decisionProjectSummaries,
  decisionRecords,
  getDecisionProjectSummary,
  experimentCatalogContent,
} from "@site";

describe("decision content", () => {
  test("keeps project decision paths canonical", () => {
    for (const summary of decisionProjectSummaries) {
      expect(summary.path).toBe(decisionProjectPath(summary.projectId));
      expect(getDecisionProjectSummary(summary.projectId)).toBe(summary);
    }
  });

  test("links decisions only to published experiments in the same project", () => {
    const experimentsBySlug = new Map(
      experimentCatalogContent.experiments.map((experiment) => [experiment.slug, experiment]),
    );

    for (const decision of decisionRecords) {
      expect(decision.experimentSlugs.length).toBeGreaterThan(0);

      for (const slug of decision.experimentSlugs) {
        const experiment = experimentsBySlug.get(slug);

        expect(experiment).toBeDefined();
        expect(experiment?.projectId).toBe(decision.projectId);
      }
    }
  });
});
