// Shared z-index allocator for the CSS-positioned overlays (KunModal,
// KunDrawer) that all live on the same `z-kun-modal` layer.
//
// Without it, several open overlays share one z-index and stacking falls back
// to DOM order — and because each overlay <Teleport>s to <body> at a FIXED
// anchor (its template position, NOT the order it was opened), a newly-opened
// overlay can render *beneath* an older one. On open each overlay instead
// claims the next value above the base, so the most-recently-opened is always
// on top regardless of declaration/DOM order.
//
// The counter is module-scoped — one shared stack for every overlay on the
// page — mirroring useBodyScrollLock's refcount. When the last overlay closes
// it resets to the base so the values can't climb forever.
//
// (KunLightbox renders a native <dialog> in the browser's top layer, which the
// browser already stacks by open order — so it needs none of this.)

import { ref } from 'vue'

// Anchor the stack at the `--z-kun-modal` token so a consumer's
// `:root { --z-kun-modal: … }` override still applies; fall back to the
// shipped default when there's no DOM (SSR) or the token is missing.
const FALLBACK_BASE = 9000
const readBase = (): number => {
  if (typeof document === 'undefined') return FALLBACK_BASE
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    '--z-kun-modal'
  )
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : FALLBACK_BASE
}

let openCount = 0 // overlays currently holding a claim
let top = 0 // highest offset issued in the current stack session

// Per-instance: claim() on open, release() on close/unmount. Callers guard the
// calls (see Modal/Drawer) so they stay symmetric across modelValue toggles.
export const useKunOverlayZIndex = () => {
  const zIndex = ref<number>()

  const claim = () => {
    openCount++
    zIndex.value = readBase() + ++top
  }

  const release = () => {
    openCount--
    if (openCount <= 0) {
      // stack empty → reset so the numbers don't grow unbounded
      openCount = 0
      top = 0
    }
  }

  return { zIndex, claim, release }
}
