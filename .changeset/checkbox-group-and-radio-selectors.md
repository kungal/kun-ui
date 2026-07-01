---
'@kungal/ui-vue': minor
---

feat(vue): add KunCheckBoxGroup + pill/icon selectors on KunRadioGroup

Adds the multi-select form field the library was missing, and rounds out the
single-select one, so "pick a category / pick sections / pick types" selectors
(previously hand-rolled in every downstream app) come from KunUI:

- **New `KunCheckBoxGroup`** — WAI-ARIA checkbox-group semantics (value is a real
  `T[]` the form submits, unlike a toolbar-style toggle group). Variants
  `classic | pill | card`, a `max` cap that blocks extra picks and emits
  `invalid: 'max-reached'`, and per-option `icon` / `description`.
- **`KunRadioGroup`** gains a `pill` variant (single-select "choice chips"), an
  optional `icon` per option, and `hideIndicator` for the `card` variant (drop
  the radio dot and signal selection with the tinted border alone — the
  icon-card look).

Both share the selection size scale, color matrix, and focus ring with the rest
of the library. Picking between them follows the recognized rule: single-select
form field → RadioGroup, multi-select form field → CheckBoxGroup; a ToggleGroup
stays for non-form UI toggles.
