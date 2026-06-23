# @kungal/ui-tokens

## 1.10.0

## 1.9.5

## 1.9.4

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

## 1.9.0

## 1.8.3

### Patch Changes

- 2c352d6: fix(tokens): lighten the page background a touch

  The light page background goes from `#eeeef1` back up to `#f2f2f5` — the previous
  value made the step up to a white card feel abrupt. Cards still pop (≈13 units)
  but the transition is gentler. Dark mode unchanged.

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

## 1.8.1

### Patch Changes

- c2f4bda: feat(tokens): add `--kun-surface-opacity` for themeable surface transparency (glass)

  The raised surface (`content1` — cards, popovers, dropdowns, inputs, modal,
  drawer) now resolves its alpha through `--kun-surface-opacity`, default `1`
  (fully opaque, no visual change). A site with a background image (e.g. a galgame
  page) can make every surface see-through at once, with no component changes:

  ```css
  :root {
    --kun-surface-opacity: 0.7;
    --kun-background-blur: 12px;
  }
  ```

  Components don't ship a `backdrop-blur` on every surface, so set
  `--kun-background-blur` too if you want true frosted glass rather than plain
  translucency. Default sites are unaffected.

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

## 1.6.3

## 1.6.2

### Patch Changes

- 05f2bee: chore: ship CHANGELOG.md in the published packages

  `CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
  so downstream can read the per-version changes straight from the npm package
  page — not only from the GitHub repo. (Releases also now appear on GitHub
  Releases and the docs site's auto-generated /changelog page.)

## 1.6.1

## 1.6.0

## 1.5.0

## 1.4.2

## 1.4.1

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.1

## 1.1.0

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

## 0.22.4

## 0.22.3

## 0.22.2

## 0.22.1

## 0.22.0

## 0.21.0

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

## 0.19.1

## 0.19.0

## 0.18.1

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

## 0.17.2

### Patch Changes

- 9989b7c: fix(tokens): restore Modal / Drawer / Tab-indicator / toast / FadeCard animations

  The motion duration tokens (`--kun-dur-fast/base/slow/exit`) were declared only
  inside `@theme`. Tailwind v4 only emits an `@theme` variable to `:root` when its
  scanner sees it "used", and these tokens have no utility namespace and are read
  solely via `var(--kun-dur-base)` inside component `<style>` blocks / inline
  styles — which Tailwind never scans. So in a normal downstream build they were
  tree-shaken out of `:root`, every `transition: … var(--kun-dur-…) …` resolved to
  `var(<undefined>)`, the whole shorthand was invalidated, and the enter/leave
  animations on Modal, Drawer, the Tab indicator, toasts and FadeCard silently
  collapsed to instant (regression from the "unified motion system" change).

  They are now mirrored into a plain `:root` block (never tree-shaken), exactly
  like the z-index fallbacks, so the animations resolve in every consumer build.
  No API change.

## 0.17.1

## 0.17.0

## 0.16.0

## 0.15.0

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

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

## 0.9.0

### Minor Changes

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

## 0.8.0

## 0.7.0

## 0.6.2

## 0.6.1

## 0.6.0

## 0.5.2

## 0.5.1

### Patch Changes

- bef6580: Add a runtime `--kun-radius-scale` knob for corner radius.

  The scalable radius tokens (`sm` / `md` / `lg`) now multiply their base by
  `var(--kun-radius-scale, 1)`, so a consumer can drive **every** KunUI corner at
  once from a single CSS variable — live, with no re-render and no config change:

  ```css
  :root {
    --kun-radius-scale: 0;
  } /* square corners everywhere */
  :root {
    --kun-radius-scale: 1.5;
  } /* 50% rounder everywhere   */
  ```

  The default (`1`) leaves everything unchanged. `none` and `full` deliberately
  don't scale (a square stays square; a pill stays a pill). Because
  `--kun-radius-scale` is a separate, consumer-owned variable that the token
  `calc()` reads, it avoids the cascade-order trap of trying to override
  `--radius-kun-*` directly. (Small controls clamp `border-radius` to ~half their
  height, so a button can't get rounder than a pill — by design.)

## 0.5.0

## 0.4.1

## 0.4.0

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

### Patch Changes

- 24de30a: Fix floating layers (popover / tooltip / modal / dropdown / drawer / select /
  context-menu / alert / message) stacking at `auto` and getting covered by
  positioned elements (carousels, sticky headers) in some consumer builds.

  The `z-kun-*` z-index utilities deref a `@theme` variable with no fallback
  (`z-index: var(--z-kun-popover)`). Tailwind v4 only emits a `@theme` variable to
  `:root` when its tree-shaker considers it "used", and a custom `@utility`
  referencing the var does not reliably count as usage across consumer
  builds/versions — so `--z-kun-*` can be dropped from `:root`, leaving
  `z-index: var(<undefined>)` → no z-index. Each utility now carries a literal
  fallback (e.g. `var(--z-kun-popover, 9300)`), so the z-index always resolves;
  a consumer's `:root { --z-kun-*: … }` override still wins when present.

## 0.3.0

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.1

## 0.2.0

### Minor Changes

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
