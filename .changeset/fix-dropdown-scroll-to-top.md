---
"@kungal/ui-vue": patch
---

Fix `KunDropdown` yanking the page to the top when opened.

The menu is teleported to `<body>` and positioned by floating-ui's async
`computePosition`. `open()` focuses the menu inside a `nextTick`, which fires
before the position is committed — so the menu is still at its initial
`top:0; left:0`, and focusing it there scrolled the document to the top (very
visible on mobile: tapping a trigger low on the page yanked the viewport up).
All three `focus()` calls now pass `{ preventScroll: true }`, so focus still
lands on the menu/item (keyboard nav unchanged) without scrolling.
