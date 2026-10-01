---
'@kungal/ui-vue': patch
---

KunPagination no longer treats a browser gesture as a request to change page. Both were reported downstream (letmoe); the forum and patch had the same behaviour.

- **Modified clicks in link mode.** With `page-href`, a click with Ctrl, Cmd, Shift or Alt held is the browser's open-in-a-new-tab, new-window or download gesture. It used to emit `update:currentPage` as well, so a consumer following the event moved the current tab while the browser opened the new one. It now emits nothing: the new tab opens and this one stays on its page.
  - A plain click still emits, exactly as before, while the link navigates. This is deliberate: a consumer that keeps the page in a local ref (patch's galgame browser) depends on it, and not emitting for any click in link mode would have left that list on the old page.
  - So every `update:currentPage` now means "show page N in this tab", whatever caused it, and a handler no longer has to tell a click from a key press. A wrapper that skipped the event for clicks on a link can drop that check.
  - Without `page-href` the controls are buttons, and a modified click is still an ordinary click.
- **Arrow keys.** ← / → page from anywhere on the page, so the listener now ignores a keystroke that is not a request to page:
  - with Ctrl, Cmd, Alt or Shift held. Alt+← (Back), Ctrl+← and Shift+← (text selection) all used to page.
  - already handled by another widget (`defaultPrevented`). An open KunLightbox used to page its image and the list behind it on the same keystroke.
  - while a modal is open above the pagination (KunModal, KunDrawer, a native `<dialog>`, anything with `aria-modal="true"`). A KunPagination inside the modal still responds.
- **KunLightbox** ignores ← / → with a modifier held as well. It used to swallow Alt+← and page to the previous image.
- **`aria-current` in link mode.** Under RouterLink / NuxtLink with `?page=N` hrefs, the prev and next links were also marked `aria-current="page"`, because RouterLink matches on the path and ignores the query. Only the active page number carries it now.

**What it costs:** nothing to adopt. If you relied on Ctrl-click also moving the current tab, or on Shift+arrow paging, that is gone. `page-href` is unchanged for crawlers and for plain clicks.

The pagination primitives we read (Reka UI, which Nuxt UI's `to` builds on, Zag / Ark UI's `type: "link"`, MUI) all emit for every click, modified or not. We diverge and apply the predicate vue-router's `RouterLink` uses for its own navigation, as KunTab already does for its link items.
