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
