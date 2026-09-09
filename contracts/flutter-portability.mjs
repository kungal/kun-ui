// Hand-curated Flutter-portability classification, consumed by
// scripts/gen-flutter-contracts.mjs. Every reason string is copied verbatim
// into contracts/component-contracts.json — write it for the Flutter port's
// reader, not for this repo's.
//
// A component absent from WEB_ONLY_COMPONENTS is portable BY DEFAULT, on
// purpose: a new component (or a new prop) lands in the contract
// automatically, where the parity report makes it visible downstream. The
// wrong default would be silence — a web-only default lets the contract
// quietly fall behind the library, which is the shadcn zinc.dart failure mode
// (docs/architecture-flutter.md §2.3) at the contract level. If a new
// component is genuinely a web artifact, add one entry here.
//
// "Web-only" means the parity report will never ask the Flutter port to
// answer for it. When a capability crosses but the *shape* does not (the
// overlay providers, KunIcon), that is still web-only — the reason says what
// carries the capability instead.

export const WEB_ONLY_COMPONENTS = {
  KunContent:
    'Renders an HTML string via v-html; Flutter has no HTML renderer, and a rich-content screen is an app-level decision (architecture-flutter.md §4.2).',
  KunMarkdown:
    'An inline-SVG markdown glyph, not a renderer; glyphs reach Flutter as IconData through the kun_ui_icons font (tier 1).',
  KunScrollShadow:
    'A pure-CSS answer to web scrollbars (edge fades on a DOM scroller); Flutter scrolling has its own physics, viewports and Scrollbar.',
  KunImage:
    'Wraps the injected web image pipeline (NuxtImg: srcset, formats, placeholders); Flutter image loading and caching is its own stack.',
  KunImageNative: 'A bare <img> wrapper whose whole job is class merging.',
  KunLink:
    'Wraps the injected router link (<a>/NuxtLink); navigation belongs to the Flutter app’s router.',
  KunRipple:
    'Pointer-ripple effect; the Flutter SDK ships this as InkWell/InkResponse.',
  KunText:
    'Inserts zero-width spaces so long tokens survive CSS overflow-wrap; Flutter Text soft-wraps anywhere by default.',
  KunIcon:
    'Renders inline SVG from the web icon registry; Flutter consumes the same icons as IconData through the kun_ui_icons font (tier 1) and the SDK’s Icon widget. The one animated icon (the spinner) becomes a hand-written widget in tier 4.',
  KunFadeCard:
    'A Vue Transition plus the CSS grid 0fr→1fr expand trick; the Flutter SDK answers with AnimatedSize/AnimatedSwitcher.',
  KunMessageProvider:
    'A mount-once teleport host for useKunMessage() toasts; the capability crosses as an imperative API over Flutter’s Overlay, not as a component. Its Dart API is a tier-4 decision.',
  KunAlertProvider:
    'A mount-once teleport host for useKunAlert() confirm dialogs; the capability crosses as an imperative API over Flutter’s dialog routes, not as a component. Its Dart API is a tier-4 decision.',
  KunLoliProvider:
    'A mount-once teleport host for useKunLoliInfo() mascot popups; the capability crosses as an imperative API over Flutter’s Overlay, not as a component. Its Dart API is a tier-4 decision.',
}

// CSS class pass-throughs, matched by name on every portable component:
// className, classNames, innerClassName, innerClass, imageClassName,
// contentClass, iconClass, nameClass, menuClass, triggerClass, labelClassName.
export const WEB_ONLY_PROP_PATTERN = /class(names?)?$/i
export const WEB_ONLY_PROP_PATTERN_REASON =
  'CSS class pass-through; Dart has no class strings — styling enters through the widget’s own parameters.'

const FORM_NAME =
  'Native <form> field name (hidden-input mirroring); Flutter has no uncontrolled form serialization.'
const ARIA_NAMESPACE =
  'Readable namespace for generated ARIA ids; Flutter Semantics has no id linkage.'
const LINK_MODE =
  'Link mode renders an <a>; navigation belongs to the Flutter app’s router.'

export const WEB_ONLY_PROPS = {
  KunButton: {
    href: LINK_MODE,
    rel: '<a> rel attribute — link mode only.',
    target: '<a> target attribute — link mode only.',
    type: 'Native <button> form type (submit/reset); Flutter has no implicit form submission.',
  },
  KunCard: { href: LINK_MODE },
  KunBrand: {
    to: 'Router link target; navigation belongs to the Flutter app’s router.',
  },
  KunPagination: {
    pageHref:
      'Emits crawlable <a> page links for SEO; meaningless off the web.',
  },
  KunAutocomplete: { name: FORM_NAME },
  KunCheckBox: { name: FORM_NAME },
  KunNumberInput: { name: FORM_NAME },
  KunPinInput: { name: FORM_NAME },
  KunSelect: { name: FORM_NAME },
  KunTextarea: { name: FORM_NAME },
  KunAccordionItem: { name: ARIA_NAMESPACE },
  KunTab: { name: ARIA_NAMESPACE },
  KunTabPanel: { name: ARIA_NAMESPACE },
  KunTabPanels: { name: ARIA_NAMESPACE },
}
