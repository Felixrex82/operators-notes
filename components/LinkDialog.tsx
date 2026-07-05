"use client";
import { useState, useEffect, useRef } from "react";

interface Props {
  open: boolean;
  selectedText: string;
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export default function LinkDialog({ open, selectedText, onInsert, onClose }: Props) {
  const [text, setText] = useState(selectedText);
  const [url, setUrl] = useState("");
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setText(selectedText || "");
      setUrl("");
      setTimeout(() => urlRef.current?.focus(), 50);
    }
  }, [open, selectedText]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function insert(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    const linkText = text || url;
    const href = url.startsWith("http") ? url : `https://${url}`;
    onInsert(`[${linkText}](${href})`);
    onClose();
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Dialog */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        background: "var(--surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "8px",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.08em",
          }}>
            INSERT LINK
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={insert} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.63rem", color: "var(--muted)",
              letterSpacing: "0.08em", marginBottom: "0.4rem",
            }}>
              LINK TEXT
            </label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="The text readers will see"
              style={{
                width: "100%", padding: "0.65rem 0.9rem",
                background: "var(--void)", border: "1px solid var(--border)",
                borderRadius: "5px", color: "var(--primary)",
                fontSize: "0.88rem", outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.63rem", color: "var(--muted)",
              letterSpacing: "0.08em", marginBottom: "0.4rem",
            }}>
              URL
            </label>
            <input
              ref={urlRef}
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              style={{
                width: "100%", padding: "0.65rem 0.9rem",
                background: "var(--void)", border: "1px solid var(--border)",
                borderRadius: "5px", color: "var(--primary)",
                fontSize: "0.88rem", outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Preview */}
          {url && (
            <div style={{
              padding: "0.6rem 0.85rem",
              background: "var(--void)", border: "1px solid var(--border)",
              borderRadius: "4px",
            }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "var(--muted)", marginBottom: "0.25rem" }}>PREVIEW</p>
              <p style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "underline" }}>
                {text || url}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end", marginTop: "0.25rem" }}>
            <button type="button" onClick={onClose} style={{
              padding: "0.55rem 1rem", background: "transparent",
              color: "var(--muted)", border: "1px solid var(--border)",
              borderRadius: "5px", fontSize: "0.85rem", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              padding: "0.55rem 1.25rem", background: "var(--accent)",
              color: "#fff", border: "none", borderRadius: "5px",
              fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
            }}>
              Insert link
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
