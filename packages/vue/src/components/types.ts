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
