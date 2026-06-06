import type { App, Plugin } from 'vue'
import KunButton from './components/Button.vue'
import KunCard from './components/Card.vue'
import KunIcon from './components/Icon.vue'
import KunRipple from './components/Ripple.vue'

// Components — import individually for tree-shaking, or register them all
// globally with the KunUI plugin (below).
export { KunButton, KunCard, KunIcon, KunRipple }

// Config + composables
export {
  useKunUIConfig,
  provideKunUIConfig,
  installKunUIConfig,
  KUN_UI_DEFAULT_CONFIG,
  type KunUIConfig,
} from './config/useKunUIConfig'
export { useResolvedRounded } from './composables/useResolvedRounded'
export { useRipple, type RippleType } from './composables/useRipple'

// Prop types
export type { KunButtonProps, KunCardProps } from './components/types'

const components = { KunButton, KunCard, KunIcon, KunRipple }

// Vue plugin: `app.use(KunUI)` registers every component globally under its
// `Kun*` name, so templates can use `<KunButton>` without per-file imports
// (parity with the Nuxt-layer auto-import DX, but framework-native).
export const KunUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default KunUI
