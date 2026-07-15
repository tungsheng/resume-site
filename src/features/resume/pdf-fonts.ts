import { readFileSync } from "node:fs";

export const RESUME_PDF_FONT_FAMILY = "ResumePDFSans";

const FONT_MIME_TYPE = "font/woff2";

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
  const interRegularDataUrl = loadFontDataUrl("InterVariable.woff2");
  const interItalicDataUrl = loadFontDataUrl("InterVariable-Italic.woff2");
  return `
@font-face {
  font-family: '${RESUME_PDF_FONT_FAMILY}';
  src: url('${interRegularDataUrl}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: '${RESUME_PDF_FONT_FAMILY}';
  src: url('${interItalicDataUrl}') format('woff2');
  font-weight: 100 900;
  font-style: italic;
  font-display: block;
}
`;
}

export function getResumePdfFontFaceCss(): string {
  return (fontFaceCss ??= buildFontFaceCss());
}
