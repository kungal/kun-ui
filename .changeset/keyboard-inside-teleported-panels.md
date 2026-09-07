---
'@kungal/ui-vue': patch
---

Fix the keyboard going dead inside KunSelect, KunAutocomplete and KunCommandPalette

Reported downstream against KunSelect: in a multiple select, clicking an option
left Escape unable to close the panel. It reproduced, and it was wider than the
report — the whole keyboard was dead, not just Escape.

All three panels are `Teleport`ed to `<body>`, so a keydown inside one never
bubbles to the trigger where the handler lives. What differs is how focus gets
into the panel in the first place:

- **KunSelect** — the `<ul>` is `tabindex="-1"`, so a real mouse click on an
  option (or on the list's own padding) focuses the *list*. Measured in Chrome
  152 after clicking one option of a non-searchable multiple select: ArrowDown,
  Enter, type-ahead and Escape were all dead, and only a click outside could
  close the panel. A searchable select was hit too — clicking the 4px strip
  around the list was enough. The keydown handler now sits on the panel root
  (and no longer on the search box, which would have run it twice and toggled
  the selection straight back off), so every key works from anywhere in the
  panel; and the panel's own padding now declines focus, so a click there leaves
  it on the search box or the list instead of dropping it on `<body>`.
- **KunAutocomplete** — options already kept focus in the input with
  `@mousedown.prevent`; the panel's own padding did not. A click there moved
  focus to `<body>` with the panel still open. The padding now declines focus as
  well (`.self`, so a focusable element inside a custom `option` slot still
  works).
- **KunCommandPalette** — results are real `<button>`/`<a>` elements, so one Tab
  took focus off the input and Escape stopped closing the dialog.

Each of the three also gained the window-level Escape backstop KunDropdown and
KunPopover already had, for focus the component does not own. Verified in Chrome
152 that a select or autocomplete inside a KunModal still closes only itself on
the first Escape, and the palette opened over a modal likewise.

One deliberate behaviour change: `Tab` out of an open KunSelect now returns
focus to the trigger and closes the panel, as KunDropdown does. It used to let
the browser move on — and since the panel is teleported to the *end* of
`<body>`, that wrapped focus to the top of the page.
