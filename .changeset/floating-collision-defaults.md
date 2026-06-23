---
"@kungal/ui-vue": minor
---

feat(vue): overlays avoid viewport collisions by default + cap size on small screens

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
