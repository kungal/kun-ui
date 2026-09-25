---
'@kungal/ui-vue': patch
'@kungal/ui-core': patch
---

`KunScrollShadow` is now portable in the Flutter contract (`contracts/component-contracts.json`). Nothing changes on the web. The contract used to call it a pure-CSS answer to web scrollbars. The Flutter port now needs what it adds on top of a scroller: edge fades that show only while there is more content on that side, a vertical mouse wheel that scrolls a horizontal strip (`wheel`, with `'contain'` keeping the page still), and grab-to-scroll with a mouse (`draggable`). Flutter's `Scrollable` does none of these by default, and a Flutter app with horizontal shelves could not scroll them with a plain mouse wheel. Only `className` and `contentClass` stay web-only, as class pass-throughs do everywhere.
