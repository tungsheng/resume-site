import { afterAll, describe, expect, test } from "bun:test";
import { publicResumeData } from "../../src/features/resume/data";
import { renderResumeHtmlDocument } from "../../src/features/resume/render-static-html";
import {
  calculatePdfScale,
  closePDFBrowser,
  LETTER_PDF_SIZE_PX,
  measurePDFContent,
} from "../../src/services/pdf";

const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "1";
const itIfIntegration = RUN_INTEGRATION_TESTS ? test : test.skip;

describe("PDF Rendering", () => {
  afterAll(async () => {
    if (RUN_INTEGRATION_TESTS) {
      await closePDFBrowser();
    }
  });

  itIfIntegration("keeps the public resume on one Letter page at natural scale", async () => {
    const html = renderResumeHtmlDocument(publicResumeData);
    const contentSize = await measurePDFContent(html);

    expect(contentSize.contentWidthPx).toBeLessThanOrEqual(LETTER_PDF_SIZE_PX.width);
    expect(contentSize.contentHeightPx).toBeLessThanOrEqual(LETTER_PDF_SIZE_PX.height);
    expect(calculatePdfScale(contentSize.contentWidthPx, contentSize.contentHeightPx)).toBe(1);
  });
});
