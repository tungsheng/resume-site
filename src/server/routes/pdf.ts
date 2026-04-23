import { isResumeLayoutTemplate } from "../../layouts";
import { generatePDF } from "../../services/pdf";
import { loadResume } from "../../domain/resume/load";
import { renderResumeHtmlDocument } from "../../features/resume/render-static-html";
import { getResumeSettings } from "../../features/resume/presentation";
import { logger } from "../../logger";
import { config } from "../../config";
import { checkRateLimit, getClientIP, isValidColor, parseJsonBody } from "../../utils";

function error(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

function badRequest(message: string): Response {
  return error(400, message);
}

function notFound(message: string = "Not found"): Response {
  return error(404, message);
}

function tooManyRequests(message: string): Response {
  return error(429, message);
}

export async function handlePublicPDF(
  req: Request,
  directAddress: string | null = null
): Promise<Response> {
  const ip = getClientIP(req, {
    directAddress,
    trustProxy: config.trustProxy,
  });
  if (!checkRateLimit(ip, 3, 60000)) {
    return tooManyRequests("Too many PDF requests. Please try again later.");
  }

  return handlePDFGeneration(req);
}

async function handlePDFGeneration(req: Request): Promise<Response> {
  const body = await parseJsonBody<{
    themeColor?: string;
    layoutTemplate?: string;
  }>(req);

  if (!body) {
    return badRequest("Invalid JSON");
  }

  const { themeColor, layoutTemplate } = body;

  if (themeColor !== undefined && !isValidColor(themeColor)) {
    return badRequest("Invalid theme color");
  }

  if (layoutTemplate !== undefined && !isResumeLayoutTemplate(layoutTemplate)) {
    return badRequest("Invalid layout template");
  }

  const data = await loadResume();
  if (!data) {
    return notFound("Resume not found");
  }

  const settings = getResumeSettings();
  const color = themeColor ?? settings.themeColor;
  const template = layoutTemplate ?? settings.layoutTemplate;
  try {
    const html = renderResumeHtmlDocument(data, color, template);
    const pdf = await generatePDF(html);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.header.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_Resume.pdf"`,
      },
    });
  } catch (pdfError) {
    const message = pdfError instanceof Error ? pdfError.message : "Failed to generate PDF";
    logger.error("PDF generation failed", {
      resume: data.header.name,
      layoutTemplate: template,
      error: message,
    });
    if (message.includes("PUPPETEER_EXECUTABLE_PATH")) {
      return error(500, "PDF engine unavailable: configure PUPPETEER_EXECUTABLE_PATH");
    }
    return error(500, "Failed to generate PDF");
  }
}
