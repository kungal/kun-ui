---
'@kungal/ui-vue': patch
'@kungal/ui-tokens': patch
---

**KunDrawer: a left, right or top drawer no longer leaves its edge when dragged past open.** In 2.64.0, you could start a dismissing swipe and then drag back past the starting point. The panel kept following for up to 32px of rubber band, which pulled it off the screen edge it is anchored to and opened a gap behind it. These drawers now stop at their open position, the way AndroidX `DrawerLayout` clamps its drawers. The bottom sheet, in both KunModal and KunDrawer, keeps its rubber-band stretch. `KunSwipeDismissPhysics` in kun_ui_tokens documents the split for the Flutter port. Its values are unchanged.
