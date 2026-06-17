import { KunUI } from '@kungal/ui-vue'

// Globally register every KunUI component on the docs app.
//
// Normally the Nuxt layer auto-imports components at BUILD time (it rewrites
// `<KunButton>` in .vue templates into real imports). That transform never runs
// on code the Playground compiles in the browser at RUNTIME, so a freshly
// compiled template that references `<KunButton>` would fail to resolve it.
//
// `KunUI` is the library's Vue plugin — it does `app.component(name, comp)` for
// the whole set. Installing it here adds them to the app's GLOBAL component
// registry, which is exactly what Vue's runtime `resolveComponent` falls back
// to. So Playground-compiled components, mounted via `<component :is>` inside
// this same app tree, resolve `<KunButton>` & friends and inherit the layer's
// icon / link / image bridges (installed by ui-nuxt's installKunUIConfig on the
// same vueApp). Build-time auto-imported call sites are unaffected — they never
// hit the global registry.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(KunUI)
})
