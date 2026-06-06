import type { App, Plugin } from 'vue'
import KunBadge from './components/Badge.vue'
import KunButton from './components/Button.vue'
import KunCard from './components/Card.vue'
import KunCheckBox from './components/CheckBox.vue'
import KunChip from './components/Chip.vue'
import KunContextMenu from './components/ContextMenu.vue'
import KunDivider from './components/Divider.vue'
import KunDropdown from './components/Dropdown.vue'
import KunDrawer from './components/Drawer.vue'
import KunIcon from './components/Icon.vue'
import KunImage from './components/Image.vue'
import KunImageNative from './components/ImageNative.vue'
import KunInfo from './components/Info.vue'
import KunInput from './components/Input.vue'
import KunLink from './components/Link.vue'
import KunLoading from './components/Loading.vue'
import KunMessageProvider from './components/MessageProvider.vue'
import KunModal from './components/Modal.vue'
import KunPopover from './components/Popover.vue'
import KunProgress from './components/Progress.vue'
import KunRadioGroup from './components/RadioGroup.vue'
import KunSelect from './components/Select.vue'
import KunRipple from './components/Ripple.vue'
import KunSlider from './components/Slider.vue'
import KunSwitch from './components/Switch.vue'
import KunTab from './components/Tab.vue'
import KunTextarea from './components/Textarea.vue'
import KunTooltip from './components/Tooltip.vue'

// Components — import individually for tree-shaking, or register them all
// globally with the KunUI plugin (below).
export {
  KunBadge,
  KunButton,
  KunCard,
  KunCheckBox,
  KunChip,
  KunContextMenu,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunIcon,
  KunImage,
  KunImageNative,
  KunInfo,
  KunInput,
  KunLink,
  KunLoading,
  KunMessageProvider,
  KunModal,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRipple,
  KunSelect,
  KunSlider,
  KunSwitch,
  KunTab,
  KunTextarea,
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
export { useKunUniqueId } from './composables/useKunUniqueId'

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
  KunImageProps,
  KunImageNativeProps,
  KunLinkProps,
  KunDividerProps,
  KunBadgeProps,
  KunChipProps,
  KunProgressProps,
  KunInfoProps,
  KunLoadingProps,
  KunInputProps,
  KunTextareaProps,
  KunSwitchProps,
  KunCheckBoxProps,
  KunSliderProps,
  KunRadioGroupProps,
  KunRadioOption,
  KunRadioValue,
  KunRadioVariant,
  KunRadioOrientation,
  KunSelectProps,
  KunSelectOption,
  KunSelectValue,
  KunContextMenuItem,
  KunContextMenuProps,
  KunDropdownItem,
  KunDrawerProps,
  KunDrawerPlacement,
  KunDrawerSize,
} from './components/types'

const components = {
  KunBadge,
  KunButton,
  KunCard,
  KunCheckBox,
  KunChip,
  KunContextMenu,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunIcon,
  KunImage,
  KunImageNative,
  KunInfo,
  KunInput,
  KunLink,
  KunLoading,
  KunMessageProvider,
  KunModal,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRipple,
  KunSelect,
  KunSlider,
  KunSwitch,
  KunTab,
  KunTextarea,
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
