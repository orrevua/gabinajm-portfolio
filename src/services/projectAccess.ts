import crypto from "crypto";

const SECRET =
  process.env.PROJECT_ACCESS_SECRET ||
  crypto.randomBytes(32).toString("hex");

export function signCookie(slug: string): string {
  const timestamp = Date.now().toString();
  const data = `${slug}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");
  return `${data}:${signature}`;
}

export function verifyCookie(slug: string, cookieValue: string): boolean {
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return false;

  const [cookieSlug, timestamp, signature] = parts;
  if (cookieSlug !== slug) return false;

  const age = Date.now() - Number(timestamp);
  if (isNaN(age) || age < 0 || age > 86400_000) return false;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(`${cookieSlug}:${timestamp}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
