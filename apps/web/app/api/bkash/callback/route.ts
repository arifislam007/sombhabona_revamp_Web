import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeBkashPayment } from "@/lib/bkash";
import { siteUrl } from "@/lib/site-url";
import { isVerified, markDonation, reconcileDonation, type Outcome } from "@/lib/donations";

// The browser is redirected here by bKash, so this GET must be safe to hit repeatedly
// and must never trust the query string for anything except "which payment".
export async function GET(request: Request) {
  const base = siteUrl();
  const go = (path: string) => NextResponse.redirect(`${base}/donate/${path}`);
  const toPage = (outcome: Outcome) =>
    go(outcome === "COMPLETED" ? "success" : outcome === "PENDING" ? "pending" : "failed");

  const { searchParams } = new URL(request.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  if (!paymentID) return go("failed");

  const donation = await prisma.donation.findUnique({ where: { bkashPaymentId: paymentID } });
  if (!donation) return go("failed");

  // Already settled (refresh, replay, forged link): report the stored outcome, change nothing.
  if (donation.status !== "PENDING") return toPage(donation.status);

  if (status !== "success") {
    // The URL says cancelled/failed, but anyone with the paymentID could have typed that.
    // Only record it if bKash agrees no money was taken.
    const outcome = await reconcileDonation(donation);
    // Still PENDING means bKash shows it as unpaid (or could not be reached): the donor
    // cancelled or abandoned it, so say "not completed"; the row expires after 24h.
    return outcome === "PENDING" ? go("failed") : toPage(outcome);
  }

  try {
    const result = await executeBkashPayment(paymentID);
    const verified = isVerified(donation, result);

    if (!verified) {
      console.error("bKash verification mismatch", {
        donationId: donation.id,
        paymentID,
        transactionStatus: result.transactionStatus,
      });
    }

    await markDonation(donation.id, verified ? "COMPLETED" : "FAILED", result.trxID);
    return verified ? go("success") : go("failed");
  } catch (err) {
    // A timeout or error here does NOT mean the donor was not charged. Ask bKash before deciding.
    console.error("bKash execute failed; reconciling", { donationId: donation.id, paymentID, err });
    return toPage(await reconcileDonation(donation));
  }
}
