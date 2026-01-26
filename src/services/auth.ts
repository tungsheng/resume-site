// Authentication and session management

import { getDb } from "../db";
import { getSessionToken } from "../utils";

// Fallback in-memory store when database unavailable
export const memorySessions = new Map<
  string,
  { username: string; expiresAt: number; csrfToken?: string }
>();

export function generateToken(): string {
  return crypto.randomUUID();
}

export function createSession(
  token: string,
  username: string,
  expiresAt: Date,
  csrfToken?: string
): void {
  const db = getDb();
  if (db) {
    const stmt = db.prepare(
      "INSERT INTO sessions (token, username, expires_at, csrf_token) VALUES (?, ?, ?, ?)"
    );
    stmt.run(token, username, Math.floor(expiresAt.getTime() / 1000), csrfToken ?? null);
  } else {
    memorySessions.set(token, { username, expiresAt: expiresAt.getTime(), csrfToken });
  }
}

export function deleteSession(token: string): void {
  const db = getDb();
  if (db) {
    const stmt = db.prepare("DELETE FROM sessions WHERE token = ?");
    stmt.run(token);
  } else {
    memorySessions.delete(token);
  }
}

export function isAuthenticated(req: Request): boolean {
  const token = getSessionToken(req);
  if (!token) return false;

  const db = getDb();
  if (db) {
    const stmt = db.prepare(
      "SELECT token FROM sessions WHERE token = ? AND expires_at > unixepoch()"
    );
    const result = stmt.get(token);
    return result !== null;
  } else {
    const session = memorySessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      memorySessions.delete(token);
      return false;
    }
    return true;
  }
}

export function getSessionCSRFToken(token: string): string | null {
  const db = getDb();
  if (db) {
    const stmt = db.prepare(
      "SELECT csrf_token FROM sessions WHERE token = ? AND expires_at > unixepoch()"
    );
    const result = stmt.get(token) as { csrf_token: string | null } | null;
    return result?.csrf_token ?? null;
  } else {
    const session = memorySessions.get(token);
    if (!session || Date.now() > session.expiresAt) return null;
    return session.csrfToken ?? null;
  }
}

export function updateSessionCSRFToken(token: string, csrfToken: string): void {
  const db = getDb();
  if (db) {
    const stmt = db.prepare("UPDATE sessions SET csrf_token = ? WHERE token = ?");
    stmt.run(csrfToken, token);
  } else {
    const session = memorySessions.get(token);
    if (session) {
      session.csrfToken = csrfToken;
    }
  }
}
