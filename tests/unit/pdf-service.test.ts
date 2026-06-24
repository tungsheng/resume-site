import { describe, expect, test } from "bun:test";
import {
  calculatePdfScale,
  getPDFRenderTimeoutMs,
  LETTER_PDF_SIZE_PX,
} from "@services/pdf";

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

  test("allows a positive PDF render timeout override", () => {
    const originalTimeout = process.env.PDF_RENDER_TIMEOUT_MS;

    try {
      process.env.PDF_RENDER_TIMEOUT_MS = "45000";
      expect(getPDFRenderTimeoutMs()).toBe(45000);

      process.env.PDF_RENDER_TIMEOUT_MS = "0";
      expect(getPDFRenderTimeoutMs()).toBe(30000);
    } finally {
      if (originalTimeout === undefined) {
        delete process.env.PDF_RENDER_TIMEOUT_MS;
      } else {
        process.env.PDF_RENDER_TIMEOUT_MS = originalTimeout;
      }
    }
  });
});
