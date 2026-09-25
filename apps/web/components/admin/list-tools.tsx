import Link from "next/link";
import { Download } from "lucide-react";
import { PAGE_SIZE, type ListFilters } from "@/lib/admin-data";

const STATUSES = ["COMPLETED", "PENDING", "FAILED", "CANCELLED"] as const;

const inputClass =
  "rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function qs(f: ListFilters, extra: Record<string, string | number> = {}) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.status) p.set("status", f.status);
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  for (const [k, v] of Object.entries(extra)) p.set(k, String(v));
  return p.toString();
}

// Plain GET form: works without JavaScript and keeps filters in the URL.
export function FilterBar({
  filters,
  exportType,
  withStatus = false,
}: {
  filters: ListFilters;
  exportType: string;
  withStatus?: boolean;
}) {
  return (
    <form method="get" className="mb-4 flex flex-wrap items-end gap-3" role="search">
      <div>
        <label htmlFor="f-q" className="mb-1 block text-xs font-medium text-muted-foreground">
          Search
        </label>
        <input id="f-q" name="q" defaultValue={filters.q} placeholder="Name, email, phone…" className={`${inputClass} w-56`} />
      </div>
      {withStatus && (
        <div>
          <label htmlFor="f-status" className="mb-1 block text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select id="f-status" name="status" defaultValue={filters.status} className={inputClass}>
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="f-from" className="mb-1 block text-xs font-medium text-muted-foreground">
          From
        </label>
        <input id="f-from" type="date" name="from" defaultValue={filters.from} className={inputClass} />
      </div>
      <div>
        <label htmlFor="f-to" className="mb-1 block text-xs font-medium text-muted-foreground">
          To
        </label>
        <input id="f-to" type="date" name="to" defaultValue={filters.to} className={inputClass} />
      </div>
      <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        Apply
      </button>
      <a href="?" className="px-2 py-2 text-sm text-muted-foreground underline hover:text-foreground">
        Clear
      </a>
      <a
        href={`/api/admin/export?${qs(filters, { type: exportType })}`}
        className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Download size={14} aria-hidden="true" /> Download CSV
      </a>
    </form>
  );
}

export function Pagination({ filters, total }: { filters: ListFilters; total: number }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const link = (p: number) => `?${qs(filters, { page: p })}`;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span aria-live="polite">
        {from}–{to} of {total.toLocaleString("en-US")}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={link(page - 1)} className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">
            Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={link(page + 1)} className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

export function TableShell({ children, empty, label }: { children: React.ReactNode; empty?: boolean; label: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
      {empty && <p className="p-8 text-center text-muted-foreground">No records match.</p>}
    </div>
  );
}

export const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";
export const td = "px-4 py-3 align-top text-foreground";

const statusStyle: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  CANCELLED: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[status] ?? ""}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
