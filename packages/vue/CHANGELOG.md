# @kungal/ui-vue

## 0.2.2

### Patch Changes

- d32b6e5: Fix `Unknown file extension ".css"` crash under Nuxt SSR.

  KunUpload imports `vue-advanced-cropper`'s stylesheets, and the library build
  externalized those `.css` subpaths — so bare `import 'vue-advanced-cropper/dist/
style.css'` statements survived at the top of the published `dist/index.js`.
  Nuxt externalizes `@kungal/ui-vue` for SSR and handed those paths straight to
  Node, which can't load `.css` — crashing dev _and_ production SSR for any app
  that imported any Kun component (the cropper sits at the top of the barrel).

  The build now bundles all imported dependency CSS into `@kungal/ui-vue`'s single
  `dist/style.css` (which consumers already import) and ships JS with no runtime
  CSS imports; the cropper's JS stays external. No consumer changes needed.

  - @kungal/ui-core@0.2.2

## 0.2.1

### Patch Changes

- f48f420: Export `useBodyScrollLock`. The refcounted body scroll-lock composable that
  KunModal / KunDrawer / KunLightbox already use internally is now public, so apps
  can lock body scroll for their own overlays through the same shared counter
  (nested overlays won't unlock the body until the outermost one closes).
  - @kungal/ui-core@0.2.1

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

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

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
