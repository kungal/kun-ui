# @kungal/ui-vue

## 0.12.0

### Minor Changes

- 6e5836e: Make the navigational components render real, crawlable `<a href>` links.

  Google only follows `<a href>` — it doesn't click `<div @click>` / `<button>` /
  programmatic navigation. Several KunUI components navigated via `config.navigate`
  on a non-anchor element, so those links were invisible to crawlers. They now
  render a real anchor (`config.linkComponent` → `<a>` / `NuxtLink`), keeping the
  same navigation behavior (and working without JS):

  - **KunBrand** — the home/logo link was a `<div @click>`; now a real `<a>` to `to`
    (the canonical crawl entry point).
  - **KunPagination** — new `pageHref?: (page) => string` prop. When provided, the
    numbered page controls render `<a href>` per page, so paginated content is
    crawlable. Without it, behaviour is unchanged (plain buttons).
  - **KunAvatar / KunUserChip** — a profile-linking avatar was a `<div @click>`;
    now a real `<a>` to the user profile when there's a user to link to. KunUserChip
    wraps the **whole** chip (avatar + name) in one link so the name is anchor text,
    and gained an `isNavigation` prop (default `true`); the inner avatar is no longer
    a nested link.
  - **KunDropdown / KunContextMenu** — menu items gained an optional `href`. An item
    with `href` renders `<a role="menuitem" href>` (crawlable, for navigational
    menus); action items without `href` stay `<button>`.

  All changes are non-breaking: components without a navigation target (or
  pagination without `pageHref`, menu items without `href`) render exactly as
  before. Note KunBrand and a profile-linking KunAvatar/KunUserChip now render an
  `<a>` instead of a `<div>` — restyle if you targeted the element by tag.

### Patch Changes

- @kungal/ui-core@0.12.0

## 0.11.0

### Minor Changes

- 5403dca: SEO-first Tab panels + crawlable tab-as-route.

  KunTab was a headless tab **bar** (it rendered `role="tab"` buttons and exposed
  the active value, but no content). That left the SSR-SEO-critical decision —
  how to render and hide each section — entirely to the consumer, and the obvious
  `v-if` choice silently drops inactive panels from the indexable DOM. This adds a
  first-class, SEO-optimal content layer.

  **New `KunTabPanel` / `KunTabPanels`.**

  ```vue
  <KunTab v-model="active" :items="items" name="product" />
  <KunTabPanels v-model="active" name="product">
    <KunTabPanel value="overview">…</KunTabPanel>
    <KunTabPanel value="specs">…</KunTabPanel>
  </KunTabPanels>
  ```

  - **`mount` (default `"eager"`)** — `eager` server-renders **every** panel into the
    HTML so search engines index all of it; inactive panels are hidden, not removed.
    `"lazy"` renders on first activation then keeps (huge data, accepts the
    trade-off for unopened panels); `"unmount"` keeps only the active panel in the
    DOM (NOT crawlable — for heavy non-SEO widgets only). `forceMount` is a boolean
    alias for `eager`, familiar from Radix/Reka/MUI.
  - **Inactive panels hide with `hidden="until-found"`** (`hiddenStrategy`, default) —
    they stay indexed _and_ become reachable by in-page search (Ctrl+F),
    scroll-to-text fragments and deep links; the `beforematch` reveal flips the
    active tab to match. `hiddenStrategy="display"` falls back to `display:none`.
    SSR/first paint is flash-free (a `content-visibility` placeholder upgrades to
    the real attribute on the client).
  - Correct `role="tabpanel"` + `aria-labelledby`/`aria-controls` wiring (tab ↔
    panel ids derive from the tab `value`, namespaced by an optional `name`).

  **KunTab: `href` items now render a real `<a>` (crawlable tab-as-route).** Tabs
  with `href` previously rendered a `<button>` that navigated programmatically —
  invisible to crawlers. They now render `config.linkComponent` (`<a>` / `NuxtLink`)
  with the href, so each tab is a discoverable URL and works without JS; with JS the
  click is intercepted and routed through `config.navigate` (no double-nav). Tabs
  also gained `id` / `aria-controls` (and KunTab a `name` prop) to pair with panels.

### Patch Changes

- @kungal/ui-core@0.11.0

## 0.10.0

### Minor Changes

- 7f8495d: A unified motion system — smoother, more consistent animation across every
  component.

  **Motion tokens (@kungal/ui-tokens).** One easing set + duration scale so the
  whole library shares a rhythm instead of each component inventing its own:
  `--ease-kun-standard / -out / -in / -emphasized` (also exposed as Tailwind
  `ease-kun-*` utilities) and `--kun-dur-fast / -base / -slow / -exit`. Curves are
  asymmetric by design — decelerate on enter, accelerate on exit — and exits run
  ~30% shorter than enters. The opinionated base layer now also honours
  `prefers-reduced-motion: reduce` (WCAG 2.3.3).

  **Killed the layout-thrashing animations** (these caused visible stutter):

  - **KunTab** indicator no longer transitions `height` (it never changes between
    same-row tabs); it slides via `transform` and only its `width` animates.
  - **KunFadeCard** expands via the grid `0fr → 1fr` trick instead of `max-height`
    — no more `max-h-96` clipping of tall content, no per-frame height recalc.
  - **KunMessage** progress bar shrinks via `transform: scaleX` (compositor)
    instead of animating `width`.

  **Overlays retuned and made origin-aware.** KunModal now fades its backdrop
  (opacity only) while the panel rises + scales independently; KunDrawer’s backdrop
  and panel are timing-matched. KunDropdown / KunSelect / KunPopover / KunDatePicker
  / KunContextMenu now **grow out of their trigger** — `transform-origin` follows
  the floating-ui placement, so a menu that flips above its trigger correctly grows
  from its bottom edge. Every overlay shares the `ease-kun-*` curves and timing.

  **Micro-interactions.** KunSlider’s thumb gains a hover/focus ring halo (it had
  no feedback before); KunSwitch gains a keyboard `focus-visible` ring and a
  springier thumb settle; KunCheckBox’s check eases in with the emphasized curve.

  No component API changed. KunFadeCard now wraps its slot in a grid container (a
  DOM-structure change); if you targeted its immediate child with CSS, retarget the
  inner content.

### Patch Changes

- @kungal/ui-core@0.10.0

## 0.9.0

### Patch Changes

- 0a57065: Make the default corner radius rounder, HeroUI-style.

  The `--radius-kun-*` scale grows so the default control radius lands at HeroUI's
  12px (it was 8px):

  | bucket | before      | after |
  | ------ | ----------- | ----- |
  | sm     | 4px         | 6px   |
  | md     | 12 ←default | 12px  |
  | lg     | 12px        | 16px  |

  `md` (every component's default) is now **12px**, `lg` (floating panels — dropdown
  / context-menu / toast) is **16px**, which keeps their concentric nesting exact
  (panel 16 = item 12 + the 4px `p-1` inset). The `--kun-radius-scale` runtime knob
  still multiplies on top, and `none` / `full` still don't scale.

  One component needed a fix at the larger radius: **KunCheckBox**. Its small square
  box would look circular at a 12px token radius (12px ≈ half a 16–20px box), so the
  box now uses a proportional `35%` radius — a rounded square at every size, never a
  circle (matching how HeroUI derives its checkbox radius). The radio-look variant
  stays a full circle. No other component needed a size change; pill/circle controls
  (chips, avatars, switch, slider) are unaffected.

  - @kungal/ui-core@0.9.0

## 0.8.0

### Minor Changes

- 7624924: Extend the unified size system to the non-text controls.

  The first sizing pass only covered text controls (button/input/select/…). This
  brings the selection + display controls onto the same coherent system, grounded
  in how HeroUI / PrimeVue / Naive UI / Mantine / Ant size them.

  - **New shared selection scale (`kunSelectionSizeClasses`, @kungal/ui-core)** —
    KunCheckBox and KunRadioGroup now use **identical** box sizes (every major
    library does this), so a checkbox and a radio of the same size match. Box px by
    size: 12 / 14 / 16 / 20 / 24 — ≈ 0.5× the text-control height and ≈ 1.2–1.4× the
    label font, so the box sits optically level with its label.
  - **KunCheckBox gains a `size` prop** (`xs`–`xl`, default `md`). It was hardcoded
    at 20px while its sibling KunRadioGroup scaled 12→24 — now they share one scale
    (md box is 16px). The check glyph and label scale with it.
  - **KunSwitch gains a `size` prop.** Track/thumb scale on clean steps (track
    28×16 → 64×32, thumb = track height − 4); `md` is the original switch size.
  - **KunSlider gains a `size` prop.** Track 4→12px, thumb 14→28px; `md` unchanged.
  - **KunChip** moved onto its proper compact sub-scale (≈ 0.7× the button height at
    the same keyword — a tag is text + tight padding, not a tap target); its `md`/
    `lg`/`xl` vertical padding is slightly tighter so chips no longer read as tall
    as buttons.

  Components sized by their content/padding rather than a height (KunTooltip,
  KunDropdown/KunContextMenu menus, KunPopover, KunInfo) intentionally keep no
  `size` prop — no surveyed library gives them one.

### Patch Changes

- Updated dependencies [7624924]
  - @kungal/ui-core@0.8.0

## 0.7.0

### Minor Changes

- 29a39a7: Unify form-control sizing on one shared scale, and fix the `lg`/`xl` button
  proportions.

  - **New `kunControlSizeClasses` (@kungal/ui-core)** — a single source of truth for
    the per-size font + padding of every text-like form control. Padding-driven,
    `md` (~38px) as the anchor, `px:py` a clean 2:1, horizontal padding growing
    faster than vertical so a bigger control gets wider, not flatter.
  - **KunButton `lg`/`xl` fixed** — `lg` was `px-6 py-2` (3:1) and `xl` was
    `px-8 py-2.5` (3.2:1, a wide flat bar). They're now `px-5 py-2.5` and
    `px-6 py-3` (both 2:1), so large buttons look proportional. `md` is unchanged.
  - **One scale across controls** — KunButton, KunInput, KunSelect, KunDatePicker,
    KunTextarea and KunTagInput all consume the shared scale, so a button, input,
    select and date-picker of the same size line up at the same height in a row
    (md = 38px).
  - **KunSelect / KunDatePicker / KunTextarea gain a `size` prop** (`xs`–`xl`,
    default `md`). Previously they had no size and were locked one notch tighter
    than buttons (`px-3` / `p-3`); their default horizontal padding is now `px-4`,
    matching KunButton/KunInput `md`.

  Pill/compact display components (KunChip, KunBadge, KunAvatar) are intentionally
  not part of this form-control scale and keep their compact sizing.

### Patch Changes

- Updated dependencies [29a39a7]
  - @kungal/ui-core@0.7.0

## 0.6.2

### Patch Changes

- 7b521fc: KunCheckBox: add a gap between the box and its slotted content.

  The box and its content sat as adjacent flex children with no gap, so the box's
  right edge touched the start of slotted content (`<KunCheckBox>分类</KunCheckBox>`)
  — measured gap was 0. Only the `label` _prop_ path was spaced, because that
  `<label>` carried its own `ml-2`; slot/`v-html` content had nothing. The wrapper
  now uses `gap-2` (matching KunRadioGroup) and the redundant `ml-2` is dropped from
  the label, so the box→content gap is a uniform 8px whether you use the `label`
  prop or the default slot.

  - @kungal/ui-core@0.6.2

## 0.6.1

### Patch Changes

- dc437bb: Bundle the KunLoli mascots, fix Tab icon spacing, enlarge the Null/Loading
  images, and align KunTagInput's tag color.

  - **KunLoli**: the popup pulled its mascot from `/alert/{name}.webp` in the
    consuming app's public dir, so it showed a broken image in any app that didn't
    ship those four files. The four mascots are now bundled as base64 webp data
    URIs (same zero-setup, no-network policy as the bundled icons and the
    KunLoading / KunNull images), so `<KunLoli>` works out of the box.
  - **KunTab**: tabs with both an icon and a label had no gap between them (the
    size→gap map was defined but never applied), so the two were cramped together.
    The gap (`gap-1` / `gap-1.5` / `gap-2` by size) is now applied.
  - **KunNull / KunLoading**: the default mascot image is one size larger
    (`w-60`→`w-72` and `w-72`→`w-80` respectively).
  - **KunTagInput**: tags used a one-off color palette (`bg-primary/15
text-primary-700`) that read slightly off from the rest of the UI; they now use
    the same `flat` variant every other KunUI chip uses, so a tag's color matches.
  - @kungal/ui-core@0.6.1

## 0.6.0

### Minor Changes

- c15c5fc: Remove the `KunFavicon` component.

  `KunFavicon` was just a static, hardcoded inline SVG of the KunUI lollipop mark
  with no props — it carried no library value (an app that wants a logo ships its
  own asset, e.g. via `KunBrand`'s `iconSrc`). It's dropped from the `@kungal/ui-vue`
  exports and the `@kungal/ui-nuxt` auto-import list.

  **Migration:** if you were rendering `<KunFavicon />`, inline your own logo SVG or
  `<img>`/`KunImage` pointing at your favicon asset instead.

### Patch Changes

- @kungal/ui-core@0.6.0

## 0.5.2

### Patch Changes

- 8b39e7c: Make every component's corner radius follow the unified Kun radius system.

  Two classes of inconsistency were leaking through:

  - **KunButton / KunCopy defaulted `rounded` to `'lg'`** (12px) while every other
    component defers to the global `config.rounded` (default `md`, 8px) — so buttons
    looked visibly rounder than inputs, cards and surfaces sitting next to them. And
    because `'lg'` was a _prop default_ (never `undefined`), setting `config.rounded`
    globally couldn't pull buttons in line. Both now omit the default and resolve to
    `config.rounded` like the rest; pass `rounded` to override per-instance.

  - **Several components hardcoded raw Tailwind radii** (`rounded-lg` / `rounded-md` /
    `rounded-xl` / `rounded`) instead of the `rounded-kun-*` tokens, so they neither
    shared the unified scale nor responded to the runtime `--kun-radius-scale` knob.
    Converted to tokens (preserving each surface's pixel size and concentric nesting):
    KunTab (container + items + indicators), KunDropdown (panel + items), KunContextMenu
    (panel), KunSelect (listbox + options), KunMessage (toast card), KunPagination
    (page-jump input), KunRadioGroup (option row), KunTagInput (tag chip) and
    KunCheckBox (the box). Pill/circle elements using `rounded-full` are unchanged by
    design; KunLightbox's dark floating toolbars and KunLoading's mascot/overlay keep
    their own styling.

  Net effect: one global radius for all components, all of it now driven by
  `config.rounded` and scaled live by `--kun-radius-scale`.

  - @kungal/ui-core@0.5.2

## 0.5.1

### Patch Changes

- @kungal/ui-core@0.5.1

## 0.5.0

### Minor Changes

- b669cf4: Button/input sizing polish, a beautified checkbox, and a uniform corner radius.

  - **KunButton / KunInput sizes**: horizontal padding now grows with size while
    vertical padding stays tight (`py < px`), so larger sizes get _wider_, not
    fatter — matching modern libraries (shadcn `lg = px-8`, HeroUI fixed heights).
    `md` is unchanged; `lg`/`xl` are noticeably less bulky. Input vertical padding
    matches Button per size so the two line up in a form row.
  - **KunCheckBox**: the check is smaller (more breathing room in the box),
    stays centered, and scales in with a subtle pop. Cursor is now a pointer.
  - **Uniform corner radius**: every component now defers to the single global
    `config.rounded` (default `md`). Removed the per-component radius overrides on
    KunModal / KunDrawer / KunInfo / KunPopover / KunUpload (were `lg`) and
    KunRadioGroup, so all surfaces share one radius — set `config.rounded` once to
    restyle them together. (Pill/circle controls that use `rounded-full` are
    unaffected, by design.)

### Patch Changes

- @kungal/ui-core@0.5.0

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
