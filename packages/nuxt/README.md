# @kungal/ui-nuxt

The **Nuxt Layer** for KunUI. It wraps the Nuxt-decoupled
[`@kungal/ui-vue`](../vue) package and restores the full Nuxt developer
experience on top of it:

- **auto-imports** every KunUI component (`<KunButton>`, `<KunCard>`,
  `<KunIcon>`, …) — no per-file imports, and Nuxt generates their types so
  templates stay type-checked;
- **injects `NuxtLink`** as KunUI's `linkComponent`, so `href` buttons/cards
  render as SSR-aware client-side links (exactly like the original);
- **injects `@nuxt/icon`** as KunUI's `iconComponent` — used only as a
  *fallback* for icons not in KunUI's bundled set (KunUI's own ~24 icons are
  bundled inline in `@kungal/ui-core` and never fetched). For consumer icons,
  install `@iconify-json/*` and use `@nuxt/icon`'s local/client bundle mode so
  they aren't fetched either, or `registerKunIcons()` from `@kungal/ui-core`;
- registers `@nuxt/icon` + `@nuxt/image`;
- **auto-imports the composables** too (`useKunMessage`, `useKunUIConfig`, …)
  so they work with no import, like the original.

### Messages (toasts)

`useKunMessage()` is auto-imported. Mount the provider once (e.g. in
`app.vue` or your default layout) — it Teleports to body:

```vue
<template>
  <NuxtPage />
  <KunMessageProvider />
</template>
```

```ts
useKunMessage('Saved', 'success') // from anywhere, no import
```

It deliberately does **not** own a Tailwind entry — your app keeps one
stylesheet that imports Tailwind + `@kungal/ui-tokens` and declares the
`@source` scan (that path is node_modules-layout-specific). See below.

Net effect: a Nuxt app consuming this layer behaves like the original
Nuxt-native KunUI — **zero regression** — while the components underneath
are now framework-decoupled and shared with the (future) React layer.

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@kungal/ui-nuxt'],
})
```

Add one Tailwind entry stylesheet in your app and register it
(`css: ['~/assets/css/main.css']`):

```css
/* assets/css/main.css */
@import 'tailwindcss';
@import '@kungal/ui-tokens';
@source '../../node_modules/@kungal/ui-vue/dist'; /* component classes */
@source '../../node_modules/@kungal/ui-core/dist';   /* variant × color matrix */
```

(Tailwind v4 in Nuxt also needs the `@tailwindcss/vite` plugin in
`nuxt.config.ts` → `vite.plugins`.) That's it:

```vue
<template>
  <KunButton color="primary">Save</KunButton>
  <KunButton href="/docs" variant="light">Docs</KunButton> <!-- NuxtLink -->
  <KunIcon name="lucide:heart" />                          <!-- @nuxt/icon -->
</template>
```

## How the bridge works

`@kungal/ui-vue` deliberately has no Nuxt dependency — its `linkComponent` /
`iconComponent` config slots default to a plain `<a>` and `@iconify/vue`.
This layer's plugin (`app/plugins/kun-ui.ts`) calls `installKunUIConfig`
at the app level with `NuxtLink` + a thin `@nuxt/icon` wrapper, so every
KunUI component picks up the Nuxt implementations via `inject`. Swapping
the layer out (or running the same components in a plain Vue app) falls
back to the framework-neutral defaults automatically.
