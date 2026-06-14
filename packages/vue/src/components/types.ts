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
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
}

export type KunModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface KunModalProps {
  className?: string
  innerClassName?: string
  isDismissable?: boolean
  isShowCloseButton?: boolean
  withContainer?: boolean
  rounded?: KunUIRounded
  // Max width of the panel (full = nearly the whole viewport). Default 'md'.
  size?: KunModalSize
  // inside (default): the panel body scrolls, capped at 90vh.
  // outside: the whole overlay scrolls — for panels taller than the viewport.
  scrollBehavior?: 'inside' | 'outside'
  // Vertical alignment of the panel. Default 'center'.
  placement?: 'center' | 'top'
  // ARIA role of the panel. Use 'alertdialog' for confirm/destructive prompts
  // that need an immediate response. Default 'dialog'.
  role?: 'dialog' | 'alertdialog'
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
  // Horizontal alignment of each tab's content (icon + label) inside its box.
  // Mainly visible on vertical / full-width tabs (where the box is wider than
  // its content). Default 'center'.
  align?: 'start' | 'center' | 'end'
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
  // Render a caret pointing at the trigger.
  showArrow?: boolean
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
  // Render a caret pointing at the trigger.
  showArrow?: boolean
}

// ── Image ──────────────────────────────────────────────────────────────
export interface KunImageProps {
  src: string
  alt?: string
  // Shown if `src` fails to load (broken URL, 404). Resets when `src` changes.
  fallbackSrc?: string
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
  /** @deprecated No-op — a label renders automatically when default-slot content is present. */
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
  // Accessible name (e.g. "5 条未读"). Without an anchor slot the badge renders
  // standalone (inline), not as a corner overlay.
  ariaLabel?: string
}

// ── Chip ───────────────────────────────────────────────────────────────
export interface KunChipProps {
  className?: string
  color?: KunUIColor
  size?: KunUISize
  variant?: KunUIVariant
  // Render a × that emits `close` (removable tag — filters, tag inputs).
  closable?: boolean
  disabled?: boolean
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
  // Accessible name for the progressbar (e.g. "上传进度").
  ariaLabel?: string
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
  // Render a compact spinner icon instead of the full mascot image — for
  // small inline loading states (next to a button, a table cell, etc.).
  spinner?: boolean
  // Spinner size (spinner mode only). Default 'md'.
  size?: KunUISize
}

// ── Input ──────────────────────────────────────────────────────────────
export interface KunInputProps {
  label?: string
  type?: string
  color?: KunUIColor
  className?: string
  placeholder?: string
  /** @deprecated Use `description` (unified across all KunUI form controls). */
  helperText?: string
  // Helper text below the field (hidden when `error` is set). Canonical name.
  description?: string
  error?: string
  // Mark the field invalid (danger ring) without showing an error message.
  isInvalid?: boolean
  // Show an X button to clear the value when non-empty.
  isClearable?: boolean
  // For type="password": render an eye toggle to reveal/hide the value.
  revealPassword?: boolean
  size?: KunUISize
  required?: boolean
  disabled?: boolean
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
  autofocus?: boolean
  rounded?: KunUIRounded
}

// ── Textarea ───────────────────────────────────────────────────────────
export interface KunTextareaProps {
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  placeholder?: string
  label?: string
  name?: string
  /** @deprecated Use `description` (unified across all KunUI form controls). */
  hint?: string
  // Helper text below the field (hidden when `error` is set). Canonical name.
  description?: string
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
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
  rounded?: KunUIRounded
  size?: KunUISize
}

// ── NumberInput ────────────────────────────────────────────────────────
export interface KunNumberInputProps {
  min?: number
  max?: number
  step?: number
  size?: KunUISize
  color?: KunUIColor
  label?: string
  placeholder?: string
  error?: string
  // Helper text below the field (hidden when `error` is set).
  description?: string
  isInvalid?: boolean
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  // Show the −/+ stepper buttons (default true).
  controls?: boolean
  // Round/display to this many decimal places.
  precision?: number
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
  rounded?: KunUIRounded
  // Native form field name (emits a hidden input mirroring the value).
  name?: string
  ariaLabel?: string
}

// ── PinInput (OTP) ─────────────────────────────────────────────────────
export interface KunPinInputProps {
  // Number of cells (code length).
  length?: number
  // numeric → digits only + inputmode numeric; text → any single char.
  type?: 'numeric' | 'text'
  // Render each filled cell as a • (one-time codes / passcodes).
  mask?: boolean
  size?: KunUISize
  color?: KunUIColor
  disabled?: boolean
  // Mark every cell invalid (danger ring).
  isInvalid?: boolean
  // Focus the first cell on mount.
  autofocus?: boolean
  placeholder?: string
  rounded?: KunUIRounded
  // Native form field name (emits a hidden input mirroring the joined value).
  name?: string
  ariaLabel?: string
}

// ── Autocomplete (combobox) ────────────────────────────────────────────
export interface KunAutocompleteOption {
  value: string
  label: string
  disabled?: boolean
}

export interface KunAutocompleteProps {
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  options: readonly KunAutocompleteOption[]
  label?: string
  placeholder?: string
  error?: string
  // Helper text below the field (hidden when `error` is set).
  description?: string
  isInvalid?: boolean
  disabled?: boolean
  size?: KunUISize
  rounded?: KunUIRounded
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
  clearable?: boolean
  // Accept a value the user typed that is not in `options` (free text).
  allowCustomValue?: boolean
  // Skip built-in label filtering — you control `options` from `@search`
  // (remote/async suggestions). Default false (client-side filter).
  manualFilter?: boolean
  noResultText?: string
  name?: string
  ariaLabel?: string
}

// ── Switch ─────────────────────────────────────────────────────────────
export interface KunSwitchProps {
  label?: string
  disabled?: boolean
  className?: string
  labelClassName?: string
  size?: KunUISize
  // Error message (red text below). Takes precedence over description.
  error?: string
  // Helper text below the switch (hidden when `error` is set).
  description?: string
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
  // Tri-state "some but not all" (e.g. a select-all parent). Visual dash that
  // overrides the check; the underlying input stays unchecked until toggled.
  indeterminate?: boolean
  // Error message (red text below + danger box). Takes precedence over description.
  error?: string
  // Helper text below the control (hidden when `error` is set).
  description?: string
  className?: string
  size?: KunUISize
}

// ── Slider ─────────────────────────────────────────────────────────────
export interface KunSliderMark {
  value: number
  label?: string
}

export interface KunSliderProps {
  min?: number
  max?: number
  step?: number
  size?: KunUISize
  color?: KunUIColor
  disabled?: boolean
  // Visible field label (rendered above the track, associates the slider).
  label?: string
  // Accessible name when there is no visible label (role="slider" needs a name).
  ariaLabel?: string
  // Error message (red text below + danger fill). Takes precedence over description.
  error?: string
  // Helper text below the track (hidden when `error` is set).
  description?: string
  // Tick marks under the track. Pass numbers (or {value,label}) within [min,max].
  marks?: (number | KunSliderMark)[]
  // Show a value bubble above the thumb while hovering / dragging / focused.
  showTooltip?: boolean
  // Always render the current value next to the label.
  showValue?: boolean
  // Format the value shown in the tooltip / value readout.
  formatValue?: (value: number) => string
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
  disabled?: boolean
}

export interface KunSelectProps<T extends KunSelectValue = KunSelectValue> {
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  options: readonly KunSelectOption<T>[]
  label?: string
  placeholder?: string
  error?: string
  // Helper text under the field (hidden when `error` is set).
  description?: string
  disabled?: boolean
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
  darkBorder?: boolean
  ariaLabel?: string
  className?: string
  rounded?: KunUIRounded
  size?: KunUISize
  // Multi-select: v-model becomes an array; the trigger shows removable chips
  // and the list stays open while toggling.
  multiple?: boolean
  // Render a filter input at the top of the list (client-side label match).
  searchable?: boolean
  // Show an X to reset the selection (single) — chips already remove per-item.
  clearable?: boolean
  searchPlaceholder?: string
  // Shown when the filter matches nothing.
  noResultText?: string
  // Native form field name — emits hidden input(s) so the value is collected
  // by the surrounding <form> / FormData.
  name?: string
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
  // Label shown briefly after a successful copy. Default '已复制'.
  copiedText?: string
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
  // Accessible name for the scrollable region. Default 'scrollable content'.
  ariaLabel?: string
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
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  modelValue?: string | null | [string | null, string | null]
  mode?: KunDatePickerMode
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  /**
   * @deprecated No-op since 0.18.0. Every neutral border now resolves to the
   * unified `--color-kun-border` token (the `border-kun` utility), which already
   * flips light↔dark — so the old light-translucent / dark-solid split this prop
   * toggled is gone. Safe to remove from call sites.
   */
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
  /** @deprecated Use `description` (unified across all KunUI form controls). */
  hint?: string
  // Helper text below the trigger (hidden when `error` is set). Canonical name.
  description?: string
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
  /** @deprecated Use `description` (unified across all KunUI form controls). */
  helperText?: string
  // Helper text below the field (hidden when `error` is set). Canonical name.
  description?: string
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
  /** @deprecated Use `description` (unified across all KunUI form controls). */
  hint?: string
  // Helper text below the dropzone. Canonical name.
  description?: string
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
  // Grand total for the "+N" overflow chip. Defaults to users.length, so the
  // overflow shows even without passing it explicitly.
  total?: number
  // Accessible name for the group (default derived from the count).
  ariaLabel?: string
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
