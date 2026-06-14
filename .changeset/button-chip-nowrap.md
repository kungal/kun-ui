---
"@kungal/ui-vue": patch
---

fix(vue): keep button / chip / badge / tag labels on a single line

A label on these atomic components is one action/marker, not flowing prose, so it
shouldn't wrap to a second line (the modern standard — shadcn's button ships
`whitespace-nowrap`, Material's spec keeps the label single-line). Added
`whitespace-nowrap` to `KunButton`, `KunChip`, `KunBadge`, and the tags inside
`KunTagInput` (KunTab already had it). `KunButton` also gets `[&_svg]:shrink-0`
(plus `shrink-0` on its icon slots) so a long label never squishes the icons —
the label overflows on one line instead of wrapping.
