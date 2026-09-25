"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function CheckPendingButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/reconcile", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Check failed.");
      setMessage(
        data.checked === 0
          ? "No pending donations older than 10 minutes."
          : `Checked ${data.checked}: ${data.COMPLETED} completed, ${data.FAILED + data.CANCELLED} closed, ${data.PENDING} still pending.`
      );
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Check failed.");
    }
    setBusy(false);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <RefreshCw size={14} aria-hidden="true" className={busy ? "animate-spin" : ""} /> Check pending with bKash
      </button>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
