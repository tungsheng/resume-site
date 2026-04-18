import { beforeAll, describe, expect, test } from "bun:test";

const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "1";
const itIfIntegration = RUN_INTEGRATION_TESTS ? test : test.skip;

describe("API Integration", () => {
  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  beforeAll(async () => {
    if (!RUN_INTEGRATION_TESTS) return;

    try {
      const res = await fetch(`${BASE_URL}/api/resumes`, {
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

  itIfIntegration("GET /api/resumes", async () => {
    const res = await fetch(`${BASE_URL}/api/resumes`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { resumes: string[] };
    expect(data.resumes).toBeArray();
  });

  itIfIntegration("GET / serves the home page shell", async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<div id=\"root\"></div>");
    expect(html).toContain("ML Inference &amp; Distributed Systems");
  });

  itIfIntegration("GET /project/cloud-inference-platform serves the project shell", async () => {
    const res = await fetch(`${BASE_URL}/project/cloud-inference-platform`);
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

  itIfIntegration("GET /about serves the about shell", async () => {
    const res = await fetch(`${BASE_URL}/about`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("About Tony Lee");
  });

  itIfIntegration("GET /resume/tony-lee serves the resume shell", async () => {
    const res = await fetch(`${BASE_URL}/resume/tony-lee`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<title>Resume</title>");
  });

  itIfIntegration("GET /api/resume/:name - 404 for missing", async () => {
    const res = await fetch(`${BASE_URL}/api/resume/nonexistent-xyz`);
    expect(res.status).toBe(404);
  });

  itIfIntegration("POST /api/login - 401 for invalid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "wrong" }),
    });
    expect(res.status).toBe(401);
  });

  itIfIntegration("POST /api/login - 200 for valid credentials", async () => {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "changeme";

    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Set-Cookie")).toContain("session=");
    expect(res.headers.get("X-CSRF-Token")).toBeTruthy();
  });

  itIfIntegration("Security headers are present", async () => {
    const res = await fetch(`${BASE_URL}/api/resumes`);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  itIfIntegration("POST /api/login - 429 after rate limit exceeded", async () => {
    const uniqueHeader = `test-${Date.now()}`;

    const requests = [];
    for (let i = 0; i < 6; i++) {
      requests.push(
        fetch(`${BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": uniqueHeader,
          },
          body: JSON.stringify({ username: "test", password: "test" }),
        })
      );
    }

    const responses = await Promise.all(requests);
    const statusCodes = responses.map((r) => r.status);
    expect(statusCodes).toContain(429);
  });
});
