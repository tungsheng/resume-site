// HTTP route handlers

import { config } from "./config";
import {
  parseJsonBody,
  getSessionToken,
  isValidColor,
  checkRateLimit,
  getClientIP,
  generateCSRFToken,
  validateCSRFToken,
} from "./utils";
import {
  isAuthenticated,
  createSession,
  deleteSession,
  generateToken,
  getSessionCSRFToken,
  updateSessionCSRFToken,
} from "./services/auth";
import { getThemeColor, saveThemeColor } from "./services/settings";
import { listResumes, loadResume, generateHTML } from "./services/resume";
import { generatePDF } from "./services/pdf";

// Helper to check CSRF for protected routes
function checkCSRF(req: Request): Response | null {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) return null;

  const csrfToken = getSessionCSRFToken(sessionToken);
  if (!validateCSRFToken(req, csrfToken)) {
    return Response.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  return null;
}

// Helper to build session cookie
function buildSessionCookie(token: string, isProduction: boolean = false): string {
  let cookie = `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
  if (isProduction) {
    cookie += "; Secure";
  }
  return cookie;
}

// --- Auth Handlers ---

export async function handleLogin(req: Request): Promise<Response> {
  // Rate limiting check
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 5, 60000)) {
    return Response.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await parseJsonBody<{ username?: string; password?: string }>(req);
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = body;
  if (typeof username !== "string" || typeof password !== "string") {
    return Response.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  const usernameMatch =
    username.length === config.adminUsername.length &&
    crypto.timingSafeEqual(
      new TextEncoder().encode(username),
      new TextEncoder().encode(config.adminUsername)
    );
  const passwordMatch =
    password.length === config.adminPassword.length &&
    crypto.timingSafeEqual(
      new TextEncoder().encode(password),
      new TextEncoder().encode(config.adminPassword)
    );
  if (usernameMatch && passwordMatch) {
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

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
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
      // Generate new CSRF token if none exists
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

  return new Response(JSON.stringify({ authenticated }), { headers });
}

// --- Resume Handlers ---

export async function handleListResumes(): Promise<Response> {
  const resumes = await listResumes();
  return Response.json({ resumes });
}

export async function handleGetResume(req: Request & { params?: Record<string, string> }): Promise<Response> {
  const name = req.params?.name ?? new URL(req.url).pathname.replace("/api/resume/", "");
  const data = await loadResume(name);
  if (!data) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }
  return Response.json(data);
}

// --- Settings Handlers ---

export async function handleGetSettings(req: Request & { params?: Record<string, string> }): Promise<Response> {
  const name = req.params?.name ?? new URL(req.url).pathname.replace("/api/settings/", "");
  const themeColor = getThemeColor(name);
  return Response.json({ themeColor });
}

export async function handleSaveSettings(req: Request): Promise<Response> {
  // CSRF check for authenticated mutation
  const csrfError = checkCSRF(req);
  if (csrfError) return csrfError;

  if (!isAuthenticated(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const name = (req as Request & { params?: Record<string, string> }).params?.name
    ?? new URL(req.url).pathname.replace("/api/settings/", "");

  const body = await parseJsonBody<{ themeColor?: string }>(req);
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { themeColor } = body;
  if (typeof themeColor !== "string" || !isValidColor(themeColor)) {
    return Response.json({ error: "Invalid theme color" }, { status: 400 });
  }

  saveThemeColor(name, themeColor);
  return Response.json({ success: true });
}

// --- PDF Handlers ---

export async function handleExportPDF(req: Request): Promise<Response> {
  // CSRF check for authenticated mutation
  const csrfError = checkCSRF(req);
  if (csrfError) return csrfError;

  if (!isAuthenticated(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handlePDFGeneration(req);
}

export async function handlePublicPDF(req: Request): Promise<Response> {
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 3, 60000)) {
    return Response.json(
      { error: "Too many PDF requests. Please try again later." },
      { status: 429 }
    );
  }
  return handlePDFGeneration(req);
}

async function handlePDFGeneration(req: Request): Promise<Response> {
  const body = await parseJsonBody<{ name?: string; themeColor?: string }>(req);
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, themeColor } = body;
  if (typeof name !== "string") {
    return Response.json({ error: "Resume name required" }, { status: 400 });
  }

  const data = await loadResume(name);
  if (!data) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }

  const color = themeColor || getThemeColor(name);
  const html = generateHTML(data, color);
  const pdf = await generatePDF(html);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.header.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_Resume.pdf"`,
    },
  });
}

// --- Static File Handler ---

export async function handleStaticFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const staticFile = Bun.file(`public${path}`);
  if (await staticFile.exists()) {
    return new Response(staticFile);
  }
  return null;
}
