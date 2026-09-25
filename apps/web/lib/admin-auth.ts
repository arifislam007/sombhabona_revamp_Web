import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Shared-password staff login. Sessions are stateless: a signed expiry timestamp in an
// httpOnly cookie. They are signed with ADMIN_SESSION_SECRET, which is separate from the
// password so a captured cookie cannot be used to guess the password offline. Changing either
// value invalidates every existing session.

const SESSION_SECONDS = 8 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

// The admin area only exists when BOTH values are configured and the secret is long enough.
export function adminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && (process.env.ADMIN_SESSION_SECRET ?? "").length >= MIN_SECRET_LENGTH;
}

function isSecureSite(): boolean {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");
}

// The __Host- prefix makes browsers refuse the cookie unless it is Secure, host-only and Path=/.
export function sessionCookieName(): string {
  return isSecureSite() ? "__Host-sb_admin" : "sb_admin";
}

function signingKey(): Buffer {
  return createHash("sha256").update(`sombhabona-admin-session:${process.env.ADMIN_SESSION_SECRET ?? ""}`).digest();
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("hex");
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${expires}.${sign(String(expires))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !adminEnabled()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(sign(expires), "hex");
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export const sessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
  // Only mark Secure when the site is actually served over https, otherwise the
  // browser would drop the cookie and login would silently loop.
  secure: isSecureSite(),
});

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(sessionCookieName())?.value);
}

// Call from every admin page and admin API route. Layouts do not re-run on every
// navigation, so auth must never rely on a layout alone.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
