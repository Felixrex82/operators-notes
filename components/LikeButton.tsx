"use client";
import { useState, useEffect } from "react";

interface Props {
  slug: string;
}

export default function LikeButton({ slug }: Props) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const storageKey = `liked:${slug}`;

  useEffect(() => {
    // Check if already liked on this device
    setLiked(localStorage.getItem(storageKey) === "1");

    // Fetch current count
    fetch(`/api/likes?slug=${slug}`)
      .then(r => r.json())
      .then(d => setLikes(d.likes));
  }, [slug, storageKey]);

  async function toggle() {
    if (animating) return;
    setAnimating(true);

    if (liked) {
      // Unlike
      setLiked(false);
      setLikes(n => Math.max(0, (n || 0) - 1));
      localStorage.removeItem(storageKey);
      const res = await fetch(`/api/likes?slug=${slug}`, { method: "DELETE" });
      const data = await res.json();
      setLikes(data.likes);
    } else {
      // Like
      setLiked(true);
      setLikes(n => (n || 0) + 1);
      localStorage.setItem(storageKey, "1");
      const res = await fetch(`/api/likes?slug=${slug}`, { method: "POST" });
      const data = await res.json();
      setLikes(data.likes);
    }

    setTimeout(() => setAnimating(false), 400);
  }

  return (
    <button
      onClick={toggle}
      title={liked ? "Unlike this note" : "Like this note"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.9rem",
        background: liked ? "rgba(239,68,68,0.08)" : "var(--surface)",
        border: `1px solid ${liked ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.2s",
        transform: animating && !liked ? "scale(1.12)" : "scale(1)",
      }}
    >
      <span style={{
        fontSize: "1rem",
        lineHeight: 1,
        display: "inline-block",
        transition: "transform 0.2s",
        transform: animating ? "scale(1.3)" : "scale(1)",
        filter: liked ? "none" : "grayscale(1)",
      }}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "0.75rem",
        color: liked ? "#ef4444" : "var(--muted)",
        fontWeight: liked ? 600 : 400,
        minWidth: "1.5rem",
        transition: "color 0.2s",
      }}>
        {likes === null ? "—" : likes}
      </span>
    </button>
  );
}
