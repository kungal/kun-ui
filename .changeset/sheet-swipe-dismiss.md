---
'@kungal/ui-vue': minor
---

A phone sheet can now be dragged downwards to dismiss it — KunModal in its
`placement="auto"` sheet form below `md`, and any KunDrawer sitting on the
bottom edge, including a `responsive` one that becomes a bottom sheet there.

The rule that matters is how the gesture shares a finger with the sheet's own
scrolling: **the content wins until it is scrolled back to the top**. A swipe
over content that is scrolled down still scrolls it, so long content can't be
dismissed by accident. This is what vaul (shadcn-vue's and Nuxt UI's Drawer) and
Base UI's `useSwipeDismiss` both do; the thresholds are theirs too — 25% of the
panel height, or a 0.4 px/ms flick, else it springs back.

- Touch only (`pointer: coarse`), so a mouse never starts a drag and text
  selection is untouched.
- A drag handle is drawn at the top of the sheet to advertise the gesture. It is
  CSS-gated to exactly where the gesture exists, decorative, and costs the
  content no layout.
- Follows `isDismissable`, so `role="alertdialog"` and a non-dismissable dialog
  cannot be swiped away. New `isSwipeDismissable` prop (default `true`) turns it
  off on its own.
- Drags starting on an `input`, `textarea`, `select`, `[contenteditable]` or
  `[role="slider"]` are left to that control; `data-kun-no-drag` opts anything
  else out.
- A drawer's backdrop dims in step with the drag.
- `prefers-reduced-motion` keeps the gesture but drops the spring-back
  animation.

Also: the body scroll lock now sets `overscroll-behavior: none` while an overlay
is open. Chrome for Android's pull-to-refresh survives `overflow: hidden`, and
it fires on exactly the downward drag this gesture uses.

`useKunSwipeDismiss` is exported for apps that want the gesture on their own
sheets.
