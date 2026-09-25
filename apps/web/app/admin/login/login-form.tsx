"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(res.status === 429 ? "Too many attempts. Try again in a few minutes." : (data.error ?? "Login failed."));
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-foreground">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "admin-login-error" : undefined}
        className="w-full rounded-xl border border-border bg-input-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <p id="admin-login-error" role="alert" className={error ? "mt-3 text-sm text-destructive" : "sr-only"}>
        {error ?? ""}
      </p>
      <button
        type="submit"
        disabled={busy || !password}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
