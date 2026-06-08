import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "";
const CONTACT_TO_NAME = process.env.CONTACT_TO_NAME || "";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "";
const CONTACT_FROM_NAME = process.env.CONTACT_FROM_NAME || "Portfolio Contact";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    if (!BREVO_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
      return NextResponse.json(
        { error: "NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const body: ContactBody = await request.json();

    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "NAME_REQUIRED" },
        { status: 400 }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "EMAIL_INVALID" },
        { status: 400 }
      );
    }

    if (!body.message || body.message.trim().length < 10) {
      return NextResponse.json(
        { error: "MESSAGE_REQUIRED" },
        { status: 400 }
      );
    }

    const name = body.name.trim().slice(0, 200);
    const email = body.email.trim().slice(0, 320);
    const message = body.message.trim().slice(0, 5000);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: CONTACT_FROM_NAME, email: CONTACT_FROM_EMAIL },
        to: [{ email: CONTACT_TO_EMAIL, name: CONTACT_TO_NAME }],
        replyTo: { email, name },
        subject: `Portfolio Contact: ${name}`,
        textContent: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        htmlContent: `
          <h2>New contact from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr />
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Brevo API error:", res.status, err);
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "SEND_FAILED" },
      { status: 500 }
    );
  }
}
