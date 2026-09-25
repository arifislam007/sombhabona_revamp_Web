import type { Prisma } from "./generated/prisma/client";
import { DonationStatus } from "./generated/prisma/enums";

export const PAGE_SIZE = 50;
export const EXPORT_LIMIT = 10_000;

export type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

export type ListFilters = {
  q: string;
  status: DonationStatus | "";
  from: string;
  to: string;
  page: number;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
// Staff are in Bangladesh, so day boundaries are Dhaka time (UTC+6).
const dhakaStart = (d: string) => new Date(`${d}T00:00:00+06:00`);

// Shape check AND a real calendar date (rejects 2025-02-31, which would crash the query).
function validDate(d: string): boolean {
  if (!DATE.test(d)) return false;
  const [y, m, day] = d.split("-").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, day));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === day;
}

export const MAX_PAGE = 10_000;
export const totalPages = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

export function parseFilters(sp: SearchParams): ListFilters {
  const status = first(sp.status);
  let from = validDate(first(sp.from)) ? first(sp.from) : "";
  let to = validDate(first(sp.to)) ? first(sp.to) : "";
  if (from && to && from > to) [from, to] = [to, from]; // ISO dates sort as strings
  const page = Number.parseInt(first(sp.page), 10);
  return {
    q: first(sp.q).slice(0, 100),
    status: (Object.values(DonationStatus) as string[]).includes(status) ? (status as DonationStatus) : "",
    from,
    to,
    page: Number.isFinite(page) && page > 0 ? Math.min(page, MAX_PAGE) : 1,
  };
}

export function createdAtRange(f: ListFilters): Prisma.DateTimeFilter | undefined {
  if (!f.from && !f.to) return undefined;
  const range: Prisma.DateTimeFilter = {};
  if (f.from) range.gte = dhakaStart(f.from);
  if (f.to) {
    const end = dhakaStart(f.to);
    end.setUTCDate(end.getUTCDate() + 1); // inclusive of the whole "to" day
    range.lt = end;
  }
  return range;
}

const contains = (q: string) => ({ contains: q, mode: "insensitive" as const });

function dateClause(f: ListFilters): { createdAt?: Prisma.DateTimeFilter } {
  const range = createdAtRange(f);
  return range ? { createdAt: range } : {};
}

export function donationWhere(f: ListFilters): Prisma.DonationWhereInput {
  return {
    ...(f.status ? { status: f.status } : {}),
    ...dateClause(f),
    ...(f.q
      ? {
          OR: [
            { donorName: contains(f.q) },
            { email: contains(f.q) },
            { phone: contains(f.q) },
            { bkashTrxId: contains(f.q) },
            { bkashPaymentId: contains(f.q) },
          ],
        }
      : {}),
  };
}

export function contactWhere(f: ListFilters): Prisma.ContactSubmissionWhereInput {
  return {
    ...dateClause(f),
    ...(f.q
      ? { OR: [{ name: contains(f.q) }, { email: contains(f.q) }, { subject: contains(f.q) }, { message: contains(f.q) }] }
      : {}),
  };
}

export function volunteerWhere(f: ListFilters): Prisma.VolunteerApplicationWhereInput {
  return {
    ...dateClause(f),
    ...(f.q
      ? {
          OR: [
            { name: contains(f.q) },
            { email: contains(f.q) },
            { phone: contains(f.q) },
            { skill: contains(f.q) },
            { message: contains(f.q) },
          ],
        }
      : {}),
  };
}

export function subscriberWhere(f: ListFilters): Prisma.NewsletterSubscriberWhereInput {
  return {
    ...dateClause(f),
    ...(f.q ? { email: contains(f.q) } : {}),
  };
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});
export const formatDate = (d: Date) => dateFmt.format(d);
export const formatTaka = (n: number) => `৳${n.toLocaleString("en-US")}`;

// --- CSV ---------------------------------------------------------------------------

// Cells starting with = + - @ are evaluated as formulas by Excel/Sheets; neutralise them
// so a malicious form submission cannot run code on a staff member's machine.
function csvCell(value: unknown): string {
  let s = value instanceof Date ? value.toISOString() : String(value ?? "");
  // A real phone number starts with a digit (optionally +); "-1-1" or "+---" are not exempt.
  const looksLikePhone = /^\+?\d[\d\s-]*$/.test(s);
  // Spreadsheets ignore leading spaces, so test the trimmed value too (" =cmd" is still a formula).
  if (!looksLikePhone && /^[=+\-@\t\r]/.test(s.trimStart())) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(csvCell).join(","));
  // BOM so Excel opens Bengali text as UTF-8.
  return `﻿${lines.join("\r\n")}\r\n`;
}
