import { describe, expect, test } from "bun:test";
import { resolveStaticAssetPath } from "../../src/server/routes/static";

describe("resolveStaticAssetPath", () => {
  test("maps a normal public asset path into the public directory", () => {
    expect(resolveStaticAssetPath("/assets/app.js")).toBe("public/assets/app.js");
  });

  test("rejects encoded traversal attempts", () => {
    expect(resolveStaticAssetPath("/%2e%2e/%2e%2e/secret.txt")).toBeNull();
    expect(resolveStaticAssetPath("/foo/../secret.txt")).toBeNull();
  });

  test("rejects the root path and malformed encodings", () => {
    expect(resolveStaticAssetPath("/")).toBeNull();
    expect(resolveStaticAssetPath("/%")).toBeNull();
  });
});
