import { describe, expect, test } from "bun:test";
import {
  addSecurityHeaders,
  checkRateLimit,
  escapeHtml,
  hexToRgba,
  isValidColor,
  sanitizeName,
} from "../../src/utils";

describe("sanitizeName", () => {
  test("accepts valid names", () => {
    expect(sanitizeName("tony-lee")).toBe("tony-lee");
    expect(sanitizeName("john_doe")).toBe("john_doe");
    expect(sanitizeName("Resume123")).toBe("Resume123");
  });

  test("rejects path traversal", () => {
    expect(sanitizeName("../etc/passwd")).toBeNull();
    expect(sanitizeName("foo/../bar")).toBeNull();
    expect(sanitizeName("foo/bar")).toBeNull();
    expect(sanitizeName("foo\\bar")).toBeNull();
  });

  test("rejects malformed URI encoding", () => {
    expect(sanitizeName("%")).toBeNull();
    expect(sanitizeName("%E0%A4%A")).toBeNull();
  });

  test("rejects empty input", () => {
    expect(sanitizeName("")).toBeNull();
    expect(sanitizeName("   ")).toBeNull();
  });

  test("strips invalid characters", () => {
    expect(sanitizeName("tony lee")).toBe("tonylee");
    expect(sanitizeName("tony.lee")).toBe("tonylee");
  });
});

describe("escapeHtml", () => {
  test("escapes HTML characters", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#039;");
  });

  test("handles non-string input", () => {
    expect(escapeHtml(null as unknown as string)).toBe("");
    expect(escapeHtml(undefined as unknown as string)).toBe("");
  });
});

describe("isValidColor", () => {
  test("accepts valid hex colors", () => {
    expect(isValidColor("#c9a86c")).toBe(true);
    expect(isValidColor("#FF0000")).toBe(true);
    expect(isValidColor("#000000")).toBe(true);
  });

  test("rejects invalid colors", () => {
    expect(isValidColor("red")).toBe(false);
    expect(isValidColor("#fff")).toBe(false);
    expect(isValidColor("#GGGGGG")).toBe(false);
  });
});

describe("hexToRgba", () => {
  test("converts hex to rgba with given alpha", () => {
    expect(hexToRgba("#c9a86c", 0.45)).toBe("rgba(201, 168, 108, 0.45)");
  });

  test("returns original value for invalid hex", () => {
    expect(hexToRgba("invalid", 0.45)).toBe("invalid");
  });
});

describe("checkRateLimit", () => {
  test("allows requests within limit", () => {
    const testIP = `test-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(testIP, 3, 60000)).toBe(true);
    expect(checkRateLimit(testIP, 3, 60000)).toBe(true);
    expect(checkRateLimit(testIP, 3, 60000)).toBe(true);
  });

  test("blocks requests over limit", () => {
    const testIP = `test-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(testIP, 2, 60000)).toBe(true);
    expect(checkRateLimit(testIP, 2, 60000)).toBe(true);
    expect(checkRateLimit(testIP, 2, 60000)).toBe(false);
  });

  test("resets after window expires", async () => {
    const testIP = `test-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(testIP, 1, 50)).toBe(true);
    expect(checkRateLimit(testIP, 1, 50)).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(checkRateLimit(testIP, 1, 50)).toBe(true);
  });
});

describe("addSecurityHeaders", () => {
  test("adds all required security headers", () => {
    const res = new Response("test");
    const secured = addSecurityHeaders(res);

    expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
    expect(secured.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    expect(secured.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(secured.headers.get("Content-Security-Policy")).toContain(
      "default-src 'self'"
    );
  });

  test("preserves existing headers", () => {
    const res = new Response("test", {
      headers: { "Content-Type": "application/json" },
    });
    const secured = addSecurityHeaders(res);

    expect(secured.headers.get("Content-Type")).toBe("application/json");
    expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
  });

  test("preserves status code", () => {
    const res = new Response("not found", { status: 404 });
    const secured = addSecurityHeaders(res);

    expect(secured.status).toBe(404);
  });
});
