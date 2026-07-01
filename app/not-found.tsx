import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ paddingTop: "52px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1rem" }}>404</p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Page not found</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "2rem" }}>This note doesn&apos;t exist. Yet.</p>
        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)" }}>← Back home</Link>
      </div>
    </div>
  );
}
