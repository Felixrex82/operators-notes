"use client";

type Variant = "footer" | "inline" | "strip";

interface Props {
  variant?: Variant;
}

export default function Subscribe({ variant = "inline" }: Props) {
  if (variant === "strip") {
    return (
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.85rem 0",
        marginBottom: "0",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.68rem",
          color: "var(--muted)",
          letterSpacing: "0.06em",
        }}>
          THE OPERATORS
        </p>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.65rem",
          color: "var(--accent)",
          background: "rgba(59,123,248,0.1)",
          padding: "0.2rem 0.6rem",
          borderRadius: "3px",
          letterSpacing: "0.05em",
        }}>
          NEWSLETTER COMING SOON
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div style={{
        margin: "3rem 0 0",
        padding: "2rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        borderLeft: "2px solid var(--accent)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}>
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.65rem",
          color: "var(--accent)",
          letterSpacing: "0.1em",
        }}>
          THE OPERATORS
        </p>
        <h3 style={{
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "var(--primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
        }}>
          Newsletter coming soon.
        </h3>
        <p style={{
          fontSize: "0.85rem",
          color: "var(--muted)",
          lineHeight: 1.65,
        }}>
          Notes on startups, products, Web3, and execution — straight to your inbox. 
          Launching soon for operators, founders, and builders.
        </p>
      </div>
    );
  }

  // Footer variant
  return (
    <div style={{
      borderTop: "1px solid var(--border)",
      padding: "2.5rem 0",
      marginBottom: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    }}>
      <div>
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.65rem",
          color: "var(--accent)",
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        }}>
          THE OPERATORS
        </p>
        <h3 style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--primary)",
          letterSpacing: "-0.03em",
          marginBottom: "0.4rem",
        }}>
          Newsletter coming soon.
        </h3>
        <p style={{
          fontSize: "0.85rem",
          color: "var(--muted)",
          lineHeight: 1.6,
          maxWidth: "420px",
        }}>
          Notes on startups, products, Web3, and execution — launching soon for operators, thinkers, founders, and builders.
        </p>
      </div>
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "0.65rem",
        color: "var(--accent)",
        background: "rgba(59,123,248,0.1)",
        padding: "0.35rem 0.85rem",
        borderRadius: "4px",
        letterSpacing: "0.05em",
        flexShrink: 0,
      }}>
        COMING SOON
      </span>
    </div>
  );
}
