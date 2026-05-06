// PDF generation

import puppeteer, { type Browser, type Page } from "puppeteer-core";

const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];
const PX_PER_INCH = 96;
const LETTER_WIDTH_IN = 8.5;
const LETTER_HEIGHT_IN = 11;
const LETTER_WIDTH_PX = LETTER_WIDTH_IN * PX_PER_INCH;
const LETTER_HEIGHT_PX = LETTER_HEIGHT_IN * PX_PER_INCH;
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
  width: LETTER_WIDTH_PX,
  height: LETTER_HEIGHT_PX,
} as const;

export interface PdfContentSize {
  contentWidthPx: number;
  contentHeightPx: number;
}

function clampPdfScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1;
  return Math.max(0.1, Math.min(1, scale));
}

export function calculatePdfScale(
  contentWidthPx: number,
  contentHeightPx: number
): number {
  const widthScale = LETTER_WIDTH_PX / Math.max(contentWidthPx, LETTER_WIDTH_PX);
  const heightScale = LETTER_HEIGHT_PX / Math.max(contentHeightPx, LETTER_HEIGHT_PX);

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
      width: Math.ceil(LETTER_WIDTH_PX),
      height: Math.ceil(LETTER_HEIGHT_PX),
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
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
    { letterWidthPx: LETTER_WIDTH_PX, letterHeightPx: LETTER_HEIGHT_PX }
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
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

export async function closePDFBrowser(): Promise<void> {
  if (!browser) return;
  if (browser.connected) {
    await browser.close();
  }
  browser = null;
}
