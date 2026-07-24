# AGENTS.md — kun-ui (KunUI design system)

## What this repo is

KunUI, the shared cross-framework component library for the NextMoe/KunGal
ecosystem. One design language, multiple render layers. pnpm workspace with
4 packages versioned in lockstep (currently 2.17.x), released via changesets:

- `@kungal/ui-tokens` — framework-agnostic Tailwind v4 theme (semantic colors,
  radius, OKLCH-based palette).
- `@kungal/ui-core` — design types, `cn()`, variant matrix, radius system.
- `@kungal/ui-vue` — Vue 3 component layer, 53 components, Nuxt-decoupled.
- `@kungal/ui-nuxt` — Nuxt layer wrapping ui-vue (auto-imports, injection).

React (`@kungal/ui-react`) is a planned future layer. Multi-brand token-set
layering (primitive→semantic→component) is the planned evolution (design doc 05).

## This repo is upstream for the whole ecosystem

Downstream repos (kungal forum, moyu/patch, letmoe, infra apps/web, …) carry an
iron rule: "never modify KunUI from a consumer repo — report bugs instead."
This repo is where KunUI changes ARE made — every change here ships to every
consumer site. Treat API changes as breaking-change reviews; additive first.
Consumer upgrade recipe: bump + install + build (see docs/UPGRADE-*.md).

## Commands

```bash
pnpm install
pnpm build                 # build all packages (filter ./packages/*)
pnpm typecheck             # typecheck all packages
pnpm gen:llms              # regenerate llms.txt / llms-full.txt after component changes
pnpm changeset             # record a changeset for the release train
# Release (ci:version / ci:publish) is CI-driven — do not publish manually.
```

Playgrounds: `apps/playground` (Vue), `apps/nuxt-playground`, `apps/docs`.

## Conventions

- Commit but never push — the user pushes in batches. English-only commit
  messages and comments. Path-scoped commits (`git commit -- <paths>`), never `add -A`.
- Releases go through changesets; "ci: release packages [skip ci]" commits are
  CI artifacts — never hand-edit versions in package.json.
- All frontend functions as arrow functions; compose classes with `cn()`.
- No gradient backgrounds anywhere; semantic colors only (50–950 scales).
- After adding/changing components, run `pnpm gen:llms` so AI-facing docs stay current.

## Component contracts (do not break)

- **KunModal owns its width via the `size` prop** (default md = 28rem);
  consumers must not wrap fixed-width divs in the slot.
- **Closing animations require the component to stay mounted** — consumers use
  `v-model:open`, not `v-if`. Keep this pattern working.

## Key docs

`docs/architecture.md` (design), `docs/INTEGRATION.md` (consumer setup),
`docs/RELEASING.md` (release train), `docs/DOWNSTREAM.md` (consumer map),
`docs/USING-WITH-AI.md` + `llms.txt`/`llms-full.txt` (AI-facing component reference).
