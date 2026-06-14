---
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

feat: align form labels / error text and unify the chip-tag size scale

The core size system was already consistent (form controls share
`kunControlSizeClasses`, checkbox/radio share `kunSelectionSizeClasses`). The
drift was in the peripheral bits:

- **Form labels** now identical everywhere: `KunTextarea` and `KunDatePicker`
  labels gained the `text-default-700` tint, and `KunDatePicker` dropped its odd
  `mb-2` for the standard `mb-1`.
- **Error messages** now identical: `KunTextarea` switched from `text-danger-600`
  (and a `<div>`) to the standard `text-danger` `<p>`; `KunDatePicker` and
  `KunRadioGroup` dropped `mt-2` for `mt-1`.
- **Chip / tag size**: new `kunChipSizeClasses` in `@kungal/ui-core` is the single
  source for chip/tag pills. `KunChip` and the tags inside `KunTagInput` now share
  it (and the pill `rounded-full` shape), so a tag looks identical to a standalone
  `<KunChip>` of the same size instead of being a one-off smaller rounded-rect.

Tab keeps its intentionally-compact tab scale; Switch/Slider keep their
dimension-specific scales.
