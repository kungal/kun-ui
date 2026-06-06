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
