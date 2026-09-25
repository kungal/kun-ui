---
'@kungal/ui-vue': patch
'@kungal/ui-core': patch
---

`lucide:heart` is now bundled. It is `KunReaction`'s default `icon`, and an unbundled name renders nothing, so a reaction left on its default showed no glyph unless the site registered the heart itself. `kun_ui_icons` gains `KunIcons.heart` and `KunIcons.heartFilled`. The filled twin is Flutter-only: the web fills a stroke icon with `fill-current`, and a font glyph is a traced stroke that cannot be filled, so the generator traces a second glyph from the same SVG with its paths filled. The `FILLED` list in `icons-manifest.mjs` names the icons that get one.
