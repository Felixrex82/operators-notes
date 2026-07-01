import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

const thinkingAreas = [
  { label: "Startups", description: "Strategy, positioning, moats, and the mechanics of building companies." },
  { label: "Products", description: "How products are designed, why they succeed, and what makes them stick." },
  { label: "Web3", description: "Infrastructure, protocols, and the real opportunities in decentralized systems." },
  { label: "Growth", description: "Systems over hacks. Sustainable acquisition, activation, and retention." },
  { label: "Research", description: "Market analysis, competitive landscapes, and emerging patterns." },
  { label: "Essays", description: "Longer-form thinking on technology, attention, and the future." },
  { label: "Systems", description: "How complex things work and how to design them intentionally." },
  { label: "Execution", description: "The operational craft of getting things done at pace and at scale." },
];

const projects = [
  {
    name: "MEADNET", status: "Active",
    description: "A decentralized network infrastructure project exploring peer-to-peer connectivity at scale.",
    thesis: "Connectivity should be a primitive, not a product.",
    tags: ["Web3", "Infrastructure", "P2P"], href: "/projects",
  },
  {
    name: "CALMLEDGER", status: "Building",
    description: "A personal finance intelligence layer that makes your financial data actually useful.",
    thesis: "Financial clarity shouldn't require a finance degree.",
    tags: ["Fintech", "Product", "Consumer"], href: "/projects",
  },
];

export default function Home() {
  const notes = getAllNotes().slice(0, 3);

  return (
    <div className="page-wrap">
      {/* ── Hero ── */}
      <section className="container section--hero" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="label" style={{ marginBottom: "1.5rem" }}>PUBLIC REPOSITORY</p>
        <h1 style={{
          fontSize: "clamp(1.85rem, 5.5vw, 3rem)",
          fontWeight: 700, color: "var(--primary)",
          letterSpacing: "-0.04em", lineHeight: 1.1,
          marginBottom: "1.25rem", maxWidth: "640px",
        }}>
          The Operator&apos;s Notes
        </h1>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "var(--secondary)", lineHeight: 1.75, marginBottom: "1rem", maxWidth: "540px" }}>
          Hi, I&apos;m Felix. I spend my time thinking about startups, products, attention markets,
          Web3, growth systems, and emerging technology. This site is where I document what I learn.
        </p>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "500px" }}>
          Not a portfolio. Not a resume. A public repository of ideas, observations, startup research,
          product analysis, and lessons from building.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/notes" className="btn-primary">Read Notes →</Link>
          <Link href="/projects" className="btn-secondary">View Projects</Link>
        </div>
      </section>

      {/* ── Recent Notes ── */}
      <section className="container section" style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
          <div>
            <p className="label">RECENT</p>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em" }}>Latest Notes</h2>
          </div>
          <Link href="/notes" style={{ fontSize: "0.8rem", color: "var(--accent)", whiteSpace: "nowrap" }}>All notes →</Link>
        </div>

        <div>
          {notes.map((note, i) => (
            <Link href={`/notes/${note.slug}`} key={note.slug} className="note-row" style={{ borderBottom: i < notes.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                  <span className="tag-accent">{note.category.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.35rem", letterSpacing: "-0.01em", lineHeight: 1.35 }}>{note.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.55 }}>{note.excerpt}</p>
              </div>
              <div className="note-row__meta">
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)" }}>
                  {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.25rem" }}>{note.readingTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="container section" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="label">FEATURED</p>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", marginBottom: "2rem" }}>Projects</h2>
        <div className="tile-grid tile-grid--2">
          {projects.map(project => (
            <Link key={project.name} href={project.href} className="tile tile--lg" style={{ display: "block", textDecoration: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem", gap: "0.5rem" }}>
                <h3 style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.9rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "0.05em" }}>{project.name}</h3>
                <span style={{
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", flexShrink: 0,
                  color: project.status === "Active" ? "#4ade80" : "var(--accent)",
                  background: project.status === "Active" ? "rgba(74,222,128,0.1)" : "rgba(59,123,248,0.1)",
                  padding: "0.2rem 0.55rem", borderRadius: "3px",
                }}>{project.status.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--secondary)", lineHeight: 1.65, marginBottom: "0.85rem" }}>{project.description}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "1.1rem", lineHeight: 1.55 }}>&ldquo;{project.thesis}&rdquo;</p>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {project.tags.map(tag => <span key={tag} className="tag-muted">{tag}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Thinking Areas ── */}
      <section className="container section">
        <p className="label">INDEX</p>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", marginBottom: "2rem" }}>Areas of Thinking</h2>
        <div className="tile-grid tile-grid--4">
          {thinkingAreas.map(area => (
            <Link key={area.label} href={`/notes?category=${area.label}`} className="tile" style={{ display: "block", textDecoration: "none" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.35rem" }}>{area.label}</h3>
              <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.55 }}>{area.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
