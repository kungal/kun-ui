---
'@kungal/ui-vue': minor
---

`KunModal` gains `initialFocus` and `returnFocus`, so a dialog can choose where focus lands when it opens and where it goes when it closes. Without them a modal behaves as before, with two fixes noted at the end.

```vue
<KunModal v-model="open" initial-focus="input" :return-focus="false" @close="restoreEditor">
```

- **`initialFocus`** takes a CSS selector matched inside the dialog, an element, or a function returning one. It runs while the open transition plays, with `preventScroll`, on the centred dialog and the phone sheet alike. If it resolves to nothing focusable, the old order applies: the first tabbable element, usually the close button. A selector that matches nothing warns in development.
- **`returnFocus`** defaults to `true`: focus returns to the element focused when the dialog opened. `false` leaves focus alone, for a host such as a rich-text editor that puts its own caret back. An element or a function returning one sends focus there; a function returning nothing falls back to `true`.
- **Place focus yourself after a `nextTick` or an `await`.** Until the close is applied, the page behind the dialog is still inert and inside the focus trap, so a `focus()` made synchronously in `@close` is lost.
- **New default: native `autofocus`.** With no `initialFocus`, an element inside carrying the `autofocus` attribute now takes focus first, as in a native `<dialog>`. Before, the trap ignored it and focused the first tabbable element.
- **Fix: return focus with an autofocused field.** A field that focused itself on mount, such as `<KunInput autofocus>`, used to become the return target. Closing then sent focus to the removed field, and it fell to `<body>`. The opener is now recorded before the dialog renders.

The new `KunFocusTarget` and `KunFocusElement` types are exported.
