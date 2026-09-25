import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { guardRequest } from "@/lib/api-guard";
import { sessionCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const blocked = guardRequest(request, "admin-logout", { limit: 20, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  (await cookies()).delete(sessionCookieName());
  return NextResponse.json({ ok: true });
}
