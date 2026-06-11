---
"@kungal/ui-vue": patch
---

Make every component's corner radius follow the unified Kun radius system.

Two classes of inconsistency were leaking through:

- **KunButton / KunCopy defaulted `rounded` to `'lg'`** (12px) while every other
  component defers to the global `config.rounded` (default `md`, 8px) — so buttons
  looked visibly rounder than inputs, cards and surfaces sitting next to them. And
  because `'lg'` was a _prop default_ (never `undefined`), setting `config.rounded`
  globally couldn't pull buttons in line. Both now omit the default and resolve to
  `config.rounded` like the rest; pass `rounded` to override per-instance.

- **Several components hardcoded raw Tailwind radii** (`rounded-lg` / `rounded-md` /
  `rounded-xl` / `rounded`) instead of the `rounded-kun-*` tokens, so they neither
  shared the unified scale nor responded to the runtime `--kun-radius-scale` knob.
  Converted to tokens (preserving each surface's pixel size and concentric nesting):
  KunTab (container + items + indicators), KunDropdown (panel + items), KunContextMenu
  (panel), KunSelect (listbox + options), KunMessage (toast card), KunPagination
  (page-jump input), KunRadioGroup (option row), KunTagInput (tag chip) and
  KunCheckBox (the box). Pill/circle elements using `rounded-full` are unchanged by
  design; KunLightbox's dark floating toolbars and KunLoading's mascot/overlay keep
  their own styling.

Net effect: one global radius for all components, all of it now driven by
`config.rounded` and scaled live by `--kun-radius-scale`.
