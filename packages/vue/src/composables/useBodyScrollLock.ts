// Body scroll-lock with a refcount shared across every consumer on the
// page. Required so nested overlays (Modal inside Modal, Modal opening a
// Lightbox, etc.) don't unlock the body when the inner one closes.
//
// The state lives at module scope so a single counter is shared by every
// consumer importing this file — a `let count = 0` inside a component's
// <script setup> would give each instance its own counter, re-introducing
// the "inner closes → body scroll unlocks while outer still open" bug.

let count = 0

// The <body> inline styles we overwrite, captured at lock time so unlock puts
// the page's own values back instead of blanking them (a host app that sets
// `body { padding-right }` inline would otherwise lose it on every close).
const MANAGED = [
  'overflow',
  'overscrollBehavior',
  'paddingRight',
  'position',
  'top',
  'left',
  'right',
  'width',
] as const
type SavedStyles = Record<(typeof MANAGED)[number], string>

let saved: SavedStyles | null = null
let savedScrollY = 0
// Whether the current lock took the body out of flow (iOS path), so unlock
// knows it has to put the scroll position back.
let pinned = false

// iOS Safari ignores `overflow: hidden` on <body> for TOUCH scrolling — the page
// keeps moving under the overlay, and on a bottom sheet that reads as the whole
// UI sliding away. The only thing that actually stops it is taking the body out
// of flow, which loses the scroll position, so we stash and restore it. This is
// what body-scroll-lock / react-remove-scroll / react-aria's usePreventScroll
// all do; there is no CSS-only equivalent.
const isIOS = () => {
  if (typeof navigator === 'undefined') return false
  if (/iP(hone|ad|od)/.test(navigator.userAgent)) return true
  // iPadOS 13+ reports a desktop Mac UA; the touch points give it away.
  return /Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1
}

const apply = (locked: boolean) => {
  if (typeof document === 'undefined') return
  const body = document.body

  if (locked) {
    // Re-entrancy guard: only the first lock captures, so a stray double-apply
    // can't overwrite the saved values with the locked ones.
    if (saved) return
    saved = Object.fromEntries(
      MANAGED.map((k) => [k, body.style[k]])
    ) as SavedStyles
    savedScrollY = window.scrollY

    // Measure the scrollbar BEFORE hiding it. Reading clientWidth forces layout,
    // so once `overflow: hidden` is on, the gap is already 0 and the
    // compensation silently becomes a no-op — which is what shipped until now,
    // leaving the page to jump 15px sideways on every open.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const basePadding = Number.parseFloat(getComputedStyle(body).paddingRight)

    body.style.overflow = 'hidden'
    // `overflow: hidden` stops the page scrolling but NOT Chrome for Android's
    // pull-to-refresh, which reads a downward drag near the top of the screen
    // and reloads the page. On a bottom sheet that drag is the dismiss gesture,
    // so the two collide; `overscroll-behavior: none` is the documented way to
    // switch pull-to-refresh off and it also kills the rubber-band bounce
    // behind the overlay.
    body.style.overscrollBehavior = 'none'
    // Added to whatever padding the page already has, not instead of it.
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${(Number.isFinite(basePadding) ? basePadding : 0) + scrollbarWidth}px`
    }

    pinned = isIOS()
    if (pinned) {
      body.style.position = 'fixed'
      body.style.top = `-${savedScrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
    }
    return
  }

  if (!saved) return
  for (const k of MANAGED) body.style[k] = saved[k]
  saved = null
  if (pinned) {
    pinned = false
    // `instant` so a page with `scroll-behavior: smooth` doesn't animate its way
    // back to where the user already was. Unknown values are ignored, so older
    // browsers just fall back to their default jump.
    window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' })
  }
}

const lock = () => {
  if (count === 0) apply(true)
  count++
}

const unlock = () => {
  if (count === 0) return
  count--
  if (count === 0) apply(false)
}

// HMR reset — dev rebuilds re-import this module but the running document
// state lingers, so a stuck count after a save would leave
// `body { overflow: hidden }` permanently. Reset on dispose.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    count = 0
    apply(false)
  })
}

// Per-instance callers should still guard with a boolean to keep
// onUnmounted symmetric (see Modal.vue for the pattern).
export const useBodyScrollLock = () => ({ lock, unlock })
