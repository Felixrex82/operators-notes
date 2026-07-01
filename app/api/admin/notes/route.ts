import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { upsertNote, getFilesha, listNotes } from "@/lib/github";

export async function GET() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await listNotes();
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, content } = await req.json();

  if (!slug || !content) {
    return NextResponse.json({ error: "slug and content are required" }, { status: 400 });
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const sha = await getFilesha(cleanSlug);

  try {
    await upsertNote(cleanSlug, content, sha);
    return NextResponse.json({ ok: true, slug: cleanSlug });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "GitHub error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
