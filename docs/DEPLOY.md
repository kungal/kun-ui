# Deploying the docs site (ui.kungal.com)

The KunUI docs site (`apps/docs`) deploys the same way as the kungal ecosystem
(see `kun-galgame-infra/docs/deploy`): **GitHub Actions builds a Docker image and
pushes it to GHCR; Dokploy pulls the prebuilt image and routes the domain to it
via its built-in Traefik (auto-HTTPS).** The production server never builds.

- **Domain:** `ui.kungal.com`
- **Port:** `6757` (dev *and* prod — never 3000)
- **Image:** `ghcr.io/kungal/kun-ui-docs:latest` (+ a `:<git-sha>` tag)
- **Runtime:** Nuxt 4 Nitro node-server (`node:24-trixie-slim`, self-contained `.output`)

```
push to main ─► GitHub Actions (docs-image.yml) build ─► push GHCR
                                                          │ webhook (deploy job)
                                                          ▼
                          single server · Dokploy ─► pull image ─► Traefik ─► ui.kungal.com
```

## Pieces in this repo

| File | Role |
| --- | --- |
| `docker/docs.Dockerfile` | Multi-stage build (build context = repo root): builds `@kungal/core` + `@kungal/ui-vue`, then `nuxt build` for `apps/docs`; run stage = Node + `.output`, `NITRO_PORT=6757`. |
| `.dockerignore` | Keeps the build context small; forces a clean install/build. |
| `docker-compose.prod.yml` | What Dokploy points at: `image: ghcr.io/kungal/kun-ui-docs:latest`, `expose: ['6757']`, `dokploy-network`. |
| `.github/workflows/docs-image.yml` | Build → push GHCR (`:latest` + `:<sha>`); optional Dokploy redeploy webhook. |
| `apps/docs/nuxt.config.ts` | `devServer.port: 6757`. |

## One-time setup

1. **DNS** — point `ui.kungal.com` (A/AAAA) at the server's public IP. Traefik
   (in Dokploy) auto-issues the certificate.
2. **First image** — push to `main` (touching `apps/docs/**` or `packages/**`)
   triggers `docs-image.yml`, which publishes `ghcr.io/kungal/kun-ui-docs:latest`.
   Make that GHCR package **public** (Package settings → Change visibility) so
   Dokploy can pull it without credentials.
3. **Dokploy app** — create a **Compose** app pointing at this repo's
   `docker-compose.prod.yml` (or a Docker provider with the image directly).
   - **Domains** tab: add `ui.kungal.com` · path `/` · service `docs` · port
     **6757**. Dokploy injects the Traefik labels + issues TLS.
4. **Auto-deploy on each build (recommended, avoids the "deploys the previous
   image" race):**
   - Copy the app's **deploy webhook URL** → repo Actions secret
     `DOKPLOY_WEBHOOK_DOCS`.
   - **Disable** the app's Dokploy *Auto Deploy* (so the only trigger is the CI
     `deploy` job, which fires *after* the image is pushed).
   - Without the secret the `deploy` job logs a skip; the image is still on
     GHCR — redeploy manually in Dokploy.

## Rollback

Point the Dokploy image ref from `:latest` to a known-good `:<git-sha>` and
redeploy (every build is tagged with its commit sha).

## Local checks

```bash
# Dev (port 6757)
pnpm --filter @kungal/docs dev

# Production runtime exactly as the image runs it:
pnpm --filter @kungal/core build
pnpm --filter @kungal/ui-vue build
pnpm --filter @kungal/docs build
NITRO_PORT=6757 node apps/docs/.output/server/index.mjs   # → http://localhost:6757

# Build the image locally (optional)
docker build -f docker/docs.Dockerfile -t kun-ui-docs .
docker run --rm -p 6757:6757 kun-ui-docs
```

## AI files on the live domain

`pnpm gen:llms` writes `llms.txt` / `llms-full.txt` to the repo root **and** to
`apps/docs/public/`, so the deployed site serves them at
`https://ui.kungal.com/llms.txt` and `…/llms-full.txt`.
