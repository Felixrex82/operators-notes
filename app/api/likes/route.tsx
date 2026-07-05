import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// GET /api/likes?slug=my-note — returns like count for a note
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 0 });

  const count = await redis.get<number>(`likes:${slug}`) || 0;
  return NextResponse.json({ likes: count });
}

// POST /api/likes?slug=my-note — increments like count
export async function POST(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 1 });

  const count = await redis.incr(`likes:${slug}`);
  return NextResponse.json({ likes: count });
}

// DELETE /api/likes?slug=my-note — decrements (unlike)
export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ likes: 0 });

  const current = await redis.get<number>(`likes:${slug}`) || 0;
  const newCount = Math.max(0, current - 1);
  await redis.set(`likes:${slug}`, newCount);
  return NextResponse.json({ likes: newCount });
}
