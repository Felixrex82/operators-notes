import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import { notFound } from "next/navigation";
import Link from "next/link";
import NoteContent from "@/components/NoteContent";
import ShareButton from "@/components/ShareButton";

export async function generateStaticParams() {
  return getAllNotes().map(n => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
    openGraph: {
      title: note.title,
      description: note.excerpt,
      type: "article",
      publishedTime: note.date,
    },
    twitter: { card: "summary_large_image", title: note.title, description: note.excerpt },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const allNotes = getAllNotes();
  const idx = allNotes.findIndex(n => n.slug === slug);
  const prev = allNotes[idx + 1] || null;
  const next = allNotes[idx - 1] || null;

  return (
    <div className="page-wrap">
      <div className="container" style={{ paddingBottom: "5rem" }}>

        {/* Back link */}
        <div style={{ paddingTop: "1.75rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <Link href="/notes" style={{
            fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem",
            color: "var(--muted)", letterSpacing: "0.06em",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
          }}>
            ← NOTES
          </Link>
        </div>

        <article className="reading-col" style={{ paddingTop: "2.5rem" }}>

          {/* Meta */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <span className="tag-accent">{note.category.toUpperCase()}</span>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.67rem", color: "var(--muted)" }}>
              {new Date(note.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span style={{ color: "var(--border-light)" }}>·</span>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.67rem", color: "var(--muted)" }}>
              {note.readingTime}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.1rem)", fontWeight: 700,
            color: "var(--primary)", letterSpacing: "-0.04em",
            lineHeight: 1.15, marginBottom: "1.1rem",
          }}>
            {note.title}
          </h1>

          <p style={{
            fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "var(--secondary)",
            lineHeight: 1.75, borderBottom: "1px solid var(--border)",
            paddingBottom: "2rem", marginBottom: "2.25rem",
          }}>
            {note.excerpt}
          </p>

          {/* Body */}
          <NoteContent content={note.content} />

          {/* Tags + Share */}
          <div style={{
            marginTop: "2.5rem", paddingTop: "1.75rem",
            borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: "1rem", flexWrap: "wrap",
          }}>
            {note.tags.length > 0 ? (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {note.tags.map(tag => (
                  <span key={tag} className="tag-muted">#{tag}</span>
                ))}
              </div>
            ) : <div />}

            <ShareButton title={note.title} slug={slug} />
          </div>

          {/* Prev / Next */}
          <div style={{
            display: "grid",
            gridTemplateColumns: prev && next ? "1fr 1fr" : prev ? "1fr" : "1fr",
            gap: "1rem", marginTop: "2.5rem", paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
          }}>
            {prev && (
              <Link href={`/notes/${prev.slug}`} style={{ textDecoration: "none" }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.63rem", color: "var(--muted)", marginBottom: "0.4rem" }}>← PREVIOUS</p>
                <p style={{ fontSize: "0.85rem", color: "var(--secondary)", lineHeight: 1.4 }}>{prev.title}</p>
              </Link>
            )}
            {next && (
              <Link href={`/notes/${next.slug}`} style={{ textDecoration: "none", textAlign: prev ? "right" : "left" }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.63rem", color: "var(--muted)", marginBottom: "0.4rem" }}>NEXT →</p>
                <p style={{ fontSize: "0.85rem", color: "var(--secondary)", lineHeight: 1.4 }}>{next.title}</p>
              </Link>
            )}
          </div>

        </article>
      </div>
    </div>
  );
}
