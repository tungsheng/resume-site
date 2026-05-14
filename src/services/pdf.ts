import puppeteer, { type Browser, type Page } from "puppeteer-core";

const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];
const PX_PER_INCH = 96;
const DEFAULT_PDF_RENDER_TIMEOUT_MS = 30_000;
const EXECUTABLE_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
];

let browser: Browser | null = null;

export const LETTER_PDF_SIZE_PX = {
  width: 8.5 * PX_PER_INCH,
  height: 11 * PX_PER_INCH,
} as const;

export interface PdfContentSize {
  contentWidthPx: number;
  contentHeightPx: number;
}

function getPositiveIntegerEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;

  const parsedValue = Number(rawValue);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) return fallback;

  return parsedValue;
}

export function getPDFRenderTimeoutMs(): number {
  return getPositiveIntegerEnv("PDF_RENDER_TIMEOUT_MS", DEFAULT_PDF_RENDER_TIMEOUT_MS);
}

function clampPdfScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1;
  return Math.max(0.1, Math.min(1, scale));
}

export function calculatePdfScale(
  contentWidthPx: number,
  contentHeightPx: number
): number {
  const widthScale = LETTER_PDF_SIZE_PX.width / Math.max(contentWidthPx, LETTER_PDF_SIZE_PX.width);
  const heightScale = LETTER_PDF_SIZE_PX.height / Math.max(contentHeightPx, LETTER_PDF_SIZE_PX.height);

  return clampPdfScale(Math.min(1, widthScale, heightScale));
}

async function resolveExecutablePath(): Promise<string | undefined> {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  for (const candidate of EXECUTABLE_CANDIDATES) {
    if (await Bun.file(candidate).exists()) {
      return candidate;
    }
  }

  return undefined;
}

async function getBrowser(): Promise<Browser> {
  if (browser && browser.connected) return browser;
  const executablePath = await resolveExecutablePath();

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: BROWSER_ARGS,
    });
  } catch (error) {
    const hint = executablePath
      ? `Failed to launch browser executable: ${executablePath}`
      : "Failed to launch browser. Set PUPPETEER_EXECUTABLE_PATH to your Chromium/Chrome binary.";
    throw new Error(`${hint} (${String(error)})`);
  }

  return browser;
}

async function createPDFPage(html: string): Promise<Page> {
  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.setViewport({
      width: Math.ceil(LETTER_PDF_SIZE_PX.width),
      height: Math.ceil(LETTER_PDF_SIZE_PX.height),
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
    await page.evaluate(async () => {
      await document.fonts?.ready;
    });
    return page;
  } catch (error) {
    await page.close();
    throw error;
  }
}

export async function measurePDFContentSize(page: Page): Promise<PdfContentSize> {
  return page.evaluate(
    ({ letterWidthPx, letterHeightPx }) => {
      const root = document.querySelector(".resume-document");
      if (!root || !(root instanceof HTMLElement)) {
        return {
          contentWidthPx: letterWidthPx,
          contentHeightPx: letterHeightPx,
        };
      }

      const rect = root.getBoundingClientRect();
      const body = document.body;
      const doc = document.documentElement;
      const leftEdge = Math.min(rect.left, 0);
      const topEdge = Math.min(rect.top, 0);
      const rightEdge = Math.max(
        rect.right,
        root.scrollWidth + Math.max(rect.left, 0),
        body?.scrollWidth ?? 0,
        doc.scrollWidth,
        letterWidthPx
      );
      const bottomEdge = Math.max(
        rect.bottom,
        root.scrollHeight + Math.max(rect.top, 0),
        body?.scrollHeight ?? 0,
        doc.scrollHeight,
        letterHeightPx
      );

      return {
        contentWidthPx: Math.ceil(Math.max(rightEdge - leftEdge, letterWidthPx)),
        contentHeightPx: Math.ceil(Math.max(bottomEdge - topEdge, letterHeightPx)),
      };
    },
    { letterWidthPx: LETTER_PDF_SIZE_PX.width, letterHeightPx: LETTER_PDF_SIZE_PX.height }
  );
}

export async function measurePDFContent(html: string): Promise<PdfContentSize> {
  const page = await createPDFPage(html);

  try {
    return await measurePDFContentSize(page);
  } finally {
    await page.close();
  }
}

export async function generatePDF(html: string): Promise<Buffer> {
  const page = await createPDFPage(html);

  try {
    const { contentWidthPx, contentHeightPx } = await measurePDFContentSize(page);
    const pdfScale = calculatePdfScale(contentWidthPx, contentHeightPx);
    const pdf = await page.pdf({
      format: "Letter",
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      scale: pdfScale,
      timeout: getPDFRenderTimeoutMs(),
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

export async function closePDFBrowser(): Promise<void> {
  if (browser?.connected) {
    await browser.close();
  }
  browser = null;
}
