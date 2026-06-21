---
"@kungal/ui-tokens": patch
"@kungal/ui-vue": patch
---

fix(vue,tokens): bordered inputs, softer shadows, lighter page background

- Form controls (Input, Textarea, Select, NumberInput, Autocomplete, DatePicker,
  TagInput flat, PinInput, Pagination jump field, Select's inline search) get a
  card-like neutral border back on top of the filled surface — the borderless
  fill was too hard to spot on a card. Error state recolours the border to danger
  instead of a persistent ring. (= the shadcn "border + fill + subtle shadow" input.)
- Elevation scale softened ~30% across all three tiers (sm/md/lg) — lighter, tighter
  shadows on cards, inputs, dropdowns, modals.
- Light page background nudged brighter (#f2f2f5 → #f4f4f7). Dark unchanged.
