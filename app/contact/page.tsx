"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem 1rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    color: "var(--primary)",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.15s",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.65rem",
    color: "var(--muted)",
    letterSpacing: "0.08em",
    marginBottom: "0.5rem",
  } as React.CSSProperties;

  const socials = [
    { label: "X / Twitter", handle: "@felix", href: "https://x.com" },
    { label: "GitHub", handle: "github.com/felix", href: "https://github.com" },
    { label: "LinkedIn", handle: "linkedin.com/in/felix", href: "https://linkedin.com" },
    { label: "Email", handle: "felix@operatorsnotes.com", href: "mailto:felix@operatorsnotes.com" },
  ];

  return (
    <div style={{ paddingTop: "52px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(65ch, 100%) 1fr" }}>
          <div />
          <div style={{ padding: "4rem 0 6rem" }}>
            <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>CONTACT</p>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>Get in touch</h1>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>
                If you&apos;re a founder, builder, or investor who found something useful here, I&apos;d like to hear from you.
              </p>
            </div>

            {/* Socials */}
            <div style={{ marginBottom: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>FIND ME</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.9rem 0",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    <span style={{ fontSize: "0.85rem", color: "var(--secondary)" }}>{s.label}</span>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem", color: "var(--accent)" }}>{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            {sent ? (
              <div style={{
                padding: "2rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", marginBottom: "0.75rem" }}>SENT</p>
                <p style={{ color: "var(--secondary)", fontSize: "0.9rem" }}>Message received. I&apos;ll get back to you.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em" }}>OR SEND A MESSAGE</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>NAME</label>
                    <input name="name" value={form.name} onChange={handle} required style={inputStyle} placeholder="Your name"
                      onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required style={inputStyle} placeholder="your@email.com"
                      onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>SUBJECT</label>
                  <select name="subject" value={form.subject} onChange={handle} required style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")}>
                    <option value="">Select a topic</option>
                    <option>Collaboration</option>
                    <option>Feedback on a note</option>
                    <option>Just saying hi</option>
                    <option>Work opportunity</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>MESSAGE</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={6} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} placeholder="What's on your mind?"
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>
                <button type="submit" style={{
                  alignSelf: "flex-start",
                  padding: "0.65rem 1.5rem",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Send message
                </button>
              </form>
            )}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
