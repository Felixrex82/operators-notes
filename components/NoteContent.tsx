"use client";
import { useEffect, useState } from "react";

export default function NoteContent({ content }: { content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Reading progress bar
    const bar = document.getElementById("reading-progress");
    if (bar) {
      const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        bar.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
      };
      window.addEventListener("scroll", update);
    }

    // Convert markdown to HTML
    import("marked").then(({ marked }) => {
      marked.setOptions({ breaks: true, gfm: true } as object);
      const result = marked.parse(content) as string;
      setHtml(result);
    });

    return () => {
      const bar = document.getElementById("reading-progress");
      if (bar) window.removeEventListener("scroll", () => {});
    };
  }, [content]);

  return (
    <>
      <div
        id="reading-progress"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "1px",
          background: "var(--accent)",
          zIndex: 100,
          transition: "width 0.1s linear",
          width: "0%",
        }}
      />
      <div
        className="note-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .note-prose p {
          font-size: 0.95rem;
          color: var(--secondary);
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }
        .note-prose h2 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .note-prose h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .note-prose ul {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary);
        }
        .note-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .note-prose blockquote {
          border-left: 2px solid var(--accent);
          padding-left: 1.25rem;
          color: var(--muted);
          font-style: italic;
          margin: 1.5rem 0;
        }
        .note-prose blockquote p {
          margin: 0;
        }
        .note-prose strong {
          color: var(--primary);
          font-weight: 600;
        }
        .note-prose em {
          font-style: italic;
        }
        .note-prose code {
          background: var(--surface);
          color: var(--accent);
          font-family: 'Geist Mono', monospace;
          font-size: 0.85em;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          border: 1px solid var(--border);
        }
        .note-prose pre {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .note-prose pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.88rem;
        }
        .note-prose a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .note-prose img {
          max-width: 100%;
          border-radius: 6px;
          margin: 1.5rem 0;
          border: 1px solid var(--border);
          display: block;
        }
        .note-prose hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }
      `}</style>
    </>
  );
}
