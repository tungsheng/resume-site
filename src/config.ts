// Environment configuration with defaults

export const config = {
  port: Number(process.env.PORT) || 3000,
  trustProxy: process.env.TRUST_PROXY === "1",
};
