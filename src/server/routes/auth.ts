import { config } from "../../config";
import {
  createSession,
  deleteSession,
  generateToken,
  getSessionCSRFToken,
  isAuthenticated,
  updateSessionCSRFToken,
} from "../../services/auth";
import {
  checkRateLimit,
  generateCSRFToken,
  getClientIP,
  getSessionToken,
  parseJsonBody,
} from "../../utils";
import { badRequest, json, tooManyRequests, unauthorized } from "../http/response";

function buildSessionCookie(token: string, isProduction: boolean = false): string {
  let cookie = `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
  if (isProduction) {
    cookie += "; Secure";
  }
  return cookie;
}

function timingSafeEqualText(left: string, right: string): boolean {
  return (
    left.length === right.length &&
    crypto.timingSafeEqual(new TextEncoder().encode(left), new TextEncoder().encode(right))
  );
}

export async function handleLogin(req: Request): Promise<Response> {
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 5, 60000)) {
    return tooManyRequests("Too many login attempts. Please try again later.");
  }

  const body = await parseJsonBody<{ username?: string; password?: string }>(req);
  if (!body) {
    return badRequest("Invalid JSON");
  }

  const { username, password } = body;
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest("Username and password required");
  }

  const usernameMatch = timingSafeEqualText(username, config.adminUsername);
  const passwordMatch = timingSafeEqualText(password, config.adminPassword);
  if (!usernameMatch || !passwordMatch) {
    return unauthorized("Invalid credentials");
  }

  const token = generateToken();
  const csrfToken = generateCSRFToken();
  const expiresAt = new Date(Date.now() + config.sessionMaxAge);
  createSession(token, username, expiresAt, csrfToken);

  const isProduction = process.env.NODE_ENV === "production";
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildSessionCookie(token, isProduction),
      "X-CSRF-Token": csrfToken,
    },
  });
}

export async function handleLogout(req: Request): Promise<Response> {
  const token = getSessionToken(req);
  if (token) deleteSession(token);

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0",
    },
  });
}

export function handleSession(req: Request): Response {
  const authenticated = isAuthenticated(req);
  let csrfToken: string | null = null;

  if (authenticated) {
    const sessionToken = getSessionToken(req);
    if (sessionToken) {
      csrfToken = getSessionCSRFToken(sessionToken);
      if (!csrfToken) {
        csrfToken = generateCSRFToken();
        updateSessionCSRFToken(sessionToken, csrfToken);
      }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  return json({ authenticated }, { headers });
}
