import type { KunUISize } from './types'

// The single source of truth for the size of every text-like form control —
// Button, Input, Select, DatePicker, Textarea, TagInput. They reference this so
// they share one scale and line up in a row.
//
// Padding-driven (not fixed-height): height = font line-height + 2·py + border.
// `md` is the anchor (~38px, the modern default). px:py is a clean 2:1 (xs/sm a
// touch looser); horizontal padding grows faster than vertical from md→xl, so a
// bigger control gets wider, not flatter. Approx heights with a 1px border and
// text line-heights 16 / 20 / 20 / 24 / 28:
//   xs ≈ 26 · sm ≈ 34 · md ≈ 38 · lg ≈ 46 · xl ≈ 54
export const kunControlSizeClasses: Record<KunUISize, string> = {
  xs: 'text-xs px-2.5 py-1',
  sm: 'text-sm px-3.5 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-lg px-6 py-3',
}

export interface KunSelectionSize {
  box: string // the square: checkbox box / radio indicator outer ring
  dot: string // radio's inner filled dot (unused by checkbox)
  check: string // checkbox's check glyph (unused by radio)
  text: string // the adjacent label
  gap: string // box ↔ label spacing
}

// The shared scale for selection controls — KunCheckBox and KunRadioGroup use
// identical box sizes (every major library does this), so a checkbox and a radio
// of the same size match. The box is ≈ 0.5× the text-control height and ≈ 1.2–1.4×
// the label font, so it sits optically level with the label beside it.
// Box px by size: 12 / 14 / 16 / 20 / 24.
export const kunSelectionSizeClasses: Record<KunUISize, KunSelectionSize> = {
  xs: { box: 'size-3', dot: 'size-1.5', check: 'size-2', text: 'text-xs', gap: 'gap-1.5' },
  sm: { box: 'size-3.5', dot: 'size-1.5', check: 'size-2.5', text: 'text-sm', gap: 'gap-2' },
  md: { box: 'size-4', dot: 'size-2', check: 'size-3', text: 'text-sm', gap: 'gap-2' },
  lg: { box: 'size-5', dot: 'size-2.5', check: 'size-3.5', text: 'text-base', gap: 'gap-2.5' },
  xl: { box: 'size-6', dot: 'size-3', check: 'size-4', text: 'text-lg', gap: 'gap-3' },
}
