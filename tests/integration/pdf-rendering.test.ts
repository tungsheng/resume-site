import { afterAll, describe, expect, test } from "bun:test";
import { publicResumeData, renderResumeHtmlDocument } from "@resume";
import {
  calculatePdfScale,
  closePDFBrowser,
  LETTER_PDF_SIZE_PX,
  measurePDFContent,
} from "@services/pdf";
import { buildResumePdf } from "../../scripts/build-resume-pdf";

const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "1";
const itIfIntegration = RUN_INTEGRATION_TESTS ? test : test.skip;

describe("PDF Rendering", () => {
  afterAll(async () => {
    if (RUN_INTEGRATION_TESTS) {
      await closePDFBrowser();
    }
  });

  itIfIntegration(
    "keeps the public resume on one Letter page at natural scale",
    async () => {
      const html = renderResumeHtmlDocument(publicResumeData);
      const contentSize = await measurePDFContent(html);

      expect(contentSize.contentWidthPx).toBeLessThanOrEqual(LETTER_PDF_SIZE_PX.width);
      expect(contentSize.contentHeightPx).toBeLessThanOrEqual(LETTER_PDF_SIZE_PX.height);
      expect(calculatePdfScale(contentSize.contentWidthPx, contentSize.contentHeightPx)).toBe(1);
    },
    20000
  );

  itIfIntegration(
    "writes a non-empty resume.pdf build artifact",
    async () => {
      const outPath = await buildResumePdf("dist");
      const bytes = new Uint8Array(await Bun.file(outPath).arrayBuffer());

      expect(bytes.byteLength).toBeGreaterThan(1000);
      // PDF magic number "%PDF-"
      expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe("%PDF-");
    },
    30000
  );
});
