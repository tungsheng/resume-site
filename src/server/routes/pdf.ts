import { isResumeLayoutTemplate } from "../../layouts";
import { generatePDF } from "../../services/pdf";
import { generateHTML, loadResume } from "../../services/resume";
import { getResumeSettings } from "../../services/settings";
import { logger } from "../../logger";
import { checkRateLimit, getClientIP, isValidColor, parseJsonBody } from "../../utils";
import { badRequest, error, notFound, tooManyRequests } from "../http/response";
import { requireAuthenticatedMutation } from "./security";

export async function handleExportPDF(req: Request): Promise<Response> {
  const authError = requireAuthenticatedMutation(req);
  if (authError) return authError;

  return handlePDFGeneration(req);
}

export async function handlePublicPDF(req: Request): Promise<Response> {
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 3, 60000)) {
    return tooManyRequests("Too many PDF requests. Please try again later.");
  }

  return handlePDFGeneration(req);
}

async function handlePDFGeneration(req: Request): Promise<Response> {
  const body = await parseJsonBody<{
    name?: string;
    themeColor?: string;
    layoutTemplate?: string;
  }>(req);

  if (!body) {
    return badRequest("Invalid JSON");
  }

  const { name, themeColor, layoutTemplate } = body;
  if (typeof name !== "string") {
    return badRequest("Resume name required");
  }

  if (themeColor !== undefined && !isValidColor(themeColor)) {
    return badRequest("Invalid theme color");
  }

  if (layoutTemplate !== undefined && !isResumeLayoutTemplate(layoutTemplate)) {
    return badRequest("Invalid layout template");
  }

  const data = await loadResume(name);
  if (!data) {
    return notFound("Resume not found");
  }

  const settings = getResumeSettings(name);
  const color = themeColor ?? settings.themeColor;
  const template = layoutTemplate ?? settings.layoutTemplate;
  try {
    const html = generateHTML(data, color, template);
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
      resume: name,
      layoutTemplate: template,
      error: message,
    });
    if (message.includes("PUPPETEER_EXECUTABLE_PATH")) {
      return error(500, "PDF engine unavailable: configure PUPPETEER_EXECUTABLE_PATH");
    }
    return error(500, "Failed to generate PDF");
  }
}
