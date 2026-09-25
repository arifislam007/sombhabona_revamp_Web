import { beforeEach, describe, expect, it, vi } from "vitest";

type Row = {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  bkashPaymentId: string | null;
  bkashTrxId: string | null;
  createdAt: Date;
};

const db = vi.hoisted(() => ({ row: null as Row | null, transitions: 0 }));
const bkash = vi.hoisted(() => ({ execute: vi.fn(), query: vi.fn() }));

// Tiny in-memory stand-in for the Donation table, with the same atomic-update semantics.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    donation: {
      findUnique: vi.fn(async ({ where }: { where: { bkashPaymentId: string } }) =>
        db.row && db.row.bkashPaymentId === where.bkashPaymentId ? { ...db.row } : null
      ),
      updateMany: vi.fn(async ({ where, data }: { where: { id: string; status: string }; data: Partial<Row> }) => {
        if (db.row && db.row.id === where.id && db.row.status === where.status) {
          Object.assign(db.row, data);
          db.transitions += 1;
          return { count: 1 };
        }
        return { count: 0 };
      }),
    },
  },
}));
vi.mock("@/lib/bkash", () => ({ executeBkashPayment: bkash.execute, queryBkashPayment: bkash.query }));

import { GET } from "@/app/api/bkash/callback/route";

const PAYMENT = "TR0011abc";
const call = (query: string) => GET(new Request(`http://localhost/api/bkash/callback?${query}`));
const location = (r: Response) => new URL(r.headers.get("location")!).pathname;
const completed = (over: Record<string, unknown> = {}) => ({
  paymentID: PAYMENT,
  transactionStatus: "Completed",
  amount: "500.00",
  merchantInvoiceNumber: "don_1",
  trxID: "TRX123",
  statusCode: "0000",
  ...over,
});

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  bkash.execute.mockReset();
  bkash.query.mockReset();
  db.transitions = 0;
  db.row = {
    id: "don_1",
    amount: 500,
    status: "PENDING",
    bkashPaymentId: PAYMENT,
    bkashTrxId: null,
    createdAt: new Date(),
  };
});

describe("bKash callback: success path", () => {
  it("completes a verified payment and stores the transaction id", async () => {
    bkash.execute.mockResolvedValue(completed());
    const res = await call(`paymentID=${PAYMENT}&status=success`);
    expect(location(res)).toBe("/donate/success");
    expect(db.row).toMatchObject({ status: "COMPLETED", bkashTrxId: "TRX123" });
  });

  it("fails the donation when the amount does not match", async () => {
    bkash.execute.mockResolvedValue(completed({ amount: "5.00" }));
    expect(location(await call(`paymentID=${PAYMENT}&status=success`))).toBe("/donate/failed");
    expect(db.row?.status).toBe("FAILED");
  });

  it("fails the donation when the invoice belongs to a different donation", async () => {
    bkash.execute.mockResolvedValue(completed({ merchantInvoiceNumber: "other" }));
    expect(location(await call(`paymentID=${PAYMENT}&status=success`))).toBe("/donate/failed");
    expect(db.row?.status).toBe("FAILED");
  });

  it("does not treat a non-Completed answer as paid", async () => {
    bkash.execute.mockResolvedValue(completed({ transactionStatus: "Initiated" }));
    await call(`paymentID=${PAYMENT}&status=success`);
    expect(db.row?.status).toBe("FAILED");
  });
});

describe("bKash callback: replays and forgeries", () => {
  it("a replay of a completed donation changes nothing and never calls bKash", async () => {
    db.row!.status = "COMPLETED";
    const res = await call(`paymentID=${PAYMENT}&status=cancel`);
    expect(location(res)).toBe("/donate/success");
    expect(db.row?.status).toBe("COMPLETED");
    expect(bkash.execute).not.toHaveBeenCalled();
    expect(bkash.query).not.toHaveBeenCalled();
  });

  it("two simultaneous callbacks produce exactly one transition", async () => {
    bkash.execute.mockResolvedValue(completed());
    await Promise.all([call(`paymentID=${PAYMENT}&status=success`), call(`paymentID=${PAYMENT}&status=success`)]);
    expect(db.transitions).toBe(1);
    expect(db.row?.status).toBe("COMPLETED");
  });

  it("unknown or missing payment ids go to the failed page", async () => {
    expect(location(await call("paymentID=nope&status=success"))).toBe("/donate/failed");
    expect(location(await call("status=success"))).toBe("/donate/failed");
  });

  it("a forged ?status=cancel cannot cancel a payment bKash says is completed", async () => {
    bkash.query.mockResolvedValue(completed({ merchantInvoiceNumber: undefined }));
    const res = await call(`paymentID=${PAYMENT}&status=cancel`);
    expect(location(res)).toBe("/donate/success");
    expect(db.row?.status).toBe("COMPLETED");
  });

  it("a forged ?status=cancel on an unpaid payment leaves it PENDING (nothing is recorded from the URL)", async () => {
    bkash.query.mockResolvedValue({ paymentID: PAYMENT, transactionStatus: "Initiated", statusCode: "0000" });
    const res = await call(`paymentID=${PAYMENT}&status=cancel`);
    expect(location(res)).toBe("/donate/failed");
    expect(db.row?.status).toBe("PENDING");
  });

  it("records CANCELLED only when bKash itself reports it", async () => {
    bkash.query.mockResolvedValue({ paymentID: PAYMENT, transactionStatus: "Cancelled", statusCode: "0000" });
    await call(`paymentID=${PAYMENT}&status=cancel`);
    expect(db.row?.status).toBe("CANCELLED");
  });
});

describe("bKash callback: errors must never lose a paid donation", () => {
  it("execute times out but bKash says Completed: the donation is recorded", async () => {
    bkash.execute.mockRejectedValue(new Error("timeout"));
    bkash.query.mockResolvedValue(completed({ merchantInvoiceNumber: undefined }));
    const res = await call(`paymentID=${PAYMENT}&status=success`);
    expect(location(res)).toBe("/donate/success");
    expect(db.row).toMatchObject({ status: "COMPLETED", bkashTrxId: "TRX123" });
  });

  it("execute AND query both fail: stays PENDING and the donor sees the pending page", async () => {
    bkash.execute.mockRejectedValue(new Error("timeout"));
    bkash.query.mockRejectedValue(new Error("down"));
    const res = await call(`paymentID=${PAYMENT}&status=success`);
    expect(location(res)).toBe("/donate/pending");
    expect(db.row?.status).toBe("PENDING");
  });

  it("execute fails and bKash reports it still unpaid: stays PENDING", async () => {
    bkash.execute.mockRejectedValue(new Error("boom"));
    bkash.query.mockResolvedValue({ paymentID: PAYMENT, transactionStatus: "Initiated", statusCode: "0000" });
    expect(location(await call(`paymentID=${PAYMENT}&status=success`))).toBe("/donate/pending");
    expect(db.row?.status).toBe("PENDING");
  });

  it("a completed payment with a different amount is not marked paid and is left for a human", async () => {
    bkash.execute.mockRejectedValue(new Error("timeout"));
    bkash.query.mockResolvedValue(completed({ amount: "1.00" }));
    await call(`paymentID=${PAYMENT}&status=success`);
    expect(db.row?.status).toBe("PENDING");
  });

  it("abandoned checkouts expire after a day", async () => {
    db.row!.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
    bkash.query.mockResolvedValue({ paymentID: PAYMENT, transactionStatus: "Initiated", statusCode: "0000" });
    await call(`paymentID=${PAYMENT}&status=cancel`);
    expect(db.row?.status).toBe("CANCELLED");
  });
});
