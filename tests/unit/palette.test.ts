import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { CANVAS, CANVAS_CSS_VAR, TONE } from "../../src/design/palette";

// The CANVAS tokens are a mirror of the `@theme` block in global.css, which has
// to stay literal CSS because Tailwind v4 reads it to generate utilities and
// cannot read TypeScript. A mirror is only safe if something checks it — the
// resume PDF is not a Tailwind surface, so when ADR-0010 re-skinned the site
// the PDF kept the old palette until it was re-aligned by hand (b0acdc0). These
// tests are what makes that a failing build instead of a discovered artefact.

const GLOBAL_CSS = readFileSync("astro/styles/global.css", "utf8");

// Read a custom property out of the @theme block. Deliberately strict: a
// missing token throws rather than returning undefined and comparing loosely.
function themeToken(name: string): string {
  const theme = GLOBAL_CSS.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1];
  if (!theme) throw new Error("no @theme block found in global.css");
  const value = theme.match(new RegExp(`^\\s*${name}:\\s*([^;]+);`, "m"))?.[1];
  if (!value) throw new Error(`${name} is not declared in the @theme block`);
  return value.trim().toLowerCase();
}

describe("CANVAS agrees with the @theme block in global.css", () => {
  for (const [key, cssVar] of Object.entries(CANVAS_CSS_VAR)) {
    test(`${key} matches ${cssVar}`, () => {
      expect<string>(CANVAS[key as keyof typeof CANVAS]).toBe(themeToken(cssVar));
    });
  }

  test("every CANVAS token declares which CSS variable it mirrors", () => {
    expect(Object.keys(CANVAS).sort()).toEqual(Object.keys(CANVAS_CSS_VAR).sort());
  });
});

describe("palette shape", () => {
  test("every value is a 6-digit hex, normalised to lower case", () => {
    for (const value of [...Object.values(CANVAS), ...Object.values(TONE)]) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test("TONE has no counterpart in global.css — it is applied as inline style", () => {
    // Guards the module's own claim. If a tone is ever added to @theme, this
    // fails and the comment in palette.ts needs revisiting.
    for (const value of Object.values(TONE)) {
      expect(GLOBAL_CSS).not.toContain(value);
    }
  });
});
