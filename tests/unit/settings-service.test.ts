import { describe, expect, test } from "bun:test";
import { RESUME_TEMPLATE_OPTIONS } from "../../src/layouts";
import {
  getLayoutTemplate,
  getResumeSettings,
  getThemeColor,
} from "../../src/services/settings";

describe("Settings Service", () => {
  test("returns default color for unknown resume", () => {
    const color = getThemeColor("unknown-xyz");
    expect(color).toBe("#c9a86c");
  });

  test("preserves the checked-in tony-lee theme color", () => {
    const color = getThemeColor("tony-lee");
    expect(color).toBe("#27ae60");
  });

  test("returns default layout template for unknown resume", () => {
    const template = getLayoutTemplate("unknown-xyz");
    expect(template).toBe("single-column-ats");
  });

  test("preserves the checked-in tony-lee layout template", () => {
    const settings = getResumeSettings("tony-lee");
    expect(settings.themeColor).toBe("#27ae60");
    expect(settings.layoutTemplate).toBe("minimal-timeline");
  });

  test("only keeps supported layout templates", () => {
    expect(RESUME_TEMPLATE_OPTIONS.map((item) => item.id)).toEqual([
      "single-column-ats",
      "minimal-timeline",
    ]);
  });
});
