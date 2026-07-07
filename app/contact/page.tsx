"use client";
import { useState } from "react";

const socials = [
  { label: "Whatsapp", handle: "+2348173857159", href: "https://wa.me/qr/RQTA7MVPJYHQE1" },
  { label: "X / Twitter", handle: "@Awodelefelix2", href: "https://x.com/awodelefelix2" },
  { label: "GitHub", handle: "github.com/Felixrex82", href: "https://github.com/Felixrex82" },
  { label: "LinkedIn", handle: "linkedin.com/in/felix", href: "https://linkedin.com" },
  { label: "Email", handle: "olamidefelix54@gmail.com", href: "olamidefelix54@gmail.com" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong. Please try again.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 0.9rem",
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "5px", color: "var(--primary)", fontSize: "0.88rem",
    outline: "none", transition: "border-color 0.15s",
    fontFamily: "inherit", WebkitAppearance: "none" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Geist Mono', monospace",
    fontSize: "0.63rem", color: "var(--muted)",
    letterSpacing: "0.08em", marginBottom: "0.45rem",
  };

  return (
    <div className="page-wrap">
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        <div className="reading-col">

          {/* Header */}
          <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
            <p className="label">CONTACT</p>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.04em", marginBottom: "0.6rem" }}>
              Get in touch
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>
              If you&apos;re a founder, builder, or investor who found something useful here, I&apos;d like to hear from you.
            </p>
          </div>

          {/* Socials */}
          <div style={{ marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
            <p className="label" style={{ marginBottom: "1rem" }}>FIND ME</p>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.85rem 0", borderBottom: "1px solid var(--border)",
                textDecoration: "none", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                <span style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>{s.label}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.75rem", color: "var(--accent)" }}>{s.handle}</span>
              </a>
            ))}
          </div>

          {/* Form */}
          <p className="label" style={{ marginBottom: "1.25rem" }}>SEND A MESSAGE</p>

          {status === "sent" ? (
            <div style={{
              padding: "2rem", textAlign: "center",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "6px",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>✓</div>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "#4ade80", marginBottom: "0.5rem", letterSpacing: "0.06em" }}>
                MESSAGE SENT
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--secondary)" }}>
                Got it. I&apos;ll reply to <strong style={{ color: "var(--primary)" }}>{form.email}</strong> within a few days.
              </p>
              <button
                onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle"); }}
                style={{ marginTop: "1.25rem", background: "none", border: "none", color: "var(--accent)", fontSize: "0.82rem", cursor: "pointer" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>NAME</label>
                  <input name="name" value={form.name} onChange={handle} required className="input"
                    placeholder="Your name"
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required className="input"
                    placeholder="your@email.com"
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>SUBJECT</label>
                <select name="subject" value={form.subject} onChange={handle} required className="input"
                  style={{ ...inputStyle, cursor: "pointer" }}
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
                <textarea name="message" value={form.message} onChange={handle} required rows={6}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                  placeholder="What's on your mind?"
                  onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")} />
              </div>

              {status === "error" && (
                <p style={{ fontSize: "0.82rem", color: "#ef4444", padding: "0.6rem 0.9rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "5px" }}>
                  {errorMsg}
                </p>
              )}

              <div>
                <button type="submit" disabled={status === "sending"} className="btn-primary"
                  style={{ opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "not-allowed" : "pointer" }}>
                  {status === "sending" ? (
                    <><SpinnerIcon /> Sending...</>
                  ) : "Send message →"}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10" strokeLinecap="round"/>
    </svg>
  );
}
