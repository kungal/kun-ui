---
'@kungal/ui-vue': patch
---

fix(vue): KunCarousel — structurally eliminate the "runaway auto-advance" flicker

The seamless loop drives itself by writing `scrollLeft`; some browsers then nudge
`scrollLeft` again after the reorder/reflow, which the re-home logic read back as a
user scroll → re-home → nudge → a per-frame feedback loop (slides stacking and
flickering, Chrome/Edge). 2.0.1's `overflow-anchor: none` only closed one drift
source (Chromium scroll-anchoring); other sources (snap re-alignment after the
`order` reflow) could still drive it.

Three layers of defense so it can't recur regardless of the browser:

- `overflow-anchor: none` is now applied as an **inline style** instead of a
  Tailwind utility — a correctness fix must not depend on a headless consumer's
  Tailwind regenerating an arbitrary class; an inline style always wins and is
  never purged.
- A **re-entrancy lock**: the carousel's own programmatic `scrollLeft` writes can
  no longer trigger a re-home, which breaks the whole class of write→event→re-home
  loops — not just scroll-anchoring.
- A **circuit breaker** plus an autoplay **self-heal**: if reorders ever spike it
  drops to a plain non-looping slider, and autoplay re-homes before advancing so a
  stray drift can never leave the carousel parked at a physical edge.

No API change.
