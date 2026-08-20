// A wheel event's delta is not always in pixels. `deltaMode: 1` means LINES —
// what Firefox sends for a mouse wheel, 3 per notch — and `2` means PAGES, so a
// handler that scrolls by the raw number moves 3px per notch in Firefox instead
// of a screenful of anything. One line is counted as 40px because that puts a
// Firefox notch (3 lines) within a few pixels of the ~125px Chromium 151
// reports for the same notch, measured here.
const LINE_PX = 40

// `pageSize` is the scroller's own extent along the axis — only read for the
// page mode, which no mouse produces on its own.
export const wheelDeltaPx = (e: WheelEvent, pageSize: number): number => {
  // The dominant axis, so a trackpad's horizontal swipe drives a horizontal
  // strip as well as a vertical wheel does.
  const raw = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  if (e.deltaMode === 1) return raw * LINE_PX
  if (e.deltaMode === 2) return raw * pageSize
  return raw
}
