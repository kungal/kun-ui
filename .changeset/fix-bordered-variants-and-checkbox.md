---
"@kungal/ui-core": patch
"@kungal/ui-vue": patch
---

Fix invisible outline variants (`bordered` / `faded` / `ghost`) and the
off-center checkbox check.

- **Variant table**: entries set `border-{color}` but never a border *width* —
  which paints nothing in Tailwind v4, so `bordered` / `faded` / `ghost` showed
  no border on KunButton, KunChip and KunDropdown. Every variant now carries an
  explicit `border` width (transparent on `solid` / `light` / `flat` / `shadow`
  so box sizes stay uniform when switching variants), so the outline variants
  render again.
- **KunCheckBox**: the checkmark was a full-size (1em) icon nudged down by its
  baseline offset, so it sat off-center and cramped the 20px box edge-to-edge.
  It's now an explicitly-sized 14px check centered with flexbox.
