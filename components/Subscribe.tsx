"use client";
import { useState } from "react";

type Variant = "footer" | "inline" | "strip";

interface Props {
  variant?: Variant;
}

export default function Subscribe({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const res = await fetch("/api/Subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMsg(data.existing ? "You're already an Operator." : "You're in. Welcome, Operator.");
      setEmail("");
    } else {
      setStatus("error");
      setMsg(data.error || "Something went wrong.");
    }
  }

  // ── Strip variant (top of note pages) ──────────────────
  if (variant === "strip") {
    return (
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.85rem 0",
        marginBottom: "0",
      }}>
        {status === "success" ? (
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.72rem",
            color: "#4ade80",
            letterSpacing: "0.06em",
          }}>
            ✓ {msg}
          </p>
        ) : (
          <form onSubmit={submit} style={{
            display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap",
          }}>
            <p style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.68rem", color: "var(--muted)",
              letterSpacing: "0.06em", flexShrink: 0,
            }}>
              JOIN THE OPERATORS →
            </p>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1, minWidth: "180px",
                padding: "0.4rem 0.75rem",
                background: "var(--void)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--primary)", fontSize: "0.82rem",
                outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            <button type="submit" disabled={status === "loading"} style={{
              padding: "0.4rem 1rem",
              background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "4px",
              fontSize: "0.8rem", fontWeight: 500,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {status === "loading" ? "..." : "Subscribe"}
            </button>
            {status === "error" && (
              <p style={{ fontSize: "0.75rem", color: "#ef4444", width: "100%" }}>{msg}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // ── Inline variant (below article body) ────────────────
  if (variant === "inline") {
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
        }}>
          THE OPERATORS
        </p>
        <h3 style={{
          fontSize: "1.05rem", fontWeight: 600,
          color: "var(--primary)", letterSpacing: "-0.02em",
          marginBottom: "0.5rem", lineHeight: 1.3,
        }}>
          Get the notes in your inbox.
        </h3>
        <p style={{
          fontSize: "0.85rem", color: "var(--secondary)",
          lineHeight: 1.65, marginBottom: "1.25rem",
        }}>
          Join operators, founders, and builders who receive new notes as they&apos;re published.
          No noise. No schedule. Just the thinking.
        </p>

        {status === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>✓</span>
            <p style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.75rem", color: "#4ade80", letterSpacing: "0.05em",
            }}>
              {msg}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1, minWidth: "200px",
                  padding: "0.65rem 0.9rem",
                  background: "var(--void)",
                  border: "1px solid var(--border)",
                  borderRadius: "5px",
                  color: "var(--primary)", fontSize: "0.88rem",
                  outline: "none", fontFamily: "inherit",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button type="submit" disabled={status === "loading"} style={{
                padding: "0.65rem 1.35rem",
                background: "var(--accent)", color: "#fff",
                border: "none", borderRadius: "5px",
                fontSize: "0.88rem", fontWeight: 500,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {status === "loading" ? "Joining..." : "Join the Operators →"}
              </button>
            </div>
            {status === "error" && (
              <p style={{ fontSize: "0.8rem", color: "#ef4444" }}>{msg}</p>
            )}
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              No spam. Unsubscribe any time.
            </p>
          </form>
        )}
      </div>
    );
  }

  // ── Footer variant ─────────────────────────────────────
  return (
    <div style={{
      borderTop: "1px solid var(--border)",
      padding: "2.5rem 0",
      marginBottom: "2rem",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "2rem",
        alignItems: "center",
      }}>
        <div>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.65rem", color: "var(--accent)",
            letterSpacing: "0.1em", marginBottom: "0.6rem",
          }}>
            THE OPERATORS
          </p>
          <h3 style={{
            fontSize: "1.1rem", fontWeight: 600,
            color: "var(--primary)", letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}>
            Join the Operators.
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
            Receive new notes on startups, products, Web3, and execution — directly in your inbox.
          </p>
        </div>

        <div>
          {status === "success" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span>✓</span>
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.78rem", color: "#4ade80", letterSpacing: "0.05em",
              }}>
                {msg}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1, minWidth: "180px",
                    padding: "0.65rem 0.9rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "5px",
                    color: "var(--primary)", fontSize: "0.85rem",
                    outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
                <button type="submit" disabled={status === "loading"} style={{
                  padding: "0.65rem 1.2rem",
                  background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: "5px",
                  fontSize: "0.85rem", fontWeight: 500,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </div>
              {status === "error" && (
                <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{msg}</p>
              )}
              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                No spam. Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
