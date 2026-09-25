# Sombhabona — New Website

A single-page Next.js site for Sombhabona, built from the design in `figma_code/` (a Figma-exported React/Vite prototype) and wired into a real Next.js + Postgres backend, containerized with Docker Compose. Content lives in typed data files under `apps/web/content/` and `apps/web/lib/i18n.ts` — there is no CMS/admin panel by design; edit those files and redeploy to update copy.

The page supports English/Bengali toggling and a light/dark theme, matching the Figma design's structure and visual style.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4) — `apps/web`, single scrolling page (`app/page.tsx`) with anchor-linked sections (About, Impact, Programs, Relief Aid, Stories, Gallery, Volunteer, Donation, Support Network, News, Testimonials, Contact)
- **PostgreSQL 16 + Prisma 7** (driver adapter via `pg`) — stores contact/volunteer form submissions, newsletter subscribers, and donation records
- **bKash Tokenized Checkout API** for online donations (one-time or a "monthly" pledge — see note below), plus static bank transfer / Zakat details
- **Nginx** reverse proxy in front of the app

## Project layout

```
apps/web/                  Next.js application
  app/                      route handlers (App Router) + the single-page app/page.tsx
  components/sections/      Navbar, Hero, About, Impact, Programs, Relief Aid, Stories,
                             Gallery, Volunteer, Donation, Support Network, News,
                             Testimonials, Contact, Footer
  content/                   site copy (programs, org info, events, stories)
  lib/                       i18n dictionary, prisma client, mailer, bKash client, images
  prisma/                    schema + migrations
figma_code/                 original Figma-exported design reference (not part of the build)
nginx/                      reverse proxy config
docker-compose.yml           production stack (web, db, nginx)
docker-compose.dev.yml       override for local development (hot reload, adminer)
```

## Local development (without Docker)

```bash
cd apps/web
npm install
cp .env.example .env      # already present with sandbox defaults; edit as needed
# start a local Postgres, then:
npm run db:migrate:dev
npm run dev
```

## Running with Docker Compose

```bash
cp .env.example .env       # fill in real secrets before production use
docker compose up -d --build
```

This starts:
- `db` — Postgres 16, with a named volume for persistence
- `web` — Next.js app (runs `prisma migrate deploy` automatically on container start, then `node server.js`)
- `nginx` — reverse proxy on port 6085 (override with `HTTP_PORT`)

Visit `http://localhost:6085`.

### Development overrides

`docker-compose.dev.yml` adds hot-reload (bind-mounts the source, runs `next dev`) and an Adminer instance for inspecting the database:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Adminer will be available at `http://localhost:6086` (system: PostgreSQL, server: `db`).

## Environment variables

See `.env.example` at the repo root (used by Docker Compose) and `apps/web/.env.example` (used for local `npm run dev`). Key variables:

- `DATABASE_URL` — Postgres connection string
- `SMTP_*`, `NOTIFY_EMAIL` — optional; if unset, staff notification emails are silently skipped
- `BKASH_*` — bKash Tokenized Checkout credentials (defaults point at the sandbox base URL)
- `NEXT_PUBLIC_SITE_URL` — public origin used to build the bKash callback URL

## What changed from the Figma prototype

The Figma design (`figma_code/`) included placeholder marketing copy that isn't accurate for the real organization — invented statistics, a named founder with a fabricated quote, named "success story" testimonials, and a list of real, unconfirmed organizations (UNICEF, BRAC, Grameen Bank, bKash Ltd, etc.) presented as partners/endorsers. The build swaps these for:

- Real stats, mission/vision, and contact info from `sombhabona.org` (`apps/web/content/site.ts`)
- The 6 real programs instead of fictional ones (`apps/web/content/programs.ts`)
- The real founder and leadership team (Md Areful Islam — Founder; Mosfeka Nishat — Co-Founder & Communications Lead; Al Amin Hossain, Arefin Mahadi — Co-Founders; Robiul Islam Rahat — Volunteer Lead), sourced from the "Meet our members" section and Mosfeka's profile page on sombhabona.org (`apps/web/content/team.ts`) — no invented quote is attributed to the founder, only a factual summary
- Role-based, non-identifying testimonial/story attributions instead of invented named individuals
- Generic partner *categories* (Corporate Partners, Financial Institutions, etc.) instead of naming specific real organizations with no confirmed relationship
- A donation "causes" list grounded in real programs instead of fabricated fundraising progress numbers

Imagery is real Sombhabona event photography. The raw archive (`Audio Visual/`) is git-ignored; optimised copies of the photos actually used live in `apps/web/public/gallery/`, mapped in `apps/web/lib/images.ts` and `components/sections/gallery.tsx`.

## Verified facts from external coverage

Beyond sombhabona.org itself, the following are sourced from independent press coverage (see inline comments in `apps/web/content/site.ts`, `programs.ts`, `events.ts` for details):

- **170+ active volunteers** — per BSS News
- **Onindito Naree**: 160+ women trained in tailoring/crafts, 100+ employed in an on-site garment workshop — per The Daily Star
- Real past events: the Pushpokoli Eid Festival & Iftar (Mar 23, 2025, ~200 children — The Financial Express) and the Pushpokoli Winter Festival (Jan 3, 2020, ~300 children — The Daily Star)
- The founder quote in the About section ("If we can ensure their quality and skill-based education...") is attributed to Md Areful Islam per The Daily Star

The homepage now leads with an interactive "Three Pillars" section (`components/sections/focus-pillars.tsx`) spotlighting Volunteering, Education, and Skill Development with real stats per pillar, and the Programs section has a filter to browse by the same two content pillars (Education / Skill Development).

## Staff admin area (`/admin`)

Read-only lists of donations, contact messages, volunteer applications and newsletter subscribers, with search, date filters (Dhaka time), CSV download, and a "Check pending with bKash" action. It is off unless both of these are set in `.env`:

- `ADMIN_PASSWORD` — the shared staff password (use a long, unique one).
- `ADMIN_SESSION_SECRET` — 32+ random characters, different from the password (`openssl rand -hex 32`). Changing either value logs everyone out.

The login is limited to 5 wrong attempts per visitor (40 in total) per 15 minutes. Sessions last 8 hours.

## Running behind a reverse proxy

- `WEB_BIND` (default `127.0.0.1`) — the address port 8065 is published on. Only a proxy on the same machine can reach the app; set `0.0.0.0` only if your proxy is on another machine.
- `TRUSTED_PROXY_HOPS` (default `1`) — how many proxies sit in front of the app (a single nginx = 1; host nginx + the Docker nginx = 2). Used to find the real visitor IP for rate limiting. The proxy must append to `X-Forwarded-For` (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`).
- Put HSTS and TLS in the outer proxy; the app sets CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy` itself.

## Payments (bKash)

The callback never trusts the browser URL. A donation becomes `COMPLETED` only when bKash confirms the payment, the payment ID matches, and the amount equals what was stored. If bKash cannot be reached the donation stays `PENDING` (donors see a "we are confirming" page) and can be settled later from the admin page. Abandoned checkouts are closed after 24 hours.

## Tests

`npm test` (in `apps/web`) runs unit tests for admin filters/CSV, sessions, IP/rate-limit handling and the bKash callback state machine.

## Notes / follow-ups

- Bengali translations in `apps/web/lib/i18n.ts` are a best-effort machine/AI translation — have a native speaker review before launch.
- "Monthly" donations only charge once today via bKash (there's no real recurring billing integration); the UI note under the toggle says the team follows up manually for future months.
- bKash credentials in `.env.example` are blank; the sandbox base URL is set by default. Swap in production credentials and `BKASH_BASE_URL` before going live.
- No authentication/admin UI exists; content changes are made by editing files in `apps/web/content/` and `apps/web/lib/i18n.ts`, then redeploying.
