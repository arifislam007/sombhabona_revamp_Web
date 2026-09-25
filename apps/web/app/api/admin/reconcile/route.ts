import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardRequest } from "@/lib/api-guard";
import { isAdmin } from "@/lib/admin-auth";
import { reconcileDonation } from "@/lib/donations";

export const dynamic = "force-dynamic";

const MIN_AGE_MS = 10 * 60_000; // leave donors time to finish paying
const BATCH = 50;

// Asks bKash about PENDING donations and settles those it can. Safe to run repeatedly.
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const blocked = guardRequest(request, "admin-reconcile", { limit: 10, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  const pending = await prisma.donation.findMany({
    where: { status: "PENDING", bkashPaymentId: { not: null }, createdAt: { lt: new Date(Date.now() - MIN_AGE_MS) } },
    orderBy: { createdAt: "asc" },
    take: BATCH,
  });

  const tally: Record<string, number> = { COMPLETED: 0, FAILED: 0, CANCELLED: 0, PENDING: 0 };
  for (const donation of pending) tally[await reconcileDonation(donation)] += 1;

  return NextResponse.json({ checked: pending.length, ...tally });
}
