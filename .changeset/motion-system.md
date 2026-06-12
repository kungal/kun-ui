---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": minor
---

A unified motion system — smoother, more consistent animation across every
component.

**Motion tokens (@kungal/ui-tokens).** One easing set + duration scale so the
whole library shares a rhythm instead of each component inventing its own:
`--ease-kun-standard / -out / -in / -emphasized` (also exposed as Tailwind
`ease-kun-*` utilities) and `--kun-dur-fast / -base / -slow / -exit`. Curves are
asymmetric by design — decelerate on enter, accelerate on exit — and exits run
~30% shorter than enters. The opinionated base layer now also honours
`prefers-reduced-motion: reduce` (WCAG 2.3.3).

**Killed the layout-thrashing animations** (these caused visible stutter):

- **KunTab** indicator no longer transitions `height` (it never changes between
  same-row tabs); it slides via `transform` and only its `width` animates.
- **KunFadeCard** expands via the grid `0fr → 1fr` trick instead of `max-height`
  — no more `max-h-96` clipping of tall content, no per-frame height recalc.
- **KunMessage** progress bar shrinks via `transform: scaleX` (compositor)
  instead of animating `width`.

**Overlays retuned and made origin-aware.** KunModal now fades its backdrop
(opacity only) while the panel rises + scales independently; KunDrawer’s backdrop
and panel are timing-matched. KunDropdown / KunSelect / KunPopover / KunDatePicker
/ KunContextMenu now **grow out of their trigger** — `transform-origin` follows
the floating-ui placement, so a menu that flips above its trigger correctly grows
from its bottom edge. Every overlay shares the `ease-kun-*` curves and timing.

**Micro-interactions.** KunSlider’s thumb gains a hover/focus ring halo (it had
no feedback before); KunSwitch gains a keyboard `focus-visible` ring and a
springier thumb settle; KunCheckBox’s check eases in with the emphasized curve.

No component API changed. KunFadeCard now wraps its slot in a grid container (a
DOM-structure change); if you targeted its immediate child with CSS, retarget the
inner content.
