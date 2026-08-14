import { onMounted, onScopeDispose, ref, watch } from 'vue'

// Height of the *visual* viewport in CSS px — the slice of the page still
// visible once the on-screen keyboard is up.
//
// `dvh` looks like the answer and isn't: the dynamic viewport tracks retracting
// browser chrome but is defined to ignore the virtual keyboard. So a dialog
// anchored to the bottom edge and sized in `dvh` stays 100dvh tall when the
// keyboard opens — the bottom half, including whatever the user was typing into,
// is simply behind the keyboard. `visualViewport` is the only surface that sees
// it. (This is what react-aria measures for HeroUI's `--visual-viewport-height`.)
//
// Stays null until measured, so SSR and hydration emit no height at all and the
// caller's CSS fallback stays in charge — no mismatch, and browsers without the
// API keep the fallback for good.
export const useVisualViewportHeight = (isActive: () => boolean) => {
  const height = ref<number | null>(null)

  let viewport: VisualViewport | null = null

  const measure = () => {
    if (viewport) height.value = viewport.height
  }

  const start = () => {
    if (viewport || typeof window === 'undefined' || !window.visualViewport) {
      return
    }
    viewport = window.visualViewport
    viewport.addEventListener('resize', measure)
    measure()
  }

  const stop = () => {
    if (!viewport) return
    viewport.removeEventListener('resize', measure)
    viewport = null
    // Drop back to the CSS fallback while inactive, so a height captured with
    // the keyboard up can't be what the next open renders with.
    height.value = null
  }

  // Only listen while the overlay is actually up — visualViewport fires on every
  // address-bar nudge, and an idle page shouldn't pay for that.
  watch(isActive, (active) => (active ? start() : stop()))
  // Deliberately not `watch(..., { immediate: true })`: that would run during
  // setup and put an inline height into the first client render of a dialog that
  // was open in the SSR markup, which had none. onMounted lands after hydration.
  onMounted(() => {
    if (isActive()) start()
  })
  onScopeDispose(stop)

  return height
}
