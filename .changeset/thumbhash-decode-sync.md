---
'@kungal/ui-vue': patch
---

fix(vue): ThumbHash blur-up now reliably shows before fast/cached images load

Both KunImage (covers) and KunContent (body images) decoded the ThumbHash through a
lazy `import('thumbhash')`. A fast or cached CDN image could finish loading during
that import — after which a placeholder is pointless and was skipped — so the blur
never appeared (you'd see the reserved box but no blur). The decode is now a
synchronous (static) import, painted in the same tick as mount/scan, so it always
wins the race against the image load. The decoder stays externalized + tree-shaken;
it's ~2KB.
