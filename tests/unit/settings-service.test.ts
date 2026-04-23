import { describe, expect, test } from "bun:test";
import { RESUME_TEMPLATE_OPTIONS } from "../../src/layouts";
import { getResumeSettings } from "../../src/features/resume/presentation";

describe("Settings Service", () => {
  test("returns default color for unknown resume", () => {
    const settings = getResumeSettings("unknown-xyz");
    expect(settings.themeColor).toBe("#c9a86c");
  });

  test("preserves the checked-in tony-lee theme color", () => {
    const settings = getResumeSettings("tony-lee");
    expect(settings.themeColor).toBe("#27ae60");
  });

  test("returns default layout template for unknown resume", () => {
    const settings = getResumeSettings("unknown-xyz");
    expect(settings.layoutTemplate).toBe("single-column-ats");
  });

  test("preserves the checked-in tony-lee layout template", () => {
    const settings = getResumeSettings("tony-lee");
    expect(settings.themeColor).toBe("#27ae60");
    expect(settings.layoutTemplate).toBe("minimal-timeline");
  });

  test("only keeps supported layout templates", () => {
    expect(RESUME_TEMPLATE_OPTIONS).toEqual(["single-column-ats", "minimal-timeline"]);
  });
});
