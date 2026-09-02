// Build-time resume PDF generation (ADR-0003 §2).
//
// The resume PDF is a pure function of resume/data.ts and only changes on a
// code deploy, so it is generated once at build time instead of per request.
// This replaces the runtime /api/public-pdf endpoint (removed with the Bun app).
//
// It is written into the Astro publicDir (./public) so it is served by
// BOTH `astro dev` (at /resume.pdf — otherwise the resume page's "Download PDF"
// link 404s in dev) and `astro build` (which copies publicDir into dist/). Run
// before `astro build`/`astro dev` via the npm scripts; CI does the same with
// headless Chrome (the PDF's only build-time dependency).
//
// Reuses the existing renderer + puppeteer pipeline unchanged.
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { publicResumeData, renderResumeHtmlDocument } from "@resume";
import { generatePDF, normalizePdfTimestamps } from "@services/pdf";

// Chrome stamps the PDF with the moment of generation, so two builds of the
// same commit differ — which makes the one artifact that is NOT byte-checkable
// the one a recruiter downloads. We stamp the commit date instead: deterministic
// for a given commit, and honest, unlike a hardcoded constant. Follows the
// reproducible-builds convention, so SOURCE_DATE_EPOCH wins when set.
//
// Note this only buys reproducibility PER PLATFORM. Chrome bakes its user agent
// into /Creator and Skia instantiates the embedded variable font differently on
// macOS and Linux, so a local build and a CI build of the same commit still
// differ (~76KB) while rendering identically — verified by rasterising both and
// comparing ink coverage (0.01% delta, all sub-pixel positioning).
async function resolveBuildDate(): Promise<Date> {
  const epoch = process.env.SOURCE_DATE_EPOCH;
  if (epoch && /^\d+$/.test(epoch)) return new Date(Number(epoch) * 1000);
  try {
    const iso = (await Bun.$`git log -1 --format=%cI`.quiet().text()).trim();
    if (iso) return new Date(iso);
  } catch {
    // Not a git checkout (or no commits yet) — fall through.
  }
  return new Date();
}

export async function buildResumePdf(outDir = "public"): Promise<string> {
  const html = renderResumeHtmlDocument(publicResumeData);
  const pdf = normalizePdfTimestamps(await generatePDF(html), await resolveBuildDate());
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "resume.pdf");
  await Bun.write(outPath, pdf);
  return outPath;
}

if (import.meta.main) {
  const { closePDFBrowser } = await import("@services/pdf");
  try {
    const outPath = await buildResumePdf();
    const size = (await Bun.file(outPath).arrayBuffer()).byteLength;
    console.log(`[resume-pdf] wrote ${outPath} (${size} bytes)`);
  } finally {
    await closePDFBrowser();
  }
}
