# KunUI cross-framework architecture & roadmap

This document captures the analysis behind the monorepo layout and the
phased plan to take KunUI from "Nuxt-only" to "Nuxt + plain Vue + React".

## 1. The honest constraint

There is **no technology that runs `.vue` files inside React.** Vue SFCs,
Vue reactivity, slots, `defineModel`, `<Teleport>`/`<Transition>`,
lifecycle hooks — none of it exists in React. "Supporting React"
therefore always means **rewriting the render layer**. The only real
question is *how much underlying material you can reuse* when you do.

So we split KunUI by **portability**, not by component:

| Asset | Portability | Where it lives |
| --- | --- | --- |
| Design tokens (colors, radius, z-index, animations) — pure CSS | 🟢 100% | `@kungal/tokens` |
| `cn()`, variant×color matrix, type vocabulary, small utils — pure TS | 🟢 100% | `@kungal/core` |
| Component *logic patterns* (controlled/uncontrolled, precedence chains) | 🟡 portable as logic, not as code | resolver fns in `@kungal/core`; reactive wrappers per framework |
| Vue SFC render + Nuxt coupling | 🔴 0% | `@kungal/ui-vue` / `@kungal/ui-nuxt` (Vue only) |

## 2. How deeply the source is coupled to Nuxt

Measured from `kun-galgame-infra/packages/ui` (~53 `.vue` files, 12
composables):

- **Nuxt auto-imports everywhere** — `computed`/`ref`/`useSlots`/`cn`/
  `extractTextFromVNodes` and cross-component refs (`<KunIcon>`,
  `<KunButton>`, `<KunRipple>`) resolve only under Nuxt. The lib can't
  even run in a plain Vite + Vue app as-is.
- **Nuxt-specific APIs** — `defineNuxtLink()` (Button), `tryUseNuxtApp()`
  + the `vNode.appContext` hack in `useKunMessage.ts` (steals the Nuxt
  app context so `@nuxt/icon` doesn't throw `$nuxt` null).
- **Nuxt modules** — `@nuxt/image`, `@nuxt/icon`, `NuxtLink` carry the
  SSR/IPX image pipeline that the galgame apps depend on.

**Already portable in the source:** `variants.ts` (pure data table),
`cn.ts` (clsx + tailwind-merge), the Tailwind `@theme` token CSS, and
much of the underlying dependency set — `@floating-ui` (React has
`@floating-ui/react`), `focus-trap`, `dompurify`, `date-fns` are all
framework-agnostic. That meaningfully de-risks a future React port.

## 3. Cross-framework approaches surveyed

| Approach | Examples | Fit for KunUI |
| --- | --- | --- |
| **Headless core + per-framework adapters** (framework-agnostic state machines) | Zag.js / Ark UI; TanStack | ✅ The modern standard for true multi-framework. But the source has no such extraction — going pure-Zag ≈ rewriting 40 components' logic. Adopt it *inside* the React layer for the hard interactive parts. |
| **Shared tokens + per-framework components** | most enterprise design systems | ✅ Most pragmatic & incremental. This repo's spine. |
| **Web Components** | Shoelace, Stencil, Lit | ❌ SSR is the painful part (this lib is heavily SSR), and Shadow DOM fights the global Tailwind-utility design system. |
| **Compile-once (Mitosis)** | Builder.io Mitosis | ❌ Still beta; would mean rewriting every component in a restricted JSX subset; Nuxt-module features don't map. |

**Chosen:** shared-tokens spine (approach 2) + Ark UI/Zag *inside* the
React layer (approach 1) for dialog/popover/select/tabs/tooltip/
date-picker/dropdown/drawer accessibility & positioning.

## 4. Target monorepo layout

```
kun-ui/
├─ packages/
│  ├─ tokens/   @kungal/tokens   pure CSS tokens                  ✅ landed
│  ├─ core/     @kungal/core     pure TS (cn/variants/types/utils) ✅ landed
│  ├─ vue/      @kungal/ui-vue   Vue 3 components, Nuxt-decoupled  ⏳
│  ├─ nuxt/     @kungal/ui-nuxt  thin Nuxt Layer over ui-vue       ⏳
│  └─ react/    @kungal/ui-react React components on Ark UI        ⏳
└─ docs/
```

This answers all three goals at once: **Nuxt** (`ui-nuxt`), **plain Vue**
(`ui-vue`, a free win once decoupled), **React/Next** (`ui-react`).

## 5. Phased roadmap

| Phase | Work | Output | Est. |
| --- | --- | --- | --- |
| **P0** ✅ | Extract `@kungal/tokens` (CSS) + `@kungal/core` (cn/variants/types/utils) | shared foundation | done |
| **P1** 🚧 | Decouple `@kungal/ui-vue` from Nuxt: auto-imports → explicit; abstract `NuxtLink`/`Image`/`Icon` behind injectable adapters; drop the `useKunMessage` appContext hack | pure Vue 3 lib (works in any Vue app) | 1–2 wk |
| **P2** ✅ | `@kungal/ui-nuxt` thin Layer: register ui-vue as auto-imports + inject NuxtLink/@nuxt/icon (verified by SSR prerender in apps/nuxt-playground) | existing Nuxt DX, zero regression | done |
| **P3** | `@kungal/ui-react`: ~20 presentational components on tokens+core | React/Next minimal set | ~1 wk |
| **P4** | React interactive components on Ark UI/Zag | React feature parity | 2–3 wk |
| **P5** (optional) | Sink primitive logic into Zag machines shared by Vue+React | single source of truth | long-term |

**P0 + P1 is the watershed:** even if React never ships, those two steps
upgrade a "Nuxt-only" library into "any-Vue-project + cross-framework
foundation laid." React is an opt-in increment from P3 on.

## 6. P1 decoupling checklist

**Status:** the package, Vite library build (JS + scoped CSS), and vue-tsc
type emission are established, and the decoupling pattern is proven on
`KunButton`, `KunCard`, `KunIcon`, `KunRipple`, and `KunModal` (the hardest
case — Teleport + focus-trap + body-scroll-lock, verified through both the
Vite playground and Nuxt SSR prerender). The items below are the full P1
scope; the remaining ~35 components port mechanically against the same
pattern.

- [x] Replace Nuxt auto-imports with explicit imports (the four landed
  components do this; consider `unplugin-auto-import` +
  `unplugin-vue-components` later for in-repo DX parity).
- [x] Abstract the Nuxt module touch-points behind injectable config slots:
  - [x] `NuxtLink` → `config.linkComponent` (default `<a>`; pass `href` for
    string tags, `to` for RouterLink/NuxtLink components).
  - [x] `@nuxt/icon` (`<NuxtIcon>`) → `config.iconComponent` (default
    `@iconify/vue`; same Iconify names so call sites are unchanged).
  - [ ] `@nuxt/image` (`<NuxtImg>`) → `config.imageComponent` — add when
    porting `Image.vue`.
- [ ] Rework `useKunMessage` to mount its container without stealing the
  Nuxt app context (framework-neutral teleport target).
- [ ] Port `sanitize.ts` off `import.meta.server` (inject an `isServer`
  flag) before it can move into a shared package.
- [x] Consume `@kungal/core` (`cn`, `kunVariantClasses`, `resolveRounded`,
  `kunRoundedClasses`) instead of in-package copies.

### Original checklist (full P1 scope)

- Replace Nuxt auto-imports with explicit imports (or `unplugin-auto-import`
  + `unplugin-vue-components` for DX parity outside Nuxt).
- Abstract the three Nuxt module touch-points behind injectable
  components/props so a non-Nuxt host can supply its own:
  - `NuxtLink`  → a `linkComponent` injection (default `<a>`).
  - `@nuxt/image` (`<NuxtImg>`) → an `imageComponent` injection (default `<img>`).
  - `@nuxt/icon` (`<NuxtIcon>`) → an `iconComponent` injection.
- Rework `useKunMessage` to mount its container without stealing the Nuxt
  app context (framework-neutral `createApp`/teleport target), so it works
  in plain Vue.
- Port `sanitize.ts` off `import.meta.server` (inject an `isServer` flag)
  before it can move into a shared package.
- Keep consuming `@kungal/core` (`cn`, `kunVariantClasses`, `resolveRounded`,
  `kunRoundedClasses`) instead of the in-package copies.
