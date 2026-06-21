// Build-time resume PDF generation (ADR-0003 §2).
//
// The resume PDF is a pure function of resume/data.ts and only changes on a
// code deploy, so it is generated once at build time into dist/resume.pdf
// instead of per request. This replaces the runtime /api/public-pdf endpoint
// (which is removed when the Bun app is retired — slice 6). Run after
// `astro build` via the `build` npm script; CI does the same with headless
// Chrome (the PDF's only build-time dependency).
//
// Reuses the existing renderer + puppeteer pipeline unchanged.
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { publicResumeData } from "../src/features/resume/data";
import { renderResumeHtmlDocument } from "../src/features/resume/render-static-html";
import { generatePDF } from "../src/services/pdf";

export async function buildResumePdf(outDir = "dist"): Promise<string> {
  const html = renderResumeHtmlDocument(publicResumeData);
  const pdf = await generatePDF(html);
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "resume.pdf");
  await Bun.write(outPath, pdf);
  return outPath;
}

if (import.meta.main) {
  const { closePDFBrowser } = await import("../src/services/pdf");
  try {
    const outPath = await buildResumePdf();
    const size = (await Bun.file(outPath).arrayBuffer()).byteLength;
    console.log(`[resume-pdf] wrote ${outPath} (${size} bytes)`);
  } finally {
    await closePDFBrowser();
  }
}
