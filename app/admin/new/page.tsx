"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Startups", "Products", "Web3", "Growth", "Research", "Essays", "Systems", "Execution"];

function buildFrontmatter(fields: {
  title: string; excerpt: string; date: string;
  category: string; tags: string; featured: boolean;
}) {
  const tagsArr = fields.tags.split(",").map(t => t.trim()).filter(Boolean);
  return `---
title: "${fields.title.replace(/"/g, '\\"')}"
excerpt: "${fields.excerpt.replace(/"/g, '\\"')}"
date: "${fields.date}"
category: "${fields.category}"
tags: [${tagsArr.map(t => `"${t}"`).join(", ")}]
featured: ${fields.featured}
---

`;
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const fm = match[1];
  const body = match[2].trimStart();
  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?`, "m"));
    return m ? m[1] : "";
  };
  const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  const tags = tagsMatch ? tagsMatch[1].replace(/"/g, "").split(",").map(t => t.trim()).filter(Boolean).join(", ") : "";
  const featuredMatch = fm.match(/^featured:\s*(true|false)/m);
  return {
    title: get("title"),
    excerpt: get("excerpt"),
    date: get("date"),
    category: get("category"),
    tags,
    featured: featuredMatch ? featuredMatch[1] === "true" : false,
    body,
  };
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

function renderPreview(md: string) {
  return md
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1rem;font-weight:600;color:#F2F2F3;margin:1.5rem 0 0.5rem;padding-bottom:0.4rem;border-bottom:1px solid #1C1C1F">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:0.9rem;font-weight:600;color:#F2F2F3;margin:1.25rem 0 0.4rem">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F2F2F3;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#111113;color:#3B7BF8;font-size:0.82em;padding:0.15em 0.35em;border-radius:3px;border:1px solid #1C1C1F">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:0.35rem;color:#A0A0B0;font-size:0.88rem;line-height:1.7">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, '<ul style="padding-left:1.25rem;margin-bottom:1rem">$&</ul>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:2px solid #3B7BF8;padding-left:1rem;color:#5A5A6A;font-style:italic;margin:1rem 0">$1</blockquote>')
    .replace(/^(?!<[hublb])(.+)$/gm, '<p style="font-size:0.88rem;color:#A0A0B0;line-height:1.8;margin-bottom:0.9rem">$1</p>')
    .replace(/<p[^>]*><\/p>/g, "");
}

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const isEdit = !!editSlug;

  const today = new Date().toISOString().split("T")[0];

  const [fields, setFields] = useState({
    title: "", excerpt: "", date: today,
    category: "Startups", tags: "", featured: false,
  });
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  // Load existing note for editing
  useEffect(() => {
    if (!editSlug) return;
    fetch(`/api/admin/notes/${editSlug}`)
      .then(r => {
        if (r.status === 401) { router.push("/admin"); return null; }
        return r.json();
      })
      .then(data => {
        if (!data || !data.content) return;
        const parsed = parseFrontmatter(data.content);
        if (!parsed) return;
        setFields({
          title: parsed.title,
          excerpt: parsed.excerpt,
          date: parsed.date,
          category: parsed.category,
          tags: parsed.tags,
          featured: parsed.featured,
        });
        setBody(parsed.body);
        setSlug(editSlug);
        setSlugEdited(true);
        setLoadingEdit(false);
      });
  }, [editSlug, router]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && fields.title) {
      setSlug(slugify(fields.title));
    }
  }, [fields.title, slugEdited]);

  const setField = (key: string, val: string | boolean) =>
    setFields(f => ({ ...f, [key]: val }));

  const fullContent = buildFrontmatter(fields) + body;

  const save = useCallback(async () => {
    if (!fields.title || !slug || !body) {
      setErrorMsg("Title, slug, and body are required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setErrorMsg("");

    const endpoint = isEdit ? `/api/admin/notes/${editSlug}` : "/api/admin/notes";
    const method = isEdit ? "PUT" : "POST";
    const bodyPayload = isEdit
      ? { content: fullContent }
      : { slug, content: fullContent };

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });

    if (res.ok) {
      setStatus("saved");
      setTimeout(() => {
        router.push("/admin/edit");
      }, 1200);
    } else {
      const d = await res.json();
      setErrorMsg(d.error || "Something went wrong.");
      setStatus("error");
    }
  }, [fields, slug, body, isEdit, editSlug, fullContent, router]);

  // Ctrl/Cmd+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.9rem",
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "5px", color: "var(--primary)", fontSize: "0.85rem",
    outline: "none", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Courier New', monospace",
    fontSize: "0.63rem", color: "var(--muted)",
    letterSpacing: "0.08em", marginBottom: "0.4rem",
  };

  if (loadingEdit) return (
    <div style={{ paddingTop: "52px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>LOADING...</p>
    </div>
  );

  return (
    <div style={{ paddingTop: "52px" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: "52px", zIndex: 20,
        background: "rgba(10,10,11,0.95)", borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        padding: "0.75rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/edit" style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "'Courier New', monospace", letterSpacing: "0.04em" }}>
            ← BACK
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.06em" }}>
            {isEdit ? `EDITING: ${editSlug}` : "NEW NOTE"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {status === "error" && (
            <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errorMsg}</p>
          )}
          {status === "saved" && (
            <p style={{ fontSize: "0.78rem", color: "#4ade80", fontFamily: "'Courier New', monospace" }}>SAVED ✓</p>
          )}
          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>⌘S to save</span>
          <button onClick={save} disabled={status === "saving"} style={{
            padding: "0.55rem 1.2rem",
            background: status === "saving" ? "var(--border)" : "var(--accent)",
            color: "#fff", border: "none", borderRadius: "5px",
            fontSize: "0.82rem", fontWeight: 500,
            cursor: status === "saving" ? "not-allowed" : "pointer",
          }}>
            {status === "saving" ? "Publishing..." : isEdit ? "Save changes" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2rem 5rem" }}>
        {/* Metadata fields */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem", marginBottom: "1.5rem",
          padding: "1.5rem", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: "6px",
        }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>TITLE</label>
            <input
              style={{ ...inputStyle, fontSize: "1rem", fontWeight: 600 }}
              placeholder="Note title..."
              value={fields.title}
              onChange={e => setField("title", e.target.value)}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>EXCERPT</label>
            <input
              style={inputStyle}
              placeholder="Short description shown in listings..."
              value={fields.excerpt}
              onChange={e => setField("excerpt", e.target.value)}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>SLUG (URL)</label>
            <input
              style={{ ...inputStyle, fontFamily: "'Courier New', monospace", fontSize: "0.8rem" }}
              placeholder="my-note-slug"
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugEdited(true); }}
              disabled={isEdit}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            {slug && <p style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.3rem", fontFamily: "'Courier New', monospace" }}>/notes/{slug}</p>}
          </div>

          <div>
            <label style={labelStyle}>DATE</label>
            <input
              type="date"
              style={{ ...inputStyle, colorScheme: "dark" }}
              value={fields.date}
              onChange={e => setField("date", e.target.value)}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>CATEGORY</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={fields.category}
              onChange={e => setField("category", e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>TAGS (comma separated)</label>
            <input
              style={inputStyle}
              placeholder="startups, growth, product"
              value={fields.tags}
              onChange={e => setField("tags", e.target.value)}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.2rem" }}>
            <button
              type="button"
              onClick={() => setField("featured", !fields.featured)}
              style={{
                width: "36px", height: "20px", borderRadius: "10px",
                background: fields.featured ? "var(--accent)" : "var(--border-light)",
                border: "none", cursor: "pointer", position: "relative",
                transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: "2px",
                left: fields.featured ? "18px" : "2px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </button>
            <label style={{ ...labelStyle, marginBottom: 0 }}>FEATURED</label>
          </div>
        </div>

        {/* Write / Preview tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "0", borderBottom: "1px solid var(--border)" }}>
          {(["write", "preview"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.6rem 1.25rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.7rem", letterSpacing: "0.06em",
              background: "transparent", border: "none",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              color: tab === t ? "var(--primary)" : "var(--muted)",
              cursor: "pointer", marginBottom: "-1px",
            }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "write" ? (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={`Write your note in Markdown...\n\n## Section heading\n\nYour content here. Use **bold**, *italic*, \`code\`, and - bullet lists.\n\n> Blockquotes look great for callouts.`}
            style={{
              width: "100%", minHeight: "520px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderTop: "none", borderRadius: "0 0 6px 6px",
              color: "var(--secondary)", fontSize: "0.9rem",
              lineHeight: 1.8, padding: "1.5rem",
              outline: "none", resize: "vertical",
              fontFamily: "'Courier New', monospace",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        ) : (
          <div style={{
            minHeight: "520px", padding: "2rem",
            background: "var(--surface)",
            border: "1px solid var(--border)", borderTop: "none",
            borderRadius: "0 0 6px 6px",
          }}>
            {!body ? (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontStyle: "italic" }}>Nothing to preview yet.</p>
            ) : (
              <>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>
                  {fields.title || "Untitled"}
                </h1>
                {fields.excerpt && (
                  <p style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.7, borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                    {fields.excerpt}
                  </p>
                )}
                <div dangerouslySetInnerHTML={{ __html: renderPreview(body) }} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewNotePage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: "52px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>LOADING...</p>
      </div>
    }>
      <EditorInner />
    </Suspense>
  );
}
