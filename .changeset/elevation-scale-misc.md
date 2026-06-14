---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": minor
---

feat: unified elevation scale + misc token cleanups

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
