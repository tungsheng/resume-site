import { afterEach, describe, expect, test } from "bun:test";
import {
  getResumeSettings,
  loadResumeSettings,
  requestPublicResumePdf,
} from "../../src/features/resume/presentation";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("public resume helpers", () => {
  test("loads validated public resume settings from the read-only settings endpoint", async () => {
    let requestedUrl = "";
    globalThis.fetch = (async (input: string | URL | Request) => {
      requestedUrl = String(input);
      return new Response(
        JSON.stringify({
          themeColor: "#27ae60",
          layoutTemplate: "minimal-timeline",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }) as unknown as typeof fetch;

    const settings = await loadResumeSettings("tony-lee");

    expect(requestedUrl).toBe("/api/settings/tony-lee");
    expect(settings).toEqual({
      themeColor: "#27ae60",
      layoutTemplate: "minimal-timeline",
    });
  });

  test("parses public PDF errors from the API response body", async () => {
    globalThis.fetch = (async () => {
      return new Response(JSON.stringify({ error: "PDF engine unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await expect(
      requestPublicResumePdf({
        name: "tony-lee",
        themeColor: "#27ae60",
        layoutTemplate: "minimal-timeline",
      })
    ).rejects.toThrow("PDF engine unavailable");
  });

  test("preserves the checked-in tony-lee presentation when settings fetch fails", async () => {
    globalThis.fetch = (async () => {
      throw new Error("network failure");
    }) as unknown as typeof fetch;

    const settings = await loadResumeSettings("tony-lee");

    expect(settings).toEqual({
      themeColor: "#27ae60",
      layoutTemplate: "minimal-timeline",
    });
    expect(getResumeSettings("tony-lee")).toEqual(settings);
  });
});
