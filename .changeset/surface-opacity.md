---
"@kungal/ui-tokens": patch
---

feat(tokens): add `--kun-surface-opacity` for themeable surface transparency (glass)

The raised surface (`content1` — cards, popovers, dropdowns, inputs, modal,
drawer) now resolves its alpha through `--kun-surface-opacity`, default `1`
(fully opaque, no visual change). A site with a background image (e.g. a galgame
page) can make every surface see-through at once, with no component changes:

```css
:root { --kun-surface-opacity: 0.7; --kun-background-blur: 12px; }
```

Components don't ship a `backdrop-blur` on every surface, so set
`--kun-background-blur` too if you want true frosted glass rather than plain
translucency. Default sites are unaffected.
