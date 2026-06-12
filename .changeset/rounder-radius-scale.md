---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": patch
---

Make the default corner radius rounder, HeroUI-style.

The `--radius-kun-*` scale grows so the default control radius lands at HeroUI's
12px (it was 8px):

| bucket | before | after |
| ------ | ------ | ----- |
| sm     | 4px    | 6px   |
| md     | 12 ←default | 12px |
| lg     | 12px   | 16px  |

`md` (every component's default) is now **12px**, `lg` (floating panels — dropdown
/ context-menu / toast) is **16px**, which keeps their concentric nesting exact
(panel 16 = item 12 + the 4px `p-1` inset). The `--kun-radius-scale` runtime knob
still multiplies on top, and `none` / `full` still don't scale.

One component needed a fix at the larger radius: **KunCheckBox**. Its small square
box would look circular at a 12px token radius (12px ≈ half a 16–20px box), so the
box now uses a proportional `35%` radius — a rounded square at every size, never a
circle (matching how HeroUI derives its checkbox radius). The radio-look variant
stays a full circle. No other component needed a size change; pill/circle controls
(chips, avatars, switch, slider) are unaffected.
