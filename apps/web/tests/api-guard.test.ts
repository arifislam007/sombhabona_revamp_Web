import { afterEach, describe, expect, it, vi } from "vitest";
import { checkFailures, clearFailures, clientIp, guardRequest, recordFailure } from "@/lib/api-guard";

const req = (headers: Record<string, string> = {}) => new Request("http://localhost/api/x", { method: "POST", headers });

afterEach(() => vi.unstubAllEnvs());

describe("clientIp behind a proxy", () => {
  it("uses the entry our own proxy appended, not a forged one", () => {
    // the attacker sent 1.2.3.4; nginx appended the real peer 9.9.9.9
    expect(clientIp(req({ "x-forwarded-for": "1.2.3.4, 9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("counts extra trusted proxies with TRUSTED_PROXY_HOPS", () => {
    vi.stubEnv("TRUSTED_PROXY_HOPS", "2");
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6, 9.9.9.9, 10.0.0.2" }))).toBe("9.9.9.9");
  });

  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(req({ "x-real-ip": "5.5.5.5" }))).toBe("5.5.5.5");
    expect(clientIp(req())).toBe("unknown");
  });

  it("rotating the forged left-hand value does not create a new bucket", () => {
    const opts = { limit: 3, windowMs: 60_000 };
    const results = [1, 2, 3, 4, 5].map(
      (i) => guardRequest(req({ "x-forwarded-for": `spoof-${i}, 8.8.8.8` }), "rot-test", opts)?.status ?? 200
    );
    expect(results).toEqual([200, 200, 200, 429, 429]);
  });
});

describe("guardRequest origin checks", () => {
  const opts = { limit: 100, windowMs: 60_000 };

  it("blocks cross-site browser requests and mismatched origins", () => {
    expect(guardRequest(req({ "sec-fetch-site": "cross-site", "x-forwarded-for": "7.7.7.1" }), "o1", opts)?.status).toBe(403);
    expect(
      guardRequest(req({ origin: "https://evil.example", host: "localhost", "x-forwarded-for": "7.7.7.2" }), "o2", opts)?.status
    ).toBe(403);
  });

  it("does not trust X-Forwarded-Host", () => {
    const r = req({
      origin: "https://evil.example",
      "x-forwarded-host": "evil.example",
      host: "real.example",
      "x-forwarded-for": "7.7.7.3",
    });
    expect(guardRequest(r, "o3", opts)?.status).toBe(403);
  });

  it("allows same-origin and header-less clients", () => {
    expect(
      guardRequest(req({ origin: "http://localhost", host: "localhost", "x-forwarded-for": "7.7.7.4" }), "o4", opts)
    ).toBeNull();
    expect(guardRequest(req({ "x-forwarded-for": "7.7.7.5" }), "o5", opts)).toBeNull();
  });
});

describe("failed-login limiting", () => {
  const perIp = { limit: 3, windowMs: 60_000 };
  const global = { limit: 6, windowMs: 60_000 };
  const from = (ip: string) => req({ "x-forwarded-for": ip });

  it("only failures count, and success resets the visitor", () => {
    const r = from("4.4.4.4");
    for (let i = 0; i < 3; i++) {
      expect(checkFailures(r, "L1", perIp, global)).toBeNull();
      recordFailure(r, "L1", perIp, global);
    }
    expect(checkFailures(r, "L1", perIp, global)?.status).toBe(429);
    clearFailures(r, "L1");
    expect(checkFailures(r, "L1", perIp, global)).toBeNull();
  });

  it("a global cap stops attackers who rotate addresses", () => {
    for (let i = 0; i < 6; i++) recordFailure(from(`3.3.3.${i}`), "L2", perIp, global);
    expect(checkFailures(from("3.3.3.200"), "L2", perIp, global)?.status).toBe(429);
  });
});
