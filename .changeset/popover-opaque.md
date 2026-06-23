---
"@kungal/ui-vue": minor
---

feat(vue): KunPopover `opaque` prop — keep a menu solid on a frosted site

Sites with a background image often lower `--kun-surface-opacity` to frost every
surface — which also makes popover/hover-menu panels translucent and hard to read.
`opaque` forces a solid `content1` background (from its raw channels, ignoring the
surface-opacity alpha; still light/dark adaptive). Note this is the only reliable
way: setting `--kun-surface-opacity:1` on the panel does NOT work, because the
themed `--color-content1` is resolved at `:root`, not on the element.
