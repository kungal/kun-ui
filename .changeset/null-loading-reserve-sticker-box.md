---
'@kungal/ui-vue': patch
---

KunNull and KunLoading no longer shift the page when their bundled mascot decodes. The `<img>` had a width but no height, so it stayed 0px tall until the image decoded and then grew to 192px (KunNull) or 213px (KunLoading), pushing everything below it down. letmoe measured a cumulative layout shift of 0.12–0.16 from one empty state on a profile page.

The bundled image now gets an inline `aspect-ratio: auto 500 / 333`, so its box is reserved from the first frame and is in the server-rendered HTML too. Measured in Chromium with the component on screen from the first render, the shift went from 0.114 to 0 for KunNull, from 0.126 to 0 for KunLoading, and from 0.007 to 0 for KunLoading's overlay mode. It is inline rather than a class so that a consumer's Tailwind build can never drop it. The `auto` keyword means the decoded image's own ratio wins once it has loaded.

An image you pass through `src` is rendered exactly as before. KunUI does not know its shape, so reserve its box yourself, for example with `class="[&_img]:aspect-[4/3]"` on the component.
