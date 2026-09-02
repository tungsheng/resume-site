import { describe, expect, test } from "bun:test";
import {
  LETTER_PDF_SIZE_PX,
  calculatePdfScale,
  formatPdfDate,
  getPDFRenderTimeoutMs,
  normalizePdfTimestamps,
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

// Chrome stamps the PDF with the moment of generation, so two builds of the
// same commit differed by two bytes — enough to make the one artifact a
// recruiter downloads impossible to verify by comparison. The build now stamps
// the commit date instead (or SOURCE_DATE_EPOCH).
describe("PDF timestamp normalization", () => {
  const date = new Date("2026-09-01T22:11:08Z");
  const pdfWith = (dates: string[]) =>
    Buffer.from(`%PDF-1.4\n<< /CreationDate (${dates[0]}) /ModDate (${dates[1]}) >>\nstartxref\n`);

  test("formats a date as a fixed-width PDF date string", () => {
    expect(formatPdfDate(date)).toBe("D:20260901221108+00'00'");
    expect(formatPdfDate(date)).toHaveLength(23);
  });

  test("pads every field, so the width never varies", () => {
    expect(formatPdfDate(new Date("2026-01-02T03:04:05Z"))).toBe("D:20260102030405+00'00'");
    expect(formatPdfDate(new Date("2026-01-02T03:04:05Z"))).toHaveLength(23);
  });

  test("rewrites both CreationDate and ModDate", () => {
    const out = normalizePdfTimestamps(
      pdfWith(["D:20260902051526+00'00'", "D:20260902051527+00'00'"]),
      date,
    ).toString("latin1");
    expect(out).toContain("/CreationDate (D:20260901221108+00'00')");
    expect(out).toContain("/ModDate (D:20260901221108+00'00')");
    expect(out).not.toContain("051526");
  });

  // The load-bearing property: a PDF's xref table stores absolute byte offsets,
  // so a replacement that changed length would corrupt the file.
  test("never changes the byte length", () => {
    const input = pdfWith(["D:20260902051526+00'00'", "D:20991231235959+00'00'"]);
    expect(normalizePdfTimestamps(input, date)).toHaveLength(input.length);
  });

  test("two different source timestamps normalize to identical bytes", () => {
    const a = normalizePdfTimestamps(pdfWith(["D:20260902051526+00'00'", "D:20260902051526+00'00'"]), date);
    const b = normalizePdfTimestamps(pdfWith(["D:20240101000000+00'00'", "D:20240101000000+00'00'"]), date);
    expect(a.equals(b)).toBe(true);
  });

  test("passes a PDF with no date strings through unchanged", () => {
    const input = Buffer.from("%PDF-1.4\nno dates here\nstartxref\n");
    expect(normalizePdfTimestamps(input, date).equals(input)).toBe(true);
  });
});
