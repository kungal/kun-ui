# @kungal/ui-vue

## 0.2.0

### Minor Changes

- e3cf45d: Bundle the default KunLoading / KunNull mascot images (base64 data URIs) — zero
  consumer setup, no network request, consistent with the bundled-icon policy.

  - `KunLoading`: default `src` is now a bundled image (previously relied on a
    consumer-provided `/kun.webp` public asset).
  - `KunNull`: default image is now bundled (previously fetched a random sticker
    from the KunUI CDN via `getRandomSticker()`); added an optional `src` prop to
    override it.
  - Both images now render at their natural aspect ratio instead of being forced
    into a square.

- 35358f2: Rename two packages onto a consistent `ui-` namespace:

  - `@kungal/core` → `@kungal/ui-core`
  - `@kungal/tokens` → `@kungal/ui-tokens`

  `@kungal/ui-vue` and `@kungal/ui-nuxt` are unchanged in name but depend on the
  renamed packages, so all four are released together.

  **Migration:** update your dependencies and every `import` / `@import` /
  `@source` that referenced the old names:

  ```diff
  - pnpm add @kungal/ui-vue @kungal/core @kungal/tokens
  + pnpm add @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens
  ```

  ```diff
    @import 'tailwindcss';
  - @import '@kungal/tokens';
  + @import '@kungal/ui-tokens';
    @import '@kungal/ui-vue/style.css';
  - @source '../../node_modules/@kungal/core';
  + @source '../../node_modules/@kungal/ui-core';
  ```

  ```diff
  - import { registerKunIcons } from '@kungal/core'
  + import { registerKunIcons } from '@kungal/ui-core'
  ```

  The old `@kungal/core` / `@kungal/tokens` packages are deprecated on npm and
  will not receive further updates.

### Patch Changes

- d5ffbb6: Fix KunIcon color inheritance and polish the loading/empty states:

  - **KunIcon**: the inline SVG bodies paint with `currentColor`, but the base
    layer's `* { color }` rule was landing on the `v-html`'d inner nodes and
    pinning them to the foreground color — so `text-*` on (or above) `<KunIcon>`
    didn't actually color the icon. The inner nodes now inherit the icon's color.
  - **KunLoading / KunNull**: larger default image (`w-72` / `w-60`) shown at its
    natural aspect ratio instead of being squished into a square.
  - **KunNull**: the empty-state caption is now muted (`text-default-500`), and
    the default caption text changed to `莲说这里什么都没有`.

- Updated dependencies [35358f2]
  - @kungal/ui-core@0.2.0

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
- Updated dependencies [c532a02]
  - @kungal/ui-core@0.1.1
