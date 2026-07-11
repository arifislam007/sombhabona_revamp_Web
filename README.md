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
- `nginx` — reverse proxy on port 80 (override with `HTTP_PORT`)

Visit `http://localhost`.

### Development overrides

`docker-compose.dev.yml` adds hot-reload (bind-mounts the source, runs `next dev`) and an Adminer instance for inspecting the database:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Adminer will be available at `http://localhost:8081` (system: PostgreSQL, server: `db`).

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

Stock photography (Unsplash) is still used as placeholder imagery — swap for real Sombhabona photos when available.

## Notes / follow-ups

- Bengali translations in `apps/web/lib/i18n.ts` are a best-effort machine/AI translation — have a native speaker review before launch.
- "Monthly" donations only charge once today via bKash (there's no real recurring billing integration); the UI note under the toggle says the team follows up manually for future months.
- bKash credentials in `.env.example` are blank; the sandbox base URL is set by default. Swap in production credentials and `BKASH_BASE_URL` before going live.
- No authentication/admin UI exists; content changes are made by editing files in `apps/web/content/` and `apps/web/lib/i18n.ts`, then redeploying.
