# @kungal/ui-tokens

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
