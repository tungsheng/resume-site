// Environment configuration with defaults

export const config = {
  port: Number(process.env.PORT) || 3000,
  resumesDir: process.env.RESUMES_DIR || "resumes",
  trustProxy: process.env.TRUST_PROXY === "1",
};
