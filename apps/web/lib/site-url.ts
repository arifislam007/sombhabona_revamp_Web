// Public origin used for payment callbacks and redirects. Read at request time.
export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SITE_URL");
  }
  return "http://localhost:3000";
}
