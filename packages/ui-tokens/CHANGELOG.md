# @kungal/ui-tokens

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
