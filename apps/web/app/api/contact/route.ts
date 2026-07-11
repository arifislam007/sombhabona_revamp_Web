import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyStaff } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const submission = await prisma.contactSubmission.create({ data: parsed.data });

  await notifyStaff(
    "New contact form submission",
    `Name: ${submission.name}\nEmail: ${submission.email}\nSubject: ${submission.subject}\n\n${submission.message}`
  );

  return NextResponse.json({ ok: true });
}
