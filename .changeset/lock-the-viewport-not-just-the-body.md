---
'@kungal/ui-vue': minor
---

Scroll lock now locks the viewport, not just `<body>` — and the six most-used components got their props documented.

**The lock was a silent no-op on a page whose `<html>` scrolls.** CSS Overflow 3 §3.1.4 propagates `<body>`'s `overflow` to the viewport *only* while `<html>`'s own `overflow` is `visible`. So on any site with `html { overflow-y: scroll }` (the usual no-layout-shift rule) or `html { overflow-x: hidden }` (the usual stop-sideways-scrolling rule), the page kept scrolling behind every open Modal, Drawer, CommandPalette and Lightbox. Both elements are locked now, which covers every page whose viewport scrolls, whichever one you styled. Measured in Chrome 152 on all three variants: the page holds its scroll position through open → wheel → close, and `<html>`'s computed `overflow-y` goes back to exactly what your stylesheet said (`visible` / `scroll` / `auto`). `overscroll-behavior` moved with it, to the element the spec's own example uses.

**An inline `overflow-y` on `<body>` survives a lock now.** The saved styles are longhands: CSSOM cannot serialize `overflow` out of a single `overflow-y`, so a page with an inline `body { overflow-y: auto }` used to read `''` back from the shorthand and have that longhand blanked on close. `style="overflow-y: auto; padding-right: 7px"` now comes back byte-identical.

**Opening an overlay over an open `KunLightbox` says so, in dev.** The Lightbox is the one component in the browser's top layer, which makes every other KunUI overlay inert — it paints under the `::backdrop`, cannot be clicked, and does not answer Escape, so the page just looks frozen. KunModal, KunDrawer, KunCommandPalette and `useKunMessage` now print a named `console.warn` in development when they open while a modal `<dialog>` is up. Nothing changes in production, and the top layer still wins; you are just told why.

**Docs.** `KunButtonGroup` and `KunCheckBoxGroup` were registered and published but appeared nowhere on the docs site — both now have a page with examples. Every prop of `KunButton`, `KunImage`, `KunTextarea`, `KunNumberInput`, `KunFileInput`, `KunTagInput`, `KunCheckBoxGroup` and `KunButtonGroup` now carries a description in the PropsTable and in `llms.txt` — 141 of 141, up from 24. Library-wide that is 322 of 613 documented, up from 197. Eighteen more props library-wide were showing an empty description because their JSDoc block opened with a tag — `@deprecated`, or `@nuxt/image` — which the extractor reads as the start of the tag section and drops everything after; they say something now.
