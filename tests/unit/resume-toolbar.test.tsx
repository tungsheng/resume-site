import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Toolbar } from "../../src/features/resume/components";

describe("Resume Toolbar", () => {
  test("renders the shared public-site header without extra resume actions", () => {
    const html = renderToStaticMarkup(<Toolbar />);

    expect(html).toContain("class=\"site-header\"");
    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("aria-current=\"page\">Resume<");
    expect(html).not.toContain("Tony Lee&#x27;s Resume");
    expect(html).not.toContain(">Print<");
    expect(html).not.toContain(">Download PDF<");
  });
});
