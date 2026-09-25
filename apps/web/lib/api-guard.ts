import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type Limit = { limit: number; windowMs: number };

/**
 * The visitor's IP as seen by the proxy(ies) in front of the app.
 *
 * Each proxy using `$proxy_add_x_forwarded_for` APPENDS the address it saw, so the right-most
 * entries are written by our own infrastructure and cannot be forged; anything to the left can
 * be. TRUSTED_PROXY_HOPS is the number of proxies in front of the app (default 1, e.g. one
 * nginx). Count every proxy, including a Docker nginx behind a host nginx (then 2).
 */
export function clientIp(request: Request): string {
  const hops = Math.max(1, Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "1", 10) || 1);
  const chain = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (chain.length > 0) return chain[Math.max(0, chain.length - hops)];
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sameOrigin(request: Request): boolean {
  // Browsers always send Sec-Fetch-Site; anything flagged cross-site is rejected outright.
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser client (curl, server-to-server)
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  // Only the Host header and the configured site URL count. X-Forwarded-Host is client-controlled.
  const host = request.headers.get("host");
  if (host) allowed.add(host);
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      allowed.add(new URL(site).host);
    } catch {
      /* ignore malformed site URL */
    }
  }
  return allowed.has(originHost);
}

function tooMany(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfterSeconds)) } }
  );
}

function liveBucket(id: string, now: number): Bucket | undefined {
  const b = buckets.get(id);
  if (b && b.resetAt <= now) {
    buckets.delete(id);
    return undefined;
  }
  return b;
}

function cleanup(now: number) {
  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

function hit(id: string, windowMs: number): void {
  const now = Date.now();
  const b = liveBucket(id, now);
  if (b) b.count += 1;
  else {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    cleanup(now);
  }
}

function overLimit(id: string, limit: number): NextResponse | null {
  const now = Date.now();
  const b = liveBucket(id, now);
  return b && b.count >= limit ? tooMany(Math.ceil((b.resetAt - now) / 1000)) : null;
}

/**
 * Origin check + counts every request. For ordinary form endpoints.
 * In-memory: correct for a single web replica; use a shared store if you scale out.
 */
export function guardRequest(request: Request, key: string, opts: Limit): NextResponse | null {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const id = `${key}:${clientIp(request)}`;
  const blocked = overLimit(id, opts.limit);
  if (blocked) return blocked;
  hit(id, opts.windowMs);
  return null;
}

// --- Failed-attempt limiting (login) --------------------------------------------------
// Only failures count, so staff behind one shared office IP are not locked out by
// successful logins. A global cap also stops an attacker who rotates source addresses.

const GLOBAL_ID = "global";

export function checkFailures(request: Request, key: string, perIp: Limit, global: Limit): NextResponse | null {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  return overLimit(`${key}:${clientIp(request)}`, perIp.limit) ?? overLimit(`${key}:${GLOBAL_ID}`, global.limit);
}

export function recordFailure(request: Request, key: string, perIp: Limit, global: Limit): void {
  hit(`${key}:${clientIp(request)}`, perIp.windowMs);
  hit(`${key}:${GLOBAL_ID}`, global.windowMs);
}

export function clearFailures(request: Request, key: string): void {
  buckets.delete(`${key}:${clientIp(request)}`);
}
