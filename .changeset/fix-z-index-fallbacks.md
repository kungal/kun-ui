---
"@kungal/ui-tokens": patch
---

Fix floating layers (popover / tooltip / modal / dropdown / drawer / select /
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
