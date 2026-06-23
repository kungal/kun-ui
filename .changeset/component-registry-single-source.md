---
"@kungal/ui-vue": minor
"@kungal/ui-nuxt": patch
---

feat: single source of truth for component registration + `KunUIResolver`

Kills the class of bug where a newly-added component is registered for plain Vue
but forgotten elsewhere (the recent `Failed to resolve component: KunReaction`).

- **One source** — `KUN_COMPONENT_NAMES` (exported from `@kungal/ui-vue`). The
  plain-Vue plugin types its registry as `Record<KunComponentName, …>`, so a
  missing/extra entry is a **compile error**, not a silent runtime failure. The
  Nuxt layer's auto-import list and the docs meta now derive from this list
  instead of hand-maintaining their own copies — they can no longer drift.
- **`KunUIResolver`** (new, from `@kungal/ui-vue`) for `unplugin-vue-components`,
  matching Element Plus / PrimeVue: Vite apps get on-demand, tree-shaken
  auto-import of every KunUI component with zero registration and zero list —
  new components work automatically.

  ```ts
  import Components from 'unplugin-vue-components/vite'
  import { KunUIResolver } from '@kungal/ui-vue'
  // plugins: [Components({ resolvers: [KunUIResolver()] })]
  ```

No change to existing usage (`app.use(KunUI)`, the Nuxt layer auto-import).
