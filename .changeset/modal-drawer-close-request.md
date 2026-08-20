---
'@kungal/ui-vue': minor
---

On Android, the back button and back gesture now close KunModal and KunDrawer
instead of navigating away from the page — the behaviour a native `<dialog>`
already has, and what a phone user expects from anything that looks like a
sheet.

This uses the platform's `CloseWatcher` API, so it needs no history entry and
touches nothing the host app's router owns. The widespread `history.pushState`
workaround is deliberately not used: the WICG explainer for this API lists why,
ending on the one that decides it for a shared component — "a shared component
that attempts to use the history API to implement these techniques can easily
corrupt a web application's router."

Scope, deliberately narrow:

- Android only. The only close request a desktop browser sends is Escape, which
  both components already handle, so desktop behaviour is byte-for-byte
  unchanged. iOS has no back button and Safari has not shipped `CloseWatcher`,
  so it is unaffected too.
- Only the topmost overlay answers, so stacked dialogs close one layer per
  press, matching Escape.
- Nothing happens when `isDismissable` is `false`. A non-dismissable dialog lets
  the back press navigate as before rather than trapping the user on the page.

New prop on both components, `isCloseRequestDismissable` (default `true`), turns
it off for a dialog that is bound to a route and wants back to navigate.

`useKunCloseRequest` is exported for apps that want the same behaviour on their
own overlays.
