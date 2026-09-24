import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { guardRequest } from "@/lib/api-guard";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).strict();

export async function POST(request: Request) {
  const blocked = guardRequest(request, "newsletter", { limit: 5, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  });

  return NextResponse.json({ ok: true });
}
