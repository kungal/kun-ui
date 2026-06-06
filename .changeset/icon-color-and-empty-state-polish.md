---
"@kungal/ui-vue": patch
---

Fix KunIcon color inheritance and polish the loading/empty states:

- **KunIcon**: the inline SVG bodies paint with `currentColor`, but the base
  layer's `* { color }` rule was landing on the `v-html`'d inner nodes and
  pinning them to the foreground color — so `text-*` on (or above) `<KunIcon>`
  didn't actually color the icon. The inner nodes now inherit the icon's color.
- **KunLoading / KunNull**: larger default image (`w-72` / `w-60`) shown at its
  natural aspect ratio instead of being squished into a square.
- **KunNull**: the empty-state caption is now muted (`text-default-500`), and
  the default caption text changed to `莲说这里什么都没有`.
