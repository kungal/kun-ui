---
"@kungal/ui-vue": patch
---

fix(vue): Tab underlined track line, FadeCard not animating, Pagination layout

- **KunTab** `variant="underlined"` no longer draws a static full-length track
  border — only the sliding active indicator remains.
- **KunFadeCard** now actually animates. Its `<Transition>` previously wrapped an
  always-present `<div>`, so a `v-if` on the *slotted* element (the documented
  `<KunFadeCard><Foo v-if="show"/></KunFadeCard>` usage) never triggered
  enter/leave. The `v-if` now lives on the Transition's direct child, driven by
  whether the slot has real content, so toggling collapses/expands (grid
  `0fr↔1fr`) and fades as intended.
- **KunPagination** `justify-between` is now effective: the page block and the
  jump-to-page block sat under conflicting `mx-auto` margins (auto margins beat
  `justify-content` in flexbox), which spread them oddly. Removed, so the page
  controls sit at the start and the jump control at the end.
