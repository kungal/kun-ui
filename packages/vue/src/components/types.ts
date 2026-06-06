import type {
  KunUIVariant,
  KunUIColor,
  KunUISize,
  KunUIRounded,
} from '@kungal/core'

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
