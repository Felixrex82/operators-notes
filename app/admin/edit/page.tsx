"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NoteItem { slug: string; sha: string; }

export default function AdminEdit() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/admin/notes");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setNotes(data);
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

  return (
    <div style={{ paddingTop: "52px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <div>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              ADMIN · NOTES
            </p>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em" }}>
              All Notes
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/admin/new" style={{
              padding: "0.6rem 1.2rem",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "5px",
              fontSize: "0.82rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}>
              + New note
            </Link>
            <Link href="/admin/analytics" style={{
              padding: "0.6rem 1rem",
              background: "transparent",
              color: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              fontSize: "0.82rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}>
              📊 Analytics
            </Link>
            <button onClick={logout} style={{
              padding: "0.6rem 1rem",
              background: "transparent",
              color: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}>
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "5px", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#ef4444" }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
              LOADING...
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>No notes yet.</p>
            <Link href="/admin/new" style={{ fontSize: "0.85rem", color: "var(--accent)" }}>Write your first note →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {notes.map((note, i) => (
              <div key={note.slug} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.1rem 0",
                borderBottom: i < notes.length - 1 ? "1px solid var(--border)" : "none",
                gap: "1rem",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.78rem",
                    color: "var(--primary)",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {note.slug}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                    /notes/{note.slug}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <Link href={`/notes/${note.slug}`} target="_blank" style={{
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}>
                    View ↗
                  </Link>
                  <Link href={`/admin/new?edit=${note.slug}`} style={{
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.75rem",
                    color: "var(--secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note.slug)}
                    disabled={deleting === note.slug}
                    style={{
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.75rem",
                      color: deleting === note.slug ? "var(--muted)" : "#ef4444",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
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
