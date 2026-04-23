// Application entry point

import { config } from "./config";
import { loadResume } from "./domain/resume/load";
import { getResumeSettings } from "./features/resume/presentation";
import { logger } from "./logger";
import { handlePublicPDF } from "./server/routes/pdf";
import { handleStaticFile } from "./server/routes/static";
import { closePDFBrowser } from "./services/pdf";
import { addSecurityHeaders } from "./utils";

// Import HTML pages directly - Bun will bundle the TSX imports
import homePage from "../public/index.html";
import resumePage from "../public/resume.html";
import projectPage from "../public/project.html";
import experimentsPage from "../public/experiments.html";

// Wrap handler to apply security headers to all API responses
function withHeaders<T extends (...args: any[]) => Response | Promise<Response>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    const res = await handler(...args);
    return addSecurityHeaders(res);
  }) as unknown as T;
}

async function handleGetResume(): Promise<Response> {
  const data = await loadResume();
  if (!data) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }
  return Response.json(data);
}

function handleGetSettings(): Response {
  return Response.json(getResumeSettings());
}

let server: ReturnType<typeof Bun.serve>;

server = Bun.serve({
  port: config.port,
  routes: {
    // Page routes - using Bun's HTML imports for React bundling
    "/": homePage,
    "/project/cloud-inference-platform": projectPage,
    "/experiments": experimentsPage,
    "/resume": resumePage,

    // Resume API routes
    "/api/resume": { GET: withHeaders(handleGetResume) },

    // Settings API routes
    "/api/settings": { GET: withHeaders(handleGetSettings) },

    // PDF export routes
    "/api/public-pdf": {
      POST: withHeaders((req) => handlePublicPDF(req, server.requestIP(req)?.address ?? null)),
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
  logger.info("Shutting down server", { signal });

  server.stop();
  await closePDFBrowser();
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

logger.info("Resume server started", {
  baseUrl: `http://localhost:${config.port}`,
  home: `http://localhost:${config.port}/`,
  project: `http://localhost:${config.port}/project/cloud-inference-platform`,
  experiments: `http://localhost:${config.port}/experiments`,
  resume: `http://localhost:${config.port}/resume`,
});
