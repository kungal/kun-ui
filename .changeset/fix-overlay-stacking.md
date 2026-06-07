---
"@kungal/ui-vue": patch
---

Fix stacked overlays: a newly-opened `KunModal` / `KunDrawer` could render
*beneath* an already-open one.

All overlays shared a single z-index (`z-kun-modal`), so when several were open
the stacking fell back to DOM order — and because each overlay `Teleport`s to
`<body>` at its fixed template position, that order followed *declaration*
order, not *open* order. Opening a second modal from inside the first (when the
second is declared earlier in the template) buried the newer one.

Overlays now claim an incrementing z-index on open via the new
`useKunOverlayZIndex` composable (anchored at the `--z-kun-modal` token so
consumer overrides still apply; the counter resets when the last overlay
closes), so the most-recently-opened overlay is always on top regardless of
declaration/DOM order. `useKunOverlayZIndex` is exported for apps stacking their
own overlays on the same layer. (`KunLightbox` uses a native `<dialog>` top
layer and already stacked correctly.)
