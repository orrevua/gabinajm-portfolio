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

function buildEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:0;background-color:#FDF2F8;font-family:'Inter','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#FDF2F8 0%,#FAF5FF 50%,#EFF6FF 100%);min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">

<!-- Main card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.06),0 8px 16px rgba(0,0,0,0.04);">

<!-- Header gradient bar -->
<tr>
<td style="height:6px;background:linear-gradient(90deg,#F6339A 0%,#9810FA 100%);"></td>
</tr>

<!-- Logo / Brand -->
<tr>
<td align="center" style="padding:32px 40px 0;">
  <table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:linear-gradient(135deg,#F6339A,#9810FA);border-radius:14px;padding:10px 14px;">
      <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">G</span>
    </td>
    <td style="padding-left:12px;">
      <span style="font-size:18px;font-weight:700;color:#0A0A0A;letter-spacing:-0.3px;">Gabinajm</span>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- Title -->
<tr>
<td align="center" style="padding:28px 40px 8px;">
  <h1 style="margin:0;font-size:24px;font-weight:800;color:#0A0A0A;letter-spacing:-0.5px;">New Message Received</h1>
</td>
</tr>

<!-- Subtitle -->
<tr>
<td align="center" style="padding:0 40px 28px;">
  <p style="margin:0;font-size:14px;color:#595966;">${date}</p>
</td>
</tr>

<!-- Sender info card -->
<tr>
<td style="padding:0 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#FDF2F8,#FAF5FF);border-radius:16px;border:1px solid #F3E8FF;">
  <tr>
  <td style="padding:20px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <!-- Avatar circle -->
        <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#F6339A,#9810FA);width:44px;height:44px;border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-size:18px;font-weight:700;color:#ffffff;line-height:44px;">${safeName.charAt(0).toUpperCase()}</span>
          </td>
          <td style="padding-left:14px;vertical-align:middle;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#0A0A0A;">${safeName}</p>
            <p style="margin:2px 0 0;font-size:13px;color:#595966;">${safeEmail}</p>
          </td>
        </tr>
        </table>
      </td>
    </tr>
    </table>
  </td>
  </tr>
  </table>
</td>
</tr>

<!-- Message body -->
<tr>
<td style="padding:24px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAFA;border-radius:16px;border:1px solid #e6e2db;">
  <tr>
  <td style="padding:24px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#595966;">Message</p>
    <p style="margin:0;font-size:15px;line-height:1.7;color:#0A0A0A;">${safeMessage}</p>
  </td>
  </tr>
  </table>
</td>
</tr>

<!-- Reply button -->
<tr>
<td align="center" style="padding:28px 32px 0;">
  <a href="mailto:${safeEmail}?subject=Re: Portfolio Contact" style="display:inline-block;padding:14px 32px;background:linear-gradient(90deg,#F6339A,#9810FA);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:96px;box-shadow:0 10px 20px rgba(246,51,154,0.3);">Reply to ${safeName}</a>
</td>
</tr>

<!-- Divider -->
<tr>
<td style="padding:32px 40px 0;">
  <hr style="border:none;height:1px;background:linear-gradient(90deg,transparent,#e6e2db,transparent);margin:0;" />
</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:20px 40px 32px;">
  <p style="margin:0;font-size:12px;color:#595966;">Sent from your portfolio contact form</p>
  <p style="margin:4px 0 0;font-size:12px;color:#595966;">
    <a href="https://gabinajm.com" style="color:#F6339A;text-decoration:none;font-weight:600;">gabinajm.com</a>
  </p>
</td>
</tr>

</table>
<!-- End main card -->

</td></tr>
</table>
</body>
</html>`;
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
        htmlContent: buildEmailHtml(name, email, message),
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
