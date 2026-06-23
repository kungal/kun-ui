---
"@kungal/ui-vue": minor
---

feat(vue): KunCarousel seamless infinite loop (`loop`, default on)

Autoplay used to smooth-scroll all the way back to the first slide at the end — a
jarring reverse sweep. KunCarousel now loops seamlessly by **repositioning** slides
(a CSS `order` ring), with NO cloned DOM: the slide physically to the right of the
last is always the first, and after each scroll settles the position is re-homed in
the same frame (only off-screen slides shuffle, so the reset is invisible). Autoplay
glides forward past the end into the start; the arrows wrap both ways too.

- New `loop` prop, **default `true`** (auto-disabled when there are too few slides to
  loop without glitches; pass `loop="false"` for the old bounded behaviour).
- Reposition, not cloning → no duplicate nodes for screen readers to read twice.
- Keeps the native scroll-snap base (touch swipe + momentum + SSR).

Note: default-on, so existing carousels now loop — autoplay no longer snaps back, and
the arrows wrap around instead of disabling at the edges.
