import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://cdn.sanity.io/files/";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const format = request.nextUrl.searchParams.get("format");

  if (!url || !url.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (format === "m3u8") {
    const segmentUrl = `/api/video?url=${encodeURIComponent(url)}`;
    const manifest = [
      "#EXTM3U",
      "#EXT-X-VERSION:3",
      "#EXT-X-TARGETDURATION:99999",
      "#EXT-X-MEDIA-SEQUENCE:0",
      `#EXTINF:99999.0,`,
      segmentUrl,
      "#EXT-X-ENDLIST",
    ].join("\n");

    return new NextResponse(manifest, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const rangeHeader = request.headers.get("range");
  const headers: HeadersInit = {};
  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  const upstream = await fetch(url, { headers }).catch(() => null);

  if (!upstream || (!upstream.ok && upstream.status !== 206)) {
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
