import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { PAGE_SIZE, contactWhere, formatDate, parseFilters, totalPages, type SearchParams } from "@/lib/admin-data";
import { FilterBar, Pagination, TableShell, td, th } from "@/components/admin/list-tools";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const f = parseFilters(await searchParams);
  const where = contactWhere(f);
  const total = await prisma.contactSubmission.count({ where });
  const page = Math.min(f.page, totalPages(total));
  const rows = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Contact messages</h1>
      <FilterBar filters={f} exportType="messages" />
      <TableShell label="Contact messages" empty={rows.length === 0}>
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th scope="col" className={th}>Date (Dhaka)</th>
            <th scope="col" className={th}>From</th>
            <th scope="col" className={th}>Subject</th>
            <th scope="col" className={th}>Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={`${td} whitespace-nowrap`}>{formatDate(r.createdAt)}</td>
              <td className={td}>
                {r.name}
                <div className="text-muted-foreground">{r.email}</div>
              </td>
              <td className={td}>{r.subject}</td>
              <td className={`${td} max-w-md whitespace-pre-wrap break-words`}>{r.message}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      <Pagination filters={{ ...f, page }} total={total} />
    </>
  );
}
