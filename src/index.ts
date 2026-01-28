// Application entry point

import { config } from "./config";
import { initDatabase } from "./db";
import { addSecurityHeaders } from "./utils";
import {
  handleLogin,
  handleLogout,
  handleSession,
  handleListResumes,
  handleGetResume,
  handleGetSettings,
  handleSaveSettings,
  handleExportPDF,
  handlePublicPDF,
  handleStaticFile,
} from "./routes";

// Import HTML pages directly - Bun will bundle the TSX imports
import homePage from "../public/index.html";
import adminPage from "../public/admin.html";
import resumePage from "../public/resume.html";

initDatabase();

// Wrap handler to apply security headers to all API responses
function withHeaders<T extends (...args: any[]) => Response | Promise<Response>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    const res = await handler(...args);
    return addSecurityHeaders(res);
  }) as unknown as T;
}

Bun.serve({
  port: config.port,
  routes: {
    // Page routes - using Bun's HTML imports for React bundling
    "/": homePage,
    "/admin": adminPage,
    "/resume/:name": resumePage,

    // Auth API routes
    "/api/login": { POST: withHeaders(handleLogin) },
    "/api/logout": { POST: withHeaders(handleLogout) },
    "/api/session": { GET: withHeaders(handleSession) },

    // Resume API routes
    "/api/resumes": { GET: withHeaders(handleListResumes) },
    "/api/resume/:name": { GET: withHeaders(handleGetResume) },

    // Settings API routes
    "/api/settings/:name": {
      GET: withHeaders(handleGetSettings),
      POST: withHeaders(handleSaveSettings),
    },

    // PDF export routes
    "/api/export-pdf": { POST: withHeaders(handleExportPDF) },
    "/api/public-pdf": { POST: withHeaders(handlePublicPDF) },
  },

  // Fallback for static files
  async fetch(req): Promise<Response> {
    const staticResponse = await handleStaticFile(req);
    if (staticResponse) return addSecurityHeaders(staticResponse);
    return addSecurityHeaders(new Response("Not Found", { status: 404 }));
  },

  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Resume server running at http://localhost:${config.port}`);
console.log(`Home: http://localhost:${config.port}/`);
console.log(`Resume: http://localhost:${config.port}/resume/tony-lee`);
console.log(`Admin: http://localhost:${config.port}/admin`);
