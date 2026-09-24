# Sombhabona Website — Product & Technical Specification

Status: draft v1 (2026-09-24). Combines the current system ("as-is") with the target state ("to-be") from a code, security, SEO/accessibility and deployment review.
Items marked **(verify)** were not confirmed by direct measurement during the review.

---

## 1. Purpose and goals

Sombhabona is a Bangladeshi non-profit (founded 2011, Mirpur, Dhaka) working on free education (Pushpokoli School), skill development (ICT, tailoring), relief aid and youth volunteering. The website must:

1. **Build trust** with donors, partners and volunteers using real photos, real numbers and transparent reporting.
2. **Convert** visitors into donors (bKash), volunteers and newsletter subscribers.
3. **Be found**: rank for the organisation's name, its programs and Bengali-language searches.
4. **Be maintainable by a small team**: content in typed files, no CMS, one Docker Compose deployment.

Non-goals (for now): user accounts, admin dashboard, recurring-billing engine, e-commerce.

## 2. Users

| User | Needs |
|---|---|
| Donor (Bangladesh, diaspora) | Understand impact, give quickly and safely, get a receipt |
| Volunteer / student | See programs, apply, contact |
| Partner / sponsor / press | Credibility, registration details, reports, contact |
| Staff (2–3 people) | Receive form submissions by email, update copy by editing files |

## 3. Current system (as-is)

### 3.1 Stack
- Next.js 16.2 (App Router, Turbopack, `output: "standalone"`), React 19.2, TypeScript (strict), Tailwind CSS 4, framer-motion, lucide-react.
- PostgreSQL 16 through Prisma 7 (`@prisma/adapter-pg`).
- Zod for API validation, Nodemailer for staff notification, bKash Tokenized Checkout for payments.
- Docker Compose (`db`, `web`, `nginx`); dev override adds hot reload and Adminer.
- Note: `apps/web/AGENTS.md` warns this Next.js version has breaking changes; read `node_modules/next/dist/docs/` before changing framework-level code.

### 3.2 Structure
- Single scrolling page `app/page.tsx` with 14 anchor sections: Hero, Focus Pillars, About, Impact Stats, Programs, Relief Aid, Stories, Gallery, Volunteer, Donation, Support Network, News, Testimonials, Contact, plus Footer.
- Content: `content/{site,programs,events,stories,team}.ts`, copy dictionary `lib/i18n.ts` (English + Bengali), images `lib/images.ts` and `public/gallery/*`.
- Routes: `/`, `/donate/success`, `/donate/failed`, `POST /api/{contact,volunteer,newsletter,bkash/create}`, `GET /api/bkash/callback`.
- State: language and dark mode live in `useState` in `page.tsx` (not persisted).

### 3.3 Data model (Prisma)
`ContactSubmission`, `VolunteerApplication`, `NewsletterSubscriber (email unique)`, `Donation` (amount Int in BDT, method BKASH|BANK|ZAKAT, status PENDING|COMPLETED|FAILED|CANCELLED, `bkashPaymentId` unique, `bkashTrxId`). Only BKASH is used today.

### 3.4 Quality baseline
`eslint` and `tsc --noEmit` pass clean; production build passes. There are **no automated tests** and **no CI**.

## 4. Functional requirements

| ID | Requirement | State |
|---|---|---|
| F1 | Bilingual (EN/BN) content with a visible language switch | Exists; strings missing in BN (see §7) |
| F2 | Light/dark theme | Exists; not persisted, flashes on load |
| F3 | Donation: preset/custom amount (min ৳10), one-time or monthly *pledge*, bKash redirect, success/failed pages | Exists; verification gaps (§6) |
| F4 | Volunteer application → DB + staff email | Exists |
| F5 | Contact form → DB + staff email | Exists |
| F6 | Newsletter signup → DB | Exists; no double opt-in / unsubscribe |
| F7 | Programs filter (Education / Skill Development) | Exists |
| F8 | Photo gallery with category filter (16 real photos) | Exists; generic alt text |
| F9 | Real-photo imagery from the organisation archive | Done (2026-08); README still says "stock photography" — update |
| F10 | Transparency page: registration, annual report, fund allocation, team | **Missing** |
| F11 | Receipt/confirmation for donors | **Missing** (email optional today) |
| F12 | Sitemap, robots, social preview, structured data | **Missing** |

## 5. Non-functional requirements (targets)

- **Performance:** LCP ≤ 2.5 s and CLS ≤ 0.1 on mid-range Android over 4G; INP ≤ 200 ms. Hero image ≤ 300 KB, gallery images ≤ 200 KB each.
- **Accessibility:** WCAG 2.2 AA (contrast, keyboard, focus, correct `lang`, reduced motion, form errors announced).
- **SEO:** server-rendered HTML for both languages, unique URL per language, complete metadata and JSON-LD.
- **Security:** payments verified server-side; rate-limited, size-limited public endpoints; HTTPS everywhere; security headers.
- **Reliability:** healthchecks, nightly DB backup with off-box copy and tested restore, rollback ≤ 10 min.
- **Privacy:** donor PII (name, email, phone) stored in Postgres in plain text today — publish a privacy policy, define retention, honour unsubscribe.

## 6. Review findings and upgrade plan

Severity: **P0** fix before real donations; **P1** next; **P2** planned.

### 6.1 Security (from the security review)
| Pri | Finding | Fix |
|---|---|---|
| P0 | `GET /api/bkash/callback` trusts the `status` query string, is not idempotent, never checks amount; a replay can re-execute a payment or overwrite a COMPLETED donation (`callback/route.ts:8-44`) | Load donation; return unless `PENDING`; ignore query `status`; after execute, call bKash Query Payment and require `statusCode "0000"`, `transactionStatus "Completed"`, amount equal to stored amount, matching `paymentID`/invoice; update with `updateMany({where:{id,status:"PENDING"}})` |
| P0 | No rate limiting / CAPTCHA / Origin check on any POST; contact + volunteer send an email per request | nginx `limit_req` on `/api/`, honeypot field, Turnstile or hCaptcha, `Origin` must equal site URL, newsletter double opt-in |
| P0 | Web container published on host port 8065 (bypasses nginx) | `expose: ["3000"]` (keep published port only in dev override) |
| P0 | Postgres password defaults to `sombhabona` if `.env` is missing | `${POSTGRES_PASSWORD:?required}`; same for user |
| P1 | Raw `err.message` returned to client (leaks env var names); bKash `statusCode` ignored; token fetched per call, no timeouts (`bkash/create/route.ts:47-50`, `lib/bkash.ts`) | Generic client error + server log; check `statusCode`; cache token until `expires_in`; `AbortSignal.timeout` |
| P1 | No `.max()` limits, `amount` unbounded, `phone` unvalidated | `.trim().max(n)` (name 100, subject 200, message 5000, email 254), `amount ≤ 500000`, phone regex, `.strict()` |
| P1 | `NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000`; `BKASH_BASE_URL` defaults to sandbox | Fail at startup in production if unset; require explicit `BKASH_BASE_URL` |
| P1 | No security headers / CSP; `poweredByHeader` on | `headers()` in `next.config.ts` (HSTS, nosniff, Referrer-Policy, frame-ancestors, Permissions-Policy, CSP after testing); check Next 16 docs for the current proxy/middleware convention |
| P1 | `notifyStaff` failure after DB write returns 500 (user retries, duplicate rows) | try/catch + log; return success once the row is saved |
| P2 | Dev image is built with `target: builder` after `COPY . .`; `.dockerignore` excludes `.env` but not `.env.*` | Add `.env*` and `!.env.example` to `.dockerignore` |
| P2 | `DATABASE_URL` unvalidated; no indexes on `Donation.status/createdAt` | `requireEnv`; add `@@index` |

### 6.2 SEO, accessibility, performance
| Pri | Finding | Fix |
|---|---|---|
| P0/P1 | `app/page.tsx` is `"use client"`; all 14 sections hydrate; Bengali is not crawlable | Make `page.tsx` a server component; `LangProvider` + `useT()` for interactive leaves; push `"use client"` down (navbar, donation, gallery filter, forms, stories carousel) |
| P1 | `<html lang="en">` never changes; no Bengali URL/hreflang (WCAG 3.1.1) | Routes `/en` and `/bn` (`app/[lang]/`), `<html lang>`, `alternates.languages` (en, bn, x-default) |
| P1 | Metadata is title + description only | `metadataBase`, OpenGraph (1200×630), Twitter card, canonical, icons, theme colour |
| P1 | No JSON-LD | `NGO/Organization` (name, url, logo, foundingDate, address, sameAs, contactPoint, areaServed BD), `DonateAction`, `WebSite` |
| P1 | No `sitemap.ts` / `robots.ts`; success/failed pages indexable | Add both; `noindex` on `/donate/*`; disallow `/api/` |
| P1 | White text on orange `#f97316` ≈ 2.8:1 (fails AA) | Darker orange (≈`#c2410c`) or dark text |
| P1 | Reduced motion only handled in `reveal.tsx` | `<MotionConfig reducedMotion="user">`, `motion-safe:` classes, CSS `scroll-behavior` guard |
| P1 | Nav/CTAs are `<button>` scrolling, not links | Use `<a href="#id">` with `scroll-margin-top`; Escape closes mobile menu |
| P1 | Donation form: generic error, no `aria-invalid`/`aria-describedby`, `role="radio"` without arrow keys, translucent focus ring, `NaN`/decimal amounts pass client check | Visible labels, per-field errors, real radios or `aria-pressed`, solid focus ring, `Number.isInteger` check, translated messages |
| P1 | Hero H1 starts at opacity 0 (delays LCP) | `initial={false}` on the LCP element |
| P2 | All gallery alt = "Sombhabona program activity" | Per-image `alt` (EN + BN) in the data array |
| P2 | Fonts: Playfair 4 weights, Noto Sans Bengali 4 weights | Trim weights, `display: "swap"`, `preload: false` for Bengali |
| P2 | Long cache for `/gallery/*`, `/logo.png`; AVIF/WebP | `headers()` + `images.formats` |
| P2 | framer-motion full bundle | `LazyMotion` + `m.*` (~20 kB) |
| P2 | Theme/lang not persisted, flash of wrong theme | Inline head script, localStorage + cookie, honour `prefers-color-scheme` |
| P2 | Non-passive scroll listener; lang toggle ~24 px tall | `{passive:true}`; `min-h-[44px]` |

### 6.3 Code quality
- Hardcoded English in BN mode: `contact.tsx`, `donation.tsx` (errors, aria-labels, "Your Impact"), `volunteer.tsx`, `footer.tsx`, `stories.tsx` aria-labels, `layout.tsx` skip link, `hero.tsx` "Years of Transforming Lives", `lib/use-form-submit.ts` error strings → move to `lib/i18n.ts`; make `useFormSubmit` return an error code.
- `content/stories.ts` is dead (the component has its own local array); boilerplate `public/*.svg` (file, globe, next, vercel, window) likely unused; `tsconfig.tsbuildinfo` tracked.
- Contact map iframe uses a placeholder embed token, and the WhatsApp number is derived by string-replacing a URL.
- `donation.tsx` re-implements fetch/error handling instead of `useFormSubmit`; `submitting` is not reset when returning from bKash via bfcache (`pageshow`).
- `lib/use-counter.ts`: `setInterval` stepping, ignores reduced motion.
- No `not-found.tsx` / `error.tsx`; success/failed pages lack metadata, translation and a retry path.
- Schema: unused `BANK`/`ZAKAT` enum values; volunteers not de-duplicated; newsletter has no unsubscribe token.
- Duplicated field/input class strings → shared `Field`/`Input` primitives.

### 6.4 Deployment (from the DevOps review)
| Pri | Finding | Fix |
|---|---|---|
| P0 | nginx serves HTTP only | TLS — simplest is Caddy (`sombhabona.org { encode zstd gzip; reverse_proxy web:3000 }`); or nginx + certbot with 80→443 redirect |
| P0 | Postgres volume is the only copy of data | Nightly `pg_dump` (host cron), 14-day retention, off-box sync (rclone), periodic restore test, backup before every deploy |
| P1 | No healthchecks | `GET /api/health` (`SELECT 1`); compose `healthcheck` on web; nginx `depends_on: service_healthy` |
| P1 | Migrations run at every container start | Keep for single replica; back up first; expand/contract migrations; optional one-shot `migrate` service |
| P1 | nginx: no security headers, `server_tokens`, size/time limits, forced `Connection: upgrade` | Add headers, `client_max_body_size 16k`, `limit_req_zone`, `map $http_upgrade` |
| P1 | No caching of `/_next/static` and `/gallery` at the proxy | `proxy_cache` zone or long-lived `Cache-Control` |
| P1 | `NEXT_PUBLIC_*` is inlined at build time; compose runtime env does not change client bundles | Pass as build arg |
| P2 | No CI, no image registry, builds on the VPS | GitHub Actions (lint, `tsc`, `prisma validate`, build, docker build → GHCR); deploy over SSH with `docker compose pull && up -d --wait`; keep previous tag for rollback; Dependabot |
| P2 | No log rotation / monitoring | `json-file` `max-size 10m`, `max-file 3`; external uptime monitor on `/api/health`; ufw, fail2ban, unattended-upgrades on the host |
| P2 | Unpinned `postgres:16-alpine`, `adminer`; no `cap_drop`/`no-new-privileges` | Pin versions; harden compose services |

### 6.5 Content and conversion
- Donation trust block: legal registration number/authority, bKash merchant/number, refund/contact line, privacy policy and terms links, tax-deductibility statement **if applicable**.
- Donor receipt: collect email or phone and say why; send confirmation after verified completion.
- Impact mapping: link amounts (৳100/250/500/5,000) to outcomes; show "৳500/month" on the button when monthly is selected.
- Transparency page: annual report/financials (PDF), fund-allocation breakdown, board/team from `content/team.ts`, "as of" dates and sources on every statistic.
- Mobile: persistent Donate button (nav Donate is hidden below `lg`); consider a quick-give widget near the hero.
- Other payment options for diaspora donors (Nagad, cards via a Bangladesh gateway) — decision needed (§9).
- Stories/testimonials: consent, dates, role-based or initial-only attribution (already the policy in README).
- Multi-page URLs where search intent exists: `/programs/[slug]` (slugs already in `content/programs.ts`), `/news/[slug]`, `/donate`, `/transparency`.

## 7. Target architecture (to-be)

```
app/[lang]/layout.tsx      <html lang>, metadata, JSON-LD, fonts, providers
app/[lang]/page.tsx        server component composing sections
app/[lang]/programs/[slug], /transparency, /donate (later)
app/api/*                  shared helper: zod parse, Origin check, rate limit, try/catch, typed errors
app/api/health/route.ts
app/{sitemap,robots,not-found,error}.ts(x)
components/                server sections by default; "use client" only for navbar, donation, gallery filter, forms, stories carousel
lib/i18n.ts                all strings (split per section when large); useT() from LangProvider
lib/bkash.ts               token cache, timeouts, statusCode checks, zod-parsed responses, Query Payment
```

Payment flow (to-be): create (server-side validated amount) → bKash → callback → load donation (must be `PENDING`) → execute → Query Payment verification (status, amount, invoice, paymentID) → atomic `PENDING→COMPLETED|FAILED` → receipt email → redirect to success/failed. Callback must be safe to hit repeatedly.

## 8. Acceptance criteria

1. Replaying or forging the callback URL cannot change a donation that is not `PENDING`, and a mismatched amount is never marked `COMPLETED` (unit + integration tests with mocked bKash).
2. Public POST endpoints reject oversize input and return 429 beyond the rate limit.
3. `curl https://…/bn` returns server-rendered Bengali HTML with `<html lang="bn">`, hreflang links, OG tags and JSON-LD; `/sitemap.xml` and `/robots.txt` resolve.
4. Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; axe reports no serious/critical issues; primary buttons meet 4.5:1 contrast.
5. Full keyboard operation of nav, language toggle, donation form and gallery filter; errors announced; `prefers-reduced-motion` stops non-essential animation.
6. Site is served only over HTTPS; port 8065 is not reachable; response headers include HSTS, nosniff, Referrer-Policy, frame-ancestors.
7. `docker compose up` fails fast without `POSTGRES_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, and (in production) `BKASH_BASE_URL`; healthchecks go green; a nightly dump exists and a restore has been rehearsed.
8. CI runs lint, type-check, `prisma validate`, build and docker build on every PR; tests exist for zod schemas, `lib/bkash`, callback transitions, plus a Playwright donate/contact smoke test.
9. No hardcoded English remains in Bengali mode (grep and manual review by a native speaker).

## 9. Roadmap

| Phase | Scope | Rough size |
|---|---|---|
| 0 — Payment safety & hardening | §6.1 P0/P1, close port 8065, required secrets, TLS, backups, healthcheck | 2–4 days |
| 1 — Rendering, i18n, SEO | Server-component refactor, `/en` `/bn`, `lang`, metadata, JSON-LD, sitemap/robots, i18n string sweep, translated form errors | 4–6 days |
| 2 — Accessibility & performance | Contrast, reduced motion, links vs buttons, donation form a11y, hero LCP, fonts, cache headers, alt text | 3–4 days |
| 3 — Trust & conversion | Transparency page, registration/privacy/terms, donor receipts, impact mapping, mobile donate bar | 3–5 days + content |
| 4 — Engineering hygiene | Tests, CI/CD to GHCR with rollback, dead-code cleanup, README refresh, shared form primitives | 3–5 days |

## 10. Open questions for the organisation

1. Legal registration details and tax-deductibility status that may be published?
2. Is a receipt (email/SMS) required for every donation? Which channel?
3. Add Nagad / cards / international payments? Which gateway?
4. Real recurring donations, or keep the manual "monthly pledge" follow-up?
5. Who owns Bengali review, and who can approve annual-report and financial figures for publication?
6. Hosting target (single VPS vs managed) and domain/DNS control for TLS?
7. Retention period for donor and volunteer data; who handles deletion requests?
8. Which people/photos have consent for public use (especially children in gallery photos)?

## 11. Housekeeping notes

- README still says "Stock photography (Unsplash) is still used"; update after the real-photo change.
- Raw photo archive `Audio Visual/` is git-ignored by design; only optimised copies in `apps/web/public/gallery/` are tracked.
- Facebook page content could not be fetched automatically (login wall); any content taken from it must be supplied manually.
