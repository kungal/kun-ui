---
"@kungal/ui-vue": patch
---

**Select / Autocomplete**: fix the page jumping to the top the first time the dropdown is opened while scrolled down. The teleported list is momentarily at `(0,0)` before floating-ui's first async measurement, so `Element.scrollIntoView()` (and a plain `focus()` on the search field) scrolled the whole window to the top. The active option now scrolls **within its own list container** only, and Select's search-field focus uses `{ preventScroll: true }`.
