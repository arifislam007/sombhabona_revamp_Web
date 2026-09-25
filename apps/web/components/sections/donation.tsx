"use client";

import { useEffect, useState } from "react";
import { Heart, Shield, GraduationCap, Wrench, DollarSign } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { programs } from "@/content/programs";
import { SectionHeading } from "@/components/section-heading";

const amounts = [100, 250, 500, 1500, 2500, 5000];
const MIN_AMOUNT = 10;
const MAX_AMOUNT = 500_000;

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border bg-input-background dark:bg-muted/30 text-foreground text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function Donation({ t }: { t: Dict }) {
  const [type, setType] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = custom ? Number(custom) : amount;
  const amountValid = Number.isInteger(finalAmount) && finalAmount >= MIN_AMOUNT && finalAmount <= MAX_AMOUNT;
  const [touched, setTouched] = useState(false);
  const nameError = touched && !donorName.trim();
  const amountError = touched && !amountValid;

  // Returning from bKash with the browser back button restores this page from cache with
  // `submitting` still true; re-enable the form.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function handleDonate() {
    setTouched(true);
    if (!donorName.trim() || !amountValid) {
      setError(
        !donorName.trim()
          ? "Please enter your name."
          : `Please enter a whole amount between ৳${MIN_AMOUNT} and ৳${MAX_AMOUNT.toLocaleString()}.`
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName,
          email: donorEmail,
          amount: finalAmount,
          recurring: type === "monthly",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to start payment.");
      window.location.href = data.bkashURL;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <section id="donation" className="py-20 lg:py-28 bg-muted/60 dark:bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.donation.label} title={t.donation.title} className="mb-14" />

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div role="group" aria-label="Donation frequency" className="flex rounded-xl overflow-hidden border border-border mb-6">
              {([["once", t.donation.once], ["monthly", t.donation.monthly]] as const).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={type === v}
                  onClick={() => setType(v)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                    type === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="mb-4 space-y-3">
              <div>
                <label htmlFor="donor-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Your full name
                </label>
                <input
                  id="donor-name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  aria-invalid={nameError || undefined}
                  aria-describedby={nameError ? "donation-error" : undefined}
                  className={`${inputClass} ${nameError ? "border-destructive" : "border-border"}`}
                />
              </div>
              <div>
                <label htmlFor="donor-email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email (optional, for your receipt)
                </label>
                <input
                  id="donor-email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className={`${inputClass} border-border`}
                />
              </div>
            </div>

            <div role="group" aria-label="Preset donation amount" className="grid grid-cols-3 gap-3 mb-4">
              {amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={amount === a && !custom}
                  onClick={() => {
                    setAmount(a);
                    setCustom("");
                  }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    amount === a && !custom
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  ৳{a.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="donor-custom-amount" className="block text-sm font-medium text-foreground mb-1.5">
                {t.donation.custom} (BDT)
              </label>
              <input
                id="donor-custom-amount"
                type="number"
                inputMode="numeric"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={1}
                value={custom}
                placeholder="Enter amount"
                onChange={(e) => {
                  setCustom(e.target.value);
                  setAmount(0);
                }}
                aria-invalid={amountError || undefined}
                aria-describedby={amountError ? "donation-error" : undefined}
                className={`${inputClass} ${amountError ? "border-destructive" : "border-border"}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              {[
                { title: t.donation.sponsor, icon: GraduationCap, amt: 1500 },
                { title: t.donation.sponsorTraining, icon: Wrench, amt: 2500 },
              ].map(({ title, icon: Icon, amt }) => (
                <button
                  key={title}
                  type="button"
                  aria-pressed={amount === amt && !custom}
                  onClick={() => {
                    setAmount(amt);
                    setCustom("");
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group text-left"
                >
                  <Icon size={14} aria-hidden="true" className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-medium text-foreground">{title}</span>
                </button>
              ))}
            </div>

            {type === "monthly" && <p className="text-xs text-muted-foreground mb-4">{t.donation.monthlyNote}</p>}

            <p id="donation-error" role="alert" className={error ? "text-sm text-destructive mb-4" : "sr-only"}>
              {error ?? ""}
            </p>

            <button
              type="button"
              onClick={handleDonate}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 border-2 border-accent-foreground bg-cta hover:bg-cta-hover text-accent-foreground py-4 rounded-xl font-bold text-base transition-colors shadow-lg shadow-black/20 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Heart size={18} aria-hidden="true" />
              {submitting
                ? "Redirecting to bKash..."
                : `${t.donation.donate} — ৳${(Number.isFinite(finalAmount) ? finalAmount : 0).toLocaleString()}${type === "monthly" ? " / month" : ""}`}
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Shield size={12} aria-hidden="true" /> Secure bKash payment
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground text-xl mb-6">{t.donation.causes}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {programs.map((program) => (
                <div key={program.slug} className="bg-card dark:bg-card rounded-2xl p-5 border border-border">
                  <h4 className="font-semibold text-foreground text-sm">{program.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{program.shortDescription}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
              <div className="flex items-start gap-3">
                <DollarSign size={22} aria-hidden="true" className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Your Impact</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>৳500 → School supplies and materials for one child</li>
                    <li>৳1,500 → One month of full sponsorship for one child</li>
                    <li>৳2,500 → Contribution toward one youth&apos;s ICT training</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
