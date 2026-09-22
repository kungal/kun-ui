---
'@kungal/ui-vue': patch
---

**KunTab's link mode is navigation, not a tablist.** A tab controls a panel; a link goes to a page. When every item carries an `href` there is no panel anywhere on the page, but the strip still rendered `role="tablist"`, `role="tab"` and `aria-controls="<name>-tabpanel-<value>"` — an id that was never rendered, while the APG requires a `tab` to carry "aria-controls referring to its associated tabpanel element". A screen reader was told these were tabs controlling panels that do not exist.

Such a strip now renders as what it is: no `role` on the list or its items, no `aria-controls` / `aria-selected`, and `aria-current="page"` on the current item only — the mapping Radix, Reka, Base UI and Fluent all use for a navigation link. Every link is individually focusable again (the roving `tabindex` left only one reachable by Tab), and arrow keys no longer move between them, because with automatic activation each arrow press was a page navigation. Enter still activates the focused link and still routes through `config.navigate`, so SPA routing under Nuxt is unchanged. A mixed strip, where only some items have an `href`, keeps tablist semantics.

**⌘ / Ctrl-click opens a link tab in a new tab again.** The click handler called `preventDefault()` on every click of an `href` item, including modified ones, so the browser's "open in a new tab" gesture navigated the current page instead — measured in Chromium, and the reason Radix and Reka both guard their link handler with `!event.metaKey`. A modified click (⌘, Ctrl, Shift, Alt, or a non-primary button) now falls through to the browser, and `v-model` does not move, because the current page has not changed.

One more thing this fixes: when the items' hrefs differ only by query string (`?tab=a`, `?tab=b`), NuxtLink marked all of them `aria-current="page"` — three links each claiming to be the current page. KunTab now sets that attribute itself, so exactly one does.

If you use `href` tabs for site navigation today, nothing in your template changes. The docs gained a `Link.vue` demo for the mode.
