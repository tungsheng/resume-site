// HTTP route handlers

import { config } from "./config";
import {
  parseJsonBody,
  getSessionToken,
  isValidColor,
  checkRateLimit,
  getClientIP,
  addSecurityHeaders,
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
    return addSecurityHeaders(
      Response.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
    );
  }

  const body = await parseJsonBody<{ username?: string; password?: string }>(req);
  if (!body) {
    return addSecurityHeaders(Response.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const { username, password } = body;
  if (typeof username !== "string" || typeof password !== "string") {
    return addSecurityHeaders(
      Response.json({ error: "Username and password required" }, { status: 400 })
    );
  }

  if (username === config.adminUsername && password === config.adminPassword) {
    const token = generateToken();
    const csrfToken = generateCSRFToken();
    const expiresAt = new Date(Date.now() + config.sessionMaxAge);
    createSession(token, username, expiresAt, csrfToken);

    const isProduction = process.env.NODE_ENV === "production";
    const res = new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(token, isProduction),
        "X-CSRF-Token": csrfToken,
      },
    });
    return addSecurityHeaders(res);
  }

  return addSecurityHeaders(Response.json({ error: "Invalid credentials" }, { status: 401 }));
}

export async function handleLogout(req: Request): Promise<Response> {
  const token = getSessionToken(req);
  if (token) deleteSession(token);

  const res = new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0",
    },
  });
  return addSecurityHeaders(res);
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

  const res = new Response(JSON.stringify({ authenticated }), { headers });
  return addSecurityHeaders(res);
}

// --- Resume Handlers ---

export async function handleListResumes(): Promise<Response> {
  const resumes = await listResumes();
  return addSecurityHeaders(Response.json({ resumes }));
}

export async function handleGetResume(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const name = url.pathname.replace("/api/resume/", "");
  const data = await loadResume(name);
  if (!data) {
    return addSecurityHeaders(Response.json({ error: "Resume not found" }, { status: 404 }));
  }
  return addSecurityHeaders(Response.json(data));
}

// --- Settings Handlers ---

export async function handleGetSettings(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const name = url.pathname.replace("/api/settings/", "");
  const themeColor = getThemeColor(name);
  return addSecurityHeaders(Response.json({ themeColor }));
}

export async function handleSaveSettings(req: Request): Promise<Response> {
  // CSRF check for authenticated mutation
  const csrfError = checkCSRF(req);
  if (csrfError) return addSecurityHeaders(csrfError);

  if (!isAuthenticated(req)) {
    return addSecurityHeaders(Response.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const url = new URL(req.url);
  const name = url.pathname.replace("/api/settings/", "");

  const body = await parseJsonBody<{ themeColor?: string }>(req);
  if (!body) {
    return addSecurityHeaders(Response.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const { themeColor } = body;
  if (typeof themeColor !== "string" || !isValidColor(themeColor)) {
    return addSecurityHeaders(Response.json({ error: "Invalid theme color" }, { status: 400 }));
  }

  saveThemeColor(name, themeColor);
  return addSecurityHeaders(Response.json({ success: true }));
}

// --- PDF Handlers ---

export async function handleExportPDF(req: Request): Promise<Response> {
  // CSRF check for authenticated mutation
  const csrfError = checkCSRF(req);
  if (csrfError) return addSecurityHeaders(csrfError);

  if (!isAuthenticated(req)) {
    return addSecurityHeaders(Response.json({ error: "Unauthorized" }, { status: 401 }));
  }

  return handlePDFGeneration(req);
}

export async function handlePublicPDF(req: Request): Promise<Response> {
  return handlePDFGeneration(req);
}

async function handlePDFGeneration(req: Request): Promise<Response> {
  const body = await parseJsonBody<{ name?: string; themeColor?: string }>(req);
  if (!body) {
    return addSecurityHeaders(Response.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const { name, themeColor } = body;
  if (typeof name !== "string") {
    return addSecurityHeaders(Response.json({ error: "Resume name required" }, { status: 400 }));
  }

  const data = await loadResume(name);
  if (!data) {
    return addSecurityHeaders(Response.json({ error: "Resume not found" }, { status: 404 }));
  }

  const color = themeColor || getThemeColor(name);
  const html = generateHTML(data, color);
  const pdf = await generatePDF(html);

  const res = new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.header.name.replace(/\s+/g, "_")}_Resume.pdf"`,
    },
  });
  return addSecurityHeaders(res);
}

// --- Static File Handler ---

export async function handleStaticFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const staticFile = Bun.file(`public${path}`);
  if (await staticFile.exists()) {
    return addSecurityHeaders(new Response(staticFile));
  }
  return null;
}
