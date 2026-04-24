import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the centered personal hero without extra project grouping", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">I&#x27;m<");
    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("aria-current=\"page\">Home<");
    expect(html).toContain("ML inference, built to scale.");
    expect(html).toContain("I build GPU serving platforms that turn traffic into measurable capacity.");
  });
});
