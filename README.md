# KunUI

A **cross-framework** component library. One design language, one shared
brain, multiple render layers.

> Status: **bootstrapping (P0).** The foundation packages — `@kungal/tokens`
> and `@kungal/core` — are in place. The Vue/Nuxt and React render layers
> are planned (see [`docs/architecture.md`](./docs/architecture.md)).

## Why this exists

The original KunUI is a mature, deeply Nuxt-coupled Vue component library
(~40 components, shipped as a Nuxt Layer). It works great in Nuxt, but
its `.vue` files cannot run in React, and they can't even run in a
non-Nuxt Vue app without Nuxt's auto-imports and modules.

There is no magic that runs Vue SFCs in React. So instead of pretending
there is, KunUI splits into layers by **how portable each asset actually
is**, and reuses the portable parts everywhere:

```
@kungal/tokens   pure CSS design tokens          ← 100% shared
@kungal/core     pure TS (cn, variants, types)    ← 100% shared
@kungal/ui-vue   Vue 3 components (no Nuxt dep)    ← Vue render layer   (P1, in progress)
@kungal/ui-nuxt  thin Nuxt Layer over ui-vue      ← Nuxt sugar          (P2, done)
@kungal/ui-react React components (Ark UI inside)  ← React render layer  (planned)
```

`ui-vue` and `ui-react` both consume `@kungal/tokens` + `@kungal/core`, so the
two stacks are visually identical by construction — same colors, same
radius, same variant matrix.

## Packages

| Package | What | State |
| --- | --- | --- |
| [`@kungal/tokens`](./packages/tokens) | Tailwind v4 design tokens (CSS) | ✅ landed |
| [`@kungal/core`](./packages/core) | framework-agnostic TS foundation | ✅ landed |
| [`@kungal/ui-vue`](./packages/vue) | pure Vue 3 components (Nuxt-decoupled) | 🚧 P1 — Button/Card/Icon/Ripple/Modal landed |
| [`@kungal/ui-nuxt`](./packages/nuxt) | Nuxt Layer wrapper (auto-imports + NuxtLink/@nuxt/icon injection) | ✅ landed (P2) |
| `@kungal/ui-react` | React components on Ark UI | ⏳ planned (P3/P4) |

## Develop

```bash
pnpm install
pnpm build       # build all packages
pnpm typecheck   # typecheck all packages
```

Requires Node ≥ 20 and pnpm 10.

## Roadmap

See [`docs/architecture.md`](./docs/architecture.md) for the full
analysis (how Nuxt-coupled the source is, the cross-framework approaches
surveyed, and the phased plan P0 → P5).
