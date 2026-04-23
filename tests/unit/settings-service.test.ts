import { describe, expect, test } from "bun:test";
import { RESUME_TEMPLATE_OPTIONS } from "../../src/layouts";
import { getResumeSettings } from "../../src/features/resume/presentation";

describe("Settings Service", () => {
  test("preserves the checked-in public theme color", () => {
    const settings = getResumeSettings();
    expect(settings.themeColor).toBe("#27ae60");
  });

  test("preserves the checked-in public layout template", () => {
    const settings = getResumeSettings();
    expect(settings.themeColor).toBe("#27ae60");
    expect(settings.layoutTemplate).toBe("minimal-timeline");
  });

  test("only keeps supported layout templates", () => {
    expect(RESUME_TEMPLATE_OPTIONS).toEqual(["single-column-ats", "minimal-timeline"]);
  });
});
