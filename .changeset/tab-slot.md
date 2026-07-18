---
'@kungal/ui-vue': minor
---

feat(vue): KunTab `#tab` slot for custom tab content (badges, dots)

KunTab is now generic over the item shape and exposes a `#tab` scoped slot
(`{ item, index, active }`) so you can render custom per-tab content — e.g.
compose a `KunBadge` for an unread count or an "unsaved" dot — instead of being
limited to icon + label. Extra fields on the item (a `count`, a `dirty` flag, …)
are typed inside the slot. The sliding indicator measures the button, so
badge-widened tabs are tracked automatically. Defaults to icon + label
(backward-compatible).
