---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": minor
---

feat: route component transitions through the motion scale

Transitions hardcoded raw `duration-150/200/300` and raw `ease-in/out/in-out`
that didn't match the designed motion tokens (overlay enters were `200ms` but
`--kun-dur-base` is `250ms`; some controls used symmetric `ease-in-out` while the
rest used the asymmetric `ease-kun-*` curves). Now unified:

- New `duration-kun-fast | base | slow | exit` utilities bound to `--kun-dur-*`
  (with literal fallbacks). Every component transition routes through them, so a
  global motion retune via the tokens actually propagates.
- Mapped by role, preserving the asymmetric rhythm (enter decelerates, exit
  accelerates): overlay **enter → base**, **leave → exit**, hover/selection/focus
  **micro → fast**, skeleton/fade/large **→ slow**.
- Remaining raw `ease-in-out` / `ease-out` Tailwind classes (Avatar, Input,
  Textarea, Progress) switched to `ease-kun-standard` / `ease-kun-out`; scoped-style
  easings (Content, Ripple) now read `var(--ease-kun-*)`. The looping indeterminate
  progress keyframe and the dark Lightbox viewer keep their own timing.

Net effect: a single, consistent motion feel across every control. No API changes.
