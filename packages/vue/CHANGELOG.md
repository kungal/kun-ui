# @kungal/ui-vue

## 0.4.1

### Patch Changes

- 93b8446: KunTextarea: defer the first auto-grow height measurement to the next animation frame. Measuring `scrollHeight` synchronously in `onMounted` could read a too-tall height before the textarea was laid out (notably a chat input that first appears on mobile), which only corrected itself on the first keystroke. The deferred measure runs after layout, so an auto-grow textarea starts at its true single-row height.
  - @kungal/ui-core@0.4.1

## 0.4.0

### Minor Changes

- cb46d7b: `KunImage` / `KunImageNative` now default to `loading="lazy"`.

  Previously `loading` defaulted to unset, so the browser loaded every image
  eagerly. A page with many images (card grids, lists, avatars) fired them all at
  once and saturated the connection, starving the above-the-fold images — they
  filled in slowly behind a long-lingering skeleton, making the page feel stuck on
  images. `KunImage` already reserves space (its aspect-ratio box + skeleton), so
  deferring off-screen images causes no layout shift and shortens the critical
  path. `KunImageNative` also gains a `loading` prop (it had none before).

  **Opt your LCP / hero image back into eager loading:**
  `<KunImage loading="eager" fetchpriority="high" … />` — otherwise it's lazy like
  the rest, which can cost a little LCP for that one image.

### Patch Changes

- @kungal/ui-core@0.4.0

## 0.3.4

### Patch Changes

- 3a50b6a: KunAvatar: render the avatar URL exactly as given — stop deriving size variants
  in the component.

  KunAvatar used to turn `user.avatar` into a 100px thumbnail by string-replacing
  the extension (`.webp` → `-100.webp`, most recently host-aware `_100` / `-100`).
  That baked CDN-specific URL conventions into the UI library. KunAvatar now
  renders `user.avatar` as-is; `size` only controls the rendered dimensions.
  Empty/missing avatar still falls back to a deterministic sticker.

  **Migration (consumers now pass the exact URL to show):** for small avatars pass
  the pre-sized thumbnail your CDN exposes (e.g. content-addressed
  `…/<hash>_100.webp`, legacy `…/avatar-100.webp`); for profile/`original` sizes
  pass the full image. Your backend already knows the image host, so resolving the
  URL belongs there — not in the UI.

  - @kungal/ui-core@0.3.4

## 0.3.3

### Patch Changes

- 9e0bdc2: KunAvatar: pick the 100px-thumbnail variant separator by image family. Content-addressed image*service avatars (`…/aa/bb/<hash>.webp`) expose variants with an underscore (`<hash>_100.webp`), while legacy path-based avatars use a hyphen (`avatar-100.webp`). The previous hardcoded hyphen `-100` 404'd every new image_service avatar (blank top-bar/comment avatars after a user changed their picture). Now detects the two-level-hex hash path and uses `*`for those,`-` otherwise.
  - @kungal/ui-core@0.3.3

## 0.3.2

### Patch Changes

- 2bd491f: `KunModal`: the backdrop only dismisses when the press _started_ on the backdrop.

  The overlay used a bare `@click`, so pressing inside the modal (e.g. selecting
  text in an input), dragging the cursor onto the backdrop, and releasing there
  fired a `click` on the backdrop and closed the modal — "I let go of the mouse
  and the dialog vanished". The overlay now tracks the pointer-down target and
  treats the click as a dismiss only when both the press and the release are on
  the backdrop itself. `isDismissable` behaviour is unchanged.

  - @kungal/ui-core@0.3.2

## 0.3.1

### Patch Changes

- @kungal/ui-core@0.3.1

## 0.3.0

### Minor Changes

- 9b8cbae: Remove the `faded` variant.

  `faded` (tinted fill + border) was visually almost indistinguishable from
  `ghost`, so it's been dropped from `KunUIVariant`. This affects every variant
  consumer — `KunButton`, `KunChip`, `KunDropdown` and `KunInfo`.

  **Migration:** replace `variant="faded"` with `variant="flat"` (tinted fill, no
  border) or `variant="bordered"` (visible colored border); `ghost` stays for the
  outline look it overlapped with.

### Patch Changes

- Updated dependencies [9b8cbae]
  - @kungal/ui-core@0.3.0

## 0.2.5

### Patch Changes

- f0bbd79: Fix `KunDropdown` yanking the page to the top when opened.

  The menu is teleported to `<body>` and positioned by floating-ui's async
  `computePosition`. `open()` focuses the menu inside a `nextTick`, which fires
  before the position is committed — so the menu is still at its initial
  `top:0; left:0`, and focusing it there scrolled the document to the top (very
  visible on mobile: tapping a trigger low on the page yanked the viewport up).
  All three `focus()` calls now pass `{ preventScroll: true }`, so focus still
  lands on the menu/item (keyboard nav unchanged) without scrolling.

  - @kungal/ui-core@0.2.5

## 0.2.4

### Patch Changes

- 0ec98f9: Fix invisible outline variants (`bordered` / `faded` / `ghost`) and the
  off-center checkbox check.

  - **Variant table**: entries set `border-{color}` but never a border _width_ —
    which paints nothing in Tailwind v4, so `bordered` / `faded` / `ghost` showed
    no border on KunButton, KunChip and KunDropdown. Every variant now carries an
    explicit `border` width (transparent on `solid` / `light` / `flat` / `shadow`
    so box sizes stay uniform when switching variants), so the outline variants
    render again.
  - **KunCheckBox**: the checkmark was a full-size (1em) icon nudged down by its
    baseline offset, so it sat off-center and cramped the 20px box edge-to-edge.
    It's now an explicitly-sized 14px check centered with flexbox.

- Updated dependencies [0ec98f9]
  - @kungal/ui-core@0.2.4

## 0.2.3

### Patch Changes

- f0bc0fc: Fix stacked overlays: a newly-opened `KunModal` / `KunDrawer` could render
  _beneath_ an already-open one.

  All overlays shared a single z-index (`z-kun-modal`), so when several were open
  the stacking fell back to DOM order — and because each overlay `Teleport`s to
  `<body>` at its fixed template position, that order followed _declaration_
  order, not _open_ order. Opening a second modal from inside the first (when the
  second is declared earlier in the template) buried the newer one.

  Overlays now claim an incrementing z-index on open via the new
  `useKunOverlayZIndex` composable (anchored at the `--z-kun-modal` token so
  consumer overrides still apply; the counter resets when the last overlay
  closes), so the most-recently-opened overlay is always on top regardless of
  declaration/DOM order. `useKunOverlayZIndex` is exported for apps stacking their
  own overlays on the same layer. (`KunLightbox` uses a native `<dialog>` top
  layer and already stacked correctly.)

  - @kungal/ui-core@0.2.3

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
