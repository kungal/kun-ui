// @kungal/ui-core — framework-agnostic foundation for every KunUI render layer.
// Pure TypeScript only: design types, class utilities, the variant matrix,
// the radius system, and small helpers. NO Vue, NO React, NO DOM/runtime
// coupling — anything that needs reactivity or a framework lives in the
// per-framework packages (@kungal/ui-vue, @kungal/ui-react, …).

export type {
  KunUIVariant,
  KunUIColor,
  KunUISize,
  KunUIRounded,
} from './types'

export { cn, type ClassValue } from './cn'

export {
  kunVariantClasses,
  kunBgClasses,
  kunTextClasses,
  kunBorderClasses,
  kunRingClasses,
  kunSoftBgClasses,
} from './variants'

export {
  kunRoundedClasses,
  KUN_DEFAULT_ROUNDED,
  resolveRounded,
} from './rounded'

export { kunControlSizeClasses } from './controlSize'

export { randomNum } from './random'
export { decodeIfEncoded } from './decodeIfEncoded'
export { getRandomSticker } from './getRandomSticker'
export type { KunUser } from './user'

// Icon registry — bundled (no-fetch) icon data + consumer registration.
export {
  registerKunIcon,
  registerKunIcons,
  getKunIcon,
  hasKunIcon,
  type KunIconData,
} from './icons'
