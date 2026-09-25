import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { checkFailures, clearFailures, recordFailure, type Limit } from "@/lib/api-guard";
import {
  adminEnabled,
  createSessionToken,
  passwordMatches,
  sessionCookieName,
  sessionCookieOptions,
} from "@/lib/admin-auth";

const schema = z.object({ password: z.string().min(1).max(200) }).strict();

// 5 wrong guesses per visitor per 15 minutes, and 40 wrong guesses in total across everyone.
const PER_IP: Limit = { limit: 5, windowMs: 15 * 60_000 };
const GLOBAL: Limit = { limit: 40, windowMs: 15 * 60_000 };

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json({ error: "Admin area is not enabled." }, { status: 404 });
  }

  const blocked = checkFailures(request, "admin-login", PER_IP, GLOBAL);
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || !passwordMatches(parsed.data.password)) {
    recordFailure(request, "admin-login", PER_IP, GLOBAL);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  clearFailures(request, "admin-login");
  (await cookies()).set(sessionCookieName(), createSessionToken(), sessionCookieOptions());
  return NextResponse.json({ ok: true });
}
