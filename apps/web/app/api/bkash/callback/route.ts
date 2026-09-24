import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeBkashPayment } from "@/lib/bkash";
import { siteUrl } from "@/lib/site-url";

// The browser is redirected here by bKash, so this GET must be safe to hit repeatedly
// and must never trust the query string for anything except "which payment".
export async function GET(request: Request) {
  const base = siteUrl();
  const failed = () => NextResponse.redirect(`${base}/donate/failed`);
  const succeeded = () => NextResponse.redirect(`${base}/donate/success`);

  const { searchParams } = new URL(request.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  if (!paymentID) return failed();

  const donation = await prisma.donation.findUnique({ where: { bkashPaymentId: paymentID } });
  if (!donation) return failed();

  // Already settled (refresh, replay, forged link): report the stored outcome, change nothing.
  if (donation.status !== "PENDING") {
    return donation.status === "COMPLETED" ? succeeded() : failed();
  }

  if (status !== "success") {
    await prisma.donation.updateMany({
      where: { id: donation.id, status: "PENDING" },
      data: { status: status === "cancel" ? "CANCELLED" : "FAILED" },
    });
    return failed();
  }

  try {
    const result = await executeBkashPayment(paymentID);

    // Only trust bKash's answer, and only if it matches what we asked for.
    const verified =
      result.transactionStatus === "Completed" &&
      result.paymentID === paymentID &&
      result.merchantInvoiceNumber === donation.id &&
      Number(result.amount) === donation.amount;

    if (!verified) {
      console.error("bKash verification mismatch", {
        donationId: donation.id,
        paymentID,
        transactionStatus: result.transactionStatus,
      });
    }

    // Atomic PENDING -> final transition; a concurrent request cannot overwrite it.
    await prisma.donation.updateMany({
      where: { id: donation.id, status: "PENDING" },
      data: { status: verified ? "COMPLETED" : "FAILED", bkashTrxId: result.trxID },
    });

    return verified ? succeeded() : failed();
  } catch (err) {
    console.error("bKash execute failed", { donationId: donation.id, paymentID, err });
    await prisma.donation.updateMany({
      where: { id: donation.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
    return failed();
  }
}
