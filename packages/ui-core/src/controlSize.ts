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

// Icon-only buttons: a fixed SQUARE whose side equals the text-button height at
// the same size, so an icon button lines up with text buttons in a row.
//
// Why this exists: kunControlSizeClasses is padding-driven (height = line-height
// + 2·py + border). A text label contributes a full line-box (≈1.5em), but a lone
// 1em icon does not — with the same padding the icon button would come out
// shorter and break the row. Mainstream libraries dodge this by giving buttons a
// fixed height and making the icon button a square of that height (shadcn
// `size-9`, HeroUI/Chakra/Ant `isIconOnly`/`.ant-btn-icon-only`). We do the same,
// ONLY for icon-only, keeping the icon at its natural 1em centered in the box.
//
// Sides MUST equal the kunControlSizeClasses heights (incl. the 1px border every
// variant carries): xs 26 · sm 34 · md 38 · lg 46 · xl 54. (size-* is border-box,
// so the value already accounts for the icon button's own 1px border.)
export const kunControlSquareClasses: Record<KunUISize, string> = {
  xs: 'size-[26px] p-0',
  sm: 'size-[34px] p-0',
  md: 'size-[38px] p-0',
  lg: 'size-[46px] p-0',
  xl: 'size-[54px] p-0',
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

// The single source of truth for chip / tag pills — a standalone KunChip and the
// tags inside KunTagInput share it, so a tag looks identical either way. A
// compact sub-scale (~0.7× the form-control height): vertical padding is tighter
// than kunControlSizeClasses because a chip is text + tight padding, not a tap
// target. Pair with `gap-1` + `rounded-full`.
export const kunChipSizeClasses: Record<KunUISize, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-sm',
  xl: 'px-6 py-2 text-base',
}
