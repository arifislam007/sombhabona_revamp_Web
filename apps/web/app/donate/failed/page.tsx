import Link from "next/link";
import { XCircle } from "lucide-react";

export default function DonateFailedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <XCircle size={56} className="text-destructive mb-6" />
      <h1 className="font-display text-3xl font-bold">Payment not completed</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Your bKash payment was not completed. No amount has been charged. Please try again.
      </p>
      <Link
        href="/#donation"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Try Again
      </Link>
    </div>
  );
}
