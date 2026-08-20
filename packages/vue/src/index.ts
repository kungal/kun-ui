import type { App, Plugin, Component } from 'vue'
import { KUN_COMPONENT_NAMES, type KunComponentName } from './componentNames'
import KunAccordion from './components/Accordion.vue'
import KunAccordionItem from './components/AccordionItem.vue'
import KunAlertProvider from './components/AlertProvider.vue'
import KunAutocomplete from './components/Autocomplete.vue'
import KunAvatar from './components/Avatar.vue'
import KunAvatarGroup from './components/AvatarGroup.vue'
import KunBadge from './components/Badge.vue'
import KunBrand from './components/Brand.vue'
import KunButton from './components/Button.vue'
import KunButtonGroup from './components/ButtonGroup.vue'
import KunCard from './components/Card.vue'
import KunCarousel from './components/Carousel.vue'
import KunCarouselItem from './components/CarouselItem.vue'
import KunCheckBox from './components/CheckBox.vue'
import KunCheckBoxGroup from './components/CheckBoxGroup.vue'
import KunChip from './components/Chip.vue'
import KunCommandPalette from './components/CommandPalette.vue'
import KunContent from './components/Content.vue'
import KunContextMenu from './components/ContextMenu.vue'
import KunDatePicker from './components/DatePicker.vue'
import KunCopy from './components/Copy.vue'
import KunDivider from './components/Divider.vue'
import KunDropdown from './components/Dropdown.vue'
import KunDrawer from './components/Drawer.vue'
import KunFadeCard from './components/FadeCard.vue'
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
import KunLoli from './components/Loli.vue'
import KunLoliProvider from './components/LoliProvider.vue'
import KunLoading from './components/Loading.vue'
import KunMarkdown from './components/Markdown.vue'
import KunMessageProvider from './components/MessageProvider.vue'
import KunModal from './components/Modal.vue'
import KunNull from './components/Null.vue'
import KunNumberInput from './components/NumberInput.vue'
import KunPagination from './components/Pagination.vue'
import KunPinInput from './components/PinInput.vue'
import KunPopover from './components/Popover.vue'
import KunProgress from './components/Progress.vue'
import KunRadioGroup from './components/RadioGroup.vue'
import KunRating from './components/Rating.vue'
import KunReaction from './components/Reaction.vue'
import KunSelect from './components/Select.vue'
import KunShatter from './components/Shatter.vue'
import KunRipple from './components/Ripple.vue'
import KunScrollShadow from './components/ScrollShadow.vue'
import KunSkeleton from './components/Skeleton.vue'
import KunSlider from './components/Slider.vue'
import KunSteps from './components/Steps.vue'
import KunSwitch from './components/Switch.vue'
import KunTab from './components/Tab.vue'
import KunTabPanel from './components/TabPanel.vue'
import KunTabPanels from './components/TabPanels.vue'
import KunTagInput from './components/TagInput.vue'
import KunText from './components/Text.vue'
import KunTextarea from './components/Textarea.vue'
import KunTimeline from './components/Timeline.vue'
import KunTimelineItem from './components/TimelineItem.vue'
import KunTooltip from './components/Tooltip.vue'
import KunUpload from './components/Upload.vue'
import KunUserChip from './components/UserChip.vue'

// Components — import individually for tree-shaking, or register them all
// globally with the KunUI plugin (below).
export {
  KunAccordion,
  KunAccordionItem,
  KunAlertProvider,
  KunAutocomplete,
  KunAvatar,
  KunAvatarGroup,
  KunBadge,
  KunBrand,
  KunButton,
  KunButtonGroup,
  KunCard,
  KunCarousel,
  KunCarouselItem,
  KunCheckBox,
  KunCheckBoxGroup,
  KunChip,
  KunCommandPalette,
  KunContent,
  KunContextMenu,
  KunCopy,
  KunDatePicker,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunFadeCard,
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
  KunLoli,
  KunLoliProvider,
  KunMarkdown,
  KunMessageProvider,
  KunModal,
  KunNull,
  KunNumberInput,
  KunPagination,
  KunPinInput,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRating,
  KunReaction,
  KunRipple,
  KunScrollShadow,
  KunSelect,
  KunShatter,
  KunSkeleton,
  KunSlider,
  KunSteps,
  KunSwitch,
  KunTab,
  KunTabPanel,
  KunTabPanels,
  KunTagInput,
  KunText,
  KunTextarea,
  KunTimeline,
  KunTimelineItem,
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
export {
  useKunPointerMenu,
  type KunPointerMenuOptions,
} from './composables/useKunPointerMenu'
export { useKunCopy } from './composables/useKunCopy'
export { useSpoilerContent } from './composables/useSpoilerContent'
export { useContentLightbox } from './composables/useContentLightbox'
export { useContentBlurUp } from './composables/useContentBlurUp'
// Refcounted body scroll-lock shared across overlays (Modal/Drawer/Lightbox
// use it internally); exported so apps can lock the body for their own overlays.
export { useBodyScrollLock } from './composables/useBodyScrollLock'
// Shared z-index allocator so the most-recently-opened overlay always stacks on
// top (Modal/Drawer use it); exported so apps can stack their own overlays on
// the same z-kun-modal layer.
export { useKunOverlayZIndex } from './composables/useKunOverlayZIndex'
// Answers platform close requests — Android's back button/gesture — so an
// overlay closes instead of the page navigating away (Modal/Drawer use it);
// exported so apps can give their own overlays the same behaviour.
export { useKunCloseRequest } from './composables/useKunCloseRequest'
// Shared floating-ui setup (offset/flip/shift + transform-origin + optional
// arrow) used by every KunUI overlay; exported so apps can build their own.
export {
  useKunFloating,
  type UseKunFloatingOptions,
} from './composables/useKunFloating'
// Marks the page background `inert` while a modal overlay is open (refcounted).
export { useKunBackgroundInert } from './composables/useKunBackgroundInert'
export {
  useFilePicker,
  type KunFilePickerOptions,
  type KunFilePickerReturn,
} from './composables/useFilePicker'
export { checkImageValid, resizeImage } from './utils/handleFileChange'
export { getRandomLoli, type KunLoliAsset } from './utils/loliAssets'

// Alert (confirm dialog) + Loli mascot — imperative triggers + read stores.
// Mount <KunAlertProvider/> and <KunLoliProvider/> once near your app root.
export {
  useKunAlert,
  useKunAlertState,
  type KunAlertOptions,
  type KunAlertType,
} from './composables/useKunAlert'
export { useKunLoliInfo, useKunLoliState } from './composables/useKunLoliInfo'
// Re-export framework-agnostic helpers consumers commonly reach for.
export { getRandomSticker, decodeIfEncoded } from '@kungal/ui-core'

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
  KunButtonGroupProps,
  KunButtonGroupOrientation,
  KunCardProps,
  KunCommandItem,
  KunCommandGroup,
  KunCommandPaletteProps,
  KunModalProps,
  KunModalSize,
  KunModalPlacement,
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
  KunNumberInputProps,
  KunPinInputProps,
  KunAutocompleteProps,
  KunAutocompleteOption,
  KunTextareaProps,
  KunSwitchProps,
  KunCheckBoxProps,
  KunCheckBoxGroupProps,
  KunCheckBoxGroupOption,
  KunCheckBoxGroupValue,
  KunCheckBoxGroupVariant,
  KunCheckBoxGroupOrientation,
  KunCheckBoxGroupInvalidReason,
  KunSliderProps,
  KunSliderMark,
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
  KunReactionProps,
  KunShatterProps,
  KunShatterOrigin,
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
  KunLoliProps,
} from './components/types'

// User data model (lives in @kungal/ui-core; re-exported here for convenience).
export type { KunUser } from '@kungal/ui-core'

// Typed as `Record<KunComponentName, …>` so this registry stays EXACTLY in sync
// with the single source (componentNames.ts): a missing or extra entry is a
// vue-tsc error, not a silent runtime "Failed to resolve component" downstream.
const components: Record<KunComponentName, Component> = {
  KunAccordion,
  KunAccordionItem,
  KunAlertProvider,
  KunAutocomplete,
  KunAvatar,
  KunAvatarGroup,
  KunBadge,
  KunBrand,
  KunButton,
  KunButtonGroup,
  KunCard,
  KunCarousel,
  KunCarouselItem,
  KunCheckBox,
  KunCheckBoxGroup,
  KunChip,
  KunCommandPalette,
  KunContent,
  KunContextMenu,
  KunCopy,
  KunDatePicker,
  KunDivider,
  KunDrawer,
  KunDropdown,
  KunFadeCard,
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
  KunLoli,
  KunLoliProvider,
  KunMarkdown,
  KunMessageProvider,
  KunModal,
  KunNull,
  KunNumberInput,
  KunPagination,
  KunPinInput,
  KunPopover,
  KunProgress,
  KunRadioGroup,
  KunRating,
  KunReaction,
  KunRipple,
  KunScrollShadow,
  KunSelect,
  KunShatter,
  KunSkeleton,
  KunSlider,
  KunSteps,
  KunSwitch,
  KunTab,
  KunTabPanel,
  KunTabPanels,
  KunTagInput,
  KunText,
  KunTextarea,
  KunTimeline,
  KunTimelineItem,
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

// The component-name single source (consumed by the Nuxt layer + docs meta), and
// the `unplugin-vue-components` resolver for on-demand auto-import in Vite apps.
export { KUN_COMPONENT_NAMES, type KunComponentName } from './componentNames'
export { KunUIResolver, type KunUIResolverOptions } from './resolver'

export default KunUI
