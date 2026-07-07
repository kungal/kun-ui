---
'@kungal/ui-vue': patch
---

fix(vue): KunAutocomplete no longer reopens the panel after picking an option

Clicking an option blurred the input, and the post-select refocus then
re-triggered the `@focus`-to-open — so the panel visibly closed and sprang back
open. Options now `@mousedown.prevent` (keeping focus on the field, so no
reopen), and the input opens on `@click` too so clicking the already-focused
field can still reopen the list. Keyboard selection was unaffected either way.
