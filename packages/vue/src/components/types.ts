import type {
  KunUIVariant,
  KunUIColor,
  KunUISize,
  KunUIRounded,
  KunUser,
} from '@kungal/ui-core'

export interface KunButtonProps {
  variant?: KunUIVariant
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  isIconOnly?: boolean
  icon?: boolean
  iconPosition?: 'left' | 'right'
  className?: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  ariaLabel?: string
}

export interface KunCardProps {
  isHoverable?: boolean
  clickable?: boolean
  href?: string
  isTransparent?: boolean
  bordered?: boolean
  className?: string
  contentClass?: string
  rounded?: KunUIRounded
  color?: KunUIColor | 'background'
  darkBorder?: boolean
}

export interface KunModalProps {
  className?: string
  innerClassName?: string
  isDismissable?: boolean
  isShowCloseButton?: boolean
  withContainer?: boolean
  rounded?: KunUIRounded
  // Accessible name for the dialog (role="dialog" needs a name; the title is in
  // the slot so it can't be auto-derived).
  ariaLabel?: string
}

// ── Tab ────────────────────────────────────────────────────────────────
export type KunTabItem = {
  value: string
  textValue?: string
  icon?: string
  disabled?: boolean
  href?: string
}

//   underlined — bottom 2px sliding indicator (default)
//   solid      — selected tab gets a filled chip
//   bordered   — outer frame + selected tab outline
//   light      — selected tab gets a soft tinted background
//   pills      — each tab is an independent pill, selected fills color
export type KunTabVariant =
  | 'underlined'
  | 'solid'
  | 'bordered'
  | 'light'
  | 'pills'
export type KunTabColor = KunUIColor
export type KunTabSize = 'sm' | 'md' | 'lg'
export type KunTabOrientation = 'horizontal' | 'vertical'

export interface KunTabProps {
  items: KunTabItem[]
  variant?: KunTabVariant
  color?: KunTabColor
  size?: KunTabSize
  orientation?: KunTabOrientation
  fullWidth?: boolean
  disabled?: boolean
  disableAnimation?: boolean
  scrollable?: boolean
  iconSize?: string
  className?: string
  innerClassName?: string
  // ARIA id namespace shared with <KunTabPanel> (so a tab links to its panel via
  // aria-controls/labelledby). Set a distinct `name` per tab group on a page.
  name?: string
}

// ── TabPanel / TabPanels ───────────────────────────────────────────────
export interface KunTabPanelProps {
  // Which tab this panel belongs to (matches a KunTabItem `value`).
  value: string
  // The active tab value. Optional when wrapped in <KunTabPanels> (inherited).
  active?: string
  // eager: SSR all panels, hide inactive (SEO-optimal, default).
  // lazy: render on first activation then keep. unmount: only active in DOM.
  mount?: 'eager' | 'lazy' | 'unmount'
  // Alias for mount="eager" — familiar from Radix/Reka/MUI.
  forceMount?: boolean
  // How inactive eager/lazy panels hide. until-found (default) keeps them
  // findable by in-page search + deep links; display is plain display:none.
  hiddenStrategy?: 'until-found' | 'display'
  name?: string
  className?: string
}

export interface KunTabPanelsProps {
  mount?: 'eager' | 'lazy' | 'unmount'
  hiddenStrategy?: 'until-found' | 'display'
  name?: string
}

// ── Tooltip ────────────────────────────────────────────────────────────
export interface KunTooltipProps {
  text?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delayShow?: number
  delayHide?: number
  hideOnMobile?: boolean
  rounded?: KunUIRounded
}

// ── Popover ────────────────────────────────────────────────────────────
export type KunPopoverPosition =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

export interface KunPopoverProps {
  position?: KunPopoverPosition
  innerClass?: string
  autoPosition?: boolean
  rounded?: KunUIRounded
  // Accessible name for the dialog (role="dialog" needs a name).
  ariaLabel?: string
}

// ── Image ──────────────────────────────────────────────────────────────
export interface KunImageProps {
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
  className?: string
  ariaLabel?: string
  width?: string | number
  height?: string | number
  // Renders a sibling skeleton overlay while loading (Radix-Avatar
  // 3-state machine). Default true; set false for a bare element.
  skeleton?: boolean
  // CSS aspect-ratio on the wrapper, e.g. "16 / 9". When set the image
  // is absolutely positioned and fills the box.
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  // Classes for the inner image (wrapper gets `className`).
  imageClassName?: string
  decoding?: 'sync' | 'async' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
  // ── @nuxt/image optimization props — only applied when an image
  //    component is injected (Nuxt). Ignored by the native <img> default.
  placeholder?:
    | string
    | number
    | boolean
    | [w: number, h: number, q?: number, b?: number]
  format?: string
  quality?: string | number
  preload?: boolean | { fetchPriority: 'auto' | 'high' | 'low' }
  provider?: 'ipx' | 'none' | (string & {})
  densities?: string
  sizes?: string
}

export interface KunImageNativeProps {
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
  ariaLabel?: string
  width?: string | number
  height?: string | number
  className?: string
}

// ── Link ───────────────────────────────────────────────────────────────
export interface KunLinkProps {
  href?: string
  to?: string | Record<string, string>
  color?: KunUIColor
  underline?: 'none' | 'hover' | 'always'
  size?: KunUISize
  className?: string
  rel?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  isShowAnchorIcon?: boolean
}

// ── Divider ────────────────────────────────────────────────────────────
export interface KunDividerProps {
  orientation?: 'horizontal' | 'vertical'
  color?: KunUIColor
  borderStyle?: 'solid' | 'dashed'
  className?: string
  withLabel?: boolean
}

// ── Badge ──────────────────────────────────────────────────────────────
export interface KunBadgeProps {
  variant?: 'dot' | 'count'
  count?: number
  max?: number
  showZero?: boolean
  show?: boolean
  color?: KunUIColor
  size?: 'sm' | 'md' | 'lg'
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

// ── Chip ───────────────────────────────────────────────────────────────
export interface KunChipProps {
  className?: string
  color?: KunUIColor
  size?: KunUISize
  variant?: KunUIVariant
}

// ── Progress ───────────────────────────────────────────────────────────
export interface KunProgressProps {
  value?: number
  max?: number
  variant?: KunUIVariant | 'gradient' | 'circle' | 'striped'
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  showLabel?: boolean
  indeterminate?: boolean
  className?: string
}

// ── Info ───────────────────────────────────────────────────────────────
export interface KunInfoProps {
  title?: string
  description?: string
  className?: string
  color?: KunUIColor
  variant?: KunUIVariant
  icon?: string
  rounded?: KunUIRounded
}

// ── Loading ────────────────────────────────────────────────────────────
export interface KunLoadingProps {
  loading?: boolean
  description?: string
  /** Image shown while loading. Defaults to a bundled mascot (base64 data
   *  URI — no network request, no consumer asset needed). Pass any URL or
   *  data URI to override. */
  src?: string
}

// ── Input ──────────────────────────────────────────────────────────────
export interface KunInputProps {
  label?: string
  type?: string
  color?: KunUIColor
  className?: string
  placeholder?: string
  helperText?: string
  error?: string
  size?: KunUISize
  required?: boolean
  disabled?: boolean
  darkBorder?: boolean
  autofocus?: boolean
  rounded?: KunUIRounded
}

// ── Textarea ───────────────────────────────────────────────────────────
export interface KunTextareaProps {
  placeholder?: string
  label?: string
  name?: string
  hint?: string
  error?: string
  maxHeight?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autofocus?: boolean
  showCharCount?: boolean
  autoGrow?: boolean
  rows?: number
  maxlength?: number
  minlength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  darkBorder?: boolean
  rounded?: KunUIRounded
  size?: KunUISize
}

// ── Switch ─────────────────────────────────────────────────────────────
export interface KunSwitchProps {
  label?: string
  disabled?: boolean
  className?: string
  labelClassName?: string
  size?: KunUISize
}

// ── CheckBox ───────────────────────────────────────────────────────────
export interface KunCheckBoxProps {
  color?: KunUIColor
  type?: 'single' | 'multiple'
  label?: string
  id?: string
  name?: string
  value?: string | number | boolean
  disabled?: boolean
  className?: string
  size?: KunUISize
}

// ── Slider ─────────────────────────────────────────────────────────────
export interface KunSliderProps {
  min?: number
  max?: number
  step?: number
  size?: KunUISize
}

// ── RadioGroup ─────────────────────────────────────────────────────────
export type KunRadioValue = string | number
export type KunRadioVariant = 'classic' | 'card'
export type KunRadioOrientation = 'vertical' | 'horizontal'

export interface KunRadioOption<T extends KunRadioValue = KunRadioValue> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export interface KunRadioGroupProps<T extends KunRadioValue = KunRadioValue> {
  options: readonly KunRadioOption<T>[]
  ariaLabel?: string
  label?: string
  variant?: KunRadioVariant
  orientation?: KunRadioOrientation
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  disabled?: boolean
  error?: string
  className?: string
}

// ── Select ─────────────────────────────────────────────────────────────
export type KunSelectValue = string | number

export interface KunSelectOption<T extends KunSelectValue = KunSelectValue> {
  value: T
  label: string
}

export interface KunSelectProps<T extends KunSelectValue = KunSelectValue> {
  options: readonly KunSelectOption<T>[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  darkBorder?: boolean
  ariaLabel?: string
  className?: string
  rounded?: KunUIRounded
  size?: KunUISize
}

// ── ContextMenu / Dropdown (shared item model) ─────────────────────────
export interface KunContextMenuItem {
  key: string
  label: string
  icon?: string
  color?: KunUIColor
  disabled?: boolean
  // When set, the item renders as a real <a>/link (crawlable) instead of a
  // button — for navigational menus. Omit for action items.
  href?: string
}

// Dropdown reuses the ContextMenu item model verbatim — one source of truth.
export type KunDropdownItem = KunContextMenuItem

export interface KunContextMenuProps {
  visible: boolean
  position?: { x: number; y: number } | null
  items?: KunContextMenuItem[]
  width?: number
  padding?: number
}

// ── Drawer ─────────────────────────────────────────────────────────────
export type KunDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'
export type KunDrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface KunDrawerProps {
  placement?: KunDrawerPlacement
  responsive?: boolean
  size?: KunDrawerSize
  title?: string
  isDismissable?: boolean
  isShowCloseButton?: boolean
  withContainer?: boolean
  rounded?: KunUIRounded
  className?: string
  innerClassName?: string
}

// ── Copy ───────────────────────────────────────────────────────────────
export interface KunCopyProps {
  text: string
  name?: string
  variant?: KunUIVariant
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  className?: string
}

// ── Rating ─────────────────────────────────────────────────────────────
export interface KunRatingProps {
  max?: number
  readonly?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

// ── Null (empty state) ─────────────────────────────────────────────────
export interface KunNullProps {
  description?: string
  /** Show the empty-state image. Default true. */
  isShowSticker?: boolean
  /** The empty-state image. Defaults to a bundled mascot (base64 data URI —
   *  no network/CDN request). Pass any URL or data URI to override. */
  src?: string
}

// ── Brand ──────────────────────────────────────────────────────────────
export interface KunBrandProps {
  name: string
  iconSrc?: string
  iconAlt?: string
  iconClass?: string
  badge?: string
  badgeColor?: KunUIColor
  to?: string
  nameClass?: string
}

// ── ScrollShadow ───────────────────────────────────────────────────────
export interface KunScrollShadowProps {
  axis?: 'horizontal' | 'vertical'
  shadowColor?: string
  shadowSize?: string
  className?: string
  contentClass?: string
}

// ── Pagination ─────────────────────────────────────────────────────────
export interface KunPaginationProps {
  currentPage: number
  totalPage: number
  isLoading?: boolean
  // Map a page number to its URL. When provided, the numbered page controls
  // render real <a href> (crawlable pagination) instead of plain buttons.
  pageHref?: (page: number) => string
}

// ── Lightbox ───────────────────────────────────────────────────────────
export interface KunLightboxImage {
  src: string
  alt?: string
}

export interface KunLightboxProps {
  images: KunLightboxImage[]
  isOpen: boolean
  initialIndex?: number
}

// ── Content / Text ─────────────────────────────────────────────────────
export interface KunContentProps {
  // Rendered with v-html — the caller MUST pass trusted/pre-sanitized HTML
  // (KunUI does not sanitize; see docs/architecture.md).
  content: string
  className?: string
}

export interface KunTextProps {
  content?: string
  className?: string
}

// ── DatePicker ─────────────────────────────────────────────────────────
export type KunDatePickerMode = 'single' | 'range'

export interface KunDatePickerProps {
  modelValue?: string | null | [string | null, string | null]
  mode?: KunDatePickerMode
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  darkBorder?: boolean
  clearable?: boolean
  format?: string
  valueFormat?: string
  minDate?: string | Date
  maxDate?: string | Date
  isDateDisabled?: (date: Date) => boolean
  locale?: string
  weekdays?: string[]
  months?: string[]
  rounded?: KunUIRounded
  size?: KunUISize
}

// ── FileInput ──────────────────────────────────────────────────────────
export interface KunFileInputProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  hint?: string
  error?: string
  disabled?: boolean
  triggerText?: string
  triggerIcon?: string
  triggerVariant?: KunUIVariant
  triggerColor?: KunUIColor
  triggerSize?: KunUISize
  fullWidth?: boolean
  showFileName?: boolean
  className?: string
}

// ── TagInput ───────────────────────────────────────────────────────────
export type KunTagInputVariant = 'bordered' | 'flat'

export type KunTagInputInvalidReason =
  | 'duplicate'
  | 'too-long'
  | 'too-short'
  | 'max-reached'
  | 'custom'

export type KunTagInputValidator = (tag: string, all: string[]) => true | string

export interface KunTagInputProps {
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  maxTags?: number
  maxTagLength?: number
  minTagLength?: number
  allowDuplicates?: boolean
  caseSensitive?: boolean
  trim?: boolean
  transform?: (raw: string) => string
  validate?: KunTagInputValidator
  splitChars?: (string | RegExp)[]
  splitOnPaste?: boolean
  confirmOnBlur?: boolean
  respectComposition?: boolean
  color?: KunUIColor
  size?: KunUISize
  variant?: KunTagInputVariant
  disabled?: boolean
  readonly?: boolean
  showCounter?: boolean
  rounded?: KunUIRounded
  className?: string
}

// ── Upload ─────────────────────────────────────────────────────────────
export interface KunUploadProps {
  size: number
  aspect: number
  initialImage?: string
  hint?: string
  className?: string
  rounded?: KunUIRounded
}

// ── Avatar / Group / User chip ─────────────────────────────────────────
export type KunAvatarSize = KunUISize | 'original' | 'original-sm'

export interface KunAvatarProps {
  // Nullable — upstream user hydration can return a missing brief; Avatar
  // falls back to a deterministic sticker.
  user: KunUser | null | undefined
  size?: KunAvatarSize
  isNavigation?: boolean
  className?: string
  imageClassName?: string
  // Accepted but unused (kept so existing call sites don't TS-error).
  disableFloating?: boolean
  floatingPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export interface KunAvatarGroupProps {
  users: KunUser[]
  ellipsis?: boolean
  visibleCount?: number
  total?: number
}

export interface KunUserChipProps {
  user: KunUser | null | undefined
  size?: KunAvatarSize
  description?: string
  className?: string
  // When true (default) and the user has an id, the whole chip is a real
  // <a>/link to the user's profile (crawlable, name as anchor text).
  isNavigation?: boolean
  disableFloating?: boolean
  floatingPosition?: 'top' | 'bottom' | 'left' | 'right'
}

// ── Header ─────────────────────────────────────────────────────────────
export interface KunHeaderProps {
  name?: string
  description?: string
  scale?: 'h1' | 'h2' | 'h3'
}

// ── Loli ───────────────────────────────────────────────────────────────
export interface KunLoliProps {
  message: string
  duration: number
}
