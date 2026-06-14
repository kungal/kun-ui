---
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

feat: KunTab `align` prop + one unified focus ring across every control

**KunTab `align`** — new `align?: 'start' | 'center' | 'end'` (default `'center'`)
controls how each tab's content sits inside its box. Mainly for vertical /
full-width tabs, where the box is wider than its label.

**Unified focus ring** — focus indication was a mess: `:focus` vs `:focus-within`
vs `:focus-visible`, ring widths `1`/`2`/`4`, opacities `/25`/`/40`/`/50`/full,
some controls dropped their border to fake a ring (a jarring jump), and Button /
CheckBox had **no** focus ring at all. Everything now routes through one recipe:

- New `kunFocusRingClasses` (direct controls) and `kunFocusRingWithinClasses`
  (composite wrappers) in `@kungal/ui-core`. One recipe: keyboard-only
  (`focus-visible`; text fields still show it on click), a flush **2px** ring in
  the control's semantic color at **/50**, no border-transparent jump.
- Migrated Input, Textarea, Select, Autocomplete, NumberInput, DatePicker,
  PinInput, TagInput, Pagination, RadioGroup, **Button** (offset ring, added) and
  **CheckBox** (added) onto it. Composite widgets (NumberInput / TagInput) ring
  the wrapper via `focus-within` and the inner `<input>` has no ring of its own,
  so there's exactly one indicator.
- Invalid controls turn the ring **danger** (same mechanism, swapped color).
- **Deprecated:** `kunRingClasses` (mixed `:focus`/`:focus-within`, off-opacity).
  Use `kunFocusRingClasses` / `kunFocusRingWithinClasses`.

No prop/API removals — purely additive plus a visual refinement of focus states.
