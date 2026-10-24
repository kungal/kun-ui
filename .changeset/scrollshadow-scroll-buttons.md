---
'@kungal/ui-vue': minor
---

**KunScrollShadow: `scrollButtons`.** A horizontal strip can now float a chevron button on each edge that can still scroll, the same control KunTab shows on an overflowing tab list. A click scrolls about 80% of the viewport, smoothly unless `prefers-reduced-motion` is set. Use it where the edge shadow alone doesn't tell users the strip scrolls, such as an editor toolbar on a phone.

It defaults to `false`, so existing strips don't change, and it is ignored for `axis="vertical"`. The buttons appear and disappear as the scroll position and the content width change, including content that grows after mount. They sit outside the scroll container, so a `draggable` drag never triggers one. As in KunTab they are a redundant affordance: swipe, wheel and keyboard still scroll the strip, so they stay out of the tab order and the accessibility tree.

KunTab now renders its chevrons through the same internal component. Its markup, classes and behaviour are unchanged.
