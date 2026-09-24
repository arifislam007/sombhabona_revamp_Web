import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyStaff } from "@/lib/mailer";
import { guardRequest } from "@/lib/api-guard";

const schema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    phone: z
      .string()
      .trim()
      .min(6)
      .max(20)
      .regex(/^[+\d][\d\s-]*$/, "Invalid phone number"),
    skill: z.string().trim().min(1).max(200),
    message: z.string().trim().max(2000).optional(),
  })
  .strict();

export async function POST(request: Request) {
  const blocked = guardRequest(request, "volunteer", { limit: 5, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const application = await prisma.volunteerApplication.create({ data: parsed.data });

  try {
    await notifyStaff(
      "New volunteer application",
      `Name: ${application.name}\nEmail: ${application.email}\nPhone: ${application.phone}\nSkill: ${application.skill}\n\n${application.message ?? ""}`
    );
  } catch (err) {
    console.error("Failed to send volunteer notification", { id: application.id, err });
  }

  return NextResponse.json({ ok: true });
}
