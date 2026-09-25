import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-foreground">Sombhabona Admin</h1>
        {adminEnabled() ? (
          <>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Staff only. Enter the admin password.</p>
            <LoginForm />
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            The admin area is turned off. Set <code>ADMIN_PASSWORD</code> in the server environment to enable it.
          </p>
        )}
      </div>
    </main>
  );
}
