---
'@kungal/ui-vue': minor
---

**`KunHoverCard`**, a preview card for a link, such as a user card on an avatar. It opens when a mouse rests on the trigger for `openDelay` (600 ms) or when the trigger takes keyboard focus (`:focus-visible`), and never on touch. A click is never intercepted: it follows the link and closes the card, so the card does not linger over the page transition. `KunPopover trigger="hover"` is unchanged. It is still the navigation-menu mode, where a click toggles the menu and touch falls back to click, which is why a link inside it both toggled the menu and navigated.

- The card has no role and never takes focus. The link stays the one accessible interface, the same line Radix HoverCard and Base UI PreviewCard draw, so put nothing in the card that the destination page lacks: keyboard and screen-reader users do not reach it.
- The trigger wrapper is `display: contents`, so wrapping a `KunAvatar` or `KunUserChip` in a flex row does not change its layout. The card anchors to the trigger slot's first element. There is no `fullWidth`; a full-width trigger is full width on its own.
- The card mounts only while open, so a fetch in its content's setup runs on open. `v-model:open` tracks it, and the default slot receives `{ close }` for a link inside the card.
- `group` keeps one card open across a list and switches between siblings without waiting out the delay again, by mouse or by Tab. `disabled` renders the trigger alone, for a user with nothing to preview.
- The delays default to 600 ms open and 300 ms close, the defaults of Base UI PreviewCard and zag's hover-card (Radix uses 700/300).
- An idle card attaches no window or document listener, which matters for a topic page with an avatar card on every reply. Measured in Chromium 153: opening a card adds a `keydown` and a `pointerdown` listener, plus floating-ui's `scroll` and `resize`, and closing it removes all four.

`useKunPointerMenu` also returns `requestOpen()` and `close()`, and its return type is exported as `KunPointerMenu`. Leaving a trigger whose menu never opened no longer arms a short-lived document `pointermove` listener; nothing else changes for `KunPopover`.
