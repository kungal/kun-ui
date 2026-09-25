// The finite set of icons KunUI ships, shared by the two icon generators:
// gen-icons.mjs (the bundled web data) and gen-icons-flutter.mjs (the pub.dev
// icon font). One list, so the two platforms cannot carry different icons.

// Names KunUI's own components use (current + the full set from the original
// lib, so future component ports already have their icons bundled).
export const WANT = {
  lucide: [
    'x', 'check', 'info', 'circle-check', 'circle-x', 'triangle-alert',
    'chevron-right', 'chevron-left', 'chevron-down', 'chevrons-right',
    'chevrons-left', 'arrow-right', 'arrow-left', 'plus', 'minus', 'upload', 'zoom-in', 'zoom-out',
    'rotate-cw', 'rotate-ccw', 'refresh-ccw', 'external-link', 'download',
    'copy', 'calendar', 'lollipop', 'eye', 'eye-off', 'search', 'filter',
    'heart',
  ],
  'svg-spinners': ['90-ring-with-bg'],
}

// Flutter-only filled twins. A component that fills a stroke icon with the
// `fill-current` class (KunReaction's active state) has no counterpart in a
// font, whose glyph is the traced stroke and cannot be filled. So
// gen-icons-flutter traces these a second time from the same SVG with
// fill="currentColor" and emits them as `<name>Filled`. The web bundle is
// unaffected; it keeps filling with CSS.
export const FILLED = {
  lucide: ['heart'],
}

export const PKG = {
  lucide: '@iconify-json/lucide',
  'svg-spinners': '@iconify-json/svg-spinners',
}
