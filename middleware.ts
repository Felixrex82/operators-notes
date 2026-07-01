import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "dev-secret-change-in-production"
);

const PUBLIC_ADMIN = ["/admin", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to /admin/* and /api/admin/*
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow the login page and login API through unauthenticated
  if (PUBLIC_ADMIN.includes(pathname)) {
    return NextResponse.next();
  }

  // --- Security headers on all admin responses ---
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-protected", "1");

  // Check JWT cookie
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    await jwtVerify(token, SECRET);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    addSecurityHeaders(res);
    return res;
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  // API routes return 401 JSON, page routes redirect
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin";
  return NextResponse.redirect(loginUrl);
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
