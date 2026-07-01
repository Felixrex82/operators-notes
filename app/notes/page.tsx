"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Note } from "@/lib/notes";

const categories = ["All", "Startups", "Products", "Web3", "Growth", "Research", "Essays", "Systems", "Execution"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    fetch("/api/notes").then(r => r.json()).then(setNotes);
  }, []);

  const filtered = notes
    .filter(n => selected === "All" || n.category === selected)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "recent"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : a.title.localeCompare(b.title));

  return (
    <div className="page-wrap">
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <p className="label">ARCHIVE · {notes.length} NOTES</p>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.6rem" }}>Notes</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
            A running collection of ideas, analyses, and observations. Updated as I learn.
          </p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <input
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            style={{ flex: 1, minWidth: "180px" }}
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input"
            style={{ width: "auto", minWidth: "140px", cursor: "pointer" }}
          >
            <option value="recent">Most Recent</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>

        {/* Category pills — horizontally scrollable on mobile */}
        <div style={{
          display: "flex", gap: "0.4rem",
          marginBottom: "2.25rem",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "0.25rem",
          scrollbarWidth: "none",
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              style={{
                padding: "0.35rem 0.85rem",
                background: selected === cat ? "var(--accent)" : "var(--surface)",
                color: selected === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${selected === cat ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "4px",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.03em",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes list */}
        {filtered.length === 0 ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No notes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div>
            {filtered.map((note, i) => (
              <Link key={note.slug} href={`/notes/${note.slug}`} className="note-row" style={{ borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.45rem", flexWrap: "wrap" }}>
                    <span className="tag-accent">{note.category.toUpperCase()}</span>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "var(--muted)" }}>
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "0.97rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.4rem", letterSpacing: "-0.02em", lineHeight: 1.35 }}>
                    {note.title}
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{note.excerpt}</p>
                </div>
                <div className="note-row__meta">
                  <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)" }}>
                    {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                    {note.readingTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
