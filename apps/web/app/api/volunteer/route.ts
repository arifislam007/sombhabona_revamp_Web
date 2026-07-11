import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyStaff } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  skill: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const application = await prisma.volunteerApplication.create({ data: parsed.data });

  await notifyStaff(
    "New volunteer application",
    `Name: ${application.name}\nEmail: ${application.email}\nPhone: ${application.phone}\nSkill: ${application.skill}\n\n${application.message ?? ""}`
  );

  return NextResponse.json({ ok: true });
}
