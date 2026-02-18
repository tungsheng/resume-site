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
    await page.setContent(html, { waitUntil: "networkidle0" });
    const contentHeightPx = await page.evaluate(
      ({ letterHeightPx }) => {
        const root = document.querySelector(".page");
        if (!root || !(root instanceof HTMLElement)) return letterHeightPx;

        const rectHeight = root.getBoundingClientRect().height;
        const scrollHeight = root.scrollHeight;
        return Math.ceil(Math.max(rectHeight, scrollHeight, letterHeightPx));
      },
      { letterHeightPx: LETTER_HEIGHT_PX }
    );

    const contentHeightIn = contentHeightPx / PX_PER_INCH;
    const pageHeightIn = Math.max(
      LETTER_HEIGHT_IN,
      Math.ceil(contentHeightIn * 100) / 100
    );

    const pdf =
      pageHeightIn <= LETTER_HEIGHT_IN + 0.01
        ? await page.pdf({
            format: "Letter",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          })
        : await page.pdf({
            width: `${LETTER_WIDTH_IN}in`,
            height: `${pageHeightIn}in`,
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
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
