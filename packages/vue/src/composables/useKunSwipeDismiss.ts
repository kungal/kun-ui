// Drag a bottom sheet down to dismiss it — the gesture every native sheet has,
// and the one a KunModal/KunDrawer in its phone form was missing.
//
// The whole design question is how the gesture shares a finger with the sheet's
// own scrolling, and the answer the field converged on is: the CONTENT WINS
// UNTIL IT IS SCROLLED BACK TO THE TOP. vaul walks up from the touch target and
// refuses to drag the moment it finds a scroller with `scrollTop !== 0`; Base
// UI's `useSwipeDismiss` phrases the same rule as "swiping toward the axis
// start edge is allowed when scrolled to the start". This does the same, with
// one deliberate difference: it checks EVERY scroller between the touch and the
// panel rather than only the innermost, so an inner list at the top nested in an
// already-scrolled panel still can't start a drag.
//
// Touch only, on purpose. A mouse drag on a sheet is not a real gesture, and
// supporting it is what makes the reference implementations big: they have to
// tell a drag from a text selection, keep `pointercancel` in order and undo the
// browser's own drag defaults. Restricting this to `(pointer: coarse)` leaves
// one clean mechanism — a non-passive `touchmove` that calls `preventDefault()`
// once the gesture is ours.
//
// `touch-action` is deliberately NOT set on the panel. The property is resolved
// by intersecting the values from the touched element up to "the first
// containing scrolling element", so `touch-action: none` on a panel that is
// itself the scroller would kill its own scrolling. vaul can afford that rule
// only because its panel never scrolls (a child does); ours does, so the
// non-passive listener is the mechanism and `touch-action` stays out of it.

import { onScopeDispose, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

// Travel needed before the gesture is claimed, in px. Under Chrome's own touch
// slop so the decision lands before the browser commits to a scroll — once it
// has, `preventDefault()` on later moves is ignored.
const DRAG_START_THRESHOLD = 6
// Fraction of the panel's own height that dismisses on release. vaul's
// CLOSE_THRESHOLD, and close to Base UI's flat 40px on a typical sheet.
const CLOSE_DISTANCE_RATIO = 0.25
// px/ms at release that dismisses regardless of distance — a flick. vaul's
// VELOCITY_THRESHOLD.
const CLOSE_VELOCITY = 0.4
// Window the release velocity is measured over.
const VELOCITY_WINDOW = 100
// No dragging this soon after the sheet appears: the enter animation
// (--kun-dur-base, 250ms) is still moving the panel, and a finger that lands
// mid-flight would fight it.
const OPEN_GRACE = 300
// No dragging this soon after the content scrolled. Momentum scrolling that
// coasts to the top would otherwise hand the rest of the same gesture to the
// drag and dismiss the sheet the user was only reading. vaul's
// SCROLL_LOCK_TIMEOUT.
const SCROLL_COOLDOWN = 100
// How far an upward drag gives before it stops, in px. Asymptotic, so the sheet
// yields at first (slope 1 at zero) and then firmly refuses instead of tearing
// off the bottom edge.
const RUBBER_BAND_LIMIT = 32

// Controls whose own gesture is a drag, so the sheet must not steal it.
const NO_DRAG_SELECTOR =
  'input,textarea,select,[contenteditable],[role="slider"],[data-kun-no-drag]'

const rubberBand = (distance: number) =>
  RUBBER_BAND_LIMIT * (1 - Math.exp(-distance / RUBBER_BAND_LIMIT))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Touch as the primary input. False on a touchscreen laptop, which is right:
// there the sheet is driven by a mouse and the gesture would only get in the
// way of selecting text.
export const isKunCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

// Every scroller above the touch must be at the top for the panel to move.
//
// The walk deliberately runs all the way to <body> rather than stopping at the
// panel: with `scrollBehavior="outside"` the scroller is the OVERLAY, outside
// the panel, and stopping early would let a drag dismiss a sheet whose content
// the reader had scrolled halfway down. The body itself is scroll-locked while
// an overlay is open, so there is nothing above worth finding.
//
// `overflow` is read rather than trusting scrollTop alone: `scrollTop` can be
// non-zero on a box that is no longer scrollable (content shrank, or the
// element was switched to `overflow: hidden`), and that stale value must not
// veto the gesture forever.
const isScrolledAnywhere = (from: Element | null) => {
  let el: Element | null = from
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.scrollTop > 0) {
      const overflowY = getComputedStyle(el).overflowY
      if (
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflowY === 'overlay'
      ) {
        return true
      }
    }
    el = el.parentElement
  }
  return false
}

export interface UseKunSwipeDismissOptions {
  /** Whether the gesture is available at all — the caller's "am I a sheet, and
   *  may I be dismissed" check. Read fresh at the start of every gesture. */
  enabled: () => boolean
  /** Backdrop to fade out as the sheet travels. Omit when the backdrop is the
   *  same element as the one hosting the panel. */
  fade?: Ref<HTMLElement | null>
  onDismiss: () => void
}

export const useKunSwipeDismiss = (
  panel: Ref<HTMLElement | null>,
  { enabled, fade, onDismiss }: UseKunSwipeDismissOptions
) => {
  let phase: 'idle' | 'pending' | 'dragging' = 'idle'
  let startX = 0
  let startY = 0
  let offset = 0
  let panelHeight = 0
  let openedAt = 0
  let lastScrollAt = 0
  let samples: { t: number; y: number }[] = []

  const now = () => performance.now()

  // Velocity is measured from the EVENT's timestamp, not from the clock at the
  // moment the handler happens to run. Both share the time origin, but a busy
  // main thread can hand a `touchmove` over tens of milliseconds after the
  // finger actually moved, which stretches dt, shrinks the computed velocity
  // and quietly swallows a flick that should have dismissed. Base UI reads
  // `event.timeStamp` for the same reason. The fallback covers a synthetic
  // event dispatched with no timestamp at all.
  const eventTime = (e: Event) => (e.timeStamp > 0 ? e.timeStamp : now())

  const setStyles = (y: number) => {
    const el = panel.value
    if (!el) return
    offset = y
    el.style.transform = `translate3d(0, ${y}px, 0)`
    const backdrop = fade?.value
    if (backdrop && panelHeight > 0) {
      const progress = Math.min(Math.max(y / panelHeight, 0), 1)
      backdrop.style.opacity = String(1 - progress)
    }
  }

  // Called on open, so a sheet re-opened after a dismissing drag never inherits
  // the inline transform/opacity that drag left behind.
  const clearStyles = () => {
    const el = panel.value
    if (el) {
      el.style.transform = ''
      el.style.transition = ''
      el.style.willChange = ''
    }
    const backdrop = fade?.value
    if (backdrop) {
      backdrop.style.opacity = ''
      backdrop.style.transition = ''
    }
    offset = 0
  }

  const settle = (toClose: boolean) => {
    const el = panel.value
    if (!el) return
    const reduced = prefersReducedMotion()
    const backdrop = fade?.value

    if (toClose) {
      // The Vue leave transition runs at the same time and over the same
      // duration; the inline transform simply overrides its keyframe so the
      // sheet leaves from wherever the finger let go instead of snapping first.
      if (!reduced) {
        el.style.transition = 'transform var(--kun-dur-exit, 180ms) var(--ease-kun-in, ease-in)'
        if (backdrop) {
          backdrop.style.transition = 'opacity var(--kun-dur-exit, 180ms) var(--ease-kun-in, ease-in)'
        }
      }
      setStyles(panelHeight)
      onDismiss()
      return
    }

    if (reduced) {
      clearStyles()
      return
    }
    el.style.transition = 'transform var(--kun-dur-base, 250ms) var(--ease-kun-emphasized, ease-out)'
    if (backdrop) {
      backdrop.style.transition = 'opacity var(--kun-dur-base, 250ms) var(--ease-kun-emphasized, ease-out)'
    }
    setStyles(0)
    // Drop the inline transition once it has played so the next gesture starts
    // from a clean slate; `transitionend` can be missed (a zero-length
    // transition never fires one), hence the timer rather than the event.
    window.setTimeout(clearStyles, 300)
  }

  const velocity = () => {
    if (samples.length < 2) return 0
    const last = samples[samples.length - 1]!
    const first = samples.find((s) => last.t - s.t <= VELOCITY_WINDOW) ?? samples[0]!
    const dt = last.t - first.t
    return dt > 0 ? (last.y - first.y) / dt : 0
  }

  const onTouchStart = (e: TouchEvent) => {
    phase = 'idle'
    const el = panel.value
    if (!el || !enabled() || !isKunCoarsePointer()) return
    // Multi-touch is a pinch/zoom, never a dismiss.
    if (e.touches.length !== 1) return
    const t = e.touches[0]!
    const at = eventTime(e)
    if (at - openedAt < OPEN_GRACE) return
    if (at - lastScrollAt < SCROLL_COOLDOWN) return
    const target = t.target
    if (target instanceof Element && target.closest(NO_DRAG_SELECTOR)) return

    startX = t.clientX
    startY = t.clientY
    samples = [{ t: at, y: t.clientY }]
    phase = 'pending'
  }

  const onTouchMove = (e: TouchEvent) => {
    if (phase === 'idle') return
    const el = panel.value
    if (!el) return
    const t = e.touches[0]
    if (!t) return

    const at = eventTime(e)
    samples.push({ t: at, y: t.clientY })
    while (samples.length > 2 && at - samples[0]!.t > VELOCITY_WINDOW) samples.shift()

    const dy = t.clientY - startY
    const dx = t.clientX - startX

    if (phase === 'pending') {
      if (Math.abs(dy) < DRAG_START_THRESHOLD && Math.abs(dx) < DRAG_START_THRESHOLD) {
        return
      }
      // A mostly-horizontal move belongs to a carousel, a slider or text.
      if (Math.abs(dx) > Math.abs(dy)) {
        phase = 'idle'
        return
      }
      // Upward is always the content's — it scrolls, or it doesn't.
      if (dy <= 0) {
        phase = 'idle'
        return
      }
      // The content keeps a downward swipe until it is back at the top.
      if (isScrolledAnywhere(t.target instanceof Element ? t.target : null)) {
        phase = 'idle'
        return
      }
      phase = 'dragging'
      // Clamped to the viewport, as vaul clamps it: with
      // `scrollBehavior="outside"` the panel can be taller than the screen, and
      // a quarter of an 1800px panel is a swipe no thumb can finish.
      panelHeight = Math.min(
        el.getBoundingClientRect().height,
        window.innerHeight
      )
      el.style.transition = 'none'
      el.style.willChange = 'transform'
      const backdrop = fade?.value
      if (backdrop) backdrop.style.transition = 'none'
    }

    // Ours now: stop the browser scrolling/overscrolling underneath the drag.
    if (e.cancelable) e.preventDefault()
    setStyles(dy > 0 ? dy : -rubberBand(-dy))
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (phase !== 'dragging') {
      phase = 'idle'
      return
    }
    phase = 'idle'
    // Swallow the compatibility click, or a drag that started on a button
    // dismisses the sheet AND fires that button on the way out.
    if (e.cancelable) e.preventDefault()

    const shouldClose =
      offset > 0 &&
      (velocity() > CLOSE_VELOCITY ||
        offset >= Math.max(panelHeight, 1) * CLOSE_DISTANCE_RATIO)
    settle(shouldClose)
  }

  const onTouchCancel = () => {
    if (phase === 'dragging') settle(false)
    phase = 'idle'
  }

  // `scroll` doesn't bubble, so the capture phase is how a descendant
  // scroller's activity is seen at all.
  useEventListener(panel, 'scroll', () => {
    lastScrollAt = now()
  }, { capture: true, passive: true })

  useEventListener(panel, 'touchstart', onTouchStart, { passive: true })
  useEventListener(panel, 'touchmove', onTouchMove, { passive: false })
  useEventListener(panel, 'touchend', onTouchEnd, { passive: false })
  useEventListener(panel, 'touchcancel', onTouchCancel, { passive: true })

  // The panel is v-if'd, so it appearing IS the sheet opening.
  watch(panel, (el) => {
    phase = 'idle'
    if (!el) return
    openedAt = now()
    lastScrollAt = 0
    clearStyles()
  })

  onScopeDispose(() => {
    phase = 'idle'
  })
}
