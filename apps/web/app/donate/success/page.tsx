import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function DonateSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <CheckCircle size={56} className="text-secondary mb-6" />
      <h1 className="font-display text-3xl font-bold">Thank you for your donation!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Your bKash payment was completed successfully. A confirmation will be sent to your email if provided.
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
