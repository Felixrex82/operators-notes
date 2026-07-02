"use client";
import { useState } from "react";

export default function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/notes/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const url = typeof window !== "undefined" ? `${window.location.origin}/notes/${slug}` : "";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "0.65rem", color: "var(--muted)",
        letterSpacing: "0.08em",
      }}>SHARE</span>

      {/* Copy link */}
      <button
        onClick={copy}
        title="Copy link"
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.35rem 0.85rem",
          background: copied ? "rgba(74,222,128,0.1)" : "var(--surface)",
          border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "var(--border)"}`,
          borderRadius: "4px", cursor: "pointer",
          fontSize: "0.78rem",
          color: copied ? "#4ade80" : "var(--secondary)",
          fontFamily: "'Geist Mono', monospace",
          transition: "all 0.15s", whiteSpace: "nowrap",
        }}
      >
        {copied ? (
          <><CheckIcon /> Copied!</>
        ) : (
          <><LinkIcon /> Copy link</>
        )}
      </button>

      {/* Share on X */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.35rem 0.85rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          fontSize: "0.78rem",
          color: "var(--secondary)",
          fontFamily: "'Geist Mono', monospace",
          transition: "all 0.15s", whiteSpace: "nowrap",
          textDecoration: "none",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted)"; e.currentTarget.style.color = "var(--primary)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--secondary)"; }}
      >
        <XIcon /> Share on X
      </a>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 7.5L7.5 4.5M5.5 3H3a2 2 0 000 4h1M6.5 9H9a2 2 0 000-4H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
      <path d="M6.538 4.664L10.315 0h-.9L6.15 4.088 3.393 0H.5l3.96 5.765L.5 11h.9l3.463-4.027L7.607 11H10.5L6.538 4.664zm-1.226 1.426l-.401-.574L1.74.713h1.374l2.574 3.682.401.574 3.348 4.79H8.063L5.312 6.09z"/>
    </svg>
  );
}
