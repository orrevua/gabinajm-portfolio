import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSanityClient } from "@/src/services/sanityClient";
import { PASSWORD_BY_SLUG_QUERY } from "@/src/services/sanityQueries";
import { signCookie } from "@/src/services/projectAccess";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`${clientIp}:${slug}`)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const password = typeof body.password === "string" ? body.password.trim().slice(0, 200) : "";

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const client = getSanityClient();
    const result = await client.fetch<{ password?: string } | null>(
      PASSWORD_BY_SLUG_QUERY,
      { slug }
    );

    if (!result?.password) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const expected = Buffer.from(result.password, "utf-8");
    const provided = Buffer.from(password, "utf-8");

    const isMatch =
      expected.length === provided.length &&
      crypto.timingSafeEqual(expected, provided);

    if (!isMatch) {
      return NextResponse.json({ error: "The password is incorrect." }, { status: 401 });
    }

    const cookieValue = signCookie(slug);
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true });
    response.cookies.set(`project_access_${slug}`, cookieValue, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 86400,
      path: `/projects/${slug}`,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to verify password. Please try again." },
      { status: 500 }
    );
  }
}
