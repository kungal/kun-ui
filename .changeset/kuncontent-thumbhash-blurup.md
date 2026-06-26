---
'@kungal/ui-vue': minor
---

feat(vue): KunContent — ThumbHash blur-up for body images

Body images in KunContent are raw `<img>` from v-html (backend-rendered markdown),
not components, so they couldn't get the cover-image blur-up. Now any
`<img data-thumbhash="…">` in the prose automatically shows a decoded, blurred
placeholder until it loads.

The decoded ThumbHash is painted as the image's OWN `background` (visible behind the
not-yet-loaded content, cleared once it paints over) — zero DOM restructuring, so it
coexists with the existing lightbox and spoiler passes and never disturbs prose
layout. The blur shows when the `<img>` reserves space (width/height attributes),
which the same backend metadata supplies — together they also remove the load-time
layout shift (CLS).

Also exported as `useContentBlurUp(containerRef)` for apps building their own prose
renderer. Client-only; the ~2KB decoder is lazy-imported.
