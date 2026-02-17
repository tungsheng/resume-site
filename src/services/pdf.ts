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

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser && browser.connected) return browser;

  browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: BROWSER_ARGS,
  });

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
