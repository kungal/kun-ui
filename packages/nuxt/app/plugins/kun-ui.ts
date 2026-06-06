import { installKunUIConfig } from '@kungal/ui-vue'
import KunNuxtIcon from '../components/KunNuxtIcon.vue'

// Inject the Nuxt-flavoured implementations into KunUI's config at the app
// level (server + client). This is the entire bridge that restores the
// original Nuxt DX on top of the Nuxt-decoupled @kungal/ui-vue:
//   - linkComponent → NuxtLink  (SSR-aware client-side navigation; KunUI
//     passes the destination as `to` because it's a component, not a tag)
//   - iconComponent → @nuxt/icon (via the KunNuxtIcon wrapper)
//   - navigate → navigateTo  (imperative router nav for Tab `href`, etc.)
//
// `defineNuxtPlugin` / `defineNuxtLink` / `navigateTo` are Nuxt auto-imports.
export default defineNuxtPlugin((nuxtApp) => {
  const NuxtLink = defineNuxtLink({})

  installKunUIConfig(nuxtApp.vueApp, {
    linkComponent: NuxtLink,
    iconComponent: KunNuxtIcon,
    navigate: (href: string) => navigateTo(href),
  })
})
