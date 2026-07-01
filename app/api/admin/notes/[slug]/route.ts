import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getNoteContent, upsertNote, deleteNote, getFilesha } from "@/lib/github";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const content = await getNoteContent(slug);
  if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sha = await getFilesha(slug);
  return NextResponse.json({ content, sha });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { content } = await req.json();
  const sha = await getFilesha(slug);

  try {
    await upsertNote(slug, content, sha);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "GitHub error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const sha = await getFilesha(slug);
  if (!sha) return NextResponse.json({ error: "File not found" }, { status: 404 });

  try {
    await deleteNote(slug, sha);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "GitHub error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
