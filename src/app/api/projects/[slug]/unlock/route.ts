import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSanityClient } from "@/src/services/sanityClient";
import { PASSWORD_BY_SLUG_QUERY } from "@/src/services/sanityQueries";
import { signCookie } from "@/src/services/projectAccess";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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
