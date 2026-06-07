// Central design-system types shared by every KunUI render layer
// (Vue, React, …). Pure type-level — no runtime code.

export type KunUIVariant =
  | 'solid'
  | 'bordered'
  | 'light'
  | 'flat'
  | 'shadow'
  | 'ghost'

export type KunUIColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type KunUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type KunUIRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'
