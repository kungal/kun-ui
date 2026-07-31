---
"@kungal/ui-vue": patch
---

fix(vue): KunLightbox double-tap zoom no longer snaps straight back on touch

On a touchscreen, double-tapping the image zoomed in and instantly zoomed back
out. Touch devices replay a tap as synthesized mouse events once the touch
sequence ends, and the second tap's replay includes a `dblclick` — verified on
mobile Chromium as `touchstart > touchend > mousedown > mouseup > click >
dblclick`. So the gesture was handled twice: `onTouchEnd`'s own double-tap
detection zoomed to 2×, then the synthesized `dblclick` saw `scale > 1` and ran
the reset branch back to 1×.

Mouse handlers (`dblclick`, `mousedown`, `mousemove`, `mouseup`) now ignore
events arriving in the wake of a touch, so each gesture is handled exactly once.
Mouse-only interaction is unaffected.
