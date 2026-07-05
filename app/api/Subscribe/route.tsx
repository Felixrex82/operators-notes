import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const submissions = new Map<string, number>();    

function rateLimit(ip: string) {
  const now = Date.now();
  const last = submissions.get(ip) || 0;
  if (now - last < 60_000) return false;
  submissions.set(ip, now);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // If not configured, just log and return success (dev mode)
  if (!apiKey || !audienceId) {
    console.log("SUBSCRIBE:", email);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // Send a welcome email
    const ownerEmail = process.env.CONTACT_EMAIL;
    if (ownerEmail) {
      await resend.emails.send({
        from: "The Operator's Notes <onboarding@resend.dev>",
        to: email,
        replyTo: ownerEmail,
        subject: "You're in, Operator.",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;background:#fff;padding:40px 32px">
            <div style="border-bottom:2px solid #0A0A0B;padding-bottom:20px;margin-bottom:28px">
              <p style="font-family:monospace;font-size:11px;letter-spacing:0.1em;color:#5A5A6A;margin:0 0 8px">THE OPERATOR'S NOTES</p>
              <h1 style="font-size:22px;font-weight:700;margin:0;letter-spacing:-0.03em">You're in, Operator.</h1>
            </div>
            <p style="font-size:15px;line-height:1.7;color:#333;margin-bottom:16px">
              Welcome to the notes. You're now part of a small group of founders, builders, and operators who read these ideas as they develop.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#333;margin-bottom:16px">
              Expect notes on startups, products, Web3, growth systems, and the craft of building things that matter. No noise. No fluff. Just the thinking.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#333;margin-bottom:32px">
              — Felix
            </p>
            <div style="border-top:1px solid #eee;padding-top:20px">
              <p style="font-size:12px;color:#999;margin:0">
                You subscribed at operatorsnotes.com. 
                If this wasn't you, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Subscription failed";
    // Handle duplicate subscriber gracefully
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      return NextResponse.json({ ok: true, existing: true });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
