import { afterEach, describe, expect, test } from "bun:test";
import { requestPublicResumePdf } from "../../src/features/resume/page";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("public resume helpers", () => {
  test("parses public PDF errors from the API response body", async () => {
    globalThis.fetch = (async () => {
      return new Response(JSON.stringify({ error: "PDF engine unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await expect(requestPublicResumePdf()).rejects.toThrow("PDF engine unavailable");
  });

  test("posts to the public PDF endpoint without a request body", async () => {
    let requestedUrl = "";
    let requestedMethod = "";
    let requestedBody: BodyInit | null | undefined;

    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      requestedUrl = String(input);
      requestedMethod = init?.method ?? "GET";
      requestedBody = init?.body;
      return new Response(new Blob(["pdf"]));
    }) as unknown as typeof fetch;

    await requestPublicResumePdf();

    expect(requestedUrl).toBe("/api/public-pdf");
    expect(requestedMethod).toBe("POST");
    expect(requestedBody).toBeUndefined();
  });
});
