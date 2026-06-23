---
"@kungal/ui-core": major
"@kungal/ui-vue": major
---

Remove the `ghost` variant.

`ghost` was visually indistinguishable from `bordered`: at rest both are just
`border + bg-transparent + colored text`. `ghost` only added a faint `hover` fill,
so the two looked identical until hovered. It has been dropped from `KunUIVariant`,
which affects every variant consumer — `KunButton`, `KunChip`, `KunDropdown` and
`KunInfo`.

**Migration:** replace `variant="ghost"` with `variant="bordered"` (the outline
look it overlapped). For a softer fill instead, `variant="flat"` or `variant="light"`.

(This mirrors the earlier removal of the `faded` variant for the same reason; the
remaining set — solid / bordered / light / flat / shadow — has no visual overlap.)
