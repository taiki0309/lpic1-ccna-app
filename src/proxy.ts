import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── In-memory rate limiter (per IP, sliding window) ────────────────
// Works for single-instance App Runner. For multi-instance, use Upstash Redis.
interface RateEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateEntry>();

const RATE_LIMIT_CONFIG = {
  // API routes: 60 requests per minute per IP
  api: { maxRequests: 60, windowMs: 60_000 },
  // Login route: 10 attempts per 5 minutes per IP
  login: { maxRequests: 10, windowMs: 300_000 },
};

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return true;
  }
  return false;
}

// ── Security headers ──────────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // XSS protection (modern browsers use CSP, but keep for legacy)
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // HSTS (tells browsers to always use HTTPS)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy (disable unnecessary browser features)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  return response;
}

// ── Proxy (formerly Middleware in older Next.js versions) ──────────
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ── Rate limiting for API routes ──────────────────────────────
  if (pathname.startsWith("/api/")) {
    const key = `api:${ip}`;
    const { maxRequests, windowMs } = RATE_LIMIT_CONFIG.api;

    if (isRateLimited(key, maxRequests, windowMs)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Limit": String(maxRequests),
          },
        }
      );
    }
  }

  // ── Rate limiting for login route (brute-force protection) ────
  if (pathname.startsWith("/login") && request.method === "POST") {
    const key = `login:${ip}`;
    const { maxRequests, windowMs } = RATE_LIMIT_CONFIG.login;

    if (isRateLimited(key, maxRequests, windowMs)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "ログイン試行回数が上限に達しました。5分後に再試行してください。" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
          },
        }
      );
    }
  }

  // ── Block obviously malicious paths ──────────────────────────
  const blockedPatterns = [
    /\.(php|asp|aspx|jsp|cgi|sh|bash|py|rb|pl)$/i,
    /\/(wp-admin|wp-login|phpmyadmin|admin|\.env|\.git)/i,
    /\/\.\./,  // path traversal
  ];
  if (blockedPatterns.some((p) => p.test(pathname))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // ── Pass through with security headers ───────────────────────
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
