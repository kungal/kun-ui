---
"@kungal/ui-tokens": patch
"@kungal/ui-vue": patch
---

perf: stop shipping backdrop-filter on every surface (mobile scroll jank)

KunCard shipped `backdrop-filter: blur(var(--kun-background-blur))` on EVERY card —
and the default blur was `0px` over an opaque surface, so it did nothing visually
while still promoting each card to a compositing layer and running the backdrop
pipeline. `backdrop-filter: blur()` is the #1 cause of janky scrolling on mobile
(a 120Hz phone can drop to ~30–60Hz). With many cards per page the layers piled up.

- KunCard / KunModal now emit `backdrop-filter` only via the new opt-in
  `kun-backdrop` utility, which is `none` by default (free — no layer, no blur pass).
- New token `--kun-backdrop-filter` (default `none`) **replaces `--kun-background-blur`**.
  A glass site opts in for every raised surface at once:
  `:root { --kun-surface-opacity: 0.7; --kun-backdrop-filter: blur(12px); }`

BREAKING (glass only): if you set `--kun-background-blur: 12px`, switch to
`--kun-backdrop-filter: blur(12px)`. Sites that never enabled glass are unaffected
(and get smoother scrolling for free).
