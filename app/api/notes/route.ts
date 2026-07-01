import { NextResponse } from "next/server";
import { getAllNotes } from "@/lib/notes";

// Revalidate every 30 seconds so new notes appear after Vercel redeploys
export const revalidate = 30;

export async function GET() {
  const notes = getAllNotes();
  return NextResponse.json(notes);
}
