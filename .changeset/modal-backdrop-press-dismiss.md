---
"@kungal/ui-vue": patch
---

`KunModal`: the backdrop only dismisses when the press *started* on the backdrop.

The overlay used a bare `@click`, so pressing inside the modal (e.g. selecting
text in an input), dragging the cursor onto the backdrop, and releasing there
fired a `click` on the backdrop and closed the modal — "I let go of the mouse
and the dialog vanished". The overlay now tracks the pointer-down target and
treats the click as a dismiss only when both the press and the release are on
the backdrop itself. `isDismissable` behaviour is unchanged.
