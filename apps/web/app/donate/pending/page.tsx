import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";

export const metadata: Metadata = { title: "Confirming your payment", robots: { index: false } };

export default function DonatePendingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <Clock size={56} aria-hidden="true" className="text-accent mb-6" />
      <h1 className="font-display text-3xl font-bold">We are confirming your payment</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We could not get a final answer from bKash yet. If money was taken from your account, we will record your
        donation once bKash confirms it. Please do not pay again. Contact us if you have any questions.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
