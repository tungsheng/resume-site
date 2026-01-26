// Environment configuration with defaults

export const config = {
  port: Number(process.env.PORT) || 3000,
  databasePath: process.env.DATABASE_PATH || "./data/resume.db",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "changeme",
  resumesDir: process.env.RESUMES_DIR || "resumes",
  sessionMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  defaultThemeColor: "#c9a86c",
};
