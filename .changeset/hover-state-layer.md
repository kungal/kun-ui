---
"@kungal/ui-tokens": patch
"@kungal/ui-vue": patch
---

fix(tokens,vue): give surfaces breathing room + refine KunCard hover

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
