import Link from "next/link";

const experience = [
  {
    company: "Yax",
    role: "Community Moderator",
    location: "Asia",
    period: "March 2023 — August 2023",
    bullets: [
      "Coordinating and managing airdrop and bounty programs",
      "Creating brand worldwide awareness within the crypto and NFT community",
      "Updating customers within the ecosystem on recent happenings and projects",
      "Managing traders group and involved in different initiatives",
      "Representing the brand in prospecting and marketing to new and existing customers",
      "Developing marketing strategies to enhance organic growth of the project",
    ],
  },
  {
    company: "Hope Finance",
    role: "Marketing Manager",
    location: "",
    period: "January 2023",
    bullets: [
      "Created and implemented marketing strategies to drive customer acquisition and retention",
      "Developed marketing collateral such as product brochures and sales presentations",
      "Conducted market research to identify customer needs and preferences",
      "Coordinated marketing campaigns across multiple channels",
    ],
  },
  {
    company: "DomainDAO",
    role: "Community Moderator",
    location: "",
    period: "October 2022 — February 2023",
    bullets: [
      "Coordinated and managed airdrop and bounty programs",
      "Created brand worldwide awareness within the crypto and NFT community",
      "Updated customers within the ecosystem on recent happenings and projects",
      "Managed traders group and was involved in different initiatives",
      "Represented the brand in prospecting and marketing to new and existing customers",
      "Developed marketing strategies to enhance organic growth of the project",
    ],
  },
  {
    company: "MenZy",
    role: "In-house Marketer",
    location: "Europe",
    period: "June 2022 — December 2022",
    bullets: [
      "Created and implemented marketing strategies to drive customer acquisition and retention",
      "Developed marketing collateral such as product brochures and sales presentations",
      "Conducted market research to identify customer needs and preferences",
      "Coordinated marketing campaigns across multiple channels",
    ],
  },
  {
    company: "Nova DAO",
    role: "Community Moderator",
    location: "India",
    period: "February 2022 — December 2022",
    bullets: [
      "Coordinated and managed airdrop and bounty programs",
      "Created brand worldwide awareness within the crypto and NFT community",
      "Updated customers within the ecosystem on recent happenings and projects",
      "Managed traders group and was involved in different initiatives",
      "Represented the brand in prospecting and marketing to new and existing customers",
      "Developed marketing strategies to enhance organic growth of the project",
    ],
  },
  {
    company: "Lifter Seals Society",
    role: "Community Manager",
    location: "Asia",
    period: "January 2022 — June 2022",
    bullets: [
      "Assisted in creating and implementing community management strategies",
      "Managed community engagement and outreach efforts",
      "Coordinated community events and initiatives",
      "Maintained communication with community members and responded to inquiries",
    ],
  },
];

const additionalExperience = [
  { role: "Founder", company: "ModArena" },
  { role: "Content Writer", company: "FameWeb" },
  { role: "Freelancer", company: "Independent" },
  { role: "Researcher", company: "Independent" },
];

const skills = [
  "In-house marketing & community management",
  "Blockchain education and advocacy",
  "Social media marketing & SEO",
  "Microsoft Office Suite (Word, PowerPoint, Excel)",
  "Content writing",
  "Cryptocurrency project research & analysis",
];

const projects = [
  {
    name: "MEADNET",
    status: "Active",
    description: "A decentralized network infrastructure project exploring peer-to-peer connectivity at scale.",
    thesis: "Connectivity should be a primitive, not a product.",
    href: "/projects",
  },
  {
    name: "CALMLEDGER",
    status: "Building",
    description: "A personal finance intelligence layer that makes your financial data actually useful.",
    thesis: "Financial clarity shouldn't require a finance degree.",
    href: "/projects",
  },
];

const interests = [
  { area: "Attention Economy", detail: "How platforms compete for time and what that means for product design." },
  { area: "Startup Strategy", detail: "Positioning, moats, sequencing, and the operational craft of building." },
  { area: "Web3 Infrastructure", detail: "The protocols and primitives that will matter after the speculation cycle ends." },
  { area: "Product Design", detail: "How great products create habits, not just features." },
  { area: "Growth Systems", detail: "Repeatable, compounding growth vs. one-time hacks." },
  { area: "Emerging Technology", detail: "AI, decentralized systems, and what infrastructure shifts unlock." },
];

export const metadata = {
  title: "About",
  description: "Awodele Felix — blockchain enthusiast, startup operator, day trader, product thinker, and community builder.",
};

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem" }}>
          <p className="label">ABOUT</p>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>
            Awodele Felix
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--accent)", fontFamily: "'Geist Mono', monospace", marginBottom: "1.5rem", letterSpacing: "0.03em" }}>
            Blockchain Enthusiast · Startup Operator · Product Thinker · Community Builder · Day Trader
          </p>
          <p style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.8, marginBottom: "1rem", maxWidth: "640px" }}>
            A blockchain and cryptocurrency enthusiast with extensive knowledge of global blockchain and crypto activities. Actively managed, moderated, and promoted several crypto and NFT projects to the worldwide crypto space.
          </p>
          <p style={{ fontSize: "0.95rem", color: "var(--secondary)", lineHeight: 1.8, maxWidth: "640px" }}>
            Beyond Web3, I spend my time thinking about startups, products, attention markets, growth systems, and emerging technology. This site is where I document what I learn.
          </p>

          {/* Contact row */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
            {[
              { label: "+234 817 385 7159", href: "tel:+2348173857159" },
              { label: "olamidefelix54@gmail.com", href: "mailto:olamidefelix54@gmail.com" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/awodele-felix-1651021b2" },
              { label: "GitHub", href: "https://github.com/Felixrex82" },
            ].map(item => (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer" style={{
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.72rem",
                  color: "var(--accent)", letterSpacing: "0.04em",
                  textDecoration: "none", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                {item.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>

          {/* Professional Experience */}
          <section>
            <p className="label" style={{ marginBottom: "1.75rem" }}>PROFESSIONAL EXPERIENCE</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {experience.map((job, idx) => (
                <div key={idx} style={{
                  padding: "1.75rem 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.2rem", letterSpacing: "-0.01em" }}>
                        {job.role}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--accent)", fontFamily: "'Geist Mono', monospace" }}>
                        {job.company}{job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem",
                      color: "var(--muted)", whiteSpace: "nowrap",
                      background: "var(--surface)", padding: "0.25rem 0.65rem",
                      borderRadius: "3px", border: "1px solid var(--border)",
                    }}>
                      {job.period}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "var(--secondary)", lineHeight: 1.65 }}>
                        <span style={{ color: "var(--muted)", flexShrink: 0, marginTop: "0.1rem" }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Work Experience */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>ADDITIONAL WORK EXPERIENCE</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
              {additionalExperience.map((item, i) => (
                <div key={i} className="tile" style={{ padding: "1.1rem 1.25rem" }}>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.2rem" }}>{item.role}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "'Geist Mono', monospace" }}>{item.company}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>SKILLS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {skills.map((skill, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.85rem 0",
                  borderBottom: i < skills.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ color: "var(--accent)", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>{skill}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>EDUCATION</p>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.3rem" }}>
                B.Ed Educational Management
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--accent)", fontFamily: "'Geist Mono', monospace", marginBottom: "0.2rem" }}>
                University of Ilorin
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Kwara State, Nigeria</p>
            </div>
          </section>

          {/* Projects */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>PROJECTS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
              {projects.map(project => (
                <Link key={project.name} href={project.href} style={{ display: "block", padding: "1.5rem", background: "var(--surface)", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#161618")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--surface)")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.88rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "0.05em" }}>
                      {project.name}
                    </h3>
                    <span style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem",
                      color: project.status === "Active" ? "#4ade80" : "var(--accent)",
                      background: project.status === "Active" ? "rgba(74,222,128,0.1)" : "rgba(59,123,248,0.1)",
                      padding: "0.2rem 0.55rem", borderRadius: "3px",
                    }}>{project.status.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--secondary)", lineHeight: 1.65, marginBottom: "0.5rem" }}>{project.description}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic" }}>&ldquo;{project.thesis}&rdquo;</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Areas of Interest */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>AREAS OF INTEREST</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {interests.map((item, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem", padding: "1rem 0",
                  borderBottom: i < interests.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--primary)" }}>{item.area}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Now */}
          <section>
            <p className="label" style={{ marginBottom: "1.25rem" }}>NOW</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {[
                { label: "Building", value: "MEADNET and CALMLEDGER" },
                { label: "Writing", value: "Notes on attention markets, Web3 infrastructure, and startup operations" },
                { label: "Studying", value: "Decentralized identity, AI infrastructure, and B2B growth systems" },
                { label: "Based in", value: "Lagos, Nigeria" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--muted)", minWidth: "70px", flexShrink: 0 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
