<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Base44 dev environment

- Run with: `docker compose -f docker-compose.base44.yml up -d` (service `web`, host port 3000).
- Single Next.js service (`node:22-slim`) bind-mounting the repo; `npm install` runs at container start, then `next dev -H 0.0.0.0 -p 3000`. Edits hot-reload without rebuilds.
- This Next.js 15.1.11 build has **no** `allowedDevOrigins`/`allowedHosts` config option (it predates the dev-server host allowlist), so no origin config in `next.config.mjs` is needed.
- The app boots with **no external credentials** — all clients (Supabase, Stripe, R2, Resend, OpenRouter) use defensive `|| ""` / dummy fallbacks and degrade gracefully. Placeholders live in `.env.base44-defaults` (listed first); real secrets are delivered via `/run/base44/app.env` (listed last, always wins).
- Secrets that make features actually work (not required to boot): Supabase URL/anon/service-role keys, Stripe secret + webhook secret, Resend key, OpenRouter key, R2 account/access/secret/bucket/public-URL. Add them from the Base44 dashboard.
- The home page (`/`) renders a client-side `PortfolioMap` from local data in `lib/portfolio-hierarchy` — no DB needed to see it.
