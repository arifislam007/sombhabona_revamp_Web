import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import {
  EXPORT_LIMIT,
  contactWhere,
  donationWhere,
  parseFilters,
  subscriberWhere,
  toCsv,
  volunteerWhere,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const f = parseFilters(Object.fromEntries(params));
  try {
    return await buildExport(type, f);
  } catch (err) {
    console.error("Admin export failed", err);
    return NextResponse.json({ error: "Export failed. Please try again." }, { status: 500 });
  }
}

const FILENAMES = {
  donations: "donations",
  messages: "messages",
  volunteers: "volunteers",
  subscribers: "subscribers",
} as const;

async function buildExport(type: string | null, f: ReturnType<typeof parseFilters>) {
  const orderBy = { createdAt: "desc" as const };
  const take = EXPORT_LIMIT;
  let csv: string;
  if (type === "donations") {
    const rows = await prisma.donation.findMany({ where: donationWhere(f), orderBy, take });
    csv = toCsv(
      ["Date (UTC)", "Donor", "Email", "Phone", "Amount (BDT)", "Recurring", "Status", "bKash trxID", "bKash paymentID", "ID"],
      rows.map((r) => [r.createdAt, r.donorName, r.email, r.phone, r.amount, r.recurring, r.status, r.bkashTrxId, r.bkashPaymentId, r.id])
    );
  } else if (type === "messages") {
    const rows = await prisma.contactSubmission.findMany({ where: contactWhere(f), orderBy, take });
    csv = toCsv(
      ["Date (UTC)", "Name", "Email", "Subject", "Message", "ID"],
      rows.map((r) => [r.createdAt, r.name, r.email, r.subject, r.message, r.id])
    );
  } else if (type === "volunteers") {
    const rows = await prisma.volunteerApplication.findMany({ where: volunteerWhere(f), orderBy, take });
    csv = toCsv(
      ["Date (UTC)", "Name", "Email", "Phone", "Skill", "Message", "ID"],
      rows.map((r) => [r.createdAt, r.name, r.email, r.phone, r.skill, r.message, r.id])
    );
  } else if (type === "subscribers") {
    const rows = await prisma.newsletterSubscriber.findMany({ where: subscriberWhere(f), orderBy, take });
    csv = toCsv(["Date (UTC)", "Email", "ID"], rows.map((r) => [r.createdAt, r.email, r.id]));
  } else {
    return NextResponse.json({ error: "Unknown export type." }, { status: 400 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const name = FILENAMES[type as keyof typeof FILENAMES];
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sombhabona-${name}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
