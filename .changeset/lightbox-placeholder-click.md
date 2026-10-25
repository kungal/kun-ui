---
'@kungal/ui-vue': patch
---

**KunLightbox: a click on the thumbhash preview no longer closes the viewer.** In 2.60.0 the placeholder let clicks through to the backdrop. A click on a veiled image's preview, or on an image that was still loading, closed the viewer. It now takes clicks the way the loaded image does, so only the dark area around it closes the viewer. Drags and swipes that start on it still page.
