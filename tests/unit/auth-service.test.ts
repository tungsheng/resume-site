import { describe, expect, test } from "bun:test";
import { createSession, deleteSession, isAuthenticated } from "../../src/services/auth";

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
