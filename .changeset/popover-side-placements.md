---
"@kungal/ui-vue": minor
---

feat(vue): KunPopover exposes right / left (and centered) placements

`KunPopoverPosition` now covers all 12 floating-ui sides — the `right-*` / `left-*`
placements (and the centered `top` / `bottom` / `right` / `left`) are now part of
the public type, not just `top-*` / `bottom-*`.

The implementation already passed `position` straight to floating-ui and mapped
every side's transform-origin, so a side-anchored flyout just needed the type to
allow it. With `autoPosition` (the default) a `position="right-start"` flyout is
fully collision-aware: `flip()` / `shift()` keep it on-screen and `size()` caps
its height to the available space and scrolls — so a tall menu near the bottom
edge no longer clips. This makes a navigation rail's hover flyout a first-class
use of `<KunPopover position="right-start" trigger="hover" :group>` instead of
hand-rolled `absolute left-full` + `max-h-[80vh]` positioning.
