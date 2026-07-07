---
'@kungal/ui-vue': patch
---

fix(vue): KunMessage no longer jumps wider for a frame when dismissed

The leaving toast went `position: absolute; width: 100%`, but the `%` resolved
against the outer `fixed` container's padding box — 2rem wider than the in-flow
content width — so the toast visibly widened and spilled out the right edge for a
frame before fading. The `TransitionGroup` wrapper is now the containing block
(`position: relative`), so `width: 100%` matches the in-flow width exactly.
