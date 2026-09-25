import { prisma } from "@/lib/prisma";
import type { Donation } from "@/lib/generated/prisma/client";
import { queryBkashPayment } from "@/lib/bkash";

export type PaymentFacts = {
  paymentID?: string;
  transactionStatus?: string;
  amount?: string;
  merchantInvoiceNumber?: string;
  trxID?: string;
};

// A payment only counts if bKash says Completed AND it is the payment we created and
// for exactly the amount we stored. bKash's status endpoint omits the invoice number, so
// it is checked only when present (the paymentID is already unique to one donation).
export function isVerified(donation: Pick<Donation, "id" | "amount" | "bkashPaymentId">, facts: PaymentFacts): boolean {
  const amount = Number(facts.amount);
  return (
    facts.transactionStatus === "Completed" &&
    facts.paymentID === donation.bkashPaymentId &&
    (facts.merchantInvoiceNumber === undefined || facts.merchantInvoiceNumber === donation.id) &&
    Number.isFinite(amount) &&
    amount === donation.amount
  );
}

export type Outcome = "COMPLETED" | "FAILED" | "CANCELLED" | "PENDING";

// Atomic PENDING -> final transition; a concurrent request cannot overwrite it.
export async function markDonation(
  id: string,
  status: "COMPLETED" | "FAILED" | "CANCELLED",
  bkashTrxId?: string
): Promise<void> {
  await prisma.donation.updateMany({
    where: { id, status: "PENDING" },
    data: { status, ...(bkashTrxId ? { bkashTrxId } : {}) },
  });
}

const EXPIRE_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * Decide a PENDING donation from bKash's own records.
 * Never marks FAILED/CANCELLED unless bKash confirms the money was not taken;
 * on any doubt (network error, unknown status) it stays PENDING to be retried.
 */
export async function reconcileDonation(donation: Donation): Promise<Outcome> {
  if (donation.status !== "PENDING") return donation.status;
  if (!donation.bkashPaymentId) return "PENDING";

  let facts: PaymentFacts;
  try {
    facts = await queryBkashPayment(donation.bkashPaymentId);
  } catch (err) {
    console.error("bKash query failed", { donationId: donation.id, err });
    return "PENDING";
  }

  if (isVerified(donation, facts)) {
    await markDonation(donation.id, "COMPLETED", facts.trxID);
    return "COMPLETED";
  }

  if (facts.transactionStatus === "Completed") {
    // Money was taken but details do not match what we stored: needs a human.
    console.error("bKash completed payment does not match donation", {
      donationId: donation.id,
      paymentID: donation.bkashPaymentId,
    });
    return "PENDING";
  }

  if (facts.transactionStatus === "Failed" || facts.transactionStatus === "Cancelled") {
    const status = facts.transactionStatus === "Cancelled" ? "CANCELLED" : "FAILED";
    await markDonation(donation.id, status);
    return status;
  }

  // Still "Initiated": the donor never paid. Expire abandoned checkouts after a day.
  if (Date.now() - donation.createdAt.getTime() > EXPIRE_AFTER_MS) {
    await markDonation(donation.id, "CANCELLED");
    return "CANCELLED";
  }
  return "PENDING";
}
