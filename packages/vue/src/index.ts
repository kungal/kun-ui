import type { App, Plugin } from 'vue'
import KunButton from './components/Button.vue'
import KunCard from './components/Card.vue'
import KunIcon from './components/Icon.vue'
import KunMessageProvider from './components/MessageProvider.vue'
import KunModal from './components/Modal.vue'
import KunPopover from './components/Popover.vue'
import KunRipple from './components/Ripple.vue'
import KunTab from './components/Tab.vue'
import KunTooltip from './components/Tooltip.vue'

// Components — import individually for tree-shaking, or register them all
// globally with the KunUI plugin (below).
export {
  KunButton,
  KunCard,
  KunIcon,
  KunMessageProvider,
  KunModal,
  KunPopover,
  KunRipple,
  KunTab,
  KunTooltip,
}

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

// Message (toast) system — imperative trigger + read store. Mount
// <KunMessageProvider/> once near your app root.
export {
  useKunMessage,
  useKunMessageState,
  type KunMessageType,
  type KunMessagePosition,
  type KunMessageOptions,
} from './composables/useKunMessage'

// Prop types
export type {
  KunButtonProps,
  KunCardProps,
  KunModalProps,
  KunTabProps,
  KunTabItem,
  KunTabVariant,
  KunTabColor,
  KunTabSize,
  KunTabOrientation,
  KunTooltipProps,
  KunPopoverProps,
  KunPopoverPosition,
} from './components/types'

const components = {
  KunButton,
  KunCard,
  KunIcon,
  KunMessageProvider,
  KunModal,
  KunPopover,
  KunRipple,
  KunTab,
  KunTooltip,
}

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
