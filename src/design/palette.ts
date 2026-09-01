// The site's colours, in one place.
//
// Two palettes live here, and they are different kinds of thing.
//
// CANVAS is the editorial palette from ADR-0010 — paper, ink, greys, accent.
// Its authored source is the `@theme` block in astro/styles/global.css, because
// Tailwind v4 reads that literal CSS to generate utilities and cannot read
// TypeScript. So this is a mirror, kept honest by a test that parses global.css
// and asserts the two agree (tests/unit/palette.test.ts). It exists because the
// resume PDF is not a Tailwind surface: document-css.ts is a template string
// that used to hardcode these six values under --resume-* names, and when
// ADR-0010 re-skinned the site the PDF silently kept the old palette until it
// was re-aligned by hand in b0acdc0.
//
// TONE is the status scale — supported / rejected / in-progress and the two
// extra chart tones. These are applied as inline styles rather than Tailwind
// utilities, so they were never in global.css at all; they were duplicated
// between astro/components/status.ts and EvidenceMatrix.astro. This module is
// their sole source, with no CSS counterpart and nothing to keep in sync.

export const CANVAS = {
  ink: "#1c1b17",
  muted: "#6f6d68",
  faint: "#83817a",
  rule: "#e4e1da",
  accent: "#2f7d3b",
  accentDark: "#235e2c",
} as const;

// The CSS custom property in global.css that each CANVAS key mirrors. The
// agreement test reads this map, so adding a token here without adding it to
// global.css fails rather than drifting.
export const CANVAS_CSS_VAR: Record<keyof typeof CANVAS, string> = {
  ink: "--color-ink",
  muted: "--color-muted",
  faint: "--color-faint",
  rule: "--color-rule",
  accent: "--color-go-green",
  accentDark: "--color-go-green-dark",
};

export type ToneName = "success" | "error" | "warning" | "info" | "neutral";

export const TONE: Record<ToneName, string> = {
  success: "#006b40",
  error: "#b3261e",
  warning: "#8a4413",
  info: "#276f89",
  neutral: "#8b939c",
};
