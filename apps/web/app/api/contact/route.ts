import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyStaff } from "@/lib/mailer";
import { guardRequest } from "@/lib/api-guard";

const schema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(5000),
  })
  .strict();

export async function POST(request: Request) {
  const blocked = guardRequest(request, "contact", { limit: 5, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const submission = await prisma.contactSubmission.create({ data: parsed.data });

  // The message is saved; a mail outage must not make the visitor retry and duplicate it.
  try {
    await notifyStaff(
      "New contact form submission",
      `Name: ${submission.name}\nEmail: ${submission.email}\nSubject: ${submission.subject}\n\n${submission.message}`
    );
  } catch (err) {
    console.error("Failed to send contact notification", { id: submission.id, err });
  }

  return NextResponse.json({ ok: true });
}
