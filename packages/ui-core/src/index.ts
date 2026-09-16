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
  kunSolidBgClasses,
  kunSolidFgClasses,
  kunSolidClasses,
  kunTextClasses,
  kunBorderClasses,
  kunRingClasses,
  kunFocusRingClasses,
  kunFocusRingWithinClasses,
  kunSoftBgClasses,
} from './variants'

export {
  kunRoundedClasses,
  KUN_DEFAULT_ROUNDED,
  resolveRounded,
  kunPanelRoundedClass,
} from './rounded'

export {
  kunControlSizeClasses,
  kunControlSquareClasses,
  kunSelectionSizeClasses,
  kunChipSizeClasses,
  type KunSelectionSize,
} from './controlSize'

// Shared motion models. The same manifest
// (packages/ui-tokens/scripts/motion-physics.mjs) generates kun_ui_tokens'
// `KunShatterPhysics` and `KunSwipeDismissPhysics`, so the web and Flutter
// renditions cannot drift.
export {
  KUN_SHATTER_PHYSICS,
  KUN_SWIPE_DISMISS_PHYSICS,
} from './motionPhysics.generated'

// Locale — KunUI's own strings, framework-free. `zh-CN` is the built-in
// default and ships here; every other catalog is its own entry point
// (`@kungal/ui-core/locale/en`) so only the one you import is bundled.
export type {
  KunMessages,
  KunMessageCatalog,
  KunMessagePath,
  KunTranslate,
} from './locale/types'
export { translateKunMessage } from './locale/translate'
export { KUN_CATALOG_ZH_CN } from './locale/zh-CN'

export { randomNum } from './random'
export { decodeIfEncoded } from './decodeIfEncoded'
export { pickAvatarFallback, getRandomSticker } from './avatarFallback'
export { KUN_AVATAR_FALLBACK } from './avatarFallbackImage'
export type { KunUser } from './user'

// Icon registry — bundled (no-fetch) icon data + consumer registration.
export {
  registerKunIcon,
  registerKunIcons,
  getKunIcon,
  hasKunIcon,
  type KunIconData,
} from './icons'
