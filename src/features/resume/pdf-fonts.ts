import { readFileSync } from "node:fs";

export const RESUME_PDF_FONT_FAMILY = "ResumePDFSans";

const FONT_MIME_TYPE = "font/woff2";

function loadFontDataUrl(filename: string): string {
  const font = readFileSync(new URL(`./fonts/${filename}`, import.meta.url));
  return `data:${FONT_MIME_TYPE};base64,${font.toString("base64")}`;
}

const interRegularDataUrl = loadFontDataUrl("InterVariable.woff2");
const interItalicDataUrl = loadFontDataUrl("InterVariable-Italic.woff2");

export function getResumePdfFontFaceCss(): string {
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
