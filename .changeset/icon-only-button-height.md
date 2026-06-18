---
"@kungal/ui-vue": patch
---

fix(vue): icon-only buttons now match the height of same-size text buttons

`isIconOnly` previously only swapped the padding (`p-2.5` etc.), so an icon-only
button collapsed to the icon's `1em` height instead of the text line-height —
leaving it ~8px shorter than a text button of the same `size` and breaking
alignment in a toolbar row. Icon-only buttons are now a fixed square whose side
equals the same-size text-button height (the new `kunControlSquareClasses`),
matching how shadcn/HeroUI/Chakra/Ant size their icon buttons. The icon stays at
its natural `1em`, centered.

Also pins `KunPagination`'s prev/next arrows to `size="sm"` so they line up with
the (already `sm`) numbered page buttons — without it the now-correct default
`md` icon button would render 4px taller than the numbers.
