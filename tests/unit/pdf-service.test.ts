import { describe, expect, test } from "bun:test";
import { calculatePdfScale, LETTER_PDF_SIZE_PX } from "../../src/services/pdf";

describe("PDF Service", () => {
  test("keeps scale at 1 when content already fits letter size", () => {
    expect(calculatePdfScale(LETTER_PDF_SIZE_PX.width, LETTER_PDF_SIZE_PX.height)).toBe(1);
    expect(calculatePdfScale(700, 900)).toBe(1);
  });

  test("scales down when content height exceeds letter size", () => {
    expect(calculatePdfScale(LETTER_PDF_SIZE_PX.width, 1100)).toBeCloseTo(
      LETTER_PDF_SIZE_PX.height / 1100,
      5
    );
  });

  test("scales down when content width exceeds letter size", () => {
    expect(calculatePdfScale(900, LETTER_PDF_SIZE_PX.height)).toBeCloseTo(
      LETTER_PDF_SIZE_PX.width / 900,
      5
    );
  });

  test("uses the tighter scale when both dimensions overflow", () => {
    expect(calculatePdfScale(900, 1200)).toBeCloseTo(
      LETTER_PDF_SIZE_PX.height / 1200,
      5
    );
  });
});
