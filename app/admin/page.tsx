"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/edit");
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingTop: "52px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "360px", padding: "0 2rem" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          ADMIN
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
          Sign in
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "2rem" }}>
          Access the notes editor.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: "'Courier New', monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                background: "var(--surface)",
                border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
                borderRadius: "5px",
                color: "var(--primary)",
                fontSize: "0.9rem",
                outline: "none",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = error ? "#ef4444" : "var(--border)")}
            />
            {error && (
              <p style={{ fontSize: "0.78rem", color: "#ef4444", marginTop: "0.4rem" }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.7rem 1.5rem",
              background: loading ? "var(--border)" : "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
