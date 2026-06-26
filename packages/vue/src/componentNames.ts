// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the set of publicly-registered KunUI components.
//
// Everything that needs "the list of component names" derives from THIS array:
//   - index.ts types its `components` map as `Record<KunComponentName, …>`, so the
//     plain-Vue `app.use(KunUI)` registry can't drift from this list — a missing
//     or extra entry is a COMPILE error (vue-tsc).
//   - the Nuxt layer (nuxt.config.ts) imports it to `addComponent` each one, so
//     downstream Nuxt templates auto-resolve every component with no hand-list.
//   - the `KunUIResolver` (unplugin-vue-components) resolves exactly these.
//   - the docs meta generator reads it.
//
// Add a component in ONE place (here + its import/entry in index.ts, which the
// type guard enforces); every consumer follows automatically. Order is cosmetic.
// ─────────────────────────────────────────────────────────────────────────────
export const KUN_COMPONENT_NAMES = [
  'KunAccordion',
  'KunAccordionItem',
  'KunAlertProvider',
  'KunAutocomplete',
  'KunAvatar',
  'KunAvatarGroup',
  'KunBadge',
  'KunBrand',
  'KunButton',
  'KunCard',
  'KunCarousel',
  'KunCarouselItem',
  'KunCheckBox',
  'KunChip',
  'KunContent',
  'KunContextMenu',
  'KunCopy',
  'KunDatePicker',
  'KunDivider',
  'KunDrawer',
  'KunDropdown',
  'KunFadeCard',
  'KunFileInput',
  'KunHeader',
  'KunIcon',
  'KunImage',
  'KunImageNative',
  'KunInfo',
  'KunInput',
  'KunLightbox',
  'KunLightboxGallery',
  'KunLightboxGalleryItem',
  'KunLink',
  'KunLoading',
  'KunLoli',
  'KunLoliProvider',
  'KunMarkdown',
  'KunMessageProvider',
  'KunModal',
  'KunNull',
  'KunNumberInput',
  'KunPagination',
  'KunPinInput',
  'KunPopover',
  'KunProgress',
  'KunRadioGroup',
  'KunRating',
  'KunReaction',
  'KunRipple',
  'KunScrollShadow',
  'KunSelect',
  'KunShatter',
  'KunSkeleton',
  'KunSlider',
  'KunSteps',
  'KunSwitch',
  'KunTab',
  'KunTabPanel',
  'KunTabPanels',
  'KunTagInput',
  'KunText',
  'KunTextarea',
  'KunTimeline',
  'KunTimelineItem',
  'KunTooltip',
  'KunUpload',
  'KunUserChip',
] as const

export type KunComponentName = (typeof KUN_COMPONENT_NAMES)[number]
