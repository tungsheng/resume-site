import { afterEach, describe, expect, test } from "bun:test";
import {
  getMaxConcurrentPDFExports,
  resolveClientIP,
  tryAcquirePDFRenderSlot,
} from "../../src/server/routes/pdf";

const originalTrustProxy = process.env.TRUST_PROXY;
const originalMaxConcurrentExports = process.env.PDF_MAX_CONCURRENT_EXPORTS;

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function requestWithHeaders(headers: HeadersInit): Request {
  return new Request("http://example.test/api/public-pdf", {
    method: "POST",
    headers,
  });
}

describe("PDF Route", () => {
  afterEach(() => {
    restoreEnv("TRUST_PROXY", originalTrustProxy);
    restoreEnv("PDF_MAX_CONCURRENT_EXPORTS", originalMaxConcurrentExports);
  });

  test("uses the direct socket address when proxy trust is disabled", () => {
    delete process.env.TRUST_PROXY;

    const req = requestWithHeaders({
      "x-forwarded-for": "203.0.113.10, 127.0.0.1",
      "x-real-ip": "203.0.113.11",
    });

    expect(resolveClientIP(req, "127.0.0.1")).toBe("127.0.0.1");
  });

  test("uses forwarded client IPs before the proxy address when proxy trust is enabled", () => {
    process.env.TRUST_PROXY = "1";

    const req = requestWithHeaders({
      "x-forwarded-for": "203.0.113.10, 127.0.0.1",
      "x-real-ip": "203.0.113.11",
    });

    expect(resolveClientIP(req, "127.0.0.1")).toBe("203.0.113.10");
  });

  test("falls back to real-ip and direct address in trusted proxy mode", () => {
    process.env.TRUST_PROXY = "1";

    expect(
      resolveClientIP(requestWithHeaders({ "x-real-ip": "203.0.113.11" }), "127.0.0.1")
    ).toBe("203.0.113.11");
    expect(resolveClientIP(requestWithHeaders({ "x-forwarded-for": " " }), "127.0.0.1")).toBe(
      "127.0.0.1"
    );
    expect(resolveClientIP(requestWithHeaders({}), "127.0.0.1")).toBe("127.0.0.1");
  });

  test("allows an environment override for max concurrent PDF exports", () => {
    process.env.PDF_MAX_CONCURRENT_EXPORTS = "4";
    expect(getMaxConcurrentPDFExports()).toBe(4);

    process.env.PDF_MAX_CONCURRENT_EXPORTS = "0";
    expect(getMaxConcurrentPDFExports()).toBe(2);
  });

  test("enforces the process-wide PDF render slot limit", () => {
    const release = tryAcquirePDFRenderSlot(1);
    if (!release) throw new Error("Expected to acquire the first PDF render slot");

    try {
      expect(tryAcquirePDFRenderSlot(1)).toBeNull();
    } finally {
      release();
    }

    const releaseAgain = tryAcquirePDFRenderSlot(1);
    if (!releaseAgain) throw new Error("Expected to acquire a PDF render slot after release");

    try {
      expect(tryAcquirePDFRenderSlot(1)).toBeNull();
    } finally {
      releaseAgain();
    }
  });
});
