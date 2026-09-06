// Body scroll-lock with a refcount shared across every consumer on the
// page. Required so nested overlays (Modal inside Modal, Modal opening a
// Lightbox, etc.) don't unlock the body when the inner one closes.
//
// The state lives at module scope so a single counter is shared by every
// consumer importing this file — a `let count = 0` inside a component's
// <script setup> would give each instance its own counter, re-introducing
// the "inner closes → body scroll unlocks while outer still open" bug.

// Known limitations, all measured and deliberately left as they are:
//
// - The lock is a no-op when <html> is its own scroll container. CSS Overflow 3
//   §3.1.4 propagates <body>'s overflow to the viewport ONLY while html's own
//   overflow is `visible`, so on a page with `html { overflow-y: scroll }` or
//   `html { overflow-x: hidden }` the page keeps scrolling behind an open
//   overlay. Base UI picks the element to lock instead (`getViewportScroller`);
//   here that would make MANAGED and the whole save/restore element-dependent.
// - MANAGED restores `overflow` and `overscrollBehavior` as SHORTHANDS. A page
//   with an inline `body { overflow-y: auto }` serializes `body.style.overflow`
//   to '' — CSSOM cannot build a shorthand out of one longhand — so unlock
//   blanks that longhand instead of putting it back.
// - The width is measured once per lock. Zooming while an overlay is open
//   leaves both the padding and the published variable stale; Base UI re-runs
//   its whole lock on `resize`.

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
let savedScrollbarWidthVar = ''
let savedScrollY = 0
// Whether the current lock took the body out of flow (iOS path), so unlock
// knows it has to put the scroll position back.
let pinned = false

const SCROLLBAR_WIDTH_VAR = '--kun-scrollbar-width'

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

// Whether the page ALREADY reserves a stable scrollbar gutter of its own. It
// then loses no width when the scrollbar is hidden, so compensating it IS the
// shift — measured on the docs site, padding on top of a gutter that was never
// lost shrank the page's own content by 16px on every open.
//
// KunUI deliberately does NOT set `scrollbar-gutter` itself, though it would
// hold `position: fixed` elements still (react-aria and Base UI both do it for
// that reason). Measured, Chrome 152: a reserved gutter keeps the initial
// containing block at 1474.4 inside a 1489.6 window, and page content cannot
// paint into the remaining 15.2px by ANY means — `right: -32px`, `width: 100vw`
// and a negative margin all still clipped at 1474.4, and
// `document.elementFromPoint(1482, 400)` returned null. So every full-bleed
// backdrop would stop short of the screen edge and leave the page background
// showing as a bright band down the side of a dim modal, and a right-anchored
// Drawer would float 15.6px off the edge. Reserving the gutter is only viable
// together with keeping the scrollbar RENDERED (Base UI's `overflow-y: scroll`
// + body-takes-over-scrolling path), which is not what this file does.
//
// Reading the computed value is the whole test: §5.2 of CSS Overflow 3 assigns
// the root element a USED value of `auto` (it propagates to the viewport), but
// getComputedStyle reports the computed value, so a page's own `stable` is
// visible here.
const pageReservesGutter = (html: HTMLElement): boolean => {
  if (typeof CSS === 'undefined' || !CSS.supports) return false
  if (!CSS.supports('scrollbar-gutter', 'stable')) return false
  return /stable/.test(getComputedStyle(html).scrollbarGutter || '')
}

const apply = (locked: boolean) => {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  const body = document.body

  if (locked) {
    // Re-entrancy guard: only the first lock captures, so a stray double-apply
    // can't overwrite the saved values with the locked ones.
    if (saved) return
    saved = Object.fromEntries(
      MANAGED.map((k) => [k, body.style[k]])
    ) as SavedStyles
    savedScrollbarWidthVar = html.style.getPropertyValue(SCROLLBAR_WIDTH_VAR)
    savedScrollY = window.scrollY

    // Measure the scrollbar BEFORE hiding it. Reading clientWidth forces layout,
    // so once `overflow: hidden` is on, the gap is already 0 and the
    // compensation silently becomes a no-op — which is what shipped until now,
    // leaving the page to jump 15px sideways on every open.
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const basePadding = Number.parseFloat(getComputedStyle(body).paddingRight)

    // How much width the page actually loses when the scrollbar goes away.
    const removed = pageReservesGutter(html) ? 0 : Math.max(0, scrollbarWidth)

    body.style.overflow = 'hidden'
    // `overflow: hidden` stops the page scrolling but NOT Chrome for Android's
    // pull-to-refresh, which reads a downward drag near the top of the screen
    // and reloads the page. On a bottom sheet that drag is the dismiss gesture,
    // so the two collide; `overscroll-behavior: none` is the documented way to
    // switch pull-to-refresh off and it also kills the rubber-band bounce
    // behind the overlay.
    body.style.overscrollBehavior = 'none'
    // Added to whatever padding the page already has, not instead of it.
    if (removed > 0) {
      body.style.paddingRight = `${(Number.isFinite(basePadding) ? basePadding : 0) + removed}px`
    }
    // Published so anything the padding cannot reach can compensate itself:
    // `position: fixed` resolves against the initial containing block, which
    // GROWS by this much, and body padding can only ever reach in-flow content.
    // Saved and put back like every other style this file touches — a consumer
    // may have set the name itself (`--kun-` is the shared ecosystem prefix).
    html.style.setProperty(SCROLLBAR_WIDTH_VAR, `${removed}px`)

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
  if (savedScrollbarWidthVar) {
    html.style.setProperty(SCROLLBAR_WIDTH_VAR, savedScrollbarWidthVar)
  } else {
    html.style.removeProperty(SCROLLBAR_WIDTH_VAR)
  }
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
