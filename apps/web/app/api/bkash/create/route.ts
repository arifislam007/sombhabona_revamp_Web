import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createBkashPayment } from "@/lib/bkash";
import { guardRequest } from "@/lib/api-guard";
import { siteUrl } from "@/lib/site-url";

const schema = z
  .object({
    donorName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254).optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(20)
      .regex(/^[+\d][\d\s-]*$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    amount: z.number().int().min(10).max(500_000),
    recurring: z.boolean().optional(),
  })
  .strict();

export async function POST(request: Request) {
  const blocked = guardRequest(request, "bkash-create", { limit: 10, windowMs: 10 * 60_000 });
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid donation details." }, { status: 400 });
  }

  const donation = await prisma.donation.create({
    data: {
      donorName: parsed.data.donorName,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      amount: parsed.data.amount,
      recurring: parsed.data.recurring ?? false,
      method: "BKASH",
      status: "PENDING",
    },
  });

  try {
    const payment = await createBkashPayment({
      amount: parsed.data.amount,
      payerReference: donation.id,
      callbackURL: `${siteUrl()}/api/bkash/callback`,
      merchantInvoiceNumber: donation.id,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: { bkashPaymentId: payment.paymentID },
    });

    return NextResponse.json({ bkashURL: payment.bkashURL });
  } catch (err) {
    // Log details server-side; never return internals (env var names, upstream errors) to the browser.
    console.error("Failed to start bKash payment", { donationId: donation.id, err });
    await prisma.donation.update({ where: { id: donation.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Unable to start bKash payment." }, { status: 502 });
  }
}
