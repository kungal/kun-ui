---
"@kungal/ui-vue": minor
---

feat(vue): KunPopover `trigger="hover"` + `useKunPointerMenu` — navigation hover menus done right

Adds first-class hover menus without the usual traps, via a reusable composable
`useKunPointerMenu` (also exported):

- **Coordinate safe-triangle** — on leaving the trigger you can travel to the
  panel without it closing. Computed from `clientX/Y` + `getBoundingClientRect()`,
  so it works even though panels are `Teleport`ed to `<body>` (DOM-containment
  safe-polygons break across portals; coordinates don't).
- **`openDelay` / `closeDelay`** and a shared **`group`** so a row of menus
  switches instantly between siblings and keeps only one open (menu-bar feel).
- **No focus steal on hover** (unlike the click open), and **touch falls back to
  click** (`pointerType` gate) so the first tap doesn't follow a link — the
  classic a11y trap. Click / keyboard / Esc / click-outside all still work.

`KunPopover` gains `trigger` ('click' default | 'hover'), `openDelay`,
`closeDelay`, `group`. `KunDropdown` (role=menu) stays click-only by design.
