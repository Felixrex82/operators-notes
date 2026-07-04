"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Startups","Products","Web3","Growth","Research","Essays","Systems","Execution"];

function buildFrontmatter(fields: {
  title: string; excerpt: string; date: string;
  category: string; tags: string; featured: boolean; coverImage: string;
}) {
  const tagsArr = fields.tags.split(",").map(t => t.trim()).filter(Boolean);
  return `---
title: "${fields.title.replace(/"/g, '\\"')}"
excerpt: "${fields.excerpt.replace(/"/g, '\\"')}"
date: "${fields.date}"
category: "${fields.category}"
tags: [${tagsArr.map(t => `"${t}"`).join(", ")}]
featured: ${fields.featured}${fields.coverImage ? `\ncoverImage: "${fields.coverImage}"` : ""}
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
  const tags = tagsMatch ? tagsMatch[1].replace(/"/g,"").split(",").map(t=>t.trim()).filter(Boolean).join(", ") : "";
  const featuredMatch = fm.match(/^featured:\s*(true|false)/m);
  return {
    title: get("title"), excerpt: get("excerpt"), date: get("date"),
    category: get("category"), tags, coverImage: get("coverImage"),
    featured: featuredMatch ? featuredMatch[1] === "true" : false,
    body,
  };
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-");
}

function renderPreview(md: string) {
  return md
    .replace(/^## (.+)$/gm,'<h2 style="font-size:1.05rem;font-weight:600;color:#F2F2F3;margin:1.75rem 0 0.75rem;padding-bottom:0.4rem;border-bottom:1px solid #1C1C1F">$1</h2>')
    .replace(/^### (.+)$/gm,'<h3 style="font-size:0.95rem;font-weight:600;color:#F2F2F3;margin:1.25rem 0 0.5rem">$1</h3>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%;border-radius:6px;margin:1rem 0;border:1px solid #1C1C1F">')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#F2F2F3;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code style="background:#0A0A0B;color:#3B7BF8;font-size:0.82em;padding:0.15em 0.4em;border-radius:3px;border:1px solid #1C1C1F">$1</code>')
    .replace(/^> (.+)$/gm,'<blockquote style="border-left:2px solid #3B7BF8;padding-left:1rem;color:#5A5A6A;font-style:italic;margin:1.25rem 0">$1</blockquote>')
    .replace(/^- (.+)$/gm,'<li style="color:#A0A0B0;font-size:0.9rem;line-height:1.7;margin-bottom:0.3rem">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g,'<ul style="padding-left:1.25rem;margin-bottom:1rem">$&</ul>')
    .replace(/^(?!<[hublbi])(.+\S.*)$/gm,'<p style="font-size:0.92rem;color:#A0A0B0;line-height:1.8;margin-bottom:1rem">$1</p>');
}

// ── Toolbar button ───────────────────────────────────────
function ToolBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        background: "none", border: "none", color: "var(--muted)",
        cursor: "pointer", padding: "0.3rem 0.5rem", borderRadius: "3px",
        fontSize: "0.82rem", lineHeight: 1, transition: "color 0.15s, background 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => { (e.currentTarget.style.color="var(--primary)"); (e.currentTarget.style.background="var(--border)"); }}
      onMouseLeave={e => { (e.currentTarget.style.color="var(--muted)"); (e.currentTarget.style.background="none"); }}
    >
      {children}
    </button>
  );
}

// ── Main editor ──────────────────────────────────────────
function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const isEdit = !!editSlug;
  const today = new Date().toISOString().split("T")[0];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    title: "", excerpt: "", date: today,
    category: "Startups", tags: "", featured: false, coverImage: "",
  });
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [tab, setTab] = useState<"write"|"preview">("write");
  const [status, setStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{url: string; name: string}[]>([]);
  const [showImagePanel, setShowImagePanel] = useState(false);

  useEffect(() => {
    if (!editSlug) return;
    fetch(`/api/admin/notes/${editSlug}`)
      .then(r => { if (r.status===401){router.push("/admin");return null;} return r.json(); })
      .then(data => {
        if (!data?.content) return;
        const parsed = parseFrontmatter(data.content);
        if (!parsed) return;
        setFields({ title:parsed.title, excerpt:parsed.excerpt, date:parsed.date, category:parsed.category, tags:parsed.tags, coverImage:parsed.coverImage, featured:parsed.featured });
        setBody(parsed.body);
        setSlug(editSlug);
        setSlugEdited(true);
        setLoadingEdit(false);
      });
  }, [editSlug, router]);

  useEffect(() => {
    if (!slugEdited && fields.title) setSlug(slugify(fields.title));
  }, [fields.title, slugEdited]);

  const setField = (k: string, v: string|boolean) => setFields(f => ({...f, [k]: v}));

  // ── Insert markdown at cursor ─────────────────────────
  function insertAtCursor(before: string, after = "", placeholder = "") {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const newText = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(newText);
    setTimeout(() => {
      ta.focus();
      const cursor = start + before.length + selected.length;
      ta.setSelectionRange(cursor, cursor);
    }, 0);
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const newText = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(newText);
    setTimeout(() => {
      ta.focus();
      if (!body.slice(start,end)) {
        ta.setSelectionRange(start + before.length, start + before.length + placeholder.length);
      }
    }, 0);
  }

  // ── Image upload ──────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setUploadedImages(imgs => [...imgs, { url: data.url, name: file.name }]);
      setShowImagePanel(true);
    } else {
      setErrorMsg(data.error || "Upload failed");
      setStatus("error");
    }
    // Reset input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function insertImage(url: string) {
    insertAtCursor(`![Image](${url})\n`);
    setTab("write");
  }

  // ── Cover image upload ────────────────────────────────
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setField("coverImage", data.url);
    } else {
      setErrorMsg(data.error || "Upload failed");
      setStatus("error");
    }
  }

  // ── Save / publish ────────────────────────────────────
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
    const payload = isEdit ? { content: fullContent } : { slug, content: fullContent };
    const res = await fetch(endpoint, { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    if (res.ok) {
      setStatus("saved");
      setTimeout(() => router.push("/admin/edit"), 1200);
    } else {
      const d = await res.json();
      setErrorMsg(d.error || "Something went wrong.");
      setStatus("error");
    }
  }, [fields, slug, body, isEdit, editSlug, fullContent, router]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey||e.ctrlKey) && e.key==="s") { e.preventDefault(); save(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [save]);

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:"0.65rem 0.9rem",
    background:"var(--surface)", border:"1px solid var(--border)",
    borderRadius:"5px", color:"var(--primary)", fontSize:"0.85rem",
    outline:"none", fontFamily:"inherit", WebkitAppearance:"none" as const,
  };
  const labelStyle: React.CSSProperties = {
    display:"block", fontFamily:"'Geist Mono','Courier New',monospace",
    fontSize:"0.63rem", color:"var(--muted)", letterSpacing:"0.08em", marginBottom:"0.4rem",
  };

  if (loadingEdit) return (
    <div style={{paddingTop:"52px",minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.75rem",color:"var(--muted)",letterSpacing:"0.08em"}}>LOADING...</p>
    </div>
  );

  return (
    <div style={{paddingTop:"52px"}}>
      {/* ── Sticky top bar ── */}
      <div className="admin-topbar">
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",minWidth:0}}>
          <Link href="/admin/edit" style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.68rem",color:"var(--muted)",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>← BACK</Link>
          <span style={{color:"var(--border)"}}>|</span>
          <span style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.68rem",color:"var(--muted)",letterSpacing:"0.05em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {isEdit ? `EDITING: ${editSlug}` : "NEW NOTE"}
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {status==="error" && <p style={{fontSize:"0.78rem",color:"#ef4444",maxWidth:"200px",textAlign:"right"}}>{errorMsg}</p>}
          {status==="saved" && <p style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.75rem",color:"#4ade80"}}>PUBLISHED ✓</p>}
          <span style={{fontSize:"0.7rem",color:"var(--muted)",display:"none"}} className="shortcut-hint">⌘S</span>
          <button onClick={save} disabled={status==="saving"} className="btn-primary" style={{padding:"0.5rem 1.1rem",fontSize:"0.82rem"}}>
            {status==="saving" ? "Publishing..." : isEdit ? "Save changes" : "Publish"}
          </button>
        </div>
      </div>

      <div className="container" style={{paddingTop:"1.75rem",paddingBottom:"5rem"}}>

        {/* ── Metadata ── */}
        <div style={{
          background:"var(--surface)", border:"1px solid var(--border)",
          borderRadius:"6px", padding:"clamp(1rem,3vw,1.75rem)",
          marginBottom:"1.25rem",
        }}>
          {/* Title */}
          <div style={{marginBottom:"1rem"}}>
            <label style={labelStyle}>TITLE</label>
            <input style={{...inputStyle,fontSize:"clamp(0.95rem,2vw,1.05rem)",fontWeight:600}}
              placeholder="Note title..." value={fields.title}
              onChange={e=>setField("title",e.target.value)}
              onFocus={e=>(e.target.style.borderColor="var(--accent)")}
              onBlur={e=>(e.target.style.borderColor="var(--border)")} />
          </div>

          {/* Excerpt */}
          <div style={{marginBottom:"1rem"}}>
            <label style={labelStyle}>EXCERPT</label>
            <input style={inputStyle} placeholder="Short description shown in listings..."
              value={fields.excerpt} onChange={e=>setField("excerpt",e.target.value)}
              onFocus={e=>(e.target.style.borderColor="var(--accent)")}
              onBlur={e=>(e.target.style.borderColor="var(--border)")} />
          </div>

          {/* Row: slug + date + category + tags */}
          <div className="admin-meta-grid" style={{marginBottom:"1rem"}}>
            <div>
              <label style={labelStyle}>SLUG (URL)</label>
              <input style={{...inputStyle,fontFamily:"'Geist Mono',monospace",fontSize:"0.8rem",opacity:isEdit?0.5:1}}
                placeholder="my-note-slug" value={slug} disabled={isEdit}
                onChange={e=>{setSlug(e.target.value);setSlugEdited(true);}}
                onFocus={e=>{if(!isEdit)e.target.style.borderColor="var(--accent)";}}
                onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              {slug && <p style={{fontSize:"0.67rem",color:"var(--muted)",marginTop:"0.3rem",fontFamily:"'Geist Mono',monospace"}}>/notes/{slug}</p>}
            </div>
            <div>
              <label style={labelStyle}>DATE</label>
              <input type="date" style={{...inputStyle,colorScheme:"dark"}} value={fields.date}
                onChange={e=>setField("date",e.target.value)}
                onFocus={e=>(e.target.style.borderColor="var(--accent)")}
                onBlur={e=>(e.target.style.borderColor="var(--border)")} />
            </div>
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <select style={{...inputStyle,cursor:"pointer"}} value={fields.category} onChange={e=>setField("category",e.target.value)}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>TAGS (comma separated)</label>
              <input style={inputStyle} placeholder="startups, growth, web3" value={fields.tags}
                onChange={e=>setField("tags",e.target.value)}
                onFocus={e=>(e.target.style.borderColor="var(--accent)")}
                onBlur={e=>(e.target.style.borderColor="var(--border)")} />
            </div>
          </div>

          {/* Cover image + featured */}
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{flex:1,minWidth:"200px"}}>
              <label style={labelStyle}>COVER IMAGE</label>
              {fields.coverImage ? (
                <div style={{display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap"}}>
                  <img src={fields.coverImage} alt="cover" style={{width:"80px",height:"50px",objectFit:"cover",borderRadius:"4px",border:"1px solid var(--border)"}} />
                  <div>
                    <p style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.68rem",color:"var(--accent)",marginBottom:"0.3rem"}}>Cover set</p>
                    <button type="button" onClick={()=>setField("coverImage","")} style={{background:"none",border:"none",color:"#ef4444",fontSize:"0.75rem",cursor:"pointer",padding:0}}>Remove</button>
                  </div>
                </div>
              ) : (
                <label style={{
                  display:"inline-flex",alignItems:"center",gap:"0.5rem",
                  padding:"0.55rem 1rem",background:"var(--void)",
                  border:"1px dashed var(--border-light)",borderRadius:"5px",
                  cursor:uploading?"not-allowed":"pointer",fontSize:"0.82rem",color:"var(--muted)",
                }}>
                  {uploading ? "Uploading..." : "↑ Upload cover image"}
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={handleCoverUpload} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Featured toggle */}
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem",paddingBottom:"0.1rem"}}>
              <button type="button" onClick={()=>setField("featured",!fields.featured)} style={{
                width:"36px",height:"20px",borderRadius:"10px",flexShrink:0,
                background:fields.featured?"var(--accent)":"var(--border-light)",
                border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",
              }}>
                <span style={{
                  position:"absolute",top:"2px",
                  left:fields.featured?"18px":"2px",
                  width:"16px",height:"16px",borderRadius:"50%",
                  background:"#fff",transition:"left 0.2s",
                }} />
              </button>
              <label style={{...labelStyle,marginBottom:0,cursor:"pointer"}} onClick={()=>setField("featured",!fields.featured)}>FEATURED</label>
            </div>
          </div>
        </div>

        {/* ── Editor tabs + toolbar ── */}
        <div style={{border:"1px solid var(--border)",borderRadius:"6px",overflow:"hidden"}}>

          {/* Tab bar + toolbar */}
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            borderBottom:"1px solid var(--border)",background:"var(--surface)",
            padding:"0 0.5rem",flexWrap:"wrap",gap:"0.25rem",
          }}>
            {/* Tabs */}
            <div style={{display:"flex"}}>
              {(["write","preview"] as const).map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{
                  padding:"0.6rem 1rem",fontFamily:"'Geist Mono',monospace",
                  fontSize:"0.68rem",letterSpacing:"0.06em",background:"transparent",border:"none",
                  borderBottom:tab===t?"2px solid var(--accent)":"2px solid transparent",
                  color:tab===t?"var(--primary)":"var(--muted)",cursor:"pointer",marginBottom:"-1px",
                }}>{t.toUpperCase()}</button>
              ))}
            </div>

            {/* Formatting toolbar — only in write mode */}
            {tab==="write" && (
              <div style={{display:"flex",alignItems:"center",gap:"0.1rem",flexWrap:"wrap",padding:"0.25rem 0"}}>
                <ToolBtn title="Bold (⌘B)" onClick={()=>wrapSelection("**","**","bold text")}>
                  <strong>B</strong>
                </ToolBtn>
                <ToolBtn title="Italic (⌘I)" onClick={()=>wrapSelection("*","*","italic text")}>
                  <em>I</em>
                </ToolBtn>
                <ToolBtn title="Heading 2" onClick={()=>insertAtCursor("\n## ","","Heading")}>
                  H2
                </ToolBtn>
                <ToolBtn title="Heading 3" onClick={()=>insertAtCursor("\n### ","","Heading")}>
                  H3
                </ToolBtn>
                <div style={{width:"1px",height:"16px",background:"var(--border)",margin:"0 0.25rem"}} />
                <ToolBtn title="Bullet list" onClick={()=>insertAtCursor("\n- ","","List item")}>
                  ≡
                </ToolBtn>
                <ToolBtn title="Blockquote" onClick={()=>insertAtCursor("\n> ","","Quote")}>
                  "
                </ToolBtn>
                <ToolBtn title="Inline code" onClick={()=>wrapSelection("`","`","code")}>
                  {"</>"}
                </ToolBtn>
                <ToolBtn title="Link" onClick={()=>wrapSelection("[","](url)","link text")}>
                  🔗
                </ToolBtn>
                <div style={{width:"1px",height:"16px",background:"var(--border)",margin:"0 0.25rem"}} />
                {/* Image upload button */}
                <label title="Insert image" style={{
                  display:"inline-flex",alignItems:"center",gap:"0.3rem",
                  padding:"0.3rem 0.5rem",borderRadius:"3px",
                  color:uploading?"var(--accent)":"var(--muted)",
                  cursor:uploading?"not-allowed":"pointer",fontSize:"0.82rem",
                  transition:"color 0.15s,background 0.15s",
                }}
                onMouseEnter={e=>{(e.currentTarget.style.color="var(--primary)");(e.currentTarget.style.background="var(--border)");}}
                onMouseLeave={e=>{(e.currentTarget.style.color=uploading?"var(--accent)":"var(--muted)");(e.currentTarget.style.background="none");}}>
                  {uploading ? "↑ uploading..." : "🖼 image"}
                  <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImageUpload} disabled={uploading} />
                </label>

                {/* Toggle image panel if images already uploaded */}
                {uploadedImages.length > 0 && (
                  <ToolBtn title="Uploaded images" onClick={()=>setShowImagePanel(p=>!p)}>
                    {uploadedImages.length} img{uploadedImages.length>1?"s":""}
                  </ToolBtn>
                )}
              </div>
            )}
          </div>

          {/* Uploaded images panel */}
          {showImagePanel && uploadedImages.length > 0 && (
            <div style={{
              padding:"0.75rem 1rem",background:"var(--void)",
              borderBottom:"1px solid var(--border)",
              display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center",
            }}>
              <span style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.65rem",color:"var(--muted)"}}>CLICK TO INSERT →</span>
              {uploadedImages.map((img,i)=>(
                <button key={i} type="button" onClick={()=>insertImage(img.url)} style={{
                  background:"none",border:"1px solid var(--border)",borderRadius:"4px",
                  padding:"0.25rem",cursor:"pointer",transition:"border-color 0.15s",
                }}
                title={`Insert ${img.name}`}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--accent)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border)")}>
                  <img src={img.url} alt={img.name} style={{width:"48px",height:"36px",objectFit:"cover",borderRadius:"3px",display:"block"}} />
                </button>
              ))}
              <button type="button" onClick={()=>setShowImagePanel(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"0.75rem",marginLeft:"auto"}}>hide</button>
            </div>
          )}

          {/* Write textarea */}
          {tab==="write" ? (
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e=>setBody(e.target.value)}
              onKeyDown={e=>{
                // Bold shortcut
                if ((e.metaKey||e.ctrlKey) && e.key==="b") { e.preventDefault(); wrapSelection("**","**","bold text"); }
                // Italic shortcut
                if ((e.metaKey||e.ctrlKey) && e.key==="i") { e.preventDefault(); wrapSelection("*","*","italic text"); }
              }}
              placeholder={`Write your note in Markdown...\n\n## Section heading\n\nYour content here. Use **bold**, *italic*, \`code\`.\n\n- Bullet point one\n- Bullet point two\n\n> A blockquote callout looks like this.`}
              style={{
                width:"100%",minHeight:"520px",
                background:"var(--void)",border:"none",
                color:"var(--secondary)",fontSize:"0.92rem",
                lineHeight:1.85,padding:"1.5rem",
                outline:"none",resize:"vertical",
                fontFamily:"'Geist Mono','Courier New',monospace",
                display:"block",
              }}
            />
          ) : (
            <div style={{minHeight:"520px",padding:"2rem",background:"var(--void)"}}>
              {!body ? (
                <p style={{color:"var(--muted)",fontSize:"0.88rem",fontStyle:"italic"}}>Nothing to preview yet. Switch to Write and start typing.</p>
              ) : (
                <>
                  {fields.coverImage && (
                    <img src={fields.coverImage} alt="cover" style={{width:"100%",maxHeight:"280px",objectFit:"cover",borderRadius:"6px",marginBottom:"1.75rem",border:"1px solid var(--border)"}} />
                  )}
                  <h1 style={{fontSize:"1.6rem",fontWeight:700,color:"var(--primary)",letterSpacing:"-0.04em",marginBottom:"0.75rem",lineHeight:1.15}}>
                    {fields.title || "Untitled"}
                  </h1>
                  {fields.excerpt && (
                    <p style={{fontSize:"1rem",color:"var(--secondary)",lineHeight:1.75,borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem",marginBottom:"1.75rem"}}>
                      {fields.excerpt}
                    </p>
                  )}
                  <div dangerouslySetInnerHTML={{__html: renderPreview(body)}} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Word count */}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.5rem"}}>
          <span style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.65rem",color:"var(--muted)"}}>
            {body.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.ceil(body.trim().split(/\s+/).filter(Boolean).length/200)} min read
          </span>
        </div>

      </div>
    </div>
  );
}

export default function NewNotePage() {
  return (
    <Suspense fallback={
      <div style={{paddingTop:"52px",minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <p style={{fontFamily:"'Geist Mono',monospace",fontSize:"0.75rem",color:"var(--muted)",letterSpacing:"0.08em"}}>LOADING...</p>
      </div>
    }>
      <EditorInner />
    </Suspense>
  );
}
