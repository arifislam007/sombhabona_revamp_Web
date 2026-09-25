import { describe, expect, it } from "vitest";
import { createdAtRange, parseFilters, toCsv, totalPages, MAX_PAGE } from "@/lib/admin-data";

describe("parseFilters", () => {
  it("rejects impossible calendar dates instead of crashing later", () => {
    const f = parseFilters({ from: "2025-02-31", to: "2025-13-01" });
    expect(f.from).toBe("");
    expect(f.to).toBe("");
  });

  it("swaps a reversed range", () => {
    const f = parseFilters({ from: "2025-03-10", to: "2025-03-01" });
    expect(f.from).toBe("2025-03-01");
    expect(f.to).toBe("2025-03-10");
  });

  it.each([
    ["0", 1],
    ["-5", 1],
    ["abc", 1],
    ["3", 3],
    ["99999999999", MAX_PAGE],
  ])("page %s -> %s", (raw, expected) => {
    expect(parseFilters({ page: raw }).page).toBe(expected);
  });

  it("ignores unknown statuses", () => {
    expect(parseFilters({ status: "HACKED" }).status).toBe("");
    expect(parseFilters({ status: "COMPLETED" }).status).toBe("COMPLETED");
  });

  it("caps the search text", () => {
    expect(parseFilters({ q: "x".repeat(500) }).q).toHaveLength(100);
  });
});

describe("createdAtRange (Dhaka, UTC+6)", () => {
  const f = parseFilters({ from: "2025-03-01", to: "2025-03-01" });
  const range = createdAtRange(f)!;
  const inRange = (iso: string) => new Date(iso) >= (range.gte as Date) && new Date(iso) < (range.lt as Date);

  it("starts at local midnight and includes the whole 'to' day", () => {
    expect(inRange("2025-03-01T00:00:00+06:00")).toBe(true);
    expect(inRange("2025-03-01T23:59:59+06:00")).toBe(true);
    expect(inRange("2025-02-28T23:59:59+06:00")).toBe(false);
    expect(inRange("2025-03-02T00:00:00+06:00")).toBe(false);
  });

  it("is undefined when no dates are set", () => {
    expect(createdAtRange(parseFilters({}))).toBeUndefined();
  });
});

describe("totalPages", () => {
  it("is at least 1 and rounds up", () => {
    expect(totalPages(0)).toBe(1);
    expect(totalPages(50)).toBe(1);
    expect(totalPages(51)).toBe(2);
  });
});

describe("toCsv", () => {
  const body = (cell: unknown) => toCsv(["h"], [[cell]]).split("\r\n")[1];

  it("neutralises spreadsheet formulas, including after leading spaces", () => {
    for (const evil of ["=1+1", "+cmd|x", "-2+3", "@SUM(A1)", " =cmd"]) {
      expect(body(evil)).toMatch(/^"?'/);
    }
  });

  it("leaves real phone numbers alone but not look-alikes", () => {
    expect(body("+8801712345678")).toBe("+8801712345678");
    expect(body("01712-345678")).toBe("01712-345678");
    expect(body("-1-1")).toBe("'-1-1");
    expect(body("+---")).toBe("'+---");
  });

  it("quotes commas, quotes and newlines", () => {
    expect(body('a,"b"\nc')).toBe('"a,""b""\nc"');
  });

  it("has a BOM, CRLF endings, and handles null and Date", () => {
    const csv = toCsv(["a", "b"], [[null, new Date("2025-01-02T03:04:05Z")]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toBe("﻿a,b\r\n,2025-01-02T03:04:05.000Z\r\n");
  });
});
