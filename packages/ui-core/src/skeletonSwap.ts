// The schedule behind KunSkeletonSwap, framework-free so the Flutter port shows
// and hides its skeleton at the same moments.

/** `content`: the content layer, stale while loading. `pending`: loading with
 *  no content to keep, the skeleton laid out but not shown yet. `skeleton`:
 *  the skeleton is showing. */
export type KunSkeletonSwapView = 'content' | 'pending' | 'skeleton'

export interface KunSkeletonSwapState {
  view: KunSkeletonSwapView
  /** When the current loading run began; null while not loading. */
  loadingSince: number | null
  /** When the skeleton was shown; null unless `view` is `skeleton`. */
  shownAt: number | null
}

export interface KunSkeletonSwapTiming {
  /** ms of loading before the skeleton shows. */
  delay: number
  /** ms a shown skeleton stays before the content may replace it. */
  minDuration: number
}

export interface KunSkeletonSwapStep {
  state: KunSkeletonSwapState
  /** Call `nextKunSkeletonSwap` again at this time; null when nothing is due. */
  wakeAt: number | null
}

/** Advance the state to `now` for the current `loading` value. */
export const nextKunSkeletonSwap = (
  state: KunSkeletonSwapState,
  loading: boolean,
  now: number,
  { delay, minDuration }: KunSkeletonSwapTiming
): KunSkeletonSwapStep => {
  if (loading) {
    const loadingSince = state.loadingSince ?? now
    if (state.view === 'skeleton') return { state: { ...state, loadingSince }, wakeAt: null }
    const showAt = loadingSince + Math.max(0, delay)
    if (now >= showAt) {
      return { state: { view: 'skeleton', loadingSince, shownAt: now }, wakeAt: null }
    }
    return { state: { view: state.view, loadingSince, shownAt: null }, wakeAt: showAt }
  }
  if (state.view === 'skeleton' && state.shownAt !== null) {
    const hideAt = state.shownAt + Math.max(0, minDuration)
    if (now < hideAt) return { state: { ...state, loadingSince: null }, wakeAt: hideAt }
  }
  return { state: { view: 'content', loadingSince: null, shownAt: null }, wakeAt: null }
}

/** The first state. `showNow` skips the delay: a server render cannot wait it
 *  out, and the hydrating client has to match what the server sent. */
export const initialKunSkeletonSwap = (
  loading: boolean,
  now: number,
  timing: KunSkeletonSwapTiming,
  showNow: boolean
): KunSkeletonSwapStep =>
  nextKunSkeletonSwap(
    loading && showNow
      ? { view: 'skeleton', loadingSince: now, shownAt: now }
      : { view: loading ? 'pending' : 'content', loadingSince: null, shownAt: null },
    loading,
    now,
    timing
  )
