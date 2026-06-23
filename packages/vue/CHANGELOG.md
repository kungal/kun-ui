# @kungal/ui-vue

## 2.3.0

### Minor Changes

- 349b46d: feat(vue): overlays avoid viewport collisions by default + cap size on small screens

  Aligns the floating overlays with Floating UI / Radix defaults so they never
  overflow the screen at an edge or on a short viewport:

  - **KunPopover** now flips, shifts AND caps its size by default (`autoPosition`
    defaults to **`true`** — it was `false`, so a popover near an edge used to
    overflow). Set `auto-position="false"` to honour `position` verbatim. (Panels
    with `show-arrow` skip the size-cap so the caret isn't clipped.)
  - **KunDropdown** and **KunDatePicker** now cap their height to the available
    space and scroll, instead of overflowing off-screen on a short viewport.
  - New `maxSize` option on the internal `useKunFloating` (size() middleware:
    max-height/width + scroll) — one implementation reused across overlays. Select /
    Autocomplete already did this.

### Patch Changes

- @kungal/ui-core@2.3.0

## 2.2.0

### Minor Changes

- 8ce8049: feat(vue): KunPopover `opaque` prop — keep a menu solid on a frosted site

  Sites with a background image often lower `--kun-surface-opacity` to frost every
  surface — which also makes popover/hover-menu panels translucent and hard to read.
  `opaque` forces a solid `content1` background (from its raw channels, ignoring the
  surface-opacity alpha; still light/dark adaptive). Note this is the only reliable
  way: setting `--kun-surface-opacity:1` on the panel does NOT work, because the
  themed `--color-content1` is resolved at `:root`, not on the element.

### Patch Changes

- @kungal/ui-core@2.2.0

## 2.1.1

### Patch Changes

- c3f4c91: fix(vue): KunPopover restores focus to the trigger on every close

  Hardens focus handling found while stress-testing hover menus: if focus was
  inside the panel when it closed via a path that doesn't restore it itself —
  e.g. a hover `group` sibling stealing the open menu — focus is now pulled back to
  the trigger instead of being orphaned on the detached panel node. Covers all
  close paths (group steal, click-outside, programmatic).

  - @kungal/ui-core@2.1.1

## 2.1.0

### Minor Changes

- d566c45: feat(vue): KunPopover `trigger="hover"` + `useKunPointerMenu` — navigation hover menus done right

  Adds first-class hover menus without the usual traps, via a reusable composable
  `useKunPointerMenu` (also exported):

  - **Coordinate safe-triangle** — on leaving the trigger you can travel to the
    panel without it closing. Computed from `clientX/Y` + `getBoundingClientRect()`,
    so it works even though panels are `Teleport`ed to `<body>` (DOM-containment
    safe-polygons break across portals; coordinates don't).
  - **`openDelay` / `closeDelay`** and a shared **`group`** so a row of menus
    switches instantly between siblings and keeps only one open (menu-bar feel).
  - **No focus steal on hover** (unlike the click open), and **touch falls back to
    click** (`pointerType` gate) so the first tap doesn't follow a link — the
    classic a11y trap. Click / keyboard / Esc / click-outside all still work.

  `KunPopover` gains `trigger` ('click' default | 'hover'), `openDelay`,
  `closeDelay`, `group`. `KunDropdown` (role=menu) stays click-only by design.

### Patch Changes

- @kungal/ui-core@2.1.0

## 2.0.1

### Patch Changes

- 373c616: fix(vue): KunCarousel runaway auto-advance / "wild flicker" on Chromium

  The seamless loop is a scroll-jacked container — it programmatically reorders
  slides (CSS `order`) and resets `scrollLeft` to re-home. Chromium's default
  **scroll anchoring** reacts to that reorder/reflow by nudging `scrollLeft` to keep
  an anchor element in view; the re-home logic then misreads the nudge as "the user
  moved to the next slide", advances, reorders again, and loops — so the carousel
  races through slides far faster than the autoplay interval (looks like everything
  flickering/stacking; reported on Chrome + Edge, desktop). The track now sets
  `overflow-anchor: none`, handing scroll control entirely to the component. No API
  or behaviour change otherwise.

  - @kungal/ui-core@2.0.1

## 2.0.0

### Major Changes

- c0e69ae: Remove the `ghost` variant.

  `ghost` was visually indistinguishable from `bordered`: at rest both are just
  `border + bg-transparent + colored text`. `ghost` only added a faint `hover` fill,
  so the two looked identical until hovered. It has been dropped from `KunUIVariant`,
  which affects every variant consumer — `KunButton`, `KunChip`, `KunDropdown` and
  `KunInfo`.

  **Migration:** replace `variant="ghost"` with `variant="bordered"` (the outline
  look it overlapped). For a softer fill instead, `variant="flat"` or `variant="light"`.

  (This mirrors the earlier removal of the `faded` variant for the same reason; the
  remaining set — solid / bordered / light / flat / shadow — has no visual overlap.)

### Patch Changes

- Updated dependencies [c0e69ae]
  - @kungal/ui-core@2.0.0

## 1.14.2

### Patch Changes

- @kungal/ui-core@1.14.2

## 1.14.1

### Patch Changes

- 6d0bce9: fix(vue): DatePicker / Autocomplete focus-on-open no longer risks scrolling the page

  Hardens the two remaining popup components that still used a bare `.focus()`:
  DatePicker (focus the root on open) and Autocomplete (refocus the input after
  select / clear) now pass `{ preventScroll: true }`. The menu components already
  did this; this brings the last two in line so a portaled-panel open can never
  jump the page to the top. (The public `Autocomplete.focus()` method keeps the
  default so the caller controls scroll intent.)

  - @kungal/ui-core@1.14.1

## 1.14.0

### Minor Changes

- cf7f212: feat(vue): KunReaction `toggle` (action mode) + default-slot visible label

  Two additive, backward-compatible hooks so a whole actions row can be one
  component, and so the text is part of the click target:

  - **`toggle` prop** (default `true`). `false` = a one-shot ACTION (share / 更多 …)
    in the same compact skin: no pressed state, no burst, just a tactile pop —
    handle it with a native `@click`. A reactions row no longer needs to mix in a
    heavier icon button.
  - **Default slot** = a visible label rendered INSIDE the button, so clicking the
    TEXT (not just the icon) toggles too — the clean fix for "点 收藏游戏 文字也该收藏".
    It inherits the active colour; when present it becomes the accessible name (the
    `label` prop is the aria fallback only when there's no visible label). Omit it to
    keep the compact icon-(+count) reaction.

### Patch Changes

- @kungal/ui-core@1.14.0

## 1.13.0

### Minor Changes

- 9cd2af8: feat: single source of truth for component registration + `KunUIResolver`

  Kills the class of bug where a newly-added component is registered for plain Vue
  but forgotten elsewhere (the recent `Failed to resolve component: KunReaction`).

  - **One source** — `KUN_COMPONENT_NAMES` (exported from `@kungal/ui-vue`). The
    plain-Vue plugin types its registry as `Record<KunComponentName, …>`, so a
    missing/extra entry is a **compile error**, not a silent runtime failure. The
    Nuxt layer's auto-import list and the docs meta now derive from this list
    instead of hand-maintaining their own copies — they can no longer drift.
  - **`KunUIResolver`** (new, from `@kungal/ui-vue`) for `unplugin-vue-components`,
    matching Element Plus / PrimeVue: Vite apps get on-demand, tree-shaken
    auto-import of every KunUI component with zero registration and zero list —
    new components work automatically.

    ```ts
    import Components from "unplugin-vue-components/vite";
    import { KunUIResolver } from "@kungal/ui-vue";
    // plugins: [Components({ resolvers: [KunUIResolver()] })]
    ```

  No change to existing usage (`app.use(KunUI)`, the Nuxt layer auto-import).

### Patch Changes

- @kungal/ui-core@1.13.0

## 1.12.1

### Patch Changes

- @kungal/ui-core@1.12.1

## 1.12.0

### Minor Changes

- 886e58f: feat(vue): KunReaction — `#icon` slot + arbitrary `color`

  Two additive, backward-compatible hooks for fully custom reactions (e.g. a "推"):

  - **`#icon` slot** (scoped `{ active }`) replaces the whole glyph — an emoji,
    image or custom SVG, and it can differ by active state. Slot content still gets
    the pop + burst animations.
  - **`color`** now also accepts any CSS colour string (e.g. a brand `#ff6a00`), not
    just a palette key. The whole effect runs through `currentColor`, so the icon
    fill, the pop and the burst (ring + sparks) all follow it with no extra wiring.

  Existing `icon` / palette-`color` usage is unchanged.

### Patch Changes

- @kungal/ui-core@1.12.0

## 1.11.0

### Minor Changes

- 160667d: feat(vue): KunReaction — a compact like/reaction control with count

  A purpose-built reaction control so a like + count doesn't bloat into a wide
  padded text button. It's a tight pill (icon + optional count), a proper toggle
  (`aria-pressed`, accessible name includes the count), and it animates on click —
  all pure CSS/Vue, no external library:

  - icon fills + colours when active;
  - a bouncy pop;
  - a one-shot burst (expanding ring + radiating sparks) when liking;
  - the count rolls in the direction it changed.

  `v-model` is the active state; `v-model:count` the count (auto ±1 on click, the
  parent can override for server sync). Props: `icon` (default a heart), `color`
  (default danger), `size`, `disabled`, `disableAnimation`, `label`. All animation
  is off under `prefers-reduced-motion`.

### Patch Changes

- @kungal/ui-core@1.11.0

## 1.10.1

### Patch Changes

- 56bd509: fix(vue): vertical underlined Tab indicator jumping on hydration (SSR)

  The pre-hydration fallback bar (drawn before the JS-measured indicator mounts) was
  hardcoded to the BOTTOM edge, so a vertical `underlined` tab showed its indicator
  under the active tab on the server and then jumped to the LEFT once the measured
  indicator took over. The fallback now follows orientation — a LEFT inset bar for
  vertical, BOTTOM for horizontal — so the SSR axis matches the final one and there's
  no jump.

  - @kungal/ui-core@1.10.1

## 1.10.0

### Minor Changes

- ae0c566: feat(vue): KunCarousel seamless infinite loop (`loop`, default on)

  Autoplay used to smooth-scroll all the way back to the first slide at the end — a
  jarring reverse sweep. KunCarousel now loops seamlessly by **repositioning** slides
  (a CSS `order` ring), with NO cloned DOM: the slide physically to the right of the
  last is always the first, and after each scroll settles the position is re-homed in
  the same frame (only off-screen slides shuffle, so the reset is invisible). Autoplay
  glides forward past the end into the start; the arrows wrap both ways too.

  - New `loop` prop, **default `true`** (auto-disabled when there are too few slides to
    loop without glitches; pass `loop="false"` for the old bounded behaviour).
  - Reposition, not cloning → no duplicate nodes for screen readers to read twice.
  - Keeps the native scroll-snap base (touch swipe + momentum + SSR).

  Note: default-on, so existing carousels now loop — autoplay no longer snaps back, and
  the arrows wrap around instead of disabling at the edges.

### Patch Changes

- @kungal/ui-core@1.10.0

## 1.9.5

### Patch Changes

- 770b77b: fix(vue): DatePicker trigger — gap + truncation between text and calendar icon

  The trigger only had `justify-between` (no gap), so in a narrow field the
  placeholder/value text butted right against the calendar icon with no spacing
  (and looked vertically off). Adopted the Select trigger's pattern: `gap-2` on the
  button, `min-w-0 flex-1 truncate` on the text, and `shrink-0` on the icon group —
  so there's always an 8px gap, the text truncates gracefully, and the icon stays
  put. (Audited Select, Autocomplete and the input family — they already do this;
  DatePicker was the only one missing it.)

  - @kungal/ui-core@1.9.5

## 1.9.4

### Patch Changes

- 92d0ff4: fix: DatePicker month/year nav closing on mobile; Enter key hijacked to "Next"

  - **DatePicker**: the calendar panel is teleported to `<body>`, so its month/year
    nav buttons were treated as outside-clicks and closed the picker (felt on mobile,
    where you must tap the nav). Added the same `dropdownRef.contains` guard that
    Select/Autocomplete already use; outside clicks still close it.
  - **Mobile "Next" key**: on a page with several fields the virtual keyboard shows a
    "Next" action that jumps to the next field instead of firing Enter — breaking
    inputs whose Enter does an in-component action. Declared `enterkeyhint` on those:
    TagInput (`enter`, add tag), Autocomplete & searchable Select (`done`, pick the
    active option), Pagination jump field (`go`). Plain Input/Textarea/NumberInput/
    PinInput are unchanged (field-to-field "Next" is correct there).
  - @kungal/ui-core@1.9.4

## 1.9.3

### Patch Changes

- 0b42fd3: perf: stop shipping backdrop-filter on every surface (mobile scroll jank)

  KunCard shipped `backdrop-filter: blur(var(--kun-background-blur))` on EVERY card —
  and the default blur was `0px` over an opaque surface, so it did nothing visually
  while still promoting each card to a compositing layer and running the backdrop
  pipeline. `backdrop-filter: blur()` is the #1 cause of janky scrolling on mobile
  (a 120Hz phone can drop to ~30–60Hz). With many cards per page the layers piled up.

  - KunCard / KunModal now emit `backdrop-filter` only via the new opt-in
    `kun-backdrop` utility, which is `none` by default (free — no layer, no blur pass).
  - New token `--kun-backdrop-filter` (default `none`) **replaces `--kun-background-blur`**.
    A glass site opts in for every raised surface at once:
    `:root { --kun-surface-opacity: 0.7; --kun-backdrop-filter: blur(12px); }`

  BREAKING (glass only): if you set `--kun-background-blur: 12px`, switch to
  `--kun-backdrop-filter: blur(12px)`. Sites that never enabled glass are unaffected
  (and get smoother scrolling for free).

  - @kungal/ui-core@1.9.3

## 1.9.2

### Patch Changes

- b673935: fix(tokens,vue): softer neutral hairline + bordered cards by default

  - KunCard shows a faint hairline border by default again (it was borderless during
    the filled-surface work) — with the lighter page and softer shadows, a hairline
    delineates the card better than shadow alone.
  - The shared neutral border token (`--color-kun-border` / the `border-kun` utility)
    drops from `default-200` to `default-100` — a lighter hairline that delineates a
    surface without framing it. Every consumer softens at once: inputs, textarea,
    select & other controls, accordion, tabs, dividers, drawer rules, etc. Error
    borders (danger) and focus rings are unaffected.
  - @kungal/ui-core@1.9.2

## 1.9.1

### Patch Changes

- 7a2c64d: fix(vue,tokens): bordered inputs, softer shadows, lighter page background

  - Form controls (Input, Textarea, Select, NumberInput, Autocomplete, DatePicker,
    TagInput flat, PinInput, Pagination jump field, Select's inline search) get a
    card-like neutral border back on top of the filled surface — the borderless
    fill was too hard to spot on a card. Error state recolours the border to danger
    instead of a persistent ring. (= the shadcn "border + fill + subtle shadow" input.)
  - Elevation scale softened ~30% across all three tiers (sm/md/lg) — lighter, tighter
    shadows on cards, inputs, dropdowns, modals.
  - Light page background nudged brighter (#f2f2f5 → #f4f4f7). Dark unchanged.
  - @kungal/ui-core@1.9.1

## 1.9.0

### Minor Changes

- 29a6a07: feat(vue): KunCard `padding` prop + roomier default; bump KunInfo padding

  KunCard's inner padding was `p-3` (12px) — tighter than the modern norm (shadcn /
  Ant use 24px, MUI 16px) and tighter than KunModal's own 24px, which made
  card-heavy UIs feel cramped.

  - New `padding` prop on KunCard: `none` | `sm` (12px) | `md` (20px) | `lg` (24px),
    **default `lg`**. Inner section `gap` also grows 12px → 16px. Pass `sm` for the
    old compact density, `none` for a full-bleed card (e.g. just a cover image).
  - KunInfo padding 12px → 16px to match.

  Visual change: cards/info are roomier by default. Set `padding="sm"` to keep the
  previous density.

### Patch Changes

- @kungal/ui-core@1.9.0

## 1.8.3

### Patch Changes

- @kungal/ui-core@1.8.3

## 1.8.2

### Patch Changes

- 117063e: fix(tokens,vue): give surfaces breathing room + refine KunCard hover

  - The light page background is a touch deeper (`#f5f5f7` → `#eeeef1`) so white
    cards/surfaces pop more (≈17 vs ≈10 units) and there's room for interaction
    states. Dark mode is unchanged (it already had ample headroom).
  - KunCard hover feedback now applies only to interactive cards (`href` /
    `clickable`) or an explicit `isHoverable`; a plain static card no longer reacts.
  - Hover is a faint `foreground` state layer (≈3%, via `::after`) — darkens
    slightly in light, lightens in dark — and stays clearly brighter than the page
    (no surface-colour swap, no shadow change).
  - KunNumberInput stepper buttons use `hover:bg-foreground/8` (a normal control
    hover) instead of the absolute `bg-default-100`.
  - @kungal/ui-core@1.8.2

## 1.8.1

### Patch Changes

- @kungal/ui-core@1.8.1

## 1.8.0

### Minor Changes

- 3e821c4: feat(tokens,vue): surface-elevation system — cards & inputs pop by fill+shadow, not borders

  Move from a border-defined look to an elevation scale. The page background is now
  a soft neutral (light `#f5f5f7`, dark near-black `#0a0a0a`) instead of pure
  white/black, so raised surfaces read as raised:

  - **Card** is a raised surface — `bg-content1` (`#fff` / `#18181b`) + `shadow-kun-sm`;
    border is now OFF by default (`bordered` is opt-in). It no longer shares the
    page background.
  - **Inputs are borderless and share the card surface**: Input, Textarea, Select,
    NumberInput, TagInput, PinInput, Autocomplete, DatePicker trigger and the
    Pagination field use `bg-content1` + `shadow-kun-sm` (same fill as a card, lifted
    by a small shadow). The error state is a danger **ring**, not a border.
  - **Floating panels lose their border** and rely on shadow + the `content1`
    surface: Dropdown, Select/Autocomplete lists, ContextMenu, Popover, Tooltip,
    DatePicker calendar, Modal, Drawer.
  - **Placeholder** now uses a theme-adaptive `::placeholder` colour (the browser
    default grey didn't follow light/dark).

  Visual change only; component APIs are unchanged except `KunCard`'s `bordered`
  default (true→false) and `KunTagInput`'s `variant` default (bordered→flat).

### Patch Changes

- @kungal/ui-core@1.8.0

## 1.7.0

### Minor Changes

- 82de3b5: feat(tokens): regenerate the semantic palette in OKLCH with contrast-guaranteed on-colors

  The whole semantic color system is now **generated** (scripts/gen-tokens.mjs,
  OKLCH via culori) instead of hand-authored HSL. Each hue is defined once by its
  OKLCH hue + a vivid `solidL`; every shade is laid on a perceptual lightness ramp
  (so `-500` means the same perceived lightness for every color), and each color
  ships a paired **`--color-{c}-foreground`** on-color DERIVED by measured WCAG
  contrast. The generator asserts AA on every solid (fill, text) pair in BOTH light
  and dark and fails the build on any regression — illegible solids can't ship
  again. Adds the previously-missing `-950` shade.

  What changes visually: solids keep HeroUI-style vivid fills (bright amber warning,
  bright green success — no more muddy darkened `-600` fills), with white text on
  the medium hues (primary/danger/default) and a refined dark tint on the bright
  ones (secondary/success/warning/info). Solids are now mode-independent, so the
  per-variant `dark:bg-{c}-{n}` pins are gone. **This is a visual change** to every
  colored surface; the component API (color/variant names) is unchanged.

  `@kungal/ui-core`: `kunSolidClasses` / `kunSolidFgClasses` / `kunSolidBgClasses`
  and the Button solid/shadow rows now use `bg-{c} text-{c}-foreground`. CheckBox,
  DatePicker, Switch, Carousel drop their hardcoded white/black + dark pins.

### Patch Changes

- Updated dependencies [82de3b5]
  - @kungal/ui-core@1.7.0

## 1.6.3

### Patch Changes

- 0019f45: fix(vue): icon-only buttons now match the height of same-size text buttons

  `isIconOnly` previously only swapped the padding (`p-2.5` etc.), so an icon-only
  button collapsed to the icon's `1em` height instead of the text line-height —
  leaving it ~8px shorter than a text button of the same `size` and breaking
  alignment in a toolbar row. Icon-only buttons are now a fixed square whose side
  equals the same-size text-button height (the new `kunControlSquareClasses`),
  matching how shadcn/HeroUI/Chakra/Ant size their icon buttons. The icon stays at
  its natural `1em`, centered.

  Also pins `KunPagination`'s prev/next arrows to `size="sm"` so they line up with
  the (already `sm`) numbered page buttons — without it the now-correct default
  `md` icon button would render 4px taller than the numbers.

  - @kungal/ui-core@1.6.3

## 1.6.2

### Patch Changes

- 05f2bee: chore: ship CHANGELOG.md in the published packages

  `CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
  so downstream can read the per-version changes straight from the npm package
  page — not only from the GitHub repo. (Releases also now appear on GitHub
  Releases and the docs site's auto-generated /changelog page.)

- Updated dependencies [05f2bee]
  - @kungal/ui-core@1.6.2

## 1.6.1

### Patch Changes

- 498a9c1: fix(vue): Accordion duplicate ids + Carousel dot indicators

  Two issues found reviewing the 1.6.0 components:

  - **KunAccordion**: header/panel ARIA ids were derived from the item `value`, so
    two accordions reusing the same values (e.g. `a`/`b`) emitted duplicate ids —
    invalid HTML and a broken `aria-controls` target. Ids are now generated with
    Vue's SSR-stable `useId()`, so they're globally unique regardless of `value`.
    (`name` stays as an optional readable prefix.)
  - **KunCarousel**: with `slidesPerView > 1` the dots rendered one-per-slide, but
    the last `slidesPerView − 1` of them could never become active. Dots now map to
    reachable scroll positions (`maxIndex + 1`), so every dot works. The dots also
    switched from an incorrect `role="tab"` (with no tabpanels) to plain buttons
    with `aria-current`, and an internal computed no longer shadows the
    `showArrows` prop.
  - @kungal/ui-core@1.6.1

## 1.6.0

### Minor Changes

- 5d9ced9: feat(vue): five new components — Accordion, Carousel, Skeleton, Steps, Timeline

  Adds the components the kungal apps were repeatedly hand-rolling on top of KunUI.
  All are SSR-safe and accessible, and reuse the shared design tokens / contrast
  helpers.

  - **KunAccordion + KunAccordionItem** — collapsible sections. Single-open by
    default or `multiple`; controlled via `v-model` (string / string[]) or
    uncontrolled from `defaultValue`. `light` / `bordered` / `splitted` variants.
    The reveal uses the CSS grid `0fr → 1fr` trick — animates real height with no
    JS measurement and renders collapsed in SSR HTML (no hydration flash). Proper
    `aria-expanded` / `aria-controls`, and the closed panel is `inert`.
  - **KunCarousel + KunCarouselItem** — horizontal slider on native CSS
    scroll-snap, so touch swipe + momentum work with zero JS and it renders
    server-side. Prev/next arrows, dot indicators (read from scroll position) and
    optional `autoplay` are progressive enhancements; autoplay pauses on
    hover/focus and is off under reduced-motion. `slidesPerView` for thumbnail
    strips.
  - **KunSkeleton** — content loading placeholder (`text` / `rect` / `circle`),
    `loaded` swaps in the real content via the default slot, pulse respects
    reduced-motion.
  - **KunSteps** — multi-step indicator (`items` + `current`), horizontal /
    vertical, done / active / pending states, contrast-correct filled markers.
  - **KunTimeline + KunTimelineItem** — vertical timeline with coloured dots or
    icon medallions; the connecting line is pure CSS.

### Patch Changes

- @kungal/ui-core@1.6.0

## 1.5.0

### Patch Changes

- 13005ea: fix(vue): legible foreground on solid/filled color variants (esp. dark mode)

  Solid fills painted white text on `bg-{color}`, which has two problems verified
  by contrast measurement:

  1. The dark color scale is inverted, so a plain `bg-{color}` renders **pale** in
     dark mode — white text dropped to ~1.0–2.5:1 (the `solid` Info `info` callout
     was essentially invisible, white on near-white).
  2. The light hues (secondary / success / warning / info) are light in **both**
     modes, so white text fails WCAG everywhere (~2:1), not just in dark mode.

  New single source of truth in `@kungal/ui-core` — `kunSolidClasses`,
  `kunSolidBgClasses`, `kunSolidFgClasses` — pairs each fill with a `dark:bg-*`
  pin (stays saturated in dark mode) and a contrast-correct foreground: the dark
  hues (default / primary / danger) keep white, the light hues take dark text.
  Every solid foreground now clears WCAG AA in both modes (≈4.1–10.3:1).

  Applied to: Button / Chip (shared variant matrix), Info (`solid` / `shadow` — the
  reported bug; its title no longer overrides the box foreground), Badge, Progress
  (on-bar label), Tab (`solid` / `pills`), DatePicker (selected day), CheckBox
  (checked fill + check/dash mark), Switch (on-track).

  Visible change: `secondary` / `success` / `warning` / `info` solid components now
  use dark text instead of (illegible) white.

- Updated dependencies [13005ea]
  - @kungal/ui-core@1.5.0

## 1.4.2

### Patch Changes

- 6d70e87: fix(vue): keep `bordered` variants the same size as the others (Info, TagInput)

  A `bordered` variant adds a real border, which enlarges the element unless the
  other variants reserve the same width with a transparent border. Button / Chip
  (via the shared variant matrix) and Tab already did this; Info and TagInput did
  not, so their `bordered` variant was ~2–3px larger than `solid` / `light` /
  `flat`.

  - **Info**: every variant now carries the same `1.5px` border (transparent for
    the non-bordered ones), so switching variants no longer changes the box size.
  - **TagInput**: the wrapper always reserves a `1px` transparent border; `flat`
    and `bordered` are now identical in size, and the error border is now visible
    on the `flat` variant too (it previously had no border width to colour).

  No visual change to the non-bordered variants beyond the size becoming
  consistent — the reserved border is transparent.

  - @kungal/ui-core@1.4.2

## 1.4.1

### Patch Changes

- 0752bc1: fix(vue): SSR-safe active highlight for KunTab

  The Tab active indicator was measured on the client (`offsetLeft`/`offsetWidth`)
  and so was absent from server-rendered HTML — on first paint (and the whole
  pre-hydration window) the selected tab showed only a text-color change, with the
  underline/pill missing. For the `solid` variant the active tab was effectively
  invisible (white text on no background) until hydration.

  The selected tab now carries a CSS-only active highlight that renders in SSR
  (inline inset box-shadow for `underlined`; background tint for `solid` / `light`);
  the JS-measured sliding indicator takes over after the client mounts, with no
  hydration mismatch. The indicator is also re-measured on mount and via a
  `ResizeObserver`, so web-font swaps and container resizes no longer leave it
  stale. `pills` / `bordered` were already SSR-safe and are unchanged.

  - @kungal/ui-core@1.4.1

## 1.4.0

### Minor Changes

- cf9196c: **KunContent: opt-in editorial prose typography + first-class code-copy & compact density.**

  - **New opt-in stylesheet `@kungal/ui-vue/prose.css`** — a token-driven editorial type system for any `.kun-prose` container (comfortable measure, modular heading scale, generous CJK-friendly leading, refined lists/blockquote/code/table/links, auto light/dark). It is a _separate import on purpose_: KunContent's `style.css` still ships only behaviour, so downstreams that already own their own `.kun-prose` typography are unaffected — they simply don't import it.
  - **Code-block copy button is now built in.** KunContent auto-injects a self-styled (token-aware, dark-mode-aware) copy button into each code block, with click-to-copy + instant icon feedback. Idempotent: a block that already carries a `.copy` button (e.g. one emitted by a Markdown pipeline) is left untouched, so it never doubles up — downstreams can drop their own copy implementations.
  - **New `compact` prop** on KunContent (adds `.kun-prose-compact`) for tighter comment/reply streams — smaller base size, leading and spacing, full-width instead of the 40rem measure. Visual effect requires importing `@kungal/ui-vue/prose.css`.

  Syntax highlighting remains a content-pipeline concern (not bundled); the prose styles theme plain code blocks neutrally and compose with pre-highlighted markup.

### Patch Changes

- @kungal/ui-core@1.4.0

## 1.3.0

### Minor Changes

- 27e40d4: **Content spoilers**: the particle mask now follows the real text shape. Multi-line spoilers are masked **line-by-line**, and space-separated text is masked **word-by-word** (gaps at spaces and ragged line ends stay clear) instead of one solid block — the cover lines up with how the text actually flows. CJK / no-space text degrades naturally to per-line masking.

  Word/line rectangles are measured once per layout via the Range API (never per frame), and the per-frame cost stays capped (the particle budget and tint fills are independent of text length), so animation never janks regardless of size. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"`).

### Patch Changes

- @kungal/ui-core@1.3.0

## 1.2.0

### Minor Changes

- 8368cfe: **Content spoilers**: reworked the click-to-reveal spoiler effect. The covered region now renders an animated dust/particle field (spawn → drift → fade → respawn) instead of a flat frosted block, and revealing dissolves the particles out as the text appears. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"` in trusted HTML).

  Under the hood it's now SSR-safe by construction (the cover is pure CSS present in the server-rendered HTML — no post-mount DOM injection, no hydration flash, and the secret stays hidden with JS disabled), the particle canvas is a pure client-side enhancement driven by one shared, fps-throttled rAF loop with off-screen spoilers paused via IntersectionObserver, and spoilers are now keyboard-accessible (`role="button"`, focusable, Enter/Space to reveal, `aria-expanded`). Respects `prefers-reduced-motion`. The cover is rectangular (no rounded corners) so it lines up with the browser's text-selection highlight.

### Patch Changes

- @kungal/ui-core@1.2.0

## 1.1.1

### Patch Changes

- c6d7502: **Select / Autocomplete**: fix the page jumping to the top the first time the dropdown is opened while scrolled down. The teleported list is momentarily at `(0,0)` before floating-ui's first async measurement, so `Element.scrollIntoView()` (and a plain `focus()` on the search field) scrolled the whole window to the top. The active option now scrolls **within its own list container** only, and Select's search-field focus uses `{ preventScroll: true }`.
  - @kungal/ui-core@1.1.1

## 1.1.0

### Minor Changes

- eaf375b: **Lightbox**: clicking the dark backdrop around the image now closes the viewer, matching the convention of every modern image viewer (and complementing the existing ESC-to-close). Clicks on the image and on the controls are unaffected, and a click that is the tail of a drag / pan / swipe no longer dismisses the viewer.

### Patch Changes

- @kungal/ui-core@1.1.0

## 1.0.0

### Major Changes

- ac0bd4e: 1.0.0 — first stable release.

  The component set (57 Vue components) and the design-token system are stable and
  documented. Over the 0.14 → 0.22 line every cross-cutting surface was routed
  through a single source of truth: borders (`--color-kun-border` / `border-kun`),
  focus rings (`kunFocusRingClasses`), corner radius (`rounded-kun-*` /
  `--kun-radius-scale`), elevation (`--shadow-kun-*`), motion (`--kun-dur-*` +
  `duration-kun-*` + `ease-kun-*`), and sizing (`kunControlSize` /
  `kunSelectionSize` / `kunChipSize`).

  Also fixes a registration gap surfaced while completing the docs: `KunAutocomplete`,
  `KunNumberInput`, and `KunPinInput` (added in 0.14.0) were never added to the Nuxt
  layer's auto-import list, so Nuxt consumers hit "Failed to resolve component". They
  now auto-import like every other component (plain-Vue `app.use(KunUI)` already
  registered them). Their docs pages, prop tables, and `llms.txt` entries are added.

### Patch Changes

- Updated dependencies [ac0bd4e]
  - @kungal/ui-core@1.0.0

## 0.22.4

### Patch Changes

- 157c04f: fix(vue): single-line audit follow-ups (menu items, UserChip, Tooltip)

  After a full sweep for which components carry a single-unit label vs. flowing
  prose:

  - **`KunDropdown` / `KunContextMenu`** menu-item labels now `truncate` (single
    line + ellipsis when the menu is width-constrained) with `shrink-0` icons,
    instead of wrapping to two lines.
  - **`KunUserChip`** name and description now `truncate` (the text column gets
    `min-w-0`) — a long name ellipsizes on one line rather than wrapping past the
    avatar.
  - **`KunTooltip`** dropped its unconditional `whitespace-nowrap` for `max-w-xs`:
    short tips still sit on one line, but a long tip now wraps inside ~20rem
    instead of being forced into one screen-wide line.

  Prose components (Card / Modal / Alert / toast bodies, checkbox/radio/switch
  labels, helper & error text) intentionally keep wrapping.

  - @kungal/ui-core@0.22.4

## 0.22.3

### Patch Changes

- 0305c8d: fix(vue): keep button / chip / badge / tag labels on a single line

  A label on these atomic components is one action/marker, not flowing prose, so it
  shouldn't wrap to a second line (the modern standard — shadcn's button ships
  `whitespace-nowrap`, Material's spec keeps the label single-line). Added
  `whitespace-nowrap` to `KunButton`, `KunChip`, `KunBadge`, and the tags inside
  `KunTagInput` (KunTab already had it). `KunButton` also gets `[&_svg]:shrink-0`
  (plus `shrink-0` on its icon slots) so a long label never squishes the icons —
  the label overflows on one line instead of wrapping.

  - @kungal/ui-core@0.22.3

## 0.22.2

### Patch Changes

- Updated dependencies [957cb52]
  - @kungal/ui-core@0.22.2

## 0.22.1

### Patch Changes

- Updated dependencies [be17775]
  - @kungal/ui-core@0.22.1

## 0.22.0

### Minor Changes

- 2026df2: feat(vue): every text control's focus ring follows its `color` prop (default `default`)

  The focus-ring color was inconsistent across the form family: some controls tied
  it to their `color` prop (Input/NumberInput/CheckBox), others hardcoded a primary
  ring (Textarea/Select/Autocomplete/DatePicker/Pagination), and even among the
  first group the default differed (Input defaulted `color: 'default'` → grey ring;
  NumberInput defaulted `color: 'primary'` → blue ring). So an Input and a Textarea
  side by side focused in different colors.

  Now uniform: every text control's focus ring routes through its `color` prop, and
  they all default to **`'default'`** (a neutral grey ring) — `color="primary"` (etc.)
  themes it. `color="success"`/`"danger"`/… give that ring; an invalid control still
  overrides to a danger ring.

  - **New `color?: KunUIColor` prop** on `KunTextarea`, `KunSelect`,
    `KunAutocomplete`, `KunDatePicker` (default `'default'`).
  - **`KunNumberInput` default `color` changed `'primary'` → `'default'`** so an
    un-themed number input matches the rest (grey ring, was blue).
  - `KunPagination`'s jump input uses the neutral ring.

  Also: **`KunCard` footer no longer draws a top border** — it's just a section
  spaced by the card's own gap, matching the (already borderless) header.

### Patch Changes

- @kungal/ui-core@0.22.0

## 0.21.0

### Minor Changes

- 3e841f0: feat: align form labels / error text and unify the chip-tag size scale

  The core size system was already consistent (form controls share
  `kunControlSizeClasses`, checkbox/radio share `kunSelectionSizeClasses`). The
  drift was in the peripheral bits:

  - **Form labels** now identical everywhere: `KunTextarea` and `KunDatePicker`
    labels gained the `text-default-700` tint, and `KunDatePicker` dropped its odd
    `mb-2` for the standard `mb-1`.
  - **Error messages** now identical: `KunTextarea` switched from `text-danger-600`
    (and a `<div>`) to the standard `text-danger` `<p>`; `KunDatePicker` and
    `KunRadioGroup` dropped `mt-2` for `mt-1`.
  - **Chip / tag size**: new `kunChipSizeClasses` in `@kungal/ui-core` is the single
    source for chip/tag pills. `KunChip` and the tags inside `KunTagInput` now share
    it (and the pill `rounded-full` shape), so a tag looks identical to a standalone
    `<KunChip>` of the same size instead of being a one-off smaller rounded-rect.

  Tab keeps its intentionally-compact tab scale; Switch/Slider keep their
  dimension-specific scales.

### Patch Changes

- Updated dependencies [3e841f0]
  - @kungal/ui-core@0.21.0

## 0.20.0

### Minor Changes

- 40e8abf: feat: unified elevation scale + misc token cleanups

  **Elevation scale** — floating surfaces were assigned `shadow-md` / `shadow-lg` /
  `shadow-2xl` ad hoc, so same-kind surfaces disagreed (Select & Autocomplete
  option lists were `shadow-lg`, but Dropdown & ContextMenu menus were `shadow-2xl`;
  Modal had no shadow at all). New three-tier scale in `@kungal/ui-tokens` —
  `--shadow-kun-sm` / `-md` / `-lg`, generating `shadow-kun-sm|md|lg` utilities
  (they compose with `ring-*` via `--tw-shadow`, so a ringed toast still gets its
  elevation). Applied by tier:

  - **sm** — tooltips, slider value bubble
  - **md** — popovers, dropdowns, context menus, select/autocomplete/date lists, toasts
  - **lg** — modals (now actually elevated), drawers

  **Misc consistency cleanups:**

  - Raw Tailwind radii routed through the token scale: `KunBrand` / `KunNull`
    `rounded-2xl` → `rounded-kun-lg`; `KunLoading` `rounded-lg` → `rounded-kun-md`
    (so `--kun-radius-scale` now affects them too). The dark `KunLightbox` viewer
    chrome keeps its own radii intentionally.
  - `KunNumberInput` stepper buttons: `disabled:opacity-40` → `disabled:opacity-50`
    to match every other disabled control.

- 40e8abf: feat: route component transitions through the motion scale

  Transitions hardcoded raw `duration-150/200/300` and raw `ease-in/out/in-out`
  that didn't match the designed motion tokens (overlay enters were `200ms` but
  `--kun-dur-base` is `250ms`; some controls used symmetric `ease-in-out` while the
  rest used the asymmetric `ease-kun-*` curves). Now unified:

  - New `duration-kun-fast | base | slow | exit` utilities bound to `--kun-dur-*`
    (with literal fallbacks). Every component transition routes through them, so a
    global motion retune via the tokens actually propagates.
  - Mapped by role, preserving the asymmetric rhythm (enter decelerates, exit
    accelerates): overlay **enter → base**, **leave → exit**, hover/selection/focus
    **micro → fast**, skeleton/fade/large **→ slow**.
  - Remaining raw `ease-in-out` / `ease-out` Tailwind classes (Avatar, Input,
    Textarea, Progress) switched to `ease-kun-standard` / `ease-kun-out`; scoped-style
    easings (Content, Ripple) now read `var(--ease-kun-*)`. The looping indeterminate
    progress keyframe and the dark Lightbox viewer keep their own timing.

  Net effect: a single, consistent motion feel across every control. No API changes.

### Patch Changes

- @kungal/ui-core@0.20.0

## 0.19.1

### Patch Changes

- 3a67606: fix(vue): Card header/footer, Tab item radius, Message elevation

  - **KunCard** — the header slot no longer draws a `border-b`. The footer dropped
    its `bg-default-100` fill + double padding for a single hairline divider in the
    unified `border-kun` token (`-mt-3` pulls it flush under the content), so it
    matches the rest of the UI instead of looking like a grey block.
  - **KunTab** — `solid` / `light` / `bordered` tab items were `rounded-kun-sm`
    (6px), half the radius of every other control. Items (and their sliding
    indicator) are now `rounded-kun-md` (12px, the default control radius) and the
    list container is `rounded-kun-lg` (16px), so the items nest concentrically and
    match the overall corner radius.
  - **KunMessage** (toast) — added `shadow-lg` (and a `dark:ring-white/10` edge) so
    toasts read as elevated/floating above the page instead of sitting flat with
    only a faint hairline ring.
  - @kungal/ui-core@0.19.1

## 0.19.0

### Minor Changes

- d8e7e76: feat: KunTab `align` prop + one unified focus ring across every control

  **KunTab `align`** — new `align?: 'start' | 'center' | 'end'` (default `'center'`)
  controls how each tab's content sits inside its box. Mainly for vertical /
  full-width tabs, where the box is wider than its label.

  **Unified focus ring** — focus indication was a mess: `:focus` vs `:focus-within`
  vs `:focus-visible`, ring widths `1`/`2`/`4`, opacities `/25`/`/40`/`/50`/full,
  some controls dropped their border to fake a ring (a jarring jump), and Button /
  CheckBox had **no** focus ring at all. Everything now routes through one recipe:

  - New `kunFocusRingClasses` (direct controls) and `kunFocusRingWithinClasses`
    (composite wrappers) in `@kungal/ui-core`. One recipe: keyboard-only
    (`focus-visible`; text fields still show it on click), a flush **2px** ring in
    the control's semantic color at **/50**, no border-transparent jump.
  - Migrated Input, Textarea, Select, Autocomplete, NumberInput, DatePicker,
    PinInput, TagInput, Pagination, RadioGroup, **Button** (offset ring, added) and
    **CheckBox** (added) onto it. Composite widgets (NumberInput / TagInput) ring
    the wrapper via `focus-within` and the inner `<input>` has no ring of its own,
    so there's exactly one indicator.
  - Invalid controls turn the ring **danger** (same mechanism, swapped color).
  - **Deprecated:** `kunRingClasses` (mixed `:focus`/`:focus-within`, off-opacity).
    Use `kunFocusRingClasses` / `kunFocusRingWithinClasses`.

  No prop/API removals — purely additive plus a visual refinement of focus states.

### Patch Changes

- Updated dependencies [d8e7e76]
  - @kungal/ui-core@0.19.0

## 0.18.1

### Patch Changes

- 1016e80: fix(vue): Tab underlined track line, FadeCard not animating, Pagination layout

  - **KunTab** `variant="underlined"` no longer draws a static full-length track
    border — only the sliding active indicator remains.
  - **KunFadeCard** now actually animates. Its `<Transition>` previously wrapped an
    always-present `<div>`, so a `v-if` on the _slotted_ element (the documented
    `<KunFadeCard><Foo v-if="show"/></KunFadeCard>` usage) never triggered
    enter/leave. The `v-if` now lives on the Transition's direct child, driven by
    whether the slot has real content, so toggling collapses/expands (grid
    `0fr↔1fr`) and fades as intended.
  - **KunPagination** `justify-between` is now effective: the page block and the
    jump-to-page block sat under conflicting `mx-auto` margins (auto margins beat
    `justify-content` in flexbox), which spread them oddly. Removed, so the page
    controls sit at the start and the jump control at the end.
  - @kungal/ui-core@0.18.1

## 0.18.0

### Minor Changes

- 6fa75bb: feat(tokens,vue): unified neutral border token (`--color-kun-border` / `border-kun`)

  Every structural hairline (inputs, textareas, selects, autocomplete, date picker,
  cards, dividers, tabs, tooltips, popovers, dropdowns, context menus, drawers,
  pagination, slider tooltip, radio cards, tag input) now resolves to ONE semantic
  token instead of a scatter of `border-default-200` / `border-default/20` /
  `dark:border-default-200` + a per-component `darkBorder` toggle.

  - **New:** `--color-kun-border` (defaults to the `default-200` step, so it flips
    light↔dark automatically) and a `border-kun` utility. Retheme every border at
    once by overriding `--color-kun-border` (set it under `.kun-dark-mode` too for a
    fixed non-flipping value). The global `*` border-color (opinionated base layer)
    now points at this token as well, so a bare `border` matches `border-kun`.
  - **Fixed:** `KunDivider` (and any control that used the translucent
    `border-default/20` without a dark override) was ~half as bright as other
    hairlines in dark mode (L13% vs L26%); it now matches everything else (L26%).
  - **Consistency:** light mode is visually unchanged (the old `default/20`-over-white
    already ≈ `default-200`); dark mode now collapses to a single neutral border value
    across all components.
  - Interactive-control borders intentionally stay one step stronger (checkbox/radio
    boxes `default-300`, slider thumb) per common design-system practice — they are
    not structural hairlines.
  - **Deprecated (no-op):** the `darkBorder` prop on Input/Textarea/NumberInput/
    Select/Autocomplete/DatePicker/Card. Safe to remove from call sites; kept for
    backward compatibility. Note: an un-bordered `KunCard` that relied on
    `darkBorder` to show a dark-only border should now use `bordered`.

### Patch Changes

- @kungal/ui-core@0.18.0

## 0.17.2

### Patch Changes

- @kungal/ui-core@0.17.2

## 0.17.1

### Patch Changes

- 54f3498: 代码评审(CR)修复:针对 0.14–0.17 四批改动的真实项目缺陷。

  - **KunCopy / useKunCopy** —— `useKunCopy` 此前是 fire-and-forget(返回 `void`),`KunCopy` 的 `await` 立即 resolve,导致**剪贴板写入失败时也会错误地显示「已复制」**(还和它自己弹出的失败 toast 自相矛盾)。改为 `useKunCopy` 返回 `Promise<boolean>`(并兜底 `navigator.clipboard` 不存在的情况);`KunCopy` 仅在真正成功时才切到 ✓ 状态。
  - **KunMessageItem(toast)** —— `pauseTimer`/`resumeTimer` 改为幂等:`mouseenter` 与 `pointerdown` 会同时触发暂停,此前会对同一 `startTime` **重复扣减剩余时间**,使 toast 在用户悬停/触摸时提前消失(或进度条与实际计时不同步)。
  - **KunNumberInput** —— 修复无 `min`/`max` 且初始为空时,「−」按钮被错误禁用(`null ?? -∞ > -∞` 为 false)的问题;空值现在可正常从 0 起步进。
  - **KunImage** —— `fallbackSrc` 现在也响应「缓存命中即同步报错」路径(`status==='error'`),此前这种情况下回退图永远不会加载。
  - **KunContextMenu** —— `immediate` watcher 在 SSR 且 `visible=true` 时不再访问 `document`(加 typeof 守卫),避免 `renderToString` 崩溃。
  - **KunMessageProvider** —— toast 容器标记 `data-kun-overlay`,使其在 Modal/Drawer 打开(背景 inert)时仍可交互(关闭按钮/滑动可用)。
  - **KunPinInput** —— `length` 减小时截断内部 refs 数组,避免保留已卸载 `<input>` 的引用。
  - @kungal/ui-core@0.17.1

## 0.17.0

### Minor Changes

- 59479bc: 导航 / 展示 / 排版第四批升级:修零散 a11y/安全缺陷,补 Chip/Copy 能力。

  修正(a11y / 安全)

  - **KunScrollShadow** —— `aria-label` 此前误用了 `className`(把 CSS 类当可访问名,读屏会念出 "mt-4 flex…");新增独立 `ariaLabel` prop(默认 'scrollable content')。
  - **KunLink / KunButton** —— `target="_blank"` 现在自动补 `rel="noopener noreferrer"`(tabnabbing 防护)。
  - **KunAvatarGroup** —— "+N" 溢出现在从 `users.length` 推导(不传 `total` 也能显示);按 `user.id` 作 key;加 `role="group"` + 计数 `aria-label`。
  - **KunDivider** —— 竖向加 `aria-orientation="vertical"`;`withLabel` 标记为弃用(label 由默认插槽是否有内容决定)。
  - **KunMarkdown** —— 装饰 SVG 加 `aria-hidden`。

  升级

  - **KunChip** —— 新增 `closable`(× 触发 `close`,可移除标签)、`disabled`,以及 `start` / `end` 插槽(圆点/头像/图标)。
  - **KunCopy** —— 复制后短暂反馈:图标切到 ✓、文案切到 `copiedText`(默认 '已复制')、`aria-live` 播报,~1.5s 复位。
  - **KunImage** —— 新增 `fallbackSrc`(图裂时回退,`src` 变化时重置)。
  - **KunAvatar** —— 头像 URL 裂图时回退到确定性 sticker。
  - **KunPagination** —— 提供 `pageHref` 时,上一页/下一页也渲染为可爬 `<a>`(与数字页一致)。

  Behavior(0.x minor)

  - `KunScrollShadow` 的可访问名不再等于 `className`,改为 `ariaLabel`(默认 'scrollable content')。

### Patch Changes

- @kungal/ui-core@0.17.0

## 0.16.0

### Minor Changes

- 8cc6532: 反馈 / 状态层第三批升级:补齐 a11y(aria-live/role)、确认框可定制、Toast 体验。

  修正(a11y / 正确性)

  - **KunProgress** —— `variant="circle"` 现在带 `role="progressbar"` + `aria-valuenow/min/max`(此前圆环完全没有,读屏不可知);`indeterminate` 改为真正的不定动画(条形横扫 / 圆环旋转,此前只是静态满条);新增 `ariaLabel`。
  - **KunLoading** —— 加载态加 `role="status"` + `aria-live="polite"` + `aria-busy`,装饰图 `aria-hidden`;新增轻量 `spinner` 变体(内联小尺寸,用打包的 spinner 图标)+ `size`。
  - **KunMessage(toast)** —— error / warn 现在用 `role="alert"` + `aria-live="assertive"`(打断式),info / success 仍是 `status` / polite(此前一律 polite,错误可能被读屏忽略)。
  - **AlertProvider** —— 用 `role="alertdialog"` + `aria-label`(取自 title);确认按钮改为**强调色**(主操作)、取消按钮**中性**(此前取消是红色,与惯例相反);`danger` 类型确认按钮变红。
  - **useRipple** —— 涟漪 `key` 改用自增计数(此前 `Date.now()` 在同毫秒多次点击会 key 冲突)。

  升级

  - **useKunAlert** —— 新增 `confirmText` / `cancelText` / `type`('info'|'warning'|'danger')/ `confirmColor`(可本地化文案 + 危险确认)。
  - **KunModal** —— 新增 `role`('dialog' | 'alertdialog')。
  - **KunMessage(toast)** —— 每条 toast 加悬停显示的关闭按钮(`duration:0` 常驻 toast 也能手动关);每个位置最多并存 5 条(超出丢弃最旧);支持滑动关闭(触摸横向拖拽)。
  - **KunBadge** —— 无锚点 slot 时渲染为独立内联徽标;新增 `ariaLabel`(如 "5 条未读")。

  Behavior(0.x minor)

  - `AlertProvider` 的取消按钮不再是 danger 红色,改为中性;确认按钮改为主色/按 `type` 着色。

### Patch Changes

- @kungal/ui-core@0.16.0

## 0.15.0

### Minor Changes

- e5f8c89: 浮层 / 弹出层第二批升级:对标 Radix / HeroUI / Reka,修掉 Popover 与 ContextMenu 的 a11y 缺陷,统一浮层基建。

  修正(a11y 缺陷)

  - **KunPopover** —— 触发器不再被包裹层强加 `role="button"` + 假 `aria-label="popover-trigger"`(此前传 `<KunButton>` 会形成 button 套 button、真实可访问名被盖掉);现在是真正的对话框:打开时把焦点移入面板,关闭时归还给触发器,Esc 关闭。
  - **KunContextMenu** —— 从「一堆按钮」升级为真正的 WAI-ARIA 菜单:`role="menu"`/`menuitem`、roving tabindex、方向键 / Home / End / Enter / Esc 键盘导航、打开聚焦首项、关闭归还焦点(与 KunDropdown 一致)。
  - **KunModal / KunDrawer** —— 多个叠加时按 Esc 只关闭**栈顶**那一个(此前会一次性关掉所有)。

  升级

  - **KunModal** —— 新增 `size`(sm/md/lg/xl/full)、`scrollBehavior`(inside/outside)、`placement`(center/top)。
  - **KunModal / KunDrawer** —— 打开时给页面背景加 `inert`(比单靠 `aria-modal` 更强的隔离;辅助技术与 Tab 都无法进入背景)。
  - **KunTooltip / KunPopover** —— 新增 `showArrow` 指向触发器的小箭头。
  - **KunDropdown** —— 新增首字母 type-ahead(按字母跳到对应项)。

  内部重构(不破坏 API)

  - 新增 `useKunFloating` —— 收敛 Popover / Tooltip / Dropdown / Select / Autocomplete 的 floating-ui 配置(offset/flip/shift + transform-origin + 可选 arrow),消除重复与漂移。
  - 新增 `useKunBackgroundInert` —— 引用计数的背景 `inert` 管理器。
  - `useKunOverlayZIndex` 新增 `isTopmost`(开启顺序栈,供 Esc/背景判定栈顶)。

  Breaking(0.x minor)

  - `KunPopover` 触发器包裹层不再是 `role="button"`,也不再注入 tabindex —— 请传入**可聚焦**的触发器(如 `<KunButton>`,常规用法不受影响);非交互触发器(纯图标/文本)需自行加 `tabindex`。
  - `KunModal` 面板默认带 `max-w-md` 宽度上限(此前无上限);需要更宽的用 `size="lg|xl|full"`。

### Patch Changes

- @kungal/ui-core@0.15.0

## 0.14.0

### Minor Changes

- cd404aa: 表单 / 输入控件第一批升级:对标 HeroUI / Mantine / Ant Design / PrimeVue / Naive,补齐 API 完备性、一致性与高级控件。

  新增组件

  - **KunNumberInput** —— 数字步进输入:`min`/`max`/`step`/`precision` 钳制与四舍五入、−/+ 步进按钮(到边界自动禁用)、`ArrowUp/Down`·`PageUp/Down` 键盘、`role="spinbutton"` 无障碍、`name` 原生表单收集。
  - **KunPinInput** —— OTP / 验证码分段输入:`length`、`type`(numeric/text)、`mask`、自动前进/退格回退、粘贴自动分发、方向键、`complete` 事件、`autocomplete="one-time-code"`。
  - **KunAutocomplete** —— 组合框(combobox):文本输入 + 建议列表,客户端过滤或 `manualFilter` + `@search`(远程),`allowCustomValue`、`clearable`、键盘导航、`aria-autocomplete`。

  升级

  - **KunSelect** —— 补齐键盘可达性(P0):方向键 / Enter / Space / Esc / Home / End / 首字母 type-ahead + `aria-activedescendant`,禁用项自动跳过;新增 `searchable`(列表内过滤)、`multiple`(可移除 chips)、`clearable`、`description`、`name`(隐藏域)、选项 `disabled`。
  - **KunSlider** —— 默认 `min`/`max` 由 17–77 改为 **0–100**;修复 `reactive(props)` 拷贝导致改 prop 不更新的响应式缺陷;新增 `disabled`、`label`/`ariaLabel`、`error`/`description`、`color`、`marks`、值气泡 `showTooltip`、`showValue`、`formatValue`、`change` 事件。
  - **KunCheckBox** —— 新增 `indeterminate`(三态,用于全选)+ `error`/`description`。
  - **KunInput** —— 新增 `isClearable`、`revealPassword`(密码可见性切换)、`isInvalid` + `aria-invalid`/`aria-describedby`。
  - **KunSwitch** —— 新增 `error`/`description`。

  统一

  - 辅助文案统一为 `description`(对齐 HeroUI / React-Aria);`helperText`(Input/TagInput)与 `hint`(Textarea/FileInput/Upload)保留为 **已弃用别名**,仍可用,内部回退到 `description`。

  Breaking(0.x minor)

  - `KunSlider` 默认 `min`/`max` 改为 0–100(此前 17–77):依赖旧默认值的调用需显式传入。
  - `KunSelect` 的 v-model 类型放宽为 `T | T[] | null`(支持 `multiple` 与清除);单选用法不受运行时影响,仅 TS 类型变宽。

  新增打包图标(构建期内联,运行时零请求):`lucide:minus`、`eye`、`eye-off`、`search`。

### Patch Changes

- Updated dependencies [cd404aa]
  - @kungal/ui-core@0.14.0

## 0.13.0

### Minor Changes

- 59dc29e: Accessibility + SSR-correctness sweep across the library.

  - **SSR-stable ids (the big one).** `useKunUniqueId` deferred Vue's `useId()` to
    `onMounted`, so the server HTML rendered empty ids — every `<label for>` /
    `id` pairing was broken on the server and changed on hydration. It now calls
    `useId()` synchronously (Vue guarantees it's identical server/client), so
    KunInput / KunCheckBox / KunTextarea / etc. have correct, stable label
    associations in the SSR HTML.
  - **KunModal dialog semantics.** The panel was missing `role="dialog"` /
    `aria-modal="true"` / an accessible name — now added, plus an `ariaLabel` prop.
    (KunDrawer already had these.)
  - **Accessible names on icon-only buttons.** KunModal & KunLoli close buttons and
    KunPagination prev/next now have `aria-label` (the icon itself is `aria-hidden`,
    so these announced as just "button" before).
  - **KunPagination semantics.** Wrapped in `<nav aria-label>`; numbered pages get
    `aria-label` + `aria-current="page"` on the active page.
  - **KunSlider keyboard (WCAG 2.1.1).** The thumb now responds to Arrow keys
    (±step), PageUp/PageDown (±10×), Home (min) and End (max) — it was drag-only.
  - **KunMessage live region.** Toast containers are now `role="status"`
    `aria-live="polite"`, so screen readers announce toasts.
  - **KunTooltip keyboard/SR.** Now shows on focus (not just hover), links its text
    via `aria-describedby`, and dismisses on Escape.
  - **KunRating** stars gained `aria-label` (the `title` alone wasn't announced).
  - **KunPopover** dialog gained an `ariaLabel` prop / accessible name.

  All non-breaking. The id change improves SSR output; the new `ariaLabel` props on
  KunModal/KunPopover default to a generic name when omitted.

### Patch Changes

- @kungal/ui-core@0.13.0

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
