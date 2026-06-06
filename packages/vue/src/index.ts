import type { App, Plugin } from 'vue'
import KunAvatar from './components/Avatar.vue'
import KunAvatarGroup from './components/AvatarGroup.vue'
import KunBadge from './components/Badge.vue'
import KunBrand from './components/Brand.vue'
import KunButton from './components/Button.vue'
import KunCard from './components/Card.vue'
import KunCheckBox from './components/CheckBox.vue'
import KunChip from './components/Chip.vue'
import KunContent from './components/Content.vue'
import KunContextMenu from './components/ContextMenu.vue'
import KunDatePicker from './components/DatePicker.vue'
import KunCopy from './components/Copy.vue'
import KunDivider from './components/Divider.vue'
import KunDropdown from './components/Dropdown.vue'
import KunDrawer from './components/Drawer.vue'
import KunFadeCard from './components/FadeCard.vue'
import KunFavicon from './components/Favicon.vue'
import KunFileInput from './components/FileInput.vue'
import KunHeader from './components/Header.vue'
import KunIcon from './components/Icon.vue'
import KunImage from './components/Image.vue'
import KunImageNative from './components/ImageNative.vue'
import KunInfo from './components/Info.vue'
import KunInput from './components/Input.vue'
import KunLightbox from './components/Lightbox.vue'
import KunLightboxGallery from './components/LightboxGallery.vue'
import KunLightboxGalleryItem from './components/LightboxGalleryItem.vue'
import KunLink from './components/Link.vue'
import KunLoading from './components/Loading.vue'
import KunMarkdown from './components/Markdown.vue'
import KunMessageProvider from './components/MessageProvider.vue'
import KunModal from './components/Modal.vue'
import KunNull from './components/Null.vue'
import KunPagination from './components/Pagination.vue'
import KunPopover from './components/Popover.vue'
import KunProgress from './components/Progress.vue'
import KunRadioGroup from './components/RadioGroup.vue'
import KunRating from './components/Rating.vue'
import KunSelect from './components/Select.vue'
import KunRipple from './components/Ripple.vue'
import KunScrollShadow from './components/ScrollShadow.vue'
import KunSlider from './components/Slider.vue'
import KunSwitch from './components/Switch.vue'
import KunTab from './components/Tab.vue'
import KunTagInput from './components/TagInput.vue'
import KunText from './components/Text.vue'
import KunTextarea from './components/Textarea.vue'
import KunTooltip from './components/Tooltip.vue'
import KunUpload from './components/Upload.vue'
import KunUserChip from './components/UserChip.vue'

// Components — import individually for tree-shaking, or register them all
// globally with the KunUI plugin (below).
export {
  KunAvatar,
  KunAvatarGroup,
  KunBadge,
  KunBrand,
  KunButton,
  KunCard,
  KunCheckBox,
  KunChip,
  KunContent,
  KunContextMenu,
  KunCopy,
  KunDatePicker,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunFadeCard,
  KunFavicon,
  KunFileInput,
  KunHeader,
  KunIcon,
  KunImage,
  KunImageNative,
  KunInfo,
  KunInput,
  KunLightbox,
  KunLightboxGallery,
  KunLightboxGalleryItem,
  KunLink,
  KunLoading,
  KunMarkdown,
  KunMessageProvider,
  KunModal,
  KunNull,
  KunPagination,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRating,
  KunRipple,
  KunScrollShadow,
  KunSelect,
  KunSlider,
  KunSwitch,
  KunTab,
  KunTagInput,
  KunText,
  KunTextarea,
  KunTooltip,
  KunUpload,
  KunUserChip,
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
export { useKunCopy } from './composables/useKunCopy'
export { useSpoilerContent } from './composables/useSpoilerContent'
export { useContentLightbox } from './composables/useContentLightbox'
export {
  useFilePicker,
  type KunFilePickerOptions,
  type KunFilePickerReturn,
} from './composables/useFilePicker'
export { checkImageValid, resizeImage } from './utils/handleFileChange'
// Re-export framework-agnostic helpers consumers commonly reach for.
export { getRandomSticker, decodeIfEncoded } from '@kungal/core'

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
  KunCopyProps,
  KunRatingProps,
  KunNullProps,
  KunBrandProps,
  KunScrollShadowProps,
  KunPaginationProps,
  KunLightboxImage,
  KunLightboxProps,
  KunContentProps,
  KunTextProps,
  KunDatePickerProps,
  KunDatePickerMode,
  KunFileInputProps,
  KunTagInputProps,
  KunTagInputVariant,
  KunTagInputInvalidReason,
  KunTagInputValidator,
  KunUploadProps,
  KunAvatarProps,
  KunAvatarSize,
  KunAvatarGroupProps,
  KunUserChipProps,
  KunHeaderProps,
} from './components/types'

// User data model (lives in @kungal/core; re-exported here for convenience).
export type { KunUser } from '@kungal/core'

const components = {
  KunAvatar,
  KunAvatarGroup,
  KunBadge,
  KunBrand,
  KunButton,
  KunCard,
  KunCheckBox,
  KunChip,
  KunContent,
  KunContextMenu,
  KunCopy,
  KunDatePicker,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunFadeCard,
  KunFavicon,
  KunFileInput,
  KunHeader,
  KunIcon,
  KunImage,
  KunImageNative,
  KunInfo,
  KunInput,
  KunLightbox,
  KunLightboxGallery,
  KunLightboxGalleryItem,
  KunLink,
  KunLoading,
  KunMarkdown,
  KunMessageProvider,
  KunModal,
  KunNull,
  KunPagination,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRating,
  KunRipple,
  KunScrollShadow,
  KunSelect,
  KunSlider,
  KunSwitch,
  KunTab,
  KunTagInput,
  KunText,
  KunTextarea,
  KunTooltip,
  KunUpload,
  KunUserChip,
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
