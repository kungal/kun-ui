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

// ── ButtonGroup ────────────────────────────────────────────────────────
// Joins a row/column of KunButtons into one attached unit (segmented actions,
// split buttons). It collapses the touching inner corners and overlaps the 1px
// borders into a single seam — the building block for a GitHub-style split
// button (primary KunButton + a chevron KunButton that triggers a KunPopover).
export type KunButtonGroupOrientation = 'horizontal' | 'vertical'

export interface KunButtonGroupProps {
  orientation?: KunButtonGroupOrientation
  // Accessible name for the group (role="group").
  ariaLabel?: string
  className?: string
}

/** Inner padding of a KunCard. `lg` (24px) is the comfortable default (matches
 *  shadcn / Ant / KunModal); drop to `sm`/`md` for denser cards, `none` for a
 *  full-bleed surface (e.g. a card that's just a cover image). */
export type KunCardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface KunCardProps {
  isHoverable?: boolean
  clickable?: boolean
  href?: string
  isTransparent?: boolean
  bordered?: boolean
  /** Inner padding. Default `lg` (24px). */
  padding?: KunCardPadding
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

//   auto   — bottom sheet below `md`, centred dialog at `md` and up (default)
//   center — centred at every width
//   top    — near the top edge at every width
export type KunModalPlacement = 'auto' | 'center' | 'top'

export interface KunModalProps {
  className?: string
  innerClassName?: string
  isDismissable?: boolean
  isShowCloseButton?: boolean
  withContainer?: boolean
  rounded?: KunUIRounded
  // Max width of the panel (full = nearly the whole viewport). Default 'md'.
  size?: KunModalSize
  // inside (default): the panel body scrolls, capped at 90dvh (and never taller
  // than the visible viewport, so the on-screen keyboard can't bury it).
  // outside: the whole overlay scrolls — for panels taller than the viewport.
  scrollBehavior?: 'inside' | 'outside'
  // Vertical alignment of the panel. Default 'auto' — a bottom sheet on phones,
  // a centred dialog from `md` up. Pass 'center' for the pre-2.19 behaviour of
  // centring at every width.
  placement?: KunModalPlacement
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

// Generic over the item shape so callers can attach extra fields (a `dirty`
// flag, an unread count, …) and read them back — typed — in the `#tab` slot.
export interface KunTabProps<T extends KunTabItem = KunTabItem> {
  items: T[]
  variant?: KunTabVariant
  color?: KunTabColor
  size?: KunTabSize
  orientation?: KunTabOrientation
  fullWidth?: boolean
  // JSDoc, not `//`: the default is orientation-aware (see `resolvedAlign`), so
  // it can't be a literal in `withDefaults` — which is the only place the docs
  // generator looks. The `@default` tag below is how it learns the real answer.
  /**
   * Horizontal alignment of each tab's content (icon + label) inside its box.
   * Mainly visible on vertical / full-width tabs, where the box is wider than
   * its content.
   *
   * @default "center" (horizontal) / "start" (vertical)
   */
  align?: 'start' | 'center' | 'end'
  disabled?: boolean
  disableAnimation?: boolean
  // Horizontal tabs ALWAYS contain their overflow (they scroll inside the
  // container instead of widening the page) — no flag needed. This opts a
  // *vertical* tab column into scrolling when it outgrows a bounded height.
  scrollable?: boolean
  // When a horizontal tab strip overflows, float a chevron button on each
  // scrollable edge (in addition to the always-on edge fade). Set false to keep
  // just the fade — the strip still scrolls via swipe / wheel / keyboard.
  // Default true.
  scrollButtons?: boolean
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
  // Mark this panel as loading (async / lazy data still resolving). Dims the
  // panel to 0.5 opacity, makes it inert (no pointer/keyboard interaction) and
  // sets aria-busy for screen readers. The dim uses a *delayed* fade (the React
  // useDeferredValue trick) so a fast load finishes before it becomes visible —
  // no flicker; only a genuinely slow load dims. This is the "stale-while-
  // revalidate" mechanism only: the library dims what's there, YOU decide when
  // `loading` is true and render the skeleton (e.g. via <KunSkeleton>) for a
  // first load where there is no prior content to dim.
  loading?: boolean
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
// Placement is passed straight to floating-ui, so every side aligns and (with
// `autoPosition`, the default) flips + shifts to stay on-screen while `size()`
// caps its height to the room available. The `right-*` / `left-*` sides make a
// side-anchored flyout (e.g. a navigation rail's hover menu) a first-class use
// of KunPopover instead of hand-rolled `absolute left-full` positioning.
export type KunPopoverPosition =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export interface KunPopoverProps {
  position?: KunPopoverPosition
  innerClass?: string
  /**
   * Make the trigger anchor span its container instead of shrinking to its
   * content. Both wrapper divs switch from `inline-block` to `block w-full`, so a
   * full-width trigger (e.g. a `fullWidth` KunButton or a split button) can
   * actually fill the width. Default `false` (inline, content-width).
   */
  fullWidth?: boolean
  /**
   * Avoid viewport collisions: flip to the opposite side, shift along the edge,
   * and cap height/width to the available space so tall content scrolls instead
   * of overflowing. Default `true`. Set `false` to honour `position` verbatim.
   */
  autoPosition?: boolean
  rounded?: KunUIRounded
  // Accessible name for the dialog (role="dialog" needs a name).
  ariaLabel?: string
  // Render a caret pointing at the trigger.
  showArrow?: boolean
  /**
   * Force a fully OPAQUE panel, ignoring a globally-lowered `--kun-surface-opacity`
   * (which sites with a background image use to frost surfaces). Menus/popovers over
   * a busy background usually want this for legibility. Default `false` (follows the
   * global surface opacity). Note: setting `--kun-surface-opacity:1` on the panel
   * yourself does NOT work — Tailwind resolves the themed colour at `:root`.
   */
  opaque?: boolean
  /**
   * How the popover opens. `'click'` (default) toggles + moves focus into the
   * panel. `'hover'` opens on mouse hover with a coordinate safe-triangle so you
   * can reach the panel without it closing — for navigation menus. Hover never
   * steals focus; click/keyboard/Esc still work, and touch falls back to click.
   */
  trigger?: 'click' | 'hover'
  /** `trigger="hover"`: ms before a hover opens. Default 100. */
  openDelay?: number
  /** `trigger="hover"`: ms grace after leaving (crosses the gap). Default 120. */
  closeDelay?: number
  /** `trigger="hover"`: shared id so a row of menus switches instantly between
   *  siblings and only one is open at a time (menu-bar behaviour). */
  group?: string
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
  /** A ThumbHash (base64) → a blurred "blur-up" placeholder shown until the image
   *  loads, then cross-faded out. Decoded to a tiny image on the client; falls back
   *  to the pulse skeleton until decoded (or if the hash is invalid). Implies the
   *  wrapper even with `skeleton: false`. */
  thumbhash?: string
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

// Generic over the option shape so callers can attach extra fields (avatar,
// description, …) and read them back — typed — in the `#option` scoped slot.
export interface KunAutocompleteProps<
  T extends KunAutocompleteOption = KunAutocompleteOption,
> {
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  options: readonly T[]
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
  // Async data source: show a loading spinner in the dropdown (instead of
  // `noResultText`) while a remote `@search` request is in flight. Drive it from
  // your fetch — set true when the request starts, false when the results land.
  loading?: boolean
  // Text under the loading spinner. Default '加载中…'.
  loadingText?: string
  // Debounce the `@search` emit by N ms; the input text still updates instantly
  // (a responsive field). 0 (default) emits on every keystroke — set e.g. 300
  // for remote sources so you fetch once the user pauses, not per keypress.
  debounce?: number
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
// classic = dot + label list · pill = choice chips (Material "choice chips",
// single-select) · card = bordered/tinted card (with optional icon).
export type KunRadioVariant = 'classic' | 'pill' | 'card'
export type KunRadioOrientation = 'vertical' | 'horizontal'

export interface KunRadioOption<T extends KunRadioValue = KunRadioValue> {
  value: T
  label: string
  description?: string
  // Icon name (e.g. `lucide:layout-grid`) rendered by `card` / `pill` variants.
  icon?: string
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
  // `card` variant only: drop the radio-dot indicator and signal selection with
  // the tinted border/fill alone (the icon-card look). No effect on classic/pill.
  hideIndicator?: boolean
  disabled?: boolean
  error?: string
  className?: string
}

// ── CheckBoxGroup ──────────────────────────────────────────────────────
// Multi-select sibling of RadioGroup (WAI-ARIA checkbox-group semantics):
// use this — NOT a ToggleGroup — for a multi-select FORM field, so the value
// is a real array the form submits. Same three variants as RadioGroup.
export type KunCheckBoxGroupValue = string | number
export type KunCheckBoxGroupVariant = 'classic' | 'pill' | 'card'
export type KunCheckBoxGroupOrientation = 'vertical' | 'horizontal'
export type KunCheckBoxGroupInvalidReason = 'max-reached'

export interface KunCheckBoxGroupOption<
  T extends KunCheckBoxGroupValue = KunCheckBoxGroupValue,
> {
  value: T
  label: string
  description?: string
  icon?: string
  disabled?: boolean
}

export interface KunCheckBoxGroupProps<
  T extends KunCheckBoxGroupValue = KunCheckBoxGroupValue,
> {
  options: readonly KunCheckBoxGroupOption<T>[]
  ariaLabel?: string
  label?: string
  variant?: KunCheckBoxGroupVariant
  orientation?: KunCheckBoxGroupOrientation
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  // Cap on how many options can be selected at once. A click that would exceed
  // it is blocked and emits `invalid` with `'max-reached'` (already-selected
  // options can still be toggled off).
  max?: number
  // `card` variant only: drop the checkbox-box indicator, signal selection with
  // the tinted border/fill alone (the icon-card look).
  hideIndicator?: boolean
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

// `T` is the value type; `O` is the option shape. `O` defaults to the plain
// option, but callers can pass a richer object (avatar, description, …) and read
// it back — typed — in the `#option` scoped slot.
export interface KunSelectProps<
  T extends KunSelectValue = KunSelectValue,
  O extends KunSelectOption<T> = KunSelectOption<T>,
> {
  // Focus-ring accent (the resting border/text stay neutral). Default 'default'.
  color?: KunUIColor
  options: readonly O[]
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

// ── Reaction (like + count) ────────────────────────────────────────────
export interface KunReactionProps {
  /** Icon name (default a heart); filled + coloured when active. Override the
   *  whole glyph (emoji / image / per-state) with the `#icon` slot instead. */
  icon?: string
  /** Active (liked) colour — a palette key OR any CSS colour string (e.g. a
   *  brand `#ff6a00`). The icon fill, pop and burst all follow it. Default `danger`. */
  color?: KunUIColor | (string & {})
  /**
   * `true` (default) = a like/press TOGGLE: pressed state (`aria-pressed`), icon
   * fill + colour, and a celebratory burst. `false` = a one-shot ACTION (share /
   * more …) in the same compact skin — no self-toggle, no burst, just a tactile
   * pop; handle the click with a native `@click`. Lets a whole reactions row use
   * one component instead of mixing in a heavier icon button.
   *
   * In BOTH modes the filled/coloured skin follows the `active` model. So an
   * action-mode reaction can be a controlled "menu button": wrap it as a
   * `KunPopover` trigger, bind `:model-value` to your own state (e.g. 收藏 =
   * "in ≥1 list"), and the click opens the picker instead of self-toggling.
   */
  toggle?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  /** Disable the pop / burst / count-roll animations (also off under reduced-motion). */
  disableAnimation?: boolean
  /** Accessible label base; the count is appended for the full name. Default `点赞`. */
  label?: string
}

// ── Shatter (break-apart animation) ────────────────────────────────────
/** Impact point the shards fly away from. A keyword, or explicit element-local
 *  pixel coordinates `{ x, y }`. */
export type KunShatterOrigin = 'center' | 'top' | 'pointer' | { x: number; y: number }

export interface KunShatterProps {
  /** How the break is triggered. `manual` (default) = drive it via
   *  `v-model:shattered` or the exposed `shatter()` method; `click` = clicking
   *  the content shatters it, and the click point becomes the impact origin. */
  trigger?: 'manual' | 'click'
  /** Target number of glass shards (Voronoi cells); clamped to 2–160. Default 24.
   *  Fewer is cheaper to build, but the fly-apart stays compositor-only regardless. */
  pieces?: number
  /** Fly-apart duration in ms. Default 1100. */
  duration?: number
  /** Where the break originates — shards fly outward from here. `center` (default),
   *  `top`, `pointer` (last pointer position over the content), or `{ x, y }` px. */
  origin?: KunShatterOrigin
  /** How far the shards travel, as a multiplier. Default 1. */
  spread?: number
  /** Downward gravity pull on the shards (0 = a pure radial burst). Default 1. */
  gravity?: number
  /** Maximum random spin per shard, in degrees. Default 140. */
  rotation?: number
  /** Fade shards out as they fly (false = keep full opacity, e.g. flying off-screen).
   *  Default true. */
  fade?: boolean
  /** Animation-level CSS easing. Default `linear` — the natural ballistic motion is
   *  baked into each shard's sampled keyframes, so override this only to time-warp
   *  the whole flight. */
  easing?: string
  /** Deterministic shard pattern: the same seed reproduces the same break (handy
   *  for visual tests). Omit for a fresh random shatter each time. */
  seed?: number
  /** Animate the re-form when restoring — a reverse "reassemble" where the same
   *  shards fly back in from where they scattered and settle into place. `false`
   *  snaps the content back instantly. Default true. */
  reassemble?: boolean
  /** Auto re-form this many ms after the break completes (0 = stay shattered).
   *  Default 0. */
  autoRestore?: number
  /** Keep the original's layout space after it shatters (`visibility:hidden`)
   *  instead of collapsing it (`display:none`). Default false. */
  keepSpace?: boolean
  /** Disable shattering entirely — the content stays put. Default false. */
  disabled?: boolean
  /** Skip the shard animation and hide instantly. Also forced under
   *  `prefers-reduced-motion`. Default false. */
  disableAnimation?: boolean
  /** z-index of the body-level shard overlay. Default 9999. */
  zIndex?: number
  /** Extra classes for the wrapper. */
  className?: string
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
  /** When `axis='horizontal'`, let a vertical mouse wheel scroll the content
   *  sideways (mouse users otherwise can't reach off-screen content; trackpads and
   *  touch already can). `true` releases at either edge so the page scrolls on past
   *  (no scroll-trap); `'contain'` keeps the wheel on the strip at the edges so the
   *  page doesn't move — but only while the strip is actually scrollable, so it can
   *  never freeze the page. Default false. */
  wheel?: boolean | 'contain'
  /** Click-and-drag with a mouse/pen to scroll the area, like grabbing a strip.
   *  A drag past a small threshold suppresses the click so cards inside still work
   *  on a normal click; touch is left to native scrolling. Default false. */
  draggable?: boolean
  /** Scrollbar style. `hide` (default) hides it — the edge shadows are the
   *  affordance; `thin` shows a slim, theme-coloured scrollbar (a dependency-free
   *  alternative to an overlay-scrollbar library); `auto` shows the platform
   *  default. */
  scrollbar?: 'hide' | 'thin' | 'auto'
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
  // Tighter density for comment / reply streams (adds `.kun-prose-compact`).
  // Visual effect requires importing `@kungal/ui-vue/prose.css`.
  compact?: boolean
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

// ── Skeleton ───────────────────────────────────────────────────────────
export interface KunSkeletonProps {
  /** Shape preset: `rect` block, `text` line, or `circle` (avatar). */
  variant?: 'rect' | 'text' | 'circle'
  /** CSS width. Defaults: rect/text 100%, circle = height. */
  width?: string
  /** CSS height. Defaults: text 1em, rect 1.25rem, circle 2.5rem. */
  height?: string
  rounded?: KunUIRounded
  /** When true, render the default slot (real content) instead of the placeholder. */
  loaded?: boolean
  /** Pulse animation (auto-disabled under prefers-reduced-motion); `none` to turn off. */
  animation?: 'pulse' | 'none'
  className?: string
}

// ── Steps ──────────────────────────────────────────────────────────────
export type KunStepsSize = 'sm' | 'md' | 'lg'
export interface KunStepItem {
  title: string
  description?: string
  /** Registered icon name; defaults to the step number (done shows a check). */
  icon?: string
}
export interface KunStepsProps {
  items: KunStepItem[]
  /** 0-based index of the current step; earlier steps render as done. */
  current?: number
  color?: KunUIColor
  size?: KunStepsSize
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

// ── Timeline ───────────────────────────────────────────────────────────
export interface KunTimelineProps {
  className?: string
}
export interface KunTimelineItemProps {
  /** Dot / medallion colour. */
  color?: KunUIColor
  /** Registered icon name → renders a medallion instead of a plain dot. */
  icon?: string
  title?: string
  time?: string
  className?: string
}

// ── Accordion ──────────────────────────────────────────────────────────
export interface KunAccordionProps {
  /** Allow multiple sections open at once (default single-open). */
  multiple?: boolean
  variant?: 'light' | 'bordered' | 'splitted'
  /** Initially-open value(s) when uncontrolled (no v-model). */
  defaultValue?: string | string[]
  className?: string
}
export interface KunAccordionItemProps {
  /** Unique key for this section (used by v-model). */
  value: string
  title?: string
  /** Optional leading icon (registered name). */
  icon?: string
  disabled?: boolean
  /** Optional readable prefix for the auto-generated (already unique) ARIA ids. */
  name?: string
  className?: string
}

// ── Carousel ───────────────────────────────────────────────────────────
export interface KunCarouselProps {
  /** Slides visible at once (>1 for thumbnail strips). */
  slidesPerView?: number
  /** Gap between slides (any CSS length). */
  gap?: string
  showArrows?: boolean
  showIndicators?: boolean
  /** Autoplay interval in ms (0 = off). Pauses on hover/focus, off under reduced-motion. */
  autoplay?: number
  /**
   * Seamless infinite loop via slide repositioning (CSS `order`), no cloned DOM.
   * Autoplay glides past the last slide into the first instead of snapping back.
   * Default `true`; auto-disabled when there are too few slides to loop cleanly.
   */
  loop?: boolean
  ariaLabel?: string
  className?: string
}
export interface KunCarouselItemProps {
  className?: string
}

// ── CommandPalette (⌘K) ────────────────────────────────────────────────
// The generic command-palette / spotlight SHELL: trigger + ⌘K, teleported
// dialog, query input, keyboard nav, grouped results, match highlighting, a11y.
// It owns NO search logic — you feed it results (grouped or flat) computed from
// the `query` it exposes via `v-model:query` (your scoring / index / async
// fetch), and it renders + navigates them. Selecting emits `@select`.
export interface KunCommandItem {
  /** Stable key + what `@select` carries (falls back to `label`). */
  value?: string | number
  /** Primary line. */
  label: string
  /** Secondary line — a match snippet or description. */
  description?: string
  /** Small caption above the label (e.g. a breadcrumb / category). */
  section?: string
  /** Leading icon name. */
  icon?: string
  /** Render as a real crawlable link (`@select` still fires). */
  href?: string
  disabled?: boolean
}

export interface KunCommandGroup<T extends KunCommandItem = KunCommandItem> {
  /** Optional group heading. */
  label?: string
  items: readonly T[]
}

export interface KunCommandPaletteProps<
  T extends KunCommandItem = KunCommandItem,
> {
  /** Results to show: a flat item list (one unlabelled group) OR grouped. You
   *  compute these from `v-model:query` — the shell does no matching itself. */
  items?: readonly T[] | readonly KunCommandGroup<T>[]
  /** Async search in flight → a loading state instead of the no-result text. */
  loading?: boolean
  placeholder?: string
  /** Shown when `query` is non-empty but there are no results. */
  noResultText?: string
  /** Shown when `query` is empty (a hint / "recent"). */
  emptyText?: string
  /** Global open shortcut. `true` (default) = ⌘K / Ctrl-K; a single-char string
   *  sets a custom key (still with meta/ctrl); `false` disables it. */
  shortcut?: boolean | string
  /** Highlight the query terms in the default item render. Default `true`. */
  highlight?: boolean
  /** Accessible name for the dialog. */
  ariaLabel?: string
}
