// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// NOTE: ADR-0003 — the site is migrating to Astro zero-JS static output.
// During the migration the new Astro tree lives under ./astro so it does not
// collide with the existing Bun/React app in ./src. Once every page is ported
// and the Bun app is removed, srcDir flips back to the default ./src.
//
// TODO(#12): set `site` to the real production domain once known — it is needed
// for canonical URLs, the sitemap (#8/#9) and absolute RSS image URLs.
export default defineConfig({
  site: "https://example.com",
  srcDir: "./astro",
  // Dedicated public dir during the migration: the default ./public still holds
  // the old Bun app's static HTML shells, which would otherwise shadow Astro's
  // generated pages. Flips back to ./public once the Bun app is removed (#12).
  publicDir: "./public-astro",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // ADR-0003 decision 6: Shiki highlighting matched to the dark code blocks.
    // GFM is on by default; remark alerts + reading-time land in #6/#7.
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-dark" },
  },
});
