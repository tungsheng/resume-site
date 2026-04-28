import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CommandCodeBlock } from "../../src/features/site/command-code-block";

describe("CommandCodeBlock", () => {
  test("renders highlighted CLI command tokens", () => {
    const html = renderToStaticMarkup(
      <CommandCodeBlock command="./scripts/evaluate --profile zero-idle|warm-1 --policy active-pressure" />,
    );

    expect(html).toContain("<pre");
    expect(html).toContain("<code>");
    expect(html).toContain("./scripts/evaluate");
    expect(html).toContain("--profile");
    expect(html).toContain("zero-idle");
    expect(html).toContain("warm-1");
    expect(html).toContain("--policy");
    expect(html).toContain("active-pressure");
    expect(html).toContain("command-token--program");
    expect(html).toContain("command-token--flag");
    expect(html).toContain("command-token--value");
    expect(html).toContain("command-token--separator");
  });
});
