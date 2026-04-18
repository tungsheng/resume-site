import { describe, expect, test } from "bun:test";
import { calculateResumePreviewScale } from "../../src/features/resume/preview-scale";

describe("resume preview scale", () => {
  test("prefers a wide desktop preview instead of shrinking to fit height", () => {
    const scale = calculateResumePreviewScale(1440);
    const previewWidth = 816 * scale;
    const ratio = previewWidth / 1440;

    expect(ratio).toBeGreaterThan(0.6);
    expect(ratio).toBeLessThan(0.8);
  });

  test("keeps tablet preview readable", () => {
    const scale = calculateResumePreviewScale(1024);
    const previewWidth = 816 * scale;
    const ratio = previewWidth / 1024;

    expect(ratio).toBeGreaterThan(0.7);
    expect(ratio).toBeLessThan(0.9);
  });

  test("clamps very large screens instead of scaling indefinitely", () => {
    expect(calculateResumePreviewScale(3000)).toBe(1.4);
  });
});
