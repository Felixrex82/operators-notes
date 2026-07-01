"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/notes", label: "Notes" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,10,11,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        height: "var(--nav-h)",
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <Link href="/" style={{
            fontFamily: "'Geist Mono', 'Courier New', monospace",
            fontSize: "clamp(0.65rem, 2.5vw, 0.78rem)",
            color: "var(--primary)",
            letterSpacing: "0.05em",
            fontWeight: 500,
            flexShrink: 0,
          }}>
            THE OPERATOR&apos;S NOTES
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" style={{ display: "flex", gap: "0.15rem" }}
            className="desktop-nav">
            {links.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href} style={{
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.82rem",
                  color: active ? "var(--primary)" : "var(--muted)",
                  fontWeight: active ? 500 : 400,
                  borderRadius: "4px",
                  background: active ? "var(--surface)" : "transparent",
                  transition: "color 0.15s, background 0.15s",
                }}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--secondary)",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "4px",
              lineHeight: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
              {label}
            </Link>
          ))}
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "X / Twitter", href: "https://x.com" },
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "0.85rem", color: "var(--muted)", padding: "0.25rem 0" }}>
                {s.label} ↗
              </a>
            ))}
          </div>
        </nav>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
