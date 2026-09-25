---
'@kungal/ui-vue': patch
---

`KunInfo`'s `solid` and `shadow` variants now draw their title and description in the fill's foreground. With `@kungal/ui-tokens/base.css` imported, they used the page foreground instead, because base.css sets `color` on every element, so the nested heading and paragraph never inherited the box's colour. On `color="primary"` that meant dark gray text on blue. Measured in Chromium on the docs: the title and description went from `oklch(0.2057 0.0132 233.66)` to the box's `oklch(1 0 0)`. The rule has zero specificity, so a colour class on your own slotted content still wins. The `flat`, `bordered` and `light` variants are unchanged: their titles stay coloured and their descriptions stay in the neutral foreground, as they have always rendered.
