---
'@kungal/ui-vue': minor
---

feat(vue): add KunShatter — break any content into glass shards that fly apart

A new animation component that shatters its slotted content (an image, a card, anything)
into Voronoi glass shards which burst outward from an impact point, arc under gravity,
spin, and fade.

Performance-first and dependency-free:

- The fly-apart is **compositor-only** — every shard animates only `transform` + `opacity`
  (the two properties that run on the compositor thread, never re-running layout or paint),
  so it holds 60fps regardless of piece count. Verified: 0 dropped frames even at the
  160-piece cap.
- `clip-path` carves each shard's glass edge but is set once and **never animated** (animating
  clip-path is not compositor-accelerated yet).
- Each shard is sized to its own bounding box with `overflow:hidden` + paint containment, so
  N shards tile to **≈1× the element's area** instead of N× full-size GPU layers — the one-time
  build stays a few milliseconds even at the cap.
- Voronoi shard geometry is computed in-component (rectangle clipped against seed-point
  perpendicular bisectors); **no runtime dependency**.

Usage: wrap content in `<KunShatter>` and trigger via `trigger="click"`, `v-model:shattered`,
or the exposed `shatter()` / `restore()` methods. Tunable with `pieces`, `origin`, `spread`,
`gravity`, `rotation`, `fade`, `duration`, `easing`, `seed`, `autoRestore`, and `keepSpace`.
Honours `prefers-reduced-motion` (instant hide, no shards) and is SSR-safe.
