---
"@kungal/ui-vue": minor
---

feat(vue): KunReaction — a compact like/reaction control with count

A purpose-built reaction control so a like + count doesn't bloat into a wide
padded text button. It's a tight pill (icon + optional count), a proper toggle
(`aria-pressed`, accessible name includes the count), and it animates on click —
all pure CSS/Vue, no external library:

- icon fills + colours when active;
- a bouncy pop;
- a one-shot burst (expanding ring + radiating sparks) when liking;
- the count rolls in the direction it changed.

`v-model` is the active state; `v-model:count` the count (auto ±1 on click, the
parent can override for server sync). Props: `icon` (default a heart), `color`
(default danger), `size`, `disabled`, `disableAnimation`, `label`. All animation
is off under `prefers-reduced-motion`.
