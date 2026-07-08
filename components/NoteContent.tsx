"use client";
import React, { useEffect } from "react";

export default function NoteContent({ content }: { content: string }) {
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      bar.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Render inline formatting: bold, italic, code, links
  function renderInline(text: string): React.ReactNode[] {
    // Handle images inline: ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const boldRegex = /\*\*(.+?)\*\*/g;
    const italicRegex = /\*(.+?)\*/g;
    const codeRegex = /`(.+?)`/g;

    // Process all inline tokens in order
    const tokens: { start: number; end: number; node: React.ReactNode }[] = [];

    let match;

    // Images
    while ((match = imageRegex.exec(text)) !== null) {
      const [full, alt, src] = match;
      tokens.push({
        start: match.index,
        end: match.index + full.length,
        node: (
          <img
            key={`img-${match.index}`}
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              borderRadius: "6px",
              margin: "1rem 0",
              border: "1px solid var(--border)",
              display: "block",
            }}
          />
        ),
      });
    }

    // Links
    while ((match = linkRegex.exec(text)) !== null) {
      // Skip if this position was already matched as an image
      if (tokens.some(t => t.start <= match!.index && t.end >= match!.index)) continue;
      const [full, label, href] = match;
      tokens.push({
        start: match.index,
        end: match.index + full.length,
        node: (
          <a
            key={`link-${match.index}`}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            {label}
          </a>
        ),
      });
    }

    // Bold
    while ((match = boldRegex.exec(text)) !== null) {
      if (tokens.some(t => t.start <= match!.index && t.end >= match!.index)) continue;
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        node: <strong key={`b-${match.index}`} style={{ color: "var(--primary)", fontWeight: 600 }}>{match[1]}</strong>,
      });
    }

    // Italic
    while ((match = italicRegex.exec(text)) !== null) {
      if (tokens.some(t => t.start <= match!.index && t.end >= match!.index)) continue;
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        node: <em key={`i-${match.index}`}>{match[1]}</em>,
      });
    }

    // Code
    while ((match = codeRegex.exec(text)) !== null) {
      if (tokens.some(t => t.start <= match!.index && t.end >= match!.index)) continue;
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        node: (
          <code key={`c-${match.index}`} style={{
            background: "var(--surface)", color: "var(--accent)",
            fontFamily: "'Geist Mono',monospace", fontSize: "0.85em",
            padding: "0.2em 0.4em", borderRadius: "3px",
            border: "1px solid var(--border)",
          }}>
            {match[1]}
          </code>
        ),
      });
    }

    if (tokens.length === 0) return [text];

    // Sort tokens by position
    tokens.sort((a, b) => a.start - b.start);

    const nodes: React.ReactNode[] = [];
    let cursor = 0;

    for (const token of tokens) {
      if (token.start > cursor) {
        nodes.push(text.slice(cursor, token.start));
      }
      nodes.push(token.node);
      cursor = token.end;
    }

    if (cursor < text.length) {
      nodes.push(text.slice(cursor));
    }

    return nodes;
  }

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const result: React.ReactElement[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Standalone image line: ![alt](url)
      if (/^!\[([^\]]*)\]\(([^)]+)\)$/.test(line.trim())) {
        const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) {
          result.push(
            <img
              key={key++}
              src={match[2]}
              alt={match[1]}
              style={{
                maxWidth: "100%",
                borderRadius: "6px",
                margin: "1.5rem 0",
                border: "1px solid var(--border)",
                display: "block",
              }}
            />
          );
          i++;
          continue;
        }
      }

      if (line.startsWith("## ")) {
        result.push(
          <h2 key={key++} style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--primary)", marginTop: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.02em", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        result.push(
          <h3 key={key++} style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("> ")) {
        result.push(
          <blockquote key={key++} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.25rem", color: "var(--muted)", fontStyle: "italic", margin: "1.5rem 0" }}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{line.slice(2)}</p>
          </blockquote>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          items.push(lines[i].slice(2));
          i++;
        }
        result.push(
          <ul key={key++} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--secondary)" }}>
            {items.map((item, j) => (
              <li key={j} style={{ marginBottom: "0.5rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      } else if (line.trim()) {
        result.push(
          <p key={key++} style={{ fontSize: "0.95rem", color: "var(--secondary)", marginBottom: "1.25rem", lineHeight: 1.8 }}>
            {renderInline(line)}
          </p>
        );
      }
      i++;
    }
    return result;
  };

  return (
    <>
      <div id="reading-progress" style={{ position: "fixed", top: 0, left: 0, height: "1px", background: "var(--accent)", zIndex: 100, transition: "width 0.1s linear", width: "0%" }} />
      <div>{renderContent(content)}</div>
    </>
  );
}
