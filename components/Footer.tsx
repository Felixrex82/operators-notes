"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "4rem" }}>
      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
              © {year} THE OPERATOR&apos;S NOTES
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, maxWidth: "300px" }}>
              Notes on startups, products, Web3, growth, systems, and execution.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
            {[
              { label: "X / Twitter", href: "https://x.com" },
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
            ].map(({ label, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "0.8rem", color: "var(--muted)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--secondary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
