// PDF generation

import puppeteer, { type Browser } from "puppeteer-core";

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

export async function generatePDF(html: string): Promise<Buffer> {
  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.setViewport({
      width: Math.ceil(LETTER_WIDTH_PX),
      height: Math.ceil(LETTER_HEIGHT_PX),
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
    const { contentWidthPx, contentHeightPx } = await page.evaluate(
      ({ letterWidthPx, letterHeightPx }) => {
        const root = document.querySelector(".resume-document");
        if (!root || !(root instanceof HTMLElement)) {
          return {
            contentWidthPx: letterWidthPx,
            contentHeightPx: letterHeightPx,
          };
        }

        const rect = root.getBoundingClientRect();
        const rectWidth = rect.width;
        const rectHeight = rect.height;
        const scrollWidth = root.scrollWidth;
        const scrollHeight = root.scrollHeight;
        return {
          contentWidthPx: Math.ceil(Math.max(rectWidth, scrollWidth, letterWidthPx)),
          contentHeightPx: Math.ceil(Math.max(rectHeight, scrollHeight, letterHeightPx)),
        };
      },
      { letterWidthPx: LETTER_WIDTH_PX, letterHeightPx: LETTER_HEIGHT_PX }
    );

    const pdfScale = calculatePdfScale(contentWidthPx, contentHeightPx);
    const pdf = await page.pdf({
      format: "Letter",
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
