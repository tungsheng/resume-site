import { generatePDF } from "../../services/pdf";
import { publicResumeData } from "../../features/resume/data";
import { renderResumeHtmlDocument } from "../../features/resume/render-static-html";

const DEFAULT_MAX_CONCURRENT_PDF_EXPORTS = 2;

let activePDFExports = 0;

function error(status: number, message: string, headers?: HeadersInit): Response {
  return Response.json({ error: message }, { status, headers });
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

function getPositiveIntegerEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;

  const parsedValue = Number(rawValue);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) return fallback;

  return parsedValue;
}

export function getMaxConcurrentPDFExports(): number {
  return getPositiveIntegerEnv(
    "PDF_MAX_CONCURRENT_EXPORTS",
    DEFAULT_MAX_CONCURRENT_PDF_EXPORTS
  );
}

export function tryAcquirePDFRenderSlot(
  maxConcurrentExports = getMaxConcurrentPDFExports()
): (() => void) | null {
  if (activePDFExports >= maxConcurrentExports) return null;

  activePDFExports++;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activePDFExports = Math.max(0, activePDFExports - 1);
  };
}

function getHeaderValue(req: Request, header: string): string | null {
  const value = req.headers.get(header)?.trim();
  return value || null;
}

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (rateLimits.size > 1000) {
    for (const [key, val] of rateLimits) {
      if (now > val.resetAt) rateLimits.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function resolveClientIP(req: Request, directAddress: string | null): string {
  if (process.env.TRUST_PROXY === "1") {
    const forwarded = getHeaderValue(req, "x-forwarded-for");
    const forwardedIP = forwarded?.split(",")[0]?.trim();
    if (forwardedIP) return forwardedIP;

    const realIP = getHeaderValue(req, "x-real-ip");
    if (realIP) return realIP;
  }

  if (directAddress) return directAddress;

  return "unknown";
}

export async function handlePublicPDF(
  req: Request,
  directAddress: string | null = null
): Promise<Response> {
  await req.body?.cancel().catch(() => {});

  const ip = resolveClientIP(req, directAddress);
  if (!checkRateLimit(ip, 3, 60000)) {
    return error(429, "Too many PDF requests. Please try again later.");
  }

  const releasePDFRenderSlot = tryAcquirePDFRenderSlot();
  if (!releasePDFRenderSlot) {
    return error(503, "PDF export is busy. Please try again shortly.", {
      "Retry-After": "10",
    });
  }

  const data = publicResumeData;

  try {
    const html = renderResumeHtmlDocument(data);
    const pdf = await generatePDF(html);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.header.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_Resume.pdf"`,
      },
    });
  } catch (pdfError) {
    const message = pdfError instanceof Error ? pdfError.message : "Failed to generate PDF";
    console.error("[resume-site] PDF generation failed", {
      resume: data.header.name,
      error: message,
    });
    if (message.includes("PUPPETEER_EXECUTABLE_PATH")) {
      return error(500, "PDF engine unavailable: configure PUPPETEER_EXECUTABLE_PATH");
    }
    return error(500, "Failed to generate PDF");
  } finally {
    releasePDFRenderSlot();
  }
}
