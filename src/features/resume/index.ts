// The resume feature's interface — everything a caller outside this directory
// may use, reached via the `@resume` alias (tsconfig.json). Unlike @site's
// `export *` barrel this is a curated surface: the renderers' internals
// (document-css, pdf-fonts, the view-model's intermediate types) stay private,
// so the web page, the PDF build script, and the tests all cross one seam.
export type { ResumeData } from "./types";
export { publicResumeData } from "./data";
export { buildResumeViewModel } from "./view-model";
export { ResumeDocument } from "./document";
export { renderResumeHtmlDocument } from "./render-static-html";
