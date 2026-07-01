import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE } from "@/lib/auth";

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getIP(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD || "";

  // Constant-time comparison — prevents timing attacks
  const encoder = new TextEncoder();
  const a = encoder.encode(password);
  const b = encoder.encode(correct);
  let mismatch = a.length !== b.length ? 1 : 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) mismatch |= (a[i] ?? 0) ^ (b[i] ?? 0);

  // Always delay ~200ms to prevent timing-based enumeration
  await new Promise(r => setTimeout(r, 200));

  if (mismatch !== 0) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Clear rate limit on success
  attempts.delete(ip);

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}
