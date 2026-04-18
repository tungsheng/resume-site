// Environment configuration with defaults

import { DEFAULT_RESUME_TEMPLATE } from "./layouts";

export const config = {
  port: Number(process.env.PORT) || 3000,
  resumesDir: process.env.RESUMES_DIR || "resumes",
  defaultThemeColor: "#c9a86c",
  defaultLayoutTemplate: DEFAULT_RESUME_TEMPLATE,
};
