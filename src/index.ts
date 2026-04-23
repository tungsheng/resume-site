// Application entry point

import { handlePublicPDF } from "./server/routes/pdf";
import { handleStaticFile } from "./server/routes/static";
import { closePDFBrowser } from "./services/pdf";

// Import HTML pages directly - Bun will bundle the TSX imports
import homePage from "../public/index.html";
import resumePage from "../public/resume.html";
import projectPage from "../public/project.html";
import experimentsPage from "../public/experiments.html";

const PORT = Number(process.env.PORT) || 3000;

function addSecurityHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
  );
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

let server: ReturnType<typeof Bun.serve>;

server = Bun.serve({
  port: PORT,
  routes: {
    // Page routes - using Bun's HTML imports for React bundling
    "/": homePage,
    "/project/cloud-inference-platform": projectPage,
    "/experiments": experimentsPage,
    "/resume": resumePage,

    // PDF export routes
    "/api/public-pdf": {
      POST: async (req) =>
        addSecurityHeaders(
          await handlePublicPDF(req, server.requestIP(req)?.address ?? null)
        ),
    },
  },

  // Fallback for static files
  async fetch(req): Promise<Response> {
    const staticResponse = await handleStaticFile(req);
    if (staticResponse) return addSecurityHeaders(staticResponse);
    return addSecurityHeaders(new Response("Not Found", { status: 404 }));
  },

  development: {
    hmr: false,
  },
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("[resume-site] Shutting down server", { signal });

  server.stop();
  await closePDFBrowser();
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

console.log("[resume-site] Resume server started", {
  baseUrl: `http://localhost:${PORT}`,
  home: `http://localhost:${PORT}/`,
  project: `http://localhost:${PORT}/project/cloud-inference-platform`,
  experiments: `http://localhost:${PORT}/experiments`,
  resume: `http://localhost:${PORT}/resume`,
});
