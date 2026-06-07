---
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

Remove the `faded` variant.

`faded` (tinted fill + border) was visually almost indistinguishable from
`ghost`, so it's been dropped from `KunUIVariant`. This affects every variant
consumer — `KunButton`, `KunChip`, `KunDropdown` and `KunInfo`.

**Migration:** replace `variant="faded"` with `variant="flat"` (tinted fill, no
border) or `variant="bordered"` (visible colored border); `ghost` stays for the
outline look it overlapped with.
