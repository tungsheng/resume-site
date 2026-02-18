// Security utilities

/**
 * Sanitize resume name to prevent path traversal attacks
 */
export function sanitizeName(name: string): string | null {
  if (!name || name.trim() === "") return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    return null;
  }
  if (
    decoded.includes("..") ||
    decoded.includes("/") ||
    decoded.includes("\\") ||
    decoded.includes("\0")
  ) {
    return null;
  }

  const sanitized = decoded.replace(/[^a-zA-Z0-9_-]/g, "");
  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate hex color format
 */
export function isValidColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Convert #RRGGBB to rgba(r, g, b, alpha). Returns original color if invalid.
 */
export function hexToRgba(color: string, alpha: number): string {
  if (!isValidColor(color)) return color;
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
}

/**
 * Parse JSON body from request safely
 */
export async function parseJsonBody<T>(req: Request): Promise<T | null> {
  try {
    const body = await req.json();
    if (typeof body !== "object" || body === null) return null;
    return body as T;
  } catch {
    return null;
  }
}

/**
 * Get session token from cookie
 */
export function getSessionToken(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] ?? null : null;
}

// ============================================
// Rate Limiting
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Check if request is within rate limit
 * @param ip - Client IP address
 * @param limit - Maximum requests per window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if within limit, false if exceeded
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  // Clean up expired entries periodically
  if (rateLimits.size > 1000) {
    for (const [key, val] of rateLimits) {
      if (now > val.resetAt) rateLimits.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/**
 * Get client IP from request
 */
export function getClientIP(req: Request): string {
  // Check common proxy headers
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    return first?.trim() ?? "unknown";
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback to unknown
  return "unknown";
}

// ============================================
// Security Headers
// ============================================

/**
 * Add security headers to response
 */
export function addSecurityHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
  );
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

// ============================================
// CSRF Protection
// ============================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

/**
 * Validate CSRF token from request header against stored token
 */
export function validateCSRFToken(req: Request, storedToken: string | null): boolean {
  if (!storedToken) return false;
  const headerToken = req.headers.get("X-CSRF-Token");
  return headerToken === storedToken;
}
