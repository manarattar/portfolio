# Deploying Portfolio

**Live at `manarattar.com` and `www.manarattar.com`.**

## How it is put together

This repo is a Vite SPA **plus** three API routes. On Vercel those were
serverless functions in `api/`; they now run as a small Express service
(`server.js` at `/srv/apps/portfolio-api`) that imports the same handlers
unchanged. Caddy serves the built SPA and proxies `/api/*` to that service.

`express.json({limit:"25mb"})` is required — `/api/transcribe` receives
base64-encoded audio and would otherwise fail on the 100kb default.

## Where this runs

Everything is on a single Contabo VPS. There is no Vercel, Render, or other
PaaS involved any more.

| | |
|---|---|
| Server | `194.163.176.183` — `ssh ubuntu@194.163.176.183` (key only, no password) |
| Stack | `/srv/stack/docker-compose.yml` + `/srv/stack/Caddyfile` |
| App sources | `/srv/apps/<name>` |
| Built static sites | `/srv/www/<name>` |
| Secrets | `/srv/stack/env/<name>.env` (0600, root-owned) |
| Database | one `postgres:18-alpine` container, internal network only |
| TLS | Caddy, automatic Let's Encrypt |
| Backups | nightly 03:17 to `/srv/backup/nightly`, 14-day rotation |

Caddy terminates TLS for every hostname and routes by host. Postgres has no
published port — it is reachable only on the internal Docker network.

## Secrets

Never commit them. Each app reads `/srv/stack/env/<name>.env` on the server,
which compose injects via `env_file`. `DATABASE_URL` is set by compose, not by
that file, so an app cannot accidentally point at an old database.

## Deploying a change

```bash
# frontend
npm run build
tar czf - -C dist . | ssh ubuntu@194.163.176.183 \
  'rm -rf /srv/www/portfolio && mkdir -p /srv/www/portfolio && tar xzf - -C /srv/www/portfolio'

# API service (only when api/ or server.js changes)
tar czf - api server.js package.json | ssh ubuntu@194.163.176.183 'tar xzf - -C /srv/apps/portfolio-api'
ssh ubuntu@194.163.176.183 'cd /srv/stack && sudo docker compose up -d --build portfolio-api'
```

## Things that will catch you out

- The assistant's facts live in `WEBSITE_CONTEXT` in `api/chat.js` and are
  hand-maintained. They drift. The live GitHub README is also injected, and a
  precedence rule tells the model to trust `WEBSITE_CONTEXT` when they conflict.
- Set `GITHUB_TOKEN` in the env file if the repo list goes missing: the
  unauthenticated GitHub API allows 60 requests/hour per IP.
- Stat tiles derive from the array lengths in `src/App.jsx`. Do not hardcode them
  again — they were previously wrong *and* transposed.

## Rolling back

Rebuild from the previous commit and redeploy. There is no rollback to a
previous provider — the old Vercel and Render deployments were deleted in
September 2026. Database backups are on the server at
`/srv/backup/nightly` (nightly, 14-day rotation).
