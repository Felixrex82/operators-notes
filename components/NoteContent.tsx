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

  const renderContent = (text: string) => {
    const lines = text.split("\n").map(l => l.replace(/\r/g, ""));
    const result: React.ReactElement[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Image — matches ![anything](anything)
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\((.+)\)$/);
      if (imgMatch) {
        result.push(
          <img
            key={key++}
            src={imgMatch[2].trim()}
            alt={imgMatch[1] || "Image"}
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

      // H2
      if (trimmed.startsWith("## ")) {
        result.push(
          <h2 key={key++} style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--primary)", marginTop: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.02em", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
            {trimmed.slice(3)}
          </h2>
        );
        i++;
        continue;
      }

      // H3
      if (trimmed.startsWith("### ")) {
        result.push(
          <h3 key={key++} style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            {trimmed.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        result.push(
          <blockquote key={key++} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.25rem", color: "var(--muted)", fontStyle: "italic", margin: "1.5rem 0" }}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{trimmed.slice(2)}</p>
          </blockquote>
        );
        i++;
        continue;
      }

      // Bullet list
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
          items.push(lines[i].trim().slice(2));
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
      }

      // Empty line
      if (!trimmed) {
        i++;
        continue;
      }

      // Paragraph
      result.push(
        <p key={key++} style={{ fontSize: "0.95rem", color: "var(--secondary)", marginBottom: "1.25rem", lineHeight: 1.8 }}>
          {renderInline(trimmed)}
        </p>
      );
      i++;
    }
    return result;
  };

  function renderInline(text: string): React.ReactNode[] {
    const tokens: { start: number; end: number; node: React.ReactNode }[] = [];
    const patterns = [
      { re: /!\[([^\]]*)\]\((.+?)\)/g, fn: (m: RegExpExecArray) => <img key={m.index} src={m[2]} alt={m[1]} style={{ maxWidth: "100%", borderRadius: "4px", margin: "0.5rem 0", display: "block" }} /> },
      { re: /\[([^\]]+)\]\(([^)]+)\)/g, fn: (m: RegExpExecArray) => <a key={m.index} href={m[2]} target={m[2].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>{m[1]}</a> },
      { re: /\*\*(.+?)\*\*/g, fn: (m: RegExpExecArray) => <strong key={m.index} style={{ color: "var(--primary)", fontWeight: 600 }}>{m[1]}</strong> },
      { re: /\*(.+?)\*/g, fn: (m: RegExpExecArray) => <em key={m.index}>{m[1]}</em> },
      { re: /`(.+?)`/g, fn: (m: RegExpExecArray) => <code key={m.index} style={{ background: "var(--surface)", color: "var(--accent)", fontFamily: "'Geist Mono',monospace", fontSize: "0.85em", padding: "0.2em 0.4em", borderRadius: "3px", border: "1px solid var(--border)" }}>{m[1]}</code> },
    ];

    for (const { re, fn } of patterns) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        if (!tokens.some(t => t.start <= m!.index && t.end >= m!.index)) {
          tokens.push({ start: m.index, end: m.index + m[0].length, node: fn(m) });
        }
      }
    }

    if (!tokens.length) return [text];
    tokens.sort((a, b) => a.start - b.start);

    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    for (const t of tokens) {
      if (t.start > cursor) nodes.push(text.slice(cursor, t.start));
      nodes.push(t.node);
      cursor = t.end;
    }
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  }

  return (
    <>
      <div id="reading-progress" style={{ position: "fixed", top: 0, left: 0, height: "1px", background: "var(--accent)", zIndex: 100, transition: "width 0.1s linear", width: "0%" }} />
      <div>{renderContent(content)}</div>
    </>
  );
}            background: "var(--surface)", color: "var(--accent)",
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
    const lines = text.split("\n").map(l => l.replace(/\r/g, ""));
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
