---
'@kungal/ui-vue': minor
---

feat(vue): five new components — Accordion, Carousel, Skeleton, Steps, Timeline

Adds the components the kungal apps were repeatedly hand-rolling on top of KunUI.
All are SSR-safe and accessible, and reuse the shared design tokens / contrast
helpers.

- **KunAccordion + KunAccordionItem** — collapsible sections. Single-open by
  default or `multiple`; controlled via `v-model` (string / string[]) or
  uncontrolled from `defaultValue`. `light` / `bordered` / `splitted` variants.
  The reveal uses the CSS grid `0fr → 1fr` trick — animates real height with no
  JS measurement and renders collapsed in SSR HTML (no hydration flash). Proper
  `aria-expanded` / `aria-controls`, and the closed panel is `inert`.
- **KunCarousel + KunCarouselItem** — horizontal slider on native CSS
  scroll-snap, so touch swipe + momentum work with zero JS and it renders
  server-side. Prev/next arrows, dot indicators (read from scroll position) and
  optional `autoplay` are progressive enhancements; autoplay pauses on
  hover/focus and is off under reduced-motion. `slidesPerView` for thumbnail
  strips.
- **KunSkeleton** — content loading placeholder (`text` / `rect` / `circle`),
  `loaded` swaps in the real content via the default slot, pulse respects
  reduced-motion.
- **KunSteps** — multi-step indicator (`items` + `current`), horizontal /
  vertical, done / active / pending states, contrast-correct filled markers.
- **KunTimeline + KunTimelineItem** — vertical timeline with coloured dots or
  icon medallions; the connecting line is pure CSS.
