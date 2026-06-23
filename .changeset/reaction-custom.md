---
"@kungal/ui-vue": minor
---

feat(vue): KunReaction — `#icon` slot + arbitrary `color`

Two additive, backward-compatible hooks for fully custom reactions (e.g. a "推"):

- **`#icon` slot** (scoped `{ active }`) replaces the whole glyph — an emoji,
  image or custom SVG, and it can differ by active state. Slot content still gets
  the pop + burst animations.
- **`color`** now also accepts any CSS colour string (e.g. a brand `#ff6a00`), not
  just a palette key. The whole effect runs through `currentColor`, so the icon
  fill, the pop and the burst (ring + sparks) all follow it with no extra wiring.

Existing `icon` / palette-`color` usage is unchanged.
