---
'@kungal/ui-vue': minor
---

feat(vue): KunAutocomplete gains `loading` + `debounce` for async data sources

`:loading` shows a spinner in the dropdown (reusing `KunLoading`) instead of
`noResultText` while a remote `@search` request is in flight — drive it from your
fetch (true on request start, false when the options land). `:debounce` (ms)
delays the `@search` emit so you fetch once the user pauses, not per keystroke
(the input text still updates instantly). The two mesh: while the debounce is
armed the spinner already shows, so the gap before the request never flashes
"no matches" — it's continuous from keystroke to results. `:loadingText` sets the
spinner caption (default '加载中…'). Fully backward-compatible: `debounce` defaults
to 0 (emit every keystroke, unchanged).
