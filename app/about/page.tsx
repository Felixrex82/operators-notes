export const metadata = {
  title: "About",
  description: "How Felix thinks, what he works on, and what he's learning.",
};

const interests = [
  { area: "Attention Economy", detail: "How platforms compete for time, and what that means for product design." },
  { area: "Startup Strategy", detail: "Positioning, moats, sequencing, and the operational craft of building." },
  { area: "Web3 Infrastructure", detail: "The protocols and primitives that will matter after the speculation cycle ends." },
  { area: "Product Design", detail: "How great products create habits, not just features." },
  { area: "Growth Systems", detail: "Repeatable, compounding growth vs. one-time hacks." },
  { area: "Emerging Technology", detail: "AI, decentralized systems, and what infrastructure shifts unlock." },
];

const reading = [
  { title: "Zero to One", author: "Peter Thiel" },
  { title: "Poor Charlie's Almanack", author: "Charlie Munger" },
  { title: "The Innovator's Dilemma", author: "Clayton Christensen" },
  { title: "High Output Management", author: "Andy Grove" },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "52px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(65ch, 100%) 1fr" }}>
          <div />
          <div style={{ padding: "4rem 0 6rem" }}>
            {/* Header */}
            <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                ABOUT
              </p>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "1.25rem" }}>
                Felix
              </h1>
              <p style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
                I&apos;m a startup operator, product thinker, and Web3 enthusiast. I spend most of my time 
                researching startups, analyzing products, studying markets, documenting ideas, and writing 
                about technology.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.8 }}>
                This site isn&apos;t a portfolio or a resume. It&apos;s a record of how I think. The goal is for 
                anyone who reads it — founders, builders, investors — to immediately understand what I 
                care about and why.
              </p>
            </div>

            {/* How I think */}
            <section style={{ marginBottom: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                HOW I THINK
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "I try to work from first principles before adopting frameworks. Frameworks are useful — but borrowed thinking is a ceiling.",
                  "I'm interested in systems over events. What's the underlying mechanism? What would have to be true for this to compound?",
                  "I weight operational insight heavily. I trust people who've built things and failed more than people who've only analyzed them.",
                  "I try to be honest about what I don't know. Most confident takes online are poorly-reasoned. Uncertainty, stated clearly, is more useful than false precision.",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", marginTop: "0.2rem", flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontSize: "0.92rem", color: "var(--secondary)", lineHeight: 1.75 }}>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Current interests */}
            <section style={{ marginBottom: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                CURRENT AREAS OF INTEREST
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {interests.map((item, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    padding: "1rem 0",
                    borderBottom: i < interests.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--primary)" }}>{item.area}</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Now */}
            <section style={{ marginBottom: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                NOW
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {[
                  { label: "Building", value: "MEADNET and CALMLEDGER" },
                  { label: "Writing", value: "Notes on attention markets, Web3 infrastructure, and startup operations" },
                  { label: "Studying", value: "Decentralized identity, AI infrastructure, and B2B growth systems" },
                  { label: "Based in", value: "Lagos, Nigeria" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--muted)", minWidth: "80px" }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reading */}
            <section>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                READING
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {reading.map(book => (
                  <div key={book.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>{book.title}</p>
                    <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--muted)" }}>{book.author}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
