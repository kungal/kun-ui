#
# Build + run the KunUI docs site (apps/docs) — Nuxt 4, Nitro node-server.
#
# Build context MUST be the repo root: the docs app consumes the @kungal/*
# workspace packages from source (extends @kungal/ui-nuxt; @source-scans
# packages/{core,vue}/src; imports @kungal/ui-vue/style.css), so those packages
# must be present and built before the docs build.
#
# Mirrors kun-galgame-infra/docker/nuxt.Dockerfile: deps → build → slim run
# stage with only Node + the self-contained .output.
ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-trixie-slim AS base
RUN corepack enable
WORKDIR /repo

# ---- deps: copy manifests, install the docs subgraph (+ workspace deps) ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/tokens/package.json packages/tokens/package.json
COPY packages/core/package.json   packages/core/package.json
COPY packages/vue/package.json    packages/vue/package.json
COPY packages/nuxt/package.json   packages/nuxt/package.json
COPY apps/docs/package.json       apps/docs/package.json
# --ignore-scripts: the app's `nuxt prepare` postinstall can't run before the
# sources are copied; the later `nuxt build` runs prepare itself.
RUN pnpm install --frozen-lockfile --ignore-scripts --filter "@kungal/docs..."

# ---- build: build the workspace packages, then the docs site ----
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages packages
COPY apps/docs apps/docs
# core (tsup) + vue (vite + vue-tsc) must be built so the docs can import their
# dist (style.css) and resolve types. tokens / ui-nuxt ship source (no build).
# Props tables come from the committed app/generated/component-meta.json, so
# vue-component-meta is NOT run here.
RUN pnpm --filter @kungal/core build \
 && pnpm --filter @kungal/ui-vue build \
 && pnpm --filter @kungal/docs build

# ---- run: just Node + the self-contained .output ----
FROM node:${NODE_VERSION}-trixie-slim AS run
ENV NODE_ENV=production HOST=0.0.0.0 NITRO_PORT=6757
WORKDIR /app
COPY --from=build /repo/apps/docs/.output ./.output
USER node
EXPOSE 6757
CMD ["node", ".output/server/index.mjs"]
