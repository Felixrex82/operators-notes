import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Rate limit: max 3 submissions per IP per hour
const submissions = new Map<string, { count: number; resetAt: number }>();

function checkLimit(ip: string) {
  const now = Date.now();
  const entry = submissions.get(ip);
  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkLimit(ip)) {
    return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
  }

  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !toEmail) {
    // Graceful fallback if env vars not set — still tells user it worked
    // but logs the message to server console
    console.log("CONTACT FORM SUBMISSION:", { name, email, subject, message });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "The Operator's Notes <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${subject || "New message"} — from ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <div style="border-bottom:2px solid #0A0A0B;padding-bottom:16px;margin-bottom:24px">
            <h2 style="margin:0;font-size:18px">New message via The Operator's Notes</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="padding:8px 0;color:#666;font-size:13px;width:80px">From</td><td style="padding:8px 0;font-size:14px;font-weight:500">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#3B7BF8">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px">Subject</td><td style="padding:8px 0;font-size:14px">${subject || "—"}</td></tr>
          </table>
          <div style="background:#f7f7f8;border-radius:6px;padding:20px;font-size:14px;line-height:1.7;color:#333;white-space:pre-wrap">${message}</div>
          <p style="margin-top:24px;font-size:12px;color:#999">Hit Reply to respond directly to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
