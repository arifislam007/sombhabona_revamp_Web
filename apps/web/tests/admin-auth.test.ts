import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  adminEnabled,
  createSessionToken,
  passwordMatches,
  sessionCookieName,
  verifySessionToken,
} from "@/lib/admin-auth";

const SECRET = "s".repeat(40);

beforeEach(() => {
  vi.stubEnv("ADMIN_PASSWORD", "correct horse battery staple");
  vi.stubEnv("ADMIN_SESSION_SECRET", SECRET);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org");
});
afterEach(() => vi.unstubAllEnvs());

describe("adminEnabled", () => {
  it("needs a password AND a long enough secret", () => {
    expect(adminEnabled()).toBe(true);
    vi.stubEnv("ADMIN_SESSION_SECRET", "short");
    expect(adminEnabled()).toBe(false);
    vi.stubEnv("ADMIN_SESSION_SECRET", SECRET);
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(adminEnabled()).toBe(false);
  });
});

describe("session tokens", () => {
  it("accepts a fresh token", () => {
    expect(verifySessionToken(createSessionToken())).toBe(true);
  });

  it("rejects missing, malformed, tampered and expired tokens", () => {
    const good = createSessionToken();
    const [exp, sig] = good.split(".");
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken("garbage")).toBe(false);
    expect(verifySessionToken(`${exp}.zzzz`)).toBe(false); // non-hex signature
    expect(verifySessionToken(`${Number(exp) + 9999}.${sig}`)).toBe(false); // extended expiry
    expect(verifySessionToken(`1000.${sig}`)).toBe(false); // expired
  });

  it("is invalidated by changing the session secret", () => {
    const token = createSessionToken();
    vi.stubEnv("ADMIN_SESSION_SECRET", "t".repeat(40));
    expect(verifySessionToken(token)).toBe(false);
  });

  it("is not derived from the password, so a cookie cannot be used to guess it", () => {
    const token = createSessionToken();
    vi.stubEnv("ADMIN_PASSWORD", "a different password");
    expect(verifySessionToken(token)).toBe(true);
  });

  it("is refused when admin is disabled", () => {
    const token = createSessionToken();
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(verifySessionToken(token)).toBe(false);
  });
});

describe("passwordMatches and cookie name", () => {
  it("compares exactly", () => {
    expect(passwordMatches("correct horse battery staple")).toBe(true);
    expect(passwordMatches("correct horse battery stapl")).toBe(false);
    expect(passwordMatches("")).toBe(false);
  });

  it("uses the __Host- prefix only on https", () => {
    expect(sessionCookieName()).toBe("__Host-sb_admin");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(sessionCookieName()).toBe("sb_admin");
  });
});
