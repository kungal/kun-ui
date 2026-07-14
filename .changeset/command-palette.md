---
'@kungal/ui-vue': minor
---

feat(vue): add KunCommandPalette (⌘K command palette / spotlight)

The generic ⌘K palette SHELL — trigger + global shortcut, teleported dialog,
autofocus, body scroll-lock, keyboard nav (↑↓ / Home / End / Enter / Esc),
grouped results, safe match highlighting, and full a11y (dialog + combobox +
listbox + aria-activedescendant) — with NO search logic baked in. You compute
`items` (flat or grouped) from the `query` it exposes via `v-model:query` (your
own scoring / index / async fetch) and it renders + navigates them; selecting
emits `@select`. Generic over the item shape, with `#trigger` / `#item` /
`#empty` / `#no-result` / `#footer` slots, a `loading` state, and a configurable
`shortcut`. The docs site's ⌘K search is now a thin consumer of it.
