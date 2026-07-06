"use client";
import { useState } from "react";

interface Props {
  variant?: "inline" | "banner" | "article";
}

export default function NewsletterSignup({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.existing || data.alreadySubscribed ? "exists" : "success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  // ── Article variant — shown beneath a note ───────────
  if (variant === "article") {
    return (
      <div style={{
        margin: "3rem 0 0",
        padding: "2rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        borderLeft: "2px solid var(--accent)",
      }}>
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.65rem", color: "var(--accent)",
          letterSpacing: "0.1em", marginBottom: "0.75rem",
        }}>THE NOTES</p>
        <h3 style={{
          fontSize: "1.05rem", fontWeight: 700,
          color: "var(--primary)", letterSpacing: "-0.03em",
          marginBottom: "0.5rem", lineHeight: 1.3,
        }}>
          Enjoyed this? Join the Operators.
        </h3>
        <p style={{
          fontSize: "0.88rem", color: "var(--secondary)",
          lineHeight: 1.7, marginBottom: "1.25rem",
        }}>
          Get notes on startups, products, Web3, and execution — written for people who build. No fluff, no noise. Straight to your inbox.
        </p>
        <NewsletterForm email={email} setEmail={setEmail} status={status} errorMsg={errorMsg} submit={submit} compact />
      </div>
    );
  }

  // ── Banner variant — full width section ──────────────
  if (variant === "banner") {
    return (
      <section style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "4rem 0",
        background: "var(--surface)",
        margin: "4rem 0 0",
      }}>
        <div className="container">
          <div style={{ maxWidth: "560px" }}>
            <p style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.65rem", color: "var(--accent)",
              letterSpacing: "0.1em", marginBottom: "1rem",
            }}>THE NOTES</p>
            <h2 style={{
              fontSize: "clamp(1.4rem, 3vw, 1.85rem)", fontWeight: 700,
              color: "var(--primary)", letterSpacing: "-0.04em",
              lineHeight: 1.15, marginBottom: "0.75rem",
            }}>
              Join the Operators.
            </h2>
            <p style={{
              fontSize: "clamp(0.88rem, 2vw, 0.95rem)", color: "var(--secondary)",
              lineHeight: 1.75, marginBottom: "1.75rem", maxWidth: "480px",
            }}>
              Notes on startups, products, Web3, and execution — for founders, builders, and operators who want to think more clearly and move faster. In your inbox when it matters.
            </p>
            <NewsletterForm email={email} setEmail={setEmail} status={status} errorMsg={errorMsg} submit={submit} />
          </div>
        </div>
      </section>
    );
  }

  // ── Inline variant — compact, fits in sidebars/cards ─
  return (
    <div style={{
      padding: "1.5rem",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
    }}>
      <p style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "0.63rem", color: "var(--accent)",
        letterSpacing: "0.1em", marginBottom: "0.6rem",
      }}>THE NOTES</p>
      <p style={{
        fontSize: "0.92rem", fontWeight: 600,
        color: "var(--primary)", marginBottom: "0.4rem",
        letterSpacing: "-0.02em", lineHeight: 1.3,
      }}>
        Join the Operators.
      </p>
      <p style={{
        fontSize: "0.8rem", color: "var(--muted)",
        lineHeight: 1.6, marginBottom: "1rem",
      }}>
        Notes on startups, products, and execution — straight to your inbox.
      </p>
      <NewsletterForm email={email} setEmail={setEmail} status={status} errorMsg={errorMsg} submit={submit} compact />
    </div>
  );
}

// ── Shared form component ────────────────────────────
function NewsletterForm({
  email, setEmail, status, errorMsg, submit, compact = false,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: string;
  errorMsg: string;
  submit: (e: React.FormEvent) => void;
  compact?: boolean;
}) {
  if (status === "success") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.1rem" }}>✓</span>
        <div>
          <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#4ade80", marginBottom: "0.2rem" }}>You're in, Operator.</p>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Welcome email on its way to you.</p>
        </div>
      </div>
    );
  }

  if (status === "exists") {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontStyle: "italic" }}>
        You're already subscribed. Welcome back, Operator.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: compact ? "row" : "column", gap: "0.6rem", flexWrap: "wrap" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        style={{
          flex: 1, minWidth: "200px",
          padding: "0.65rem 0.9rem",
          background: "var(--void)",
          border: `1px solid ${status === "error" ? "rgba(239,68,68,0.5)" : "var(--border)"}`,
          borderRadius: "5px", color: "var(--primary)",
          fontSize: "0.88rem", outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--accent)")}
        onBlur={e => (e.target.style.borderColor = status === "error" ? "rgba(239,68,68,0.5)" : "var(--border)")}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "0.65rem 1.25rem",
          background: "var(--accent)", color: "#fff",
          border: "none", borderRadius: "5px",
          fontSize: "0.85rem", fontWeight: 500,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.75 : 1,
          whiteSpace: "nowrap", transition: "opacity 0.15s",
          flexShrink: 0,
        }}
      >
        {status === "loading" ? "Joining..." : "Join the Operators →"}
      </button>
      {status === "error" && (
        <p style={{ fontSize: "0.78rem", color: "#ef4444", width: "100%", margin: 0 }}>{errorMsg}</p>
      )}
      <p style={{ fontSize: "0.72rem", color: "var(--muted)", width: "100%", margin: 0 }}>
        No spam, ever. Unsubscribe any time.
      </p>
    </form>
  );
}
