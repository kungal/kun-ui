---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

New `KunSplitPane`: two panes with a divider you can drag or move with the keyboard. It suits a list beside a detail view, or a main area with an auxiliary column. KunChatLayout now switches between one and two panes by its own width, and its list pane can be made draggable.

**KunSplitPane** puts its panes in the `#start` and `#end` slots.

- **Width.** `v-model:size` is the primary pane's width in px (default 360). It is a prop the server knows, so the server-rendered HTML already has the layout and the divider's `aria-valuenow`/`min`/`max`.
- **Persisting the width.** `v-model:size` updates on every pointer move. Save from `resize-end`, which fires once per drag or key press, for example to a cookie your server reads back into `size`.
- **Limits and snapping.** `min-size` and `max-size` default to 240 and 480. `snap-points` (e.g. `[360, 412]`) pull the divider in once it comes within `snap-threshold` px (default 8), and any width in between stays reachable. A keyboard step that ends within the threshold snaps too, but a snap never cancels or reverses a step, so a small `step` cannot get stuck on a snap point.
- **Which pane is sized.** `primary="end"` gives the width to the right pane, for an auxiliary column.
- **Keyboard** (WAI-ARIA window splitter pattern):
  - ← and → move the divider by `step` (default 10px); Shift moves five steps.
  - Home and End jump to the minimum and maximum.
- **The divider** is a 1px line. Its grab area is 9px wide with a mouse and 21px on a touch screen, and it sits above the panes' content. A drag follows the pointer that started it; a second finger or the mouse cannot take it over. While you drag, the page keeps a col-resize cursor, no text gets selected, and the panes ignore the pointer, so an iframe can't swallow the drag.
- **Narrow layouts.** Below `stack-below` (`md` = 48rem by default, `lg` = 64rem, or `false`), it shows one pane at a time, chosen by `show-pane`. This is a container query on the component's own width, not a media query on the window: a split nested beside a side rail or inside another pane stacks based on the room it actually has.
- **Flutter port.** The snapping rule is a pure `resolveKunSplitSize` in `@kungal/ui-core`, with tests.

**KunChatLayout** now shows two panes once the layout itself is 48rem (768px) wide, rather than once the window is.

- **Why:** a chat beside an app's side rail used to switch to two panes in a 768px window that left it 679px, and the conversation was squeezed to 327px.
- **What might change for you:** pages that give the chat less than 48rem (for example, a window of about 768–800px minus page padding) now show one pane.
- **KunChatHeader's `back="mobile"`** follows the KunChatLayout around it. Outside a KunChatLayout it still uses the window's `md` width.
- **New props:** `resizable`, `v-model:sidebar-size` (px), `sidebar-min-size` and `sidebar-max-size` make the list draggable through KunSplitPane. The `sidebar-resize-end` event is the one to persist from. Without `resizable`, `sidebar-width` works as before.
