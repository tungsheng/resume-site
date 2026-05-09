import { beforeAll, describe, expect, test } from "bun:test";

const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "1";
const itIfIntegration = RUN_INTEGRATION_TESTS ? test : test.skip;

describe("API Integration", () => {
  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  beforeAll(async () => {
    if (!RUN_INTEGRATION_TESTS) return;

    try {
      const res = await fetch(`${BASE_URL}/resume`, {
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
    } catch (error) {
      throw new Error(
        `Integration tests require a running server at ${BASE_URL}. Original error: ${String(error)}`
      );
    }
  });

  itIfIntegration("GET / serves the home page shell", async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<div id=\"root\"></div>");
    expect(html).toContain("Tony Lee | Platform Infrastructure Engineer");
  });

  itIfIntegration("GET /project/cloud-inference-platform serves the project shell", async () => {
    const res = await fetch(`${BASE_URL}/project/cloud-inference-platform`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("Cloud Inference Platform | Tony Lee");
  });

  itIfIntegration("GET /project/cloud-inference-platform/validation serves the project shell", async () => {
    const res = await fetch(`${BASE_URL}/project/cloud-inference-platform/validation`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("Cloud Inference Platform | Tony Lee");
  });

  itIfIntegration("GET /experiments serves the experiments shell", async () => {
    const res = await fetch(`${BASE_URL}/experiments`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("Experiments | Tony Lee");
  });

  itIfIntegration("GET /experiments/:slug serves the experiments shell", async () => {
    const res = await fetch(`${BASE_URL}/experiments/kv-cache`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("Experiments | Tony Lee");
  });

  itIfIntegration("GET /resume serves the resume shell", async () => {
    const res = await fetch(`${BASE_URL}/resume`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<title>Tony Lee | Resume</title>");
  });

  itIfIntegration("POST /api/public-pdf - 429 after rate limit exceeded", async () => {
    const controllers = Array.from({ length: 6 }, () => new AbortController());
    const requests = controllers.map((controller) =>
      fetch(`${BASE_URL}/api/public-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      })
    );

    try {
      const status = await Promise.any(
        requests.map(async (request) => {
          const response = await request;
          if (response.status !== 429) {
            throw new Error(`Expected a rate-limited response, got ${response.status}`);
          }
          return response.status;
        })
      );

      expect(status).toBe(429);
    } finally {
      for (const controller of controllers) {
        controller.abort();
      }
      await Promise.allSettled(requests);
    }
  });
});
