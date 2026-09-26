<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Base44 preview: `docker compose -f docker-compose.base44.yml up -d --build` runs Next.js directly from the bind-mounted repository with a live dev server on port 3000. No credentials are required to render the home portfolio map; external Supabase, Stripe, R2, and email features need their respective credentials to function. This repository's Next.js 15.1.11 package does not include `node_modules/next/dist/docs/` or the `allowedDevOrigins` option; the proxied host currently serves the homepage without extra configuration. Verify with `curl http://localhost:3000/`.

