import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AboutPage } from "../../src/features/about/page";

describe("AboutPage", () => {
  test("renders the fit and working-style narrative", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("How I Work");
    expect(html).toContain("View resume");
    expect(html).toContain("View case study");
    expect(html).toContain(">Email<");
    expect(html).toContain(">LinkedIn<");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("How I tend to show up on teams");
    expect(html).toContain("The kinds of problems I like owning");
    expect(html).toContain("What I’m looking for");
    expect(html).toContain("href=\"mailto:tungsheng@gmail.com\"");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).not.toContain("class=\"page-eyebrow\">About<");
  });
});
