"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NoteItem { slug: string; sha: string; likes?: number; }

export default function AdminEdit() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/admin/notes");
    if (res.status === 401) { router.push("/admin"); return; }
    const data: NoteItem[] = await res.json();

    // Fetch like counts for all notes in parallel
    const withLikes = await Promise.all(
      data.map(async note => {
        try {
          const r = await fetch(`/api/likes?slug=${note.slug}`);
          const d = await r.json();
          return { ...note, likes: d.likes || 0 };
        } catch {
          return { ...note, likes: 0 };
        }
      })
    );

    // Sort by likes descending
    withLikes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    setNotes(withLikes);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    const res = await fetch(`/api/admin/notes/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setNotes(n => n.filter(x => x.slug !== slug));
    } else {
      const d = await res.json();
      setError(d.error || "Delete failed");
    }
    setDeleting(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  const totalLikes = notes.reduce((sum, n) => sum + (n.likes || 0), 0);

  return (
    <div style={{ paddingTop: "52px" }}>
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p className="label">ADMIN · NOTES</p>
            <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.75rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em" }}>
              All Notes
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/admin/new" style={{
              padding: "0.6rem 1.1rem", background: "var(--accent)", color: "#fff",
              borderRadius: "5px", fontSize: "0.82rem", fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              + New note
            </Link>
            <Link href="/admin/analytics" style={{
              padding: "0.6rem 1rem", background: "transparent", color: "var(--muted)",
              border: "1px solid var(--border)", borderRadius: "5px", fontSize: "0.82rem",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              📊 Analytics
            </Link>
            <button onClick={logout} style={{
              padding: "0.6rem 1rem", background: "transparent", color: "var(--muted)",
              border: "1px solid var(--border)", borderRadius: "5px",
              fontSize: "0.82rem", cursor: "pointer",
            }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Stats strip */}
        {!loading && notes.length > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1px", background: "var(--border)", border: "1px solid var(--border)",
            borderRadius: "6px", overflow: "hidden", marginBottom: "2rem",
          }}>
            {[
              { label: "TOTAL NOTES", value: notes.length },
              { label: "TOTAL LIKES", value: totalLikes },
              { label: "MOST LIKED", value: notes[0]?.slug.replace(/-/g," ").slice(0,20) + (notes[0]?.slug.length > 20 ? "…" : "") || "—" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "var(--surface)", padding: "1.1rem 1.25rem" }}>
                <p className="label" style={{ marginBottom: "0.35rem" }}>{stat.label}</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "5px", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#ef4444" }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
              LOADING...
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>No notes yet.</p>
            <Link href="/admin/new" style={{ fontSize: "0.85rem", color: "var(--accent)" }}>Write your first note →</Link>
          </div>
        ) : (
          <div>
            {/* Column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 60px auto",
              gap: "1rem", padding: "0.5rem 0",
              borderBottom: "1px solid var(--border)", marginBottom: "0.25rem",
            }}>
              <p className="label" style={{ marginBottom: 0 }}>NOTE</p>
              <p className="label" style={{ marginBottom: 0, textAlign: "center" }}>LIKES</p>
              <p className="label" style={{ marginBottom: 0 }}>ACTIONS</p>
            </div>

            {notes.map((note, i) => (
              <div key={note.slug} style={{
                display: "grid", gridTemplateColumns: "1fr 60px auto",
                gap: "1rem", alignItems: "center",
                padding: "1rem 0",
                borderBottom: i < notes.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                {/* Slug + url */}
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Geist Mono', monospace", fontSize: "0.8rem",
                    color: "var(--primary)", fontWeight: 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {note.slug}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                    /notes/{note.slug}
                  </p>
                </div>

                {/* Like count */}
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem",
                    color: (note.likes || 0) > 0 ? "#ef4444" : "var(--muted)",
                    fontWeight: (note.likes || 0) > 0 ? 600 : 400,
                  }}>
                    {(note.likes || 0) > 0 ? "❤️" : "🤍"} {note.likes || 0}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap" }}>
                  <Link href={`/notes/${note.slug}`} target="_blank" style={{
                    padding: "0.35rem 0.7rem", fontSize: "0.75rem",
                    color: "var(--muted)", border: "1px solid var(--border)",
                    borderRadius: "4px", display: "inline-flex", alignItems: "center",
                    whiteSpace: "nowrap",
                  }}>
                    View ↗
                  </Link>
                  <Link href={`/admin/new?edit=${note.slug}`} style={{
                    padding: "0.35rem 0.7rem", fontSize: "0.75rem",
                    color: "var(--secondary)", border: "1px solid var(--border)",
                    borderRadius: "4px", display: "inline-flex", alignItems: "center",
                  }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note.slug)}
                    disabled={deleting === note.slug}
                    style={{
                      padding: "0.35rem 0.7rem", fontSize: "0.75rem",
                      color: deleting === note.slug ? "var(--muted)" : "#ef4444",
                      border: "1px solid var(--border)", borderRadius: "4px",
                      background: "transparent",
                      cursor: deleting === note.slug ? "not-allowed" : "pointer",
                    }}
                  >
                    {deleting === note.slug ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
