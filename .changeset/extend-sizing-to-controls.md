---
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

Extend the unified size system to the non-text controls.

The first sizing pass only covered text controls (button/input/select/…). This
brings the selection + display controls onto the same coherent system, grounded
in how HeroUI / PrimeVue / Naive UI / Mantine / Ant size them.

- **New shared selection scale (`kunSelectionSizeClasses`, @kungal/ui-core)** —
  KunCheckBox and KunRadioGroup now use **identical** box sizes (every major
  library does this), so a checkbox and a radio of the same size match. Box px by
  size: 12 / 14 / 16 / 20 / 24 — ≈ 0.5× the text-control height and ≈ 1.2–1.4× the
  label font, so the box sits optically level with its label.
- **KunCheckBox gains a `size` prop** (`xs`–`xl`, default `md`). It was hardcoded
  at 20px while its sibling KunRadioGroup scaled 12→24 — now they share one scale
  (md box is 16px). The check glyph and label scale with it.
- **KunSwitch gains a `size` prop.** Track/thumb scale on clean steps (track
  28×16 → 64×32, thumb = track height − 4); `md` is the original switch size.
- **KunSlider gains a `size` prop.** Track 4→12px, thumb 14→28px; `md` unchanged.
- **KunChip** moved onto its proper compact sub-scale (≈ 0.7× the button height at
  the same keyword — a tag is text + tight padding, not a tap target); its `md`/
  `lg`/`xl` vertical padding is slightly tighter so chips no longer read as tall
  as buttons.

Components sized by their content/padding rather than a height (KunTooltip,
KunDropdown/KunContextMenu menus, KunPopover, KunInfo) intentionally keep no
`size` prop — no surveyed library gives them one.
