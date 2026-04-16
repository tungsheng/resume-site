import { describe, expect, test } from "bun:test";
import { calculatePdfScale } from "../../src/services/pdf";

describe("PDF Service", () => {
  test("keeps scale at 1 when content already fits letter size", () => {
    expect(calculatePdfScale(816, 1056)).toBe(1);
    expect(calculatePdfScale(700, 900)).toBe(1);
  });

  test("scales down when content height exceeds letter size", () => {
    expect(calculatePdfScale(816, 1100)).toBeCloseTo(1056 / 1100, 5);
  });

  test("scales down when content width exceeds letter size", () => {
    expect(calculatePdfScale(900, 1056)).toBeCloseTo(816 / 900, 5);
  });

  test("uses the tighter scale when both dimensions overflow", () => {
    expect(calculatePdfScale(900, 1200)).toBeCloseTo(1056 / 1200, 5);
  });
});
