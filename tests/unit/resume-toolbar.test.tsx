import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PublicSiteHeader } from "../../src/features/site/header";

describe("Resume Header", () => {
  test("renders the shared public-site header without extra resume actions", () => {
    const html = renderToStaticMarkup(<PublicSiteHeader activeNav="resume" />);

    expect(html).toContain("class=\"site-header\"");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("class=\"site-brand__logo\"");
    expect(html).toContain("T│L");
    expect(html).toContain("aria-current=\"page\">Resume<");
    expect(html).not.toContain("Tony Lee&#x27;s Resume");
    expect(html).not.toContain(">Print<");
    expect(html).not.toContain(">Download PDF<");
  });
});
