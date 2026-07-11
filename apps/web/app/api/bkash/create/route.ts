import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createBkashPayment } from "@/lib/bkash";

const schema = z.object({
  donorName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  amount: z.number().int().min(10),
  recurring: z.boolean().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid donation details." }, { status: 400 });
  }

  const donation = await prisma.donation.create({
    data: {
      donorName: parsed.data.donorName,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone,
      amount: parsed.data.amount,
      recurring: parsed.data.recurring ?? false,
      method: "BKASH",
      status: "PENDING",
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const payment = await createBkashPayment({
      amount: parsed.data.amount,
      payerReference: donation.id,
      callbackURL: `${siteUrl}/api/bkash/callback`,
      merchantInvoiceNumber: donation.id,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: { bkashPaymentId: payment.paymentID },
    });

    return NextResponse.json({ bkashURL: payment.bkashURL });
  } catch (err) {
    await prisma.donation.update({ where: { id: donation.id }, data: { status: "FAILED" } });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to start bKash payment." },
      { status: 502 }
    );
  }
}
