# KunUI

A **cross-framework** component library. One design language, one shared
brain, multiple render layers.

> Status: **P0–P2 complete and published to npm (`0.1.x`).** Shared foundation
> (`@kungal/ui-tokens` + `@kungal/ui-core`), the full Vue layer (`@kungal/ui-vue`,
> **all 53 components migrated, Nuxt-decoupled**), and the Nuxt layer
> (`@kungal/ui-nuxt`) are done. React (`@kungal/ui-react`) is the next phase.
> See [`docs/architecture.md`](./docs/architecture.md).

## Use it in your project

**→ Full step-by-step setup: [`docs/INTEGRATION.md`](./docs/INTEGRATION.md).**

Nuxt:

```bash
pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['@kungal/ui-nuxt'], css: ['~/assets/css/main.css'] })
```

Plain Vue (Vite):

```bash
pnpm add @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite
```

```ts
import { KunUI } from '@kungal/ui-vue'
createApp(App).use(KunUI).mount('#app')
```

Both need a Tailwind v4 entry stylesheet (`tailwindcss` + `@kungal/ui-tokens` +
`@kungal/ui-vue/style.css` + `@source` directives) — the
[integration guide](./docs/INTEGRATION.md) has the exact CSS, dark mode, icon
registration, the `KunUIConfig` slots, and the **"KunUI never sanitizes HTML"**
security note.

**Using an AI tool (Claude Code, Cursor, …)?** Point it at
[`llms.txt`](./llms.txt) (compact index) or [`llms-full.txt`](./llms-full.txt)
(full docs), and see [docs/USING-WITH-AI.md](./docs/USING-WITH-AI.md) for a
paste-able `AGENTS.md`/`CLAUDE.md` rules block.

## Why this exists

The original KunUI is a mature, deeply Nuxt-coupled Vue component library
(~40 components, shipped as a Nuxt Layer). It works great in Nuxt, but
its `.vue` files cannot run in React, and they can't even run in a
non-Nuxt Vue app without Nuxt's auto-imports and modules.

There is no magic that runs Vue SFCs in React. So instead of pretending
there is, KunUI splits into layers by **how portable each asset actually
is**, and reuses the portable parts everywhere:

```
@kungal/ui-tokens   pure CSS design tokens          ← 100% shared
@kungal/ui-core     pure TS (cn, variants, types)    ← 100% shared
@kungal/ui-vue   Vue 3 components (no Nuxt dep)    ← Vue render layer   (P1, done)
@kungal/ui-nuxt  thin Nuxt Layer over ui-vue      ← Nuxt sugar          (P2, done)
@kungal/ui-react React components (Ark UI inside)  ← React render layer  (planned)
```

`ui-vue` and `ui-react` both consume `@kungal/ui-tokens` + `@kungal/ui-core`, so the
two stacks are visually identical by construction — same colors, same
radius, same variant matrix.

## Packages

| Package | What | State |
| --- | --- | --- |
| [`@kungal/ui-tokens`](./packages/ui-tokens) | Tailwind v4 design tokens (CSS) | ✅ landed |
| [`@kungal/ui-core`](./packages/ui-core) | framework-agnostic TS foundation | ✅ landed |
| [`@kungal/ui-vue`](./packages/vue) | pure Vue 3 components (Nuxt-decoupled) | ✅ **P1 complete — all 53 components migrated.** display: Button/Card/Icon/Ripple/Badge/Chip/Progress/Info/Loading/Divider/Image/ImageNative/Link/Brand/Favicon/Null/Markdown; overlay: Modal/Message/Tooltip/Popover/Tab/Select/Dropdown/Drawer/ContextMenu/Lightbox(+Gallery/GalleryItem); form: Input/Textarea/Switch/CheckBox/Slider/RadioGroup/DatePicker/FileInput/TagInput/Upload; content: Content/Text; people: Avatar/AvatarGroup/UserChip/Header; alert: AlertProvider/Loli(+Provider); util: Copy/Rating/Pagination/ScrollShadow/FadeCard |
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
