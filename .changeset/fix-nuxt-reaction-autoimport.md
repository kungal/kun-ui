---
"@kungal/ui-nuxt": patch
---

fix(nuxt): register KunReaction for auto-import

`KunReaction` (added in 1.11.0) was wired into the plain-Vue plugin and the docs
but not into the Nuxt layer's `KUN_COMPONENTS` auto-import list, so downstream
Nuxt templates hit `[Vue warn]: Failed to resolve component: KunReaction`. Added
it to the list. No other component was affected — the rest are in sync.
