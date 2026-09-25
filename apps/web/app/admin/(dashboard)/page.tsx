import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  PAGE_SIZE,
  donationWhere,
  formatDate,
  formatTaka,
  parseFilters,
  totalPages,
  type SearchParams,
} from "@/lib/admin-data";
import { CheckPendingButton } from "@/components/admin/check-pending-button";
import { FilterBar, Pagination, StatusBadge, TableShell, td, th } from "@/components/admin/list-tools";

export const metadata: Metadata = { title: "Donations" };

export default async function DonationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const f = parseFilters(await searchParams);
  const where = donationWhere(f);
  const anyStatus = donationWhere({ ...f, status: "" }); // same search/date range, any status

  const total = await prisma.donation.count({ where });
  const page = Math.min(f.page, totalPages(total));
  const [rows, completed, pending] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    // Money received: always COMPLETED only.
    prisma.donation.aggregate({ where: { ...anyStatus, status: "COMPLETED" }, _sum: { amount: true }, _count: true }),
    prisma.donation.count({ where: { ...anyStatus, status: "PENDING" } }),
  ]);

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Donations</h1>

      <dl className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Received (completed)</dt>
          <dd className="mt-1 font-display text-3xl font-bold text-foreground">{formatTaka(completed._sum.amount ?? 0)}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completed donations</dt>
          <dd className="mt-1 font-display text-3xl font-bold text-foreground">{completed._count.toLocaleString("en-US")}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending (not paid)</dt>
          <dd className="mt-1 font-display text-3xl font-bold text-foreground">{pending.toLocaleString("en-US")}</dd>
        </div>
      </dl>

      {pending > 0 && <CheckPendingButton />}
      <FilterBar filters={f} exportType="donations" withStatus />

      <TableShell label="Donations" empty={rows.length === 0}>
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th scope="col" className={th}>Date (Dhaka)</th>
            <th scope="col" className={th}>Donor</th>
            <th scope="col" className={th}>Contact</th>
            <th scope="col" className={`${th} text-right`}>Amount</th>
            <th scope="col" className={th}>Status</th>
            <th scope="col" className={th}>bKash trxID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={`${td} whitespace-nowrap`}>{formatDate(r.createdAt)}</td>
              <td className={td}>
                {r.donorName}
                {r.recurring && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">monthly pledge</span>}
              </td>
              <td className={td}>
                {r.email ?? "—"}
                {r.phone && <div className="text-muted-foreground">{r.phone}</div>}
              </td>
              <td className={`${td} text-right font-semibold tabular-nums`}>{formatTaka(r.amount)}</td>
              <td className={td}>
                <StatusBadge status={r.status} />
              </td>
              <td className={`${td} font-mono text-xs`}>{r.bkashTrxId ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <Pagination filters={{ ...f, page }} total={total} />
    </>
  );
}
