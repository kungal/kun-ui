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
  ],
  'svg-spinners': ['90-ring-with-bg'],
}

export const PKG = {
  lucide: '@iconify-json/lucide',
  'svg-spinners': '@iconify-json/svg-spinners',
}
