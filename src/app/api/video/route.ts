import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://cdn.sanity.io/files/";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const rangeHeader = request.headers.get("range");
  const headers: HeadersInit = {};
  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  const upstream = await fetch(url, { headers }).catch(() => null);

  if (!upstream || !upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "video/mp2t");
  responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);

  responseHeaders.set("Accept-Ranges", "bytes");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
