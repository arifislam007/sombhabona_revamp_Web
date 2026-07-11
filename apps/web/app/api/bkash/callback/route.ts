import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeBkashPayment } from "@/lib/bkash";

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(request.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  if (!paymentID) {
    return NextResponse.redirect(`${siteUrl}/donate/failed`);
  }

  const donation = await prisma.donation.findUnique({ where: { bkashPaymentId: paymentID } });
  if (!donation) {
    return NextResponse.redirect(`${siteUrl}/donate/failed`);
  }

  if (status !== "success") {
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: status === "cancel" ? "CANCELLED" : "FAILED" },
    });
    return NextResponse.redirect(`${siteUrl}/donate/failed`);
  }

  try {
    const result = await executeBkashPayment(paymentID);
    const succeeded = result.transactionStatus === "Completed";

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: succeeded ? "COMPLETED" : "FAILED",
        bkashTrxId: result.trxID,
      },
    });

    return NextResponse.redirect(`${siteUrl}/donate/${succeeded ? "success" : "failed"}`);
  } catch {
    await prisma.donation.update({ where: { id: donation.id }, data: { status: "FAILED" } });
    return NextResponse.redirect(`${siteUrl}/donate/failed`);
  }
}
