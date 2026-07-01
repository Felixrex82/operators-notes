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
    const lines = text.split("\n");
    const result: React.ReactElement[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("## ")) {
        result.push(<h2 key={key++} style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--primary)", marginTop: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.02em", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        result.push(<h3 key={key++} style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginTop: "2rem", marginBottom: "0.75rem" }}>{line.slice(4)}</h3>);
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
            {items.map((item, j) => {
              const bold = item.replace(/\*\*(.+?)\*\*/g, '|||$1|||');
              const parts = bold.split('|||');
              return (
                <li key={j} style={{ marginBottom: "0.5rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {parts.map((p, k) => k % 2 === 1 ? <strong key={k} style={{ color: "var(--primary)", fontWeight: 600 }}>{p}</strong> : p)}
                </li>
              );
            })}
          </ul>
        );
        continue;
      } else if (line.trim()) {
        const formatted = line
          .replace(/\*\*(.+?)\*\*/g, '|||strong|||$1|||/strong|||')
          .replace(/\*(.+?)\*/g, '|||em|||$1|||/em|||')
          .replace(/`(.+?)`/g, '|||code|||$1|||/code|||');
        const parts = formatted.split('|||');
        result.push(
          <p key={key++} style={{ fontSize: "0.95rem", color: "var(--secondary)", marginBottom: "1.25rem", lineHeight: 1.8 }}>
            {parts.map((part, k) => {
              if (part === 'strong') return null;
              if (part === '/strong') return null;
              if (part === 'em') return null;
              if (part === '/em') return null;
              if (part === 'code') return null;
              if (part === '/code') return null;
              const prev = parts[k - 1];
              if (prev === 'strong') return <strong key={k} style={{ color: "var(--primary)", fontWeight: 600 }}>{part}</strong>;
              if (prev === 'em') return <em key={k}>{part}</em>;
              if (prev === 'code') return <code key={k} style={{ background: "var(--surface)", color: "var(--accent)", fontFamily: "'Geist Mono',monospace", fontSize: "0.85em", padding: "0.2em 0.4em", borderRadius: "3px", border: "1px solid var(--border)" }}>{part}</code>;
              return part;
            })}
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
