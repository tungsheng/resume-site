import { readFileSync } from "node:fs";

export const RESUME_PDF_FONT_FAMILY = "ResumePDFSans";

// Inter at the Display end of its optical-size axis (opsz 32), for the 24pt
// name only. CSS has no @font-face descriptor for optical size, so a second
// optical size cannot live in the same family next to the opsz-14 SemiBold.
export const RESUME_PDF_DISPLAY_FONT_FAMILY = "ResumePDFDisplay";

const FONT_MIME_TYPE = "font/woff2";

// Static instances, not the Inter variable font: Chrome's PDF backend (Skia)
// cannot embed a variable font as a font program, so it drew every glyph as a
// Type 3 picture and text extraction (an ATS parser) lost the word spaces in
// the name and the SemiBold titles ("TonyLee", "StaffSoftwareEngineer").
// Static fonts embed as TrueType subsets. One face per weight/style the resume
// CSS uses; fonts/README.md records each instance and how to regenerate them.
const FONT_FACES = [
  { family: RESUME_PDF_FONT_FAMILY, file: "Inter-Regular.woff2", weight: 400, style: "normal" },
  { family: RESUME_PDF_FONT_FAMILY, file: "Inter-Medium.woff2", weight: 500, style: "normal" },
  { family: RESUME_PDF_FONT_FAMILY, file: "Inter-SemiBold.woff2", weight: 600, style: "normal" },
  { family: RESUME_PDF_FONT_FAMILY, file: "Inter-Italic.woff2", weight: 400, style: "italic" },
  {
    family: RESUME_PDF_DISPLAY_FONT_FAMILY,
    file: "InterDisplay-SemiBold.woff2",
    weight: 600,
    style: "normal",
  },
] as const;

function loadFontDataUrl(filename: string): string {
  const font = readFileSync(new URL(`./fonts/${filename}`, import.meta.url));
  return `data:${FONT_MIME_TYPE};base64,${font.toString("base64")}`;
}

// Lazy + memoized: importing this module must be side-effect free. The fonts
// resolve relative to THIS source file, which only works where the module runs
// un-bundled (the PDF build script / tests). The /resume page imports the
// @resume facade — and with it this module — into a bundled prerender chunk
// where `./fonts/` does not exist; reading at module top level made that
// import itself crash the astro build. Deferring the read means only callers
// that actually render PDF CSS pay it.
let fontFaceCss: string | undefined;

function buildFontFaceCss(): string {
  return FONT_FACES.map(
    ({ family, file, weight, style }) => `
@font-face {
  font-family: '${family}';
  src: url('${loadFontDataUrl(file)}') format('woff2');
  font-weight: ${weight};
  font-style: ${style};
  font-display: block;
}
`
  ).join("");
}

export function getResumePdfFontFaceCss(): string {
  return (fontFaceCss ??= buildFontFaceCss());
}
