// Authentication and session management

import type { Statement } from "bun:sqlite";
import { getDb } from "../db";
import { getSessionToken } from "../utils";

// Fallback in-memory store when database unavailable
export const memorySessions = new Map<
  string,
  { username: string; expiresAt: number; csrfToken?: string }
>();

// Cached prepared statements
let stmtInsert: Statement | null = null;
let stmtDelete: Statement | null = null;
let stmtSelect: Statement | null = null;
let stmtSelectCSRF: Statement | null = null;
let stmtUpdateCSRF: Statement | null = null;

function getStatements() {
  const db = getDb();
  if (!db) return null;

  if (!stmtInsert) {
    stmtInsert = db.prepare(
      "INSERT INTO sessions (token, username, expires_at, csrf_token) VALUES (?, ?, ?, ?)"
    );
    stmtDelete = db.prepare("DELETE FROM sessions WHERE token = ?");
    stmtSelect = db.prepare(
      "SELECT token FROM sessions WHERE token = ? AND expires_at > unixepoch()"
    );
    stmtSelectCSRF = db.prepare(
      "SELECT csrf_token FROM sessions WHERE token = ? AND expires_at > unixepoch()"
    );
    stmtUpdateCSRF = db.prepare("UPDATE sessions SET csrf_token = ? WHERE token = ?");
  }

  return {
    stmtInsert: stmtInsert!,
    stmtDelete: stmtDelete!,
    stmtSelect: stmtSelect!,
    stmtSelectCSRF: stmtSelectCSRF!,
    stmtUpdateCSRF: stmtUpdateCSRF!,
  };
}

export function generateToken(): string {
  return crypto.randomUUID();
}

export function createSession(
  token: string,
  username: string,
  expiresAt: Date,
  csrfToken?: string
): void {
  const stmts = getStatements();
  if (stmts) {
    stmts.stmtInsert.run(token, username, Math.floor(expiresAt.getTime() / 1000), csrfToken ?? null);
  } else {
    memorySessions.set(token, { username, expiresAt: expiresAt.getTime(), csrfToken });
  }
}

export function deleteSession(token: string): void {
  const stmts = getStatements();
  if (stmts) {
    stmts.stmtDelete.run(token);
  } else {
    memorySessions.delete(token);
  }
}

export function isAuthenticated(req: Request): boolean {
  const token = getSessionToken(req);
  if (!token) return false;

  const stmts = getStatements();
  if (stmts) {
    const result = stmts.stmtSelect.get(token);
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
  const stmts = getStatements();
  if (stmts) {
    const result = stmts.stmtSelectCSRF.get(token) as { csrf_token: string | null } | null;
    return result?.csrf_token ?? null;
  } else {
    const session = memorySessions.get(token);
    if (!session || Date.now() > session.expiresAt) return null;
    return session.csrfToken ?? null;
  }
}

export function updateSessionCSRFToken(token: string, csrfToken: string): void {
  const stmts = getStatements();
  if (stmts) {
    stmts.stmtUpdateCSRF.run(csrfToken, token);
  } else {
    const session = memorySessions.get(token);
    if (session) {
      session.csrfToken = csrfToken;
    }
  }
}
