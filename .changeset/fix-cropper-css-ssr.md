---
"@kungal/ui-vue": patch
---

Fix `Unknown file extension ".css"` crash under Nuxt SSR.

KunUpload imports `vue-advanced-cropper`'s stylesheets, and the library build
externalized those `.css` subpaths — so bare `import 'vue-advanced-cropper/dist/
style.css'` statements survived at the top of the published `dist/index.js`.
Nuxt externalizes `@kungal/ui-vue` for SSR and handed those paths straight to
Node, which can't load `.css` — crashing dev *and* production SSR for any app
that imported any Kun component (the cropper sits at the top of the barrel).

The build now bundles all imported dependency CSS into `@kungal/ui-vue`'s single
`dist/style.css` (which consumers already import) and ships JS with no runtime
CSS imports; the cropper's JS stays external. No consumer changes needed.
