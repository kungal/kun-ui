# @kungal/ui-vue

KunUI's **Vue 3 component layer, decoupled from Nuxt**. The same components
that ship in the Nuxt layer, but with every Nuxt dependency replaced by an
explicit import or an injectable config slot — so they run in *any* Vue 3
app (Vite, Astro, Laravel, plain `createApp`, …), not just Nuxt.

> Status: **P1 in progress.** The package, build, and decoupling pattern
> are established and proven on `KunButton`, `KunCard`, `KunIcon`,
> `KunRipple`. The remaining ~40 components port mechanically against the
> same pattern (see `docs/architecture.md §6`).

## Install

```bash
pnpm add @kungal/ui-vue @kungal/tokens vue
```

## Usage

```ts
// main.ts
import { createApp } from 'vue'
import KunUI from '@kungal/ui-vue'
import '@kungal/ui-vue/style.css' // component scoped styles (ripple, etc.)
import App from './App.vue'

createApp(App).use(KunUI).mount('#app')
```

```css
/* app.css */
@import 'tailwindcss';
@import '@kungal/tokens';
@source '../node_modules/@kungal/ui-vue/dist'; /* let Tailwind scan the lib */
```

```vue
<template>
  <KunButton color="primary" @click="...">Save</KunButton>
  <KunButton href="/docs" variant="light">Docs</KunButton>
</template>
```

Prefer explicit imports (tree-shaking) over the global plugin? Skip
`.use(KunUI)` and `import { KunButton } from '@kungal/ui-vue'` per file.

## How it's decoupled from Nuxt

The Nuxt original leaned on auto-imports and three Nuxt modules. Here:

| Nuxt original | `@kungal/ui-vue` replacement |
| --- | --- |
| auto-imported `computed`/`ref`/`cn`/components | explicit `import` from `vue` / `@kungal/core` / sibling files |
| `defineNuxtLink()` for `href` buttons/cards | `config.linkComponent` (default `<a>`; inject `RouterLink`/`NuxtLink`) |
| `@nuxt/icon` `<Icon>` | `config.iconComponent` (default `@iconify/vue`; inject `NuxtIcon`) |
| `@kungal/ui` Nuxt-layer Tailwind tokens | `@kungal/tokens` package |
| in-package `cn` / variant matrix / radius | `@kungal/core` (shared with the React layer) |

### Configuring the injectable slots

```ts
import { RouterLink } from 'vue-router'
import { provideKunUIConfig } from '@kungal/ui-vue'

// in a root component's setup()
provideKunUIConfig({
  rounded: 'lg',
  linkComponent: RouterLink, // KunUI passes the destination as `to`
})
```

`@kungal/ui-nuxt` (planned, P2) calls `provideKunUIConfig` with `NuxtLink` +
`@nuxt/icon` so the Nuxt DX is identical to today.

## Build

```bash
pnpm --filter @kungal/ui-vue build      # vite (JS+CSS) + vue-tsc (types)
pnpm --filter @kungal/ui-vue typecheck
```
