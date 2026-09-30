// The width rule behind KunSplitPane's divider, framework-free so the Flutter
// port snaps to the same widths.

export interface KunSplitSizeOptions {
  min: number
  max: number
  /** Widths the divider is pulled to when it comes within `snapThreshold`. */
  snapPoints?: readonly number[]
  snapThreshold?: number
  /** The width a keyboard step starts from. A snap may not cancel or reverse
   *  that step: with a 5 px step inside an 8 px threshold, the divider would
   *  otherwise never leave a snap point. A drag leaves it unset, so the
   *  divider sticks to a snap point until the pointer pulls clear. */
  from?: number
}

/** Clamp a requested width into [min, max], pull it to the nearest snap point
 *  within the threshold, and round it to a whole pixel. */
export const resolveKunSplitSize = (
  raw: number,
  { min, max, snapPoints = [], snapThreshold = 8, from }: KunSplitSizeOptions
): number => {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  const clamped = Math.min(Math.max(raw, lo), hi)
  let best = clamped
  let bestDistance = Infinity
  for (const point of snapPoints) {
    if (point < lo || point > hi) continue
    const distance = Math.abs(point - clamped)
    if (distance <= snapThreshold && distance < bestDistance) {
      best = point
      bestDistance = distance
    }
  }
  if (from !== undefined && Math.sign(best - from) !== Math.sign(clamped - from)) best = clamped
  return Math.round(best)
}
