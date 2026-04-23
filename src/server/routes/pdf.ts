import { generatePDF } from "../../services/pdf";
import { publicResumeData } from "../../features/resume/data";
import { renderResumeHtmlDocument } from "../../features/resume/render-static-html";

function error(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

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

function getClientIP(req: Request, directAddress: string | null): string {
  if (directAddress) return directAddress;

  if (process.env.TRUST_PROXY === "1") {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

    const realIP = req.headers.get("x-real-ip");
    if (realIP) return realIP;
  }

  return "unknown";
}

export async function handlePublicPDF(
  req: Request,
  directAddress: string | null = null
): Promise<Response> {
  const ip = getClientIP(req, directAddress);
  if (!checkRateLimit(ip, 3, 60000)) {
    return error(429, "Too many PDF requests. Please try again later.");
  }

  await req.body?.cancel().catch(() => {});
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
  }
}
