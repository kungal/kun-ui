---
'@kungal/ui-vue': patch
---

fix(vue): Accordion duplicate ids + Carousel dot indicators

Two issues found reviewing the 1.6.0 components:

- **KunAccordion**: header/panel ARIA ids were derived from the item `value`, so
  two accordions reusing the same values (e.g. `a`/`b`) emitted duplicate ids —
  invalid HTML and a broken `aria-controls` target. Ids are now generated with
  Vue's SSR-stable `useId()`, so they're globally unique regardless of `value`.
  (`name` stays as an optional readable prefix.)
- **KunCarousel**: with `slidesPerView > 1` the dots rendered one-per-slide, but
  the last `slidesPerView − 1` of them could never become active. Dots now map to
  reachable scroll positions (`maxIndex + 1`), so every dot works. The dots also
  switched from an incorrect `role="tab"` (with no tabpanels) to plain buttons
  with `aria-current`, and an internal computed no longer shadows the
  `showArrows` prop.
