"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/notes")
      .then(r => {
        if (r.status === 401) { router.push("/admin"); return; }
        setAuthed(true);
        setChecking(false);
      });
  }, [router]);

  if (checking) return (
    <div style={{ paddingTop: "52px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>LOADING...</p>
    </div>
  );

  if (!authed) return null;

  return (
    <div style={{ paddingTop: "52px" }}>
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="label">ADMIN · ANALYTICS</p>
            <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.75rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em" }}>
              Analytics
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/admin/edit" style={{
              padding: "0.55rem 1.1rem", fontSize: "0.82rem",
              color: "var(--muted)", border: "1px solid var(--border)",
              borderRadius: "5px", display: "inline-flex", alignItems: "center",
            }}>
              ← Notes
            </Link>
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" style={{
              padding: "0.55rem 1.1rem", fontSize: "0.82rem",
              background: "var(--accent)", color: "#fff",
              borderRadius: "5px", display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}>
              Full dashboard ↗
            </a>
          </div>
        </div>

        {/* Explainer */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "2rem", marginBottom: "2rem",
          display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap",
        }}>
          <div style={{ fontSize: "2rem", flexShrink: 0 }}>📊</div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              Your analytics live on Vercel
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
              Vercel Analytics tracks every page view across your site automatically — which notes people read, where they come from, what devices they use, and how fast your pages load. The data is already being collected since your last deploy.
            </p>
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.85rem", color: "var(--accent)",
            }}>
              Open Vercel Analytics dashboard ↗
            </a>
          </div>
        </div>

        {/* What you can see */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="label" style={{ marginBottom: "1.25rem" }}>WHAT YOU CAN SEE IN VERCEL</p>
          <div className="tile-grid tile-grid--2">
            {[
              { icon: "👥", title: "Unique visitors", desc: "How many individual people visited your site, by day, week or month." },
              { icon: "👁", title: "Page views", desc: "Total views per page — see exactly which notes are getting the most reads." },
              { icon: "🌍", title: "Countries", desc: "Where your readers are coming from, broken down by country." },
              { icon: "📱", title: "Devices", desc: "How many people read on mobile vs desktop vs tablet." },
              { icon: "🔗", title: "Referrers", desc: "Which sites are sending traffic your way — Twitter, Google, direct links." },
              { icon: "⚡", title: "Page speed", desc: "Core Web Vitals for every page so you know how fast your site feels to readers." },
            ].map(item => (
              <div key={item.title} className="tile" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.3rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enable instructions */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "2rem" }}>
          <p className="label" style={{ marginBottom: "1.25rem" }}>HOW TO ENABLE (ONE TIME)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { step: "01", text: "Go to your project on vercel.com" },
              { step: "02", text: "Click the Analytics tab in the top navigation" },
              { step: "03", text: "Click Enable — it's free on the Hobby plan (your plan)" },
              { step: "04", text: "Data starts appearing within a few minutes of your first visitor" },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", marginTop: "0.15rem", flexShrink: 0 }}>{item.step}</span>
                <p style={{ fontSize: "0.88rem", color: "var(--secondary)", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.65rem 1.35rem", background: "var(--accent)",
                color: "#fff", borderRadius: "5px", fontSize: "0.85rem", fontWeight: 500,
              }}>
              Go to Vercel Analytics ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
