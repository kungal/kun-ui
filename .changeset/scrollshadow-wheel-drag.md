---
'@kungal/ui-vue': minor
---

feat(vue): KunScrollShadow — wheel-to-scroll, drag-to-scroll, and a scrollbar toggle

A horizontal `KunScrollShadow` couldn't be scrolled by mouse users (the wheel
scrolls the page, not the strip). Three opt-in props fix that, all reusable:

- `wheel` — when `axis="horizontal"`, a vertical mouse wheel scrolls the content
  sideways (horizontal trackpad swipes too). `true` releases at the edges so the
  page keeps scrolling (no scroll-trap); `'contain'` keeps the wheel on the strip
  at the edges so the page doesn't move — only while the strip is actually
  scrollable, so it can never freeze the page.
- `draggable` — click-and-drag with a mouse/pen to scroll, like grabbing a strip.
  A drag past a small threshold suppresses the trailing click so cards inside
  still work on a normal click; touch is left to native scrolling.
- `scrollbar` — `'hide'` (default, unchanged), `'thin'` for a slim, theme-coloured
  CSS scrollbar (a dependency-free alternative to an overlay-scrollbar library), or
  `'auto'` for the platform default.

Performance: the wheel/drag handlers do O(1) work per event and read no layout in
the hot path — scroll bounds come from the ResizeObserver-backed sizes, and the
non-passive wheel listener is bound only when `wheel` is on. No API breakage;
defaults preserve current behaviour.
