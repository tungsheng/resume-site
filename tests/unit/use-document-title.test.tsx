import { describe, expect, test } from "bun:test";
import { setDocumentTitle } from "../../src/features/site/use-document-title";

describe("useDocumentTitle", () => {
  test("updates the provided title target", () => {
    const target = { title: "" };

    setDocumentTitle("Experiments | Tony Lee", target);

    expect(target.title).toBe("Experiments | Tony Lee");
  });
});
