---
'@kungal/ui-vue': minor
---

**KunLightbox: the picture opens inside the backdrop, and thumbnails keep their shape.**

- On open, the picture fits within 90% of the viewer on each axis (`max-h-[90%] max-w-[90%]`), where it used to fill the whole viewer. On a desktop window, a screenshot no longer covers the page edge to edge: the dimmed backdrop stays visible around it, as a frame and as somewhere to click to close. A small picture still stays at its intrinsic size. Zoom starts from this size, and the thumbhash placeholder takes the same frame.
- Thumbnails are as tall as before (`h-12`, `md:h-14`) and as wide as their picture, where they used to be square crops. The ratio comes from `width`/`height`, else the thumbhash, else 1. It is clamped to between 1:2 and 2:1, so a panorama cannot take over the strip, and anything beyond that is cropped. It is known before the thumbnail loads, so the strip never shifts as pictures arrive.

Asked by the kungal app.
