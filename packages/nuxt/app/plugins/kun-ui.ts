import { installKunUIConfig } from '@kun/ui-vue'
import KunNuxtIcon from '../components/KunNuxtIcon.vue'

// Inject the Nuxt-flavoured implementations into KunUI's config at the app
// level (server + client). This is the entire bridge that restores the
// original Nuxt DX on top of the Nuxt-decoupled @kun/ui-vue:
//   - linkComponent → NuxtLink  (SSR-aware client-side navigation; KunUI
//     passes the destination as `to` because it's a component, not a tag)
//   - iconComponent → @nuxt/icon (via the KunNuxtIcon wrapper)
//
// `defineNuxtPlugin` / `defineNuxtLink` are Nuxt auto-imports.
export default defineNuxtPlugin((nuxtApp) => {
  const NuxtLink = defineNuxtLink({})

  installKunUIConfig(nuxtApp.vueApp, {
    linkComponent: NuxtLink,
    iconComponent: KunNuxtIcon,
  })
})
