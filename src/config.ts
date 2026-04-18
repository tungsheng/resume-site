// Environment configuration with defaults

import { DEFAULT_RESUME_TEMPLATE } from "./layouts";

export const config = {
  port: Number(process.env.PORT) || 3000,
  resumesDir: process.env.RESUMES_DIR || "resumes",
  trustProxy: process.env.TRUST_PROXY === "1",
  defaultThemeColor: "#c9a86c",
  defaultLayoutTemplate: DEFAULT_RESUME_TEMPLATE,
};
