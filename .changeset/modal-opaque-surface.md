---
'@kungal/ui-vue': patch
---

fix(vue): KunModal panel is opaque by default (drop the hardcoded 85% alpha)

The modal panel hardcoded `bg-content1/85`, forcing an 85%-opaque (see-through)
surface that ignored `--kun-surface-opacity` and stacked on top of it — so on a
site that already lowered that token (a background-image page) the panel went
even more translucent than every other surface. It now uses plain `bg-content1`
like Card / Drawer / Dropdown / Tooltip / Select, so it is fully opaque by
default and follows `--kun-surface-opacity` (set it < 1 with `--kun-backdrop-filter`
to opt every surface into frosted glass at once). The backdrop scrim is unchanged.
