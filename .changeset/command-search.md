---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

New `KunCommandSearch`: a search field that stays in the top bar and opens KunCommandPalette's results in a panel under it. This is the top-bar search of Slack, Teams, GitHub, Jira and Steam. The kungal desktop app asked for it, and it was faking one with KunAutocomplete.

- **Same content as the palette.** It takes the same `items` (flat or `KunCommandGroup[]`), `v-model:query`, `loading` and `highlight`, and renders the same rows: icon, section, label, description, match highlight, and the `#item` slot. Like the palette it does no searching: you compute `items` from the query and own the debounce.
- **Opens on focus.** With an empty field it shows whatever `items` you pass, so recent searches go there. It opens nothing when there is nothing to show (no rows and no `#empty` slot), and `aria-expanded` follows what is on screen. Clearing the field keeps it open.
- **Enter goes to the search page.** Unlike the palette, nothing is highlighted until an arrow key moves onto a row. Enter after typing emits `@submit(query)`; Enter on a highlighted row, or a click, emits `@select(item)`. The arrow keys cycle through "nothing highlighted", as a browser's address bar does. Every documented desktop app we checked behaves this way; none picks the first suggestion on Enter.
- **Escape:** the first press closes the panel and keeps the text, the second clears the text. Tab, a click outside, selecting and submitting all close it. Focus never leaves the field: the panel is a listbox driven by `aria-activedescendant`, its options are out of the tab order, and there is no dialog, backdrop, scroll lock or focus trap.
- **Size:** the panel is left-aligned 4px under the field, as wide as the field but at least 360px, capped to the viewport. Its height is the smaller of `maxHeight` (default 420) and the room below. `loading` turns the field's search icon into a spinner. Rows already on screen stay until new ones arrive, so the list does not blink on every keystroke.
- **Shortcut:** ⌘K / Ctrl+K focuses the field. A field that is not on screen, or sits behind a modal, ignores the shortcut and leaves it to a KunCommandPalette on the same page. That is the narrow-screen recipe: show the field from `md` up and the palette's icon button below it with breakpoint classes, both fed the same `query` and `items`. The component never switches layout from JavaScript, so the server renders the right one at every width.

**Changes to KunCommandPalette**, all additive:

- `KunCommandItem.removable` adds a remove button to a row (recent searches, say). Shift+Delete removes the highlighted row; both emit the new `@remove`, you drop the item from `items`, and the highlight stays on the row that takes its place.
- A labelled group is now `role="group"`, named by its heading. A group with no items is no longer rendered: it used to leave an orphan heading.
- The palette's ⌘K ignores a keystroke another handler already consumed, which is how a visible KunCommandSearch takes it first.

**KunModal and KunDrawer** no longer close on an Escape that a field inside them already used. A KunCommandSearch clearing its text and a KunChatComposer cancelling its reply bar each took the modal down on the same press.

Locale: `commandPalette.remove` and `commandPalette.clear` (zh-CN and en), shared by both components.
