// Every user-visible string KunUI renders on its own — accessible names for
// icon-only controls, empty/loading states, and the handful of built-in button
// labels. A component prop that sets the same text always wins over the locale.
//
// These live in ui-core, not in a render layer: the catalogs are plain data
// that every layer needs (and that the kun_ui_messages pub package is
// generated from), so putting them in @kungal/ui-vue would have made the Vue
// package the upstream of React and Flutter for 91 strings.
//
// Placeholders are `{name}` and are substituted by `translateKunMessage`. They
// are NOT optional styling: a value's position moves between languages
// (react-aria ships "Decrease {fieldLabel}" for en-US and "{fieldLabel}
// verringern" for de-DE), so an interpolated string must stay one template
// here and never be assembled from fragments at the call site.

export interface KunMessages {
  alert: { title: string; confirm: string; cancel: string }
  autocomplete: { clear: string; loading: string; noResult: string }
  avatar: { unknownUser: string }
  /** `{count}` — number of users in the group. */
  avatarGroup: { label: string }
  banner: { label: string; close: string }
  /** `goto` takes `{index}`, the 1-based slide number. */
  carousel: {
    label: string
    prev: string
    next: string
    nav: string
    goto: string
  }
  chip: { remove: string }
  /** `resultCount` takes `{count}`. */
  commandPalette: {
    placeholder: string
    empty: string
    noResult: string
    loading: string
    close: string
    hintSelect: string
    hintOpen: string
    hintClose: string
    resultCount: string
  }
  /** `success` / `failure` take `{text}`, the copied string. */
  copy: { copied: string; success: string; failure: string }
  /** `prevPage` / `nextPage` take `{unit}`, filled from `unitMonth` /
   *  `unitYear` / `unitDecade`; `zoomOut` takes `{label}`; `monthCell` takes
   *  `{month}` and `{year}` — one template, because Chinese puts the year
   *  first. */
  datePicker: {
    placeholderDay: string
    placeholderMonth: string
    placeholderYear: string
    clear: string
    today: string
    close: string
    prevYear: string
    nextYear: string
    prevPage: string
    nextPage: string
    zoomOut: string
    unitMonth: string
    unitYear: string
    unitDecade: string
    monthCell: string
  }
  drawer: { close: string }
  /** `selected` takes `{count}`. */
  fileInput: { trigger: string; selected: string }
  /** `tooLarge` takes `{name}` and `{size}`. */
  filePicker: { tooLarge: string }
  input: { clear: string; reveal: string; hide: string }
  /** `goto` takes `{index}`, the 1-based image number. */
  lightbox: {
    label: string
    close: string
    prev: string
    next: string
    goto: string
    zoomIn: string
    zoomOut: string
    rotateLeft: string
    rotateRight: string
    reset: string
    download: string
  }
  lightboxGallery: { view: string }
  loading: { description: string }
  loli: { close: string }
  message: { close: string }
  modal: { close: string }
  /** KunNull — the "nothing here" empty state. */
  null: { description: string }
  numberInput: { decrement: string; increment: string }
  /** `page` takes `{page}`. The two `hint` halves wrap the arrow-key icons. */
  pagination: {
    nav: string
    prev: string
    next: string
    page: string
    hintBefore: string
    hintAfter: string
    jumpLabel: string
    jump: string
  }
  /** `digit` takes `{label}` and `{index}`, the 1-based position. */
  pinInput: { label: string; digit: string }
  reaction: { label: string }
  /** `removeOption` takes `{label}`, the option's own label. */
  select: {
    searchPlaceholder: string
    noResult: string
    loading: string
    clear: string
    removeOption: string
  }
  spoiler: { copyCode: string; reveal: string }
  /** Both take `{tag}`. */
  tagInput: { tag: string; removeTag: string }
  upload: {
    imageAlt: string
    cropTitle: string
    cancel: string
    confirm: string
  }
}

/** A locale's strings plus its identity — everything about a locale that is
 *  framework-agnostic. A render layer extends it with whatever else it needs
 *  (the Vue layer adds a date-fns locale for the calendar grid). */
export interface KunMessageCatalog {
  /** Endonym, for a language switcher's own list (e.g. `简体中文`). */
  name: string
  /** BCP 47 tag. Not used for matching — KunUI never picks a locale for you. */
  code: string
  messages: KunMessages
}

/** Dotted path into `KunMessages`, e.g. `'pagination.prev'`. */
export type KunMessagePath = {
  [K in keyof KunMessages]: `${K & string}.${keyof KunMessages[K] & string}`
}[keyof KunMessages]

export type KunTranslate = (
  path: KunMessagePath,
  params?: Record<string, string | number>
) => string
