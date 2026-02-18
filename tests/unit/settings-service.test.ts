import { describe, expect, test } from "bun:test";
import { RESUME_TEMPLATE_OPTIONS } from "../../src/layouts";
import {
  getLayoutTemplate,
  getResumeSettings,
  getThemeColor,
  saveLayoutTemplate,
  saveThemeColor,
} from "../../src/services/settings";

describe("Settings Service", () => {
  const getUniqueName = () =>
    `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  test("returns default color for unknown resume", () => {
    const color = getThemeColor("unknown-xyz");
    expect(color).toBe("#c9a86c");
  });

  test("save and get works", () => {
    const name = getUniqueName();
    saveThemeColor(name, "#ff0000");
    const color = getThemeColor(name);
    expect(color).toBe("#ff0000");
  });

  test("returns default layout template for unknown resume", () => {
    const template = getLayoutTemplate("unknown-xyz");
    expect(template).toBe("single-column-ats");
  });

  test("save layout template keeps existing theme color", () => {
    const name = getUniqueName();
    saveThemeColor(name, "#2c3e50");
    const saved = saveLayoutTemplate(name, "single-column-ats");
    expect(saved).toBe(true);
    const settings = getResumeSettings(name);
    expect(settings.themeColor).toBe("#2c3e50");
    expect(settings.layoutTemplate).toBe("single-column-ats");
  });

  test("rejects invalid color", () => {
    const name = getUniqueName();
    const result = saveThemeColor(name, "invalid");
    expect(result).toBe(false);
  });

  test("only keeps supported layout templates", () => {
    expect(RESUME_TEMPLATE_OPTIONS.map((item) => item.id)).toEqual([
      "single-column-ats",
      "minimal-timeline",
    ]);
  });
});
