import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { PAGE_SIZE, formatDate, parseFilters, subscriberWhere, totalPages, type SearchParams } from "@/lib/admin-data";
import { FilterBar, Pagination, TableShell, td, th } from "@/components/admin/list-tools";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const f = parseFilters(await searchParams);
  const where = subscriberWhere(f);
  const total = await prisma.newsletterSubscriber.count({ where });
  const page = Math.min(f.page, totalPages(total));
  const rows = await prisma.newsletterSubscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Newsletter subscribers</h1>
      <FilterBar filters={f} exportType="subscribers" />
      <TableShell label="Newsletter subscribers" empty={rows.length === 0}>
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th scope="col" className={th}>Subscribed (Dhaka)</th>
            <th scope="col" className={th}>Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={`${td} whitespace-nowrap`}>{formatDate(r.createdAt)}</td>
              <td className={td}>{r.email}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      <Pagination filters={{ ...f, page }} total={total} />
    </>
  );
}
