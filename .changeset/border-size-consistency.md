---
'@kungal/ui-vue': patch
---

fix(vue): keep `bordered` variants the same size as the others (Info, TagInput)

A `bordered` variant adds a real border, which enlarges the element unless the
other variants reserve the same width with a transparent border. Button / Chip
(via the shared variant matrix) and Tab already did this; Info and TagInput did
not, so their `bordered` variant was ~2–3px larger than `solid` / `light` /
`flat`.

- **Info**: every variant now carries the same `1.5px` border (transparent for
  the non-bordered ones), so switching variants no longer changes the box size.
- **TagInput**: the wrapper always reserves a `1px` transparent border; `flat`
  and `bordered` are now identical in size, and the error border is now visible
  on the `flat` variant too (it previously had no border width to colour).

No visual change to the non-bordered variants beyond the size becoming
consistent — the reserved border is transparent.
