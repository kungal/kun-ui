---
"@kungal/ui-vue": minor
"@kungal/ui-nuxt": minor
---

Remove the `KunFavicon` component.

`KunFavicon` was just a static, hardcoded inline SVG of the KunUI lollipop mark
with no props — it carried no library value (an app that wants a logo ships its
own asset, e.g. via `KunBrand`'s `iconSrc`). It's dropped from the `@kungal/ui-vue`
exports and the `@kungal/ui-nuxt` auto-import list.

**Migration:** if you were rendering `<KunFavicon />`, inline your own logo SVG or
`<img>`/`KunImage` pointing at your favicon asset instead.
