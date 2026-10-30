---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
---

**KunDrawer: swipe toward its own edge to dismiss, on every placement.** Until now only a drawer on the bottom edge could be dragged shut. On a touch-primary pointer, a `left` drawer now closes on a leftward swipe, a `right` drawer on a rightward one, and a `top` drawer on an upward one. The physics are the bottom sheet's: release past 25% of the panel's width (or height), or flick faster than 0.4 px/ms. Anything less springs back, and the backdrop dims in step with the finger. Material's modal navigation drawer and vaul's `direction` behave the same way.

The gesture shares the finger with the content the way the bottom sheet already does, judged on the swipe's own axis:

- A move mostly across the axis is left alone, so the vertical list in a side drawer still scrolls natively.
- Content that can still scroll the way the finger is going keeps the swipe. In a left drawer, a horizontal tag strip takes leftward swipes until it reaches its end. RTL scrollers are handled. Vertical scroll position never blocks a horizontal swipe.
- New for every placement: an element whose `touch-action` withholds panning on the swipe's axis keeps the swipe. KunChatConversationItem's swipe actions declare `pan-y`, so in a left drawer a leftward swipe on such a row opens the row's actions instead of also closing the drawer. A bottom sheet still drags down from that row. An element with `touch-action: none` no longer starts a sheet drag in any direction.

**Every swipe-to-dismiss sheet: a flick back toward open now keeps it open.** This applies to KunModal's phone sheet and to KunDrawer on any edge. Previously, a sheet dragged past 25% closed on release even when the finger flicked back first. Now a release faster than 0.4 px/ms decides on its own: a flick toward the edge dismisses, a flick back keeps the sheet open, and only a slower release falls back to the 25% distance rule. This is how AndroidX `DrawerLayout` and iOS sheets behave. vaul and MUI's `SwipeableDrawer` don't do this, which is how this case slipped through. `KunSwipeDismissPhysics` in kun_ui_tokens documents the new rule for the Flutter port. Its values are unchanged.

Only the bottom sheet draws a drag handle. `isSwipeDismissable={false}` turns the gesture off, as before. Desktop and mouse input are unaffected.

`useKunSwipeDismiss` takes a new `direction` option (`'down'` by default) and exports the `KunSwipeDismissDirection` type, so an app's own panel can use the gesture on any edge.

`withContainer` now has JSDoc. For a navigation or history list that runs edge to edge, set it to `false` and give your own scroller `flex-1 overflow-y-auto`.
