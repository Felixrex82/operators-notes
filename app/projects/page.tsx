"use client";

const projects = [
  {
    slug: "meadnet", name: "MEADNET", status: "Active", year: "2024",
    problem: "Centralised internet infrastructure creates single points of failure, censorship vectors, and rent extraction at every layer of the stack.",
    solution: "A peer-to-peer network layer that routes around centralised bottlenecks, enabling resilient, low-cost connectivity for applications that need it.",
    thesis: "Connectivity should be a primitive, not a product. The protocol layer should be as neutral as TCP/IP — and as invisible.",
    tags: ["Web3", "Infrastructure", "P2P", "Networking"],
    learnings: [
      "Decentralisation without abstraction creates adoption barriers that kill even technically superior products",
      "The real moat in infrastructure is ecosystem: tooling, documentation, developer trust",
      "Incentive design is product design when you're building a decentralised system",
    ],
  },
  {
    slug: "calmledger", name: "CALMLEDGER", status: "Building", year: "2025",
    problem: "Personal finance tools either overwhelm users with complexity or oversimplify to the point of being useless. Most people have no clear picture of their financial position.",
    solution: "An intelligent financial clarity layer that aggregates, interprets, and surfaces what matters — without requiring users to become analysts.",
    thesis: "Financial clarity shouldn't require a finance degree. The best personal finance tool is the one that thinks so its users don't have to.",
    tags: ["Fintech", "Consumer", "AI", "Product"],
    learnings: [
      "Simplicity is not the absence of complexity — it's the intelligent abstraction of it",
      "Trust is the primary moat in fintech; features come second",
      "The activation problem in consumer fintech is always about the first 'aha' moment — getting there fast matters most",
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className="page-wrap">
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <p className="label">PROJECTS · {projects.length} ACTIVE</p>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.6rem" }}>Projects</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: "480px" }}>
            Things I&apos;m building. Each is an attempt to solve a problem I think matters, using the principles I write about.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
          {projects.map(project => (
            <div key={project.slug} style={{ background: "var(--surface)", padding: "clamp(1.25rem, 4vw, 2.25rem)" }}>

              {/* Project header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "'Geist Mono', monospace", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", fontWeight: 600, color: "var(--primary)", letterSpacing: "0.05em" }}>
                      {project.name}
                    </h2>
                    <span style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem",
                      color: project.status === "Active" ? "#4ade80" : "var(--accent)",
                      background: project.status === "Active" ? "rgba(74,222,128,0.1)" : "rgba(59,123,248,0.1)",
                      padding: "0.2rem 0.6rem", borderRadius: "3px",
                    }}>{project.status.toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {project.tags.map(tag => <span key={tag} className="tag-muted">{tag}</span>)}
                  </div>
                </div>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--muted)", flexShrink: 0 }}>{project.year}</span>
              </div>

              {/* Problem / Solution */}
              <div className="project-detail-grid">
                <div>
                  <p className="label">THE PROBLEM</p>
                  <p style={{ fontSize: "0.88rem", color: "var(--secondary)", lineHeight: 1.75 }}>{project.problem}</p>
                </div>
                <div>
                  <p className="label">THE SOLUTION</p>
                  <p style={{ fontSize: "0.88rem", color: "var(--secondary)", lineHeight: 1.75 }}>{project.solution}</p>
                </div>
              </div>

              {/* Thesis */}
              <div style={{ background: "var(--void)", border: "1px solid var(--border)", borderRadius: "5px", padding: "1.1rem 1.25rem", marginBottom: "1.5rem" }}>
                <p className="label">THESIS</p>
                <p style={{ fontSize: "0.9rem", color: "var(--secondary)", fontStyle: "italic", lineHeight: 1.65 }}>&ldquo;{project.thesis}&rdquo;</p>
              </div>

              {/* Learnings */}
              <p className="label">KEY LEARNINGS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {project.learnings.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "var(--secondary)", lineHeight: 1.65 }}>
                    <span style={{ color: "var(--accent)", fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem", marginTop: "0.15rem", flexShrink: 0 }}>→</span>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
