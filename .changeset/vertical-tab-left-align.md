---
"@kungal/ui-vue": patch
---

fix(vue): KunTab vertical orientation now defaults to left-aligned content

The `align` default is now orientation-aware. A vertical tab list reads as a
nav column, where left-aligned labels are the convention, so vertical tabs now
default to `align="start"`. Horizontal tabs keep the classic centered look.
An explicit `align` prop still overrides either orientation — pass
`align="center"` to restore the previous centered vertical tabs.
