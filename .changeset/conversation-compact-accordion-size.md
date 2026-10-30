---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

**KunChatConversationItem: `variant="compact"`, `busy`, and an `actions` slot.** These cover a list of conversation titles, such as an AI assistant's history sidebar, which the direct-message layout could not render.

- **`variant="compact"`** gives one line per row: a regular-weight title that truncates, at `text-sm`. There is no avatar, time, preview, delivery status or badge. The selected row uses a light `bg-default-100` instead of the primary fill. At rest the row is see-through, so it sits on your sidebar's own background. While it is being swiped it turns opaque, so the swipe actions behind it don't show through. Swipe actions and `href` work unchanged.
- **`busy`** shows a spinner after the title, in both variants. Screen readers announce it as "Replying" (`chat.replying`, a new message in both catalogs), so a row reads "<title> Replying".
- **The `actions` slot** lays buttons, typically a menu trigger, over the row's right end. They sit outside the row's own link or button, so they never nest inside it, and the row reserves space so they don't cover the title. On a device that can hover, they appear on hover, on keyboard focus, and while a menu they opened is expanded (anything inside with `aria-expanded="true"`). On a touch screen they stay visible, unless the row has swipe actions, in which case swiping replaces them.

**KunAccordion: `size`.** `size="sm"` gives every item a 32px header (`px-2 py-1.5 text-sm`, 16px icons) and a `px-2 pb-2` panel. It fits a list of one-line steps nested in another accordion's panel, where the default 56px header made one line of text three lines tall. `md` is the default and is unchanged.

Nothing changes for existing usage: every new prop defaults to today's rendering.
