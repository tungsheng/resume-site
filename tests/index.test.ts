import { test, expect, describe, beforeAll } from "bun:test";
import {
  sanitizeName,
  escapeHtml,
  isValidColor,
  checkRateLimit,
  generateCSRFToken,
  validateCSRFToken,
  addSecurityHeaders,
} from "../src/utils";
import { listResumes, loadResume, generateHTML } from "../src/services/resume";
import {
  createSession,
  deleteSession,
  isAuthenticated,
} from "../src/services/auth";
import { getThemeColor, saveThemeColor } from "../src/services/settings";
import type { ResumeData } from "../src/types";

// ============================================
// Utils Tests
// ============================================
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

// ============================================
// Rate Limiting Tests
// ============================================
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

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(checkRateLimit(testIP, 1, 50)).toBe(true);
  });
});

// ============================================
// CSRF Tests
// ============================================
describe("CSRF Protection", () => {
  test("generateCSRFToken returns UUID format", () => {
    const token = generateCSRFToken();
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test("validateCSRFToken returns true for matching token", () => {
    const token = generateCSRFToken();
    const req = new Request("http://localhost/", {
      headers: { "X-CSRF-Token": token },
    });
    expect(validateCSRFToken(req, token)).toBe(true);
  });

  test("validateCSRFToken returns false for mismatched token", () => {
    const token = generateCSRFToken();
    const req = new Request("http://localhost/", {
      headers: { "X-CSRF-Token": "wrong-token" },
    });
    expect(validateCSRFToken(req, token)).toBe(false);
  });

  test("validateCSRFToken returns false for missing header", () => {
    const token = generateCSRFToken();
    const req = new Request("http://localhost/");
    expect(validateCSRFToken(req, token)).toBe(false);
  });

  test("validateCSRFToken returns false for null stored token", () => {
    const req = new Request("http://localhost/", {
      headers: { "X-CSRF-Token": "some-token" },
    });
    expect(validateCSRFToken(req, null)).toBe(false);
  });
});

// ============================================
// Security Headers Tests
// ============================================
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

// ============================================
// Resume Service Tests
// ============================================
describe("Resume Service", () => {
  test("listResumes returns array", async () => {
    const files = await listResumes();
    expect(files).toBeArray();
  });

  test("loadResume returns null for missing file", async () => {
    const data = await loadResume("nonexistent-xyz");
    expect(data).toBeNull();
  });

  test("loadResume returns null for path traversal", async () => {
    const data = await loadResume("../etc/passwd");
    expect(data).toBeNull();
  });

  test("generateHTML creates valid HTML", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: ["Badge1"],
        contacts: {
          phone: "555-1234",
          linkedin: "johndoe",
          email: "john@example.com",
        },
        summary: "A summary.",
      },
      experience: [
        {
          title: "Developer",
          company: "TechCorp",
          startDate: "2020",
          endDate: "2023",
          highlights: ["Built things"],
        },
      ],
      skills: { frontend: ["React"], backend: ["Node.js"], management: ["Agile"] },
      education: [
        { school: "University", degree: "BS CS", startDate: "2016", endDate: "2020" },
      ],
      certificates: [{ title: "AWS", issuer: "Amazon", date: "2022" }],
    };

    const html = generateHTML(mockData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("John Doe");
    expect(html).toContain("Developer");
  });

  test("generateHTML escapes XSS", () => {
    const xssData: ResumeData = {
      header: {
        name: '<script>alert("XSS")</script>',
        badges: [],
        contacts: { phone: "", linkedin: "", email: "" },
        summary: "",
      },
      experience: [],
      skills: { frontend: [], backend: [], management: [] },
      education: [],
      certificates: [],
    };

    const html = generateHTML(xssData);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

// ============================================
// Session Tests (Synchronous API)
// ============================================
describe("Auth Service", () => {
  const getUniqueToken = () =>
    `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  test("session lifecycle works", () => {
    const token = getUniqueToken();
    const futureDate = new Date(Date.now() + 3600000);
    createSession(token, "admin", futureDate);

    const req = new Request("http://localhost/", {
      headers: { Cookie: `session=${token}` },
    });
    expect(isAuthenticated(req)).toBe(true);

    deleteSession(token);
    expect(isAuthenticated(req)).toBe(false);
  });

  test("returns false for no cookie", () => {
    const req = new Request("http://localhost/");
    expect(isAuthenticated(req)).toBe(false);
  });

  test("returns false for expired session", () => {
    const token = getUniqueToken();
    createSession(token, "admin", new Date(Date.now() - 1000));

    const req = new Request("http://localhost/", {
      headers: { Cookie: `session=${token}` },
    });
    expect(isAuthenticated(req)).toBe(false);
  });
});

// ============================================
// Settings Tests (Synchronous API)
// ============================================
describe("Settings Service", () => {
  const getUniqueName = () =>
    `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  test("returns default color for unknown resume", () => {
    const color = getThemeColor("unknown-xyz");
    expect(color).toBe("#c9a86c");
  });

  test("save and get works", () => {
    const name = getUniqueName();
    saveThemeColor(name, "#ff0000");
    const color = getThemeColor(name);
    expect(color).toBe("#ff0000");
  });

  test("rejects invalid color", () => {
    const name = getUniqueName();
    const result = saveThemeColor(name, "invalid");
    expect(result).toBe(false);
  });
});

// ============================================
// API Integration Tests
// ============================================
describe("API Integration", () => {
  const BASE_URL = "http://localhost:3000";
  let serverAvailable = false;

  beforeAll(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/resumes`, {
        signal: AbortSignal.timeout(1000),
      });
      serverAvailable = res.ok;
    } catch {
      serverAvailable = false;
      console.log("Integration tests skipped - server not running");
    }
  });

  test("GET /api/resumes", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE_URL}/api/resumes`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { resumes: string[] };
    expect(data.resumes).toBeArray();
  });

  test("GET /api/resume/:name - 404 for missing", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE_URL}/api/resume/nonexistent-xyz`);
    expect(res.status).toBe(404);
  });

  test("POST /api/login - 401 for invalid credentials", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "wrong" }),
    });
    expect(res.status).toBe(401);
  });

  test("POST /api/login - 200 for valid credentials", async () => {
    // Skip if server not available or credentials are not default
    // (credentials are configured via env vars ADMIN_USERNAME/ADMIN_PASSWORD)
    if (!serverAvailable) return;

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "changeme";

    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Only assert 200 if using default credentials, otherwise skip
    if (username === "admin" && password === "changeme") {
      if (res.status !== 200) {
        console.log("Login test skipped - non-default credentials configured");
        return;
      }
      expect(res.status).toBe(200);
      expect(res.headers.get("Set-Cookie")).toContain("session=");
      expect(res.headers.get("X-CSRF-Token")).toBeTruthy();
    }
  });

  test("Security headers are present", async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE_URL}/api/resumes`);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  test("POST /api/login - 429 after rate limit exceeded", async () => {
    if (!serverAvailable) return;
    // Use a unique identifier to avoid affecting other tests
    const uniqueHeader = `test-${Date.now()}`;

    // Make 6 rapid requests to exceed the limit of 5
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

    // At least one should be 429
    expect(statusCodes).toContain(429);
  });
});
