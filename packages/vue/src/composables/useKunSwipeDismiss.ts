// Drag a sheet back toward the edge it came from to dismiss it — down for a
// bottom sheet, the gesture every native sheet has, and left/right/up for a
// KunDrawer on that edge, as Material's modal navigation drawer and vaul's
// `direction` do.
//
// The whole design question is how the gesture shares a finger with the sheet's
// own scrolling, and the answer the field converged on is: the CONTENT WINS
// UNTIL IT IS SCROLLED BACK TO THE TOP. vaul walks up from the touch target and
// refuses to drag the moment it finds a scroller with `scrollTop !== 0`; Base
// UI's `useSwipeDismiss` phrases the same rule as "swiping toward the axis
// start edge is allowed when scrolled to the start". This does the same, with
// one deliberate difference: it checks EVERY scroller between the touch and the
// panel rather than only the innermost, so an inner list at the top nested in an
// already-scrolled panel still can't start a drag. Only scrolling on the swipe's
// own axis counts — a side drawer's vertical list never blocks a horizontal
// swipe — and toward an end edge (up, left) the content must be at its END, as
// in Base UI. vaul skips the scroll check for side drawers entirely, which hands
// a horizontal tab strip's swipe to the drawer.
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

import { onScopeDispose, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { KUN_SWIPE_DISMISS_PHYSICS } from '@kungal/ui-core'

// Travel needed before the gesture is claimed, in px. Under Chrome's own touch
// slop so the decision lands before the browser commits to a scroll — once it
// has, `preventDefault()` on later moves is ignored.
const DRAG_START_THRESHOLD = 6
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
// The release rule and the overdrag resistance are the gesture's feel, shared
// with kun_ui_tokens' `KunSwipeDismissPhysics`: tune them in
// packages/ui-tokens/scripts/motion-physics.mjs, never here.
const {
  closeDistanceRatio: CLOSE_DISTANCE_RATIO,
  closeVelocity: CLOSE_VELOCITY,
  rubberBandLimit: RUBBER_BAND_LIMIT,
} = KUN_SWIPE_DISMISS_PHYSICS

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

/** The way the finger travels to dismiss: toward the edge the panel sits on. */
export type KunSwipeDismissDirection = 'up' | 'down' | 'left' | 'right'

// Every scroller above the touch must be unable to scroll the way the finger
// is going for the panel to move.
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
//
// RTL flips `scrollLeft` to run from 0 at the start down to −max, so "can still
// scroll left" is not `scrollLeft < max` there.
const canScrollToward = (el: HTMLElement, direction: KunSwipeDismissDirection) => {
  const vertical = direction === 'up' || direction === 'down'
  const max = vertical
    ? el.scrollHeight - el.clientHeight
    : el.scrollWidth - el.clientWidth
  if (max < 1) return false
  const style = getComputedStyle(el)
  const overflow = vertical ? style.overflowY : style.overflowX
  if (overflow !== 'auto' && overflow !== 'scroll' && overflow !== 'overlay') {
    return false
  }
  if (direction === 'down') return el.scrollTop > 0
  if (direction === 'up') return el.scrollTop < max - 1
  const rtl = style.direction === 'rtl'
  const [lo, hi] = rtl ? [-max, 0] : [0, max]
  // A finger moving right pulls the content toward its left edge.
  return direction === 'right' ? el.scrollLeft > lo + 1 : el.scrollLeft < hi - 1
}

const isScrollableToward = (
  from: Element | null,
  direction: KunSwipeDismissDirection
) => {
  let el: Element | null = from
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && canScrollToward(el, direction)) return true
    el = el.parentElement
  }
  return false
}

// An element whose `touch-action` withholds panning on the swipe's axis has
// declared that axis its own JS gesture: KunChatConversationItem's swipe actions
// set `pan-y`, so in a left drawer a leftward swipe on a row would otherwise
// reveal the row's actions AND drag the drawer shut. The walk stops at the
// panel: `touch-action` set outside it is not about its content.
const ownsAxisGesture = (
  from: Element | null,
  panel: HTMLElement,
  direction: KunSwipeDismissDirection
) => {
  const pans =
    direction === 'up' || direction === 'down'
      ? ['pan-y', 'pan-up', 'pan-down']
      : ['pan-x', 'pan-left', 'pan-right']
  let el: Element | null = from
  while (el) {
    const value = getComputedStyle(el).touchAction
    if (value !== 'auto' && value !== 'manipulation') {
      const tokens = value.split(/\s+/)
      if (!pans.some((p) => tokens.includes(p))) return true
    }
    if (el === panel) return false
    el = el.parentElement
  }
  return false
}

export interface UseKunSwipeDismissOptions {
  /** Whether the gesture is available at all — the caller's "am I a sheet, and
   *  may I be dismissed" check. Read fresh at the start of every gesture. */
  enabled: () => boolean
  /** The way the finger travels to dismiss — toward the edge the panel sits
   *  on. Read fresh at the start of every gesture.
   *  @default 'down' */
  direction?: MaybeRefOrGetter<KunSwipeDismissDirection>
  /** Backdrop to fade out as the sheet travels. Omit when the backdrop is the
   *  same element as the one hosting the panel. */
  fade?: Ref<HTMLElement | null>
  onDismiss: () => void
}

export const useKunSwipeDismiss = (
  panel: Ref<HTMLElement | null>,
  { enabled, direction = 'down', fade, onDismiss }: UseKunSwipeDismissOptions
) => {
  let phase: 'idle' | 'pending' | 'dragging' = 'idle'
  let touchId = 0
  let startX = 0
  let startY = 0
  // Fixed per gesture: a viewport crossing `md` mid-drag must not turn it.
  let dir: KunSwipeDismissDirection = 'down'
  // Travel along `dir`, positive toward dismissal.
  let offset = 0
  // The panel's extent along `dir`.
  let panelSize = 0
  let openedAt = 0
  let lastScrollAt = 0
  let samples: { t: number; d: number }[] = []

  const now = () => performance.now()

  // Velocity is measured from the EVENT's timestamp, not from the clock at the
  // moment the handler happens to run. Both share the time origin, but a busy
  // main thread can hand a `touchmove` over tens of milliseconds after the
  // finger actually moved, which stretches dt, shrinks the computed velocity
  // and quietly swallows a flick that should have dismissed. Base UI reads
  // `event.timeStamp` for the same reason. The fallback covers a synthetic
  // event dispatched with no timestamp at all.
  const eventTime = (e: Event) => (e.timeStamp > 0 ? e.timeStamp : now())

  const isVertical = () => dir === 'up' || dir === 'down'
  const sign = () => (dir === 'down' || dir === 'right' ? 1 : -1)
  // The finger's position along `dir`: grows as it moves toward dismissal.
  const along = (t: Touch) => sign() * (isVertical() ? t.clientY : t.clientX)

  const setStyles = (d: number) => {
    const el = panel.value
    if (!el) return
    offset = d
    const px = sign() * d
    el.style.transform = isVertical()
      ? `translate3d(0, ${px}px, 0)`
      : `translate3d(${px}px, 0, 0)`
    const backdrop = fade?.value
    if (backdrop && panelSize > 0) {
      const progress = Math.min(Math.max(d / panelSize, 0), 1)
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
      setStyles(panelSize)
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
    return dt > 0 ? (last.d - first.d) / dt : 0
  }

  // The finger that started the gesture owns it until it lifts, as the Flutter
  // port's recognizer owns its first pointer. Reading `touches[0]` and resetting
  // on every `touchstart` instead left the panel parked mid-drag (+40px, as the
  // port measured) when a second finger landed: the drag was dropped with its
  // transform still applied and no later event to settle it.
  const ownTouch = (list: TouchList) =>
    Array.from(list).find((t) => t.identifier === touchId)

  const onTouchStart = (e: TouchEvent) => {
    if (phase === 'dragging') return
    phase = 'idle'
    const el = panel.value
    if (!el || !enabled() || !isKunCoarsePointer()) return
    // A second finger before the drag is claimed is a pinch/zoom, never a dismiss.
    if (e.touches.length !== 1) return
    const t = e.touches[0]!
    const at = eventTime(e)
    if (at - openedAt < OPEN_GRACE) return
    if (at - lastScrollAt < SCROLL_COOLDOWN) return
    const target = t.target
    if (target instanceof Element && target.closest(NO_DRAG_SELECTOR)) return

    touchId = t.identifier
    dir = toValue(direction)
    startX = t.clientX
    startY = t.clientY
    samples = [{ t: at, d: along(t) }]
    phase = 'pending'
  }

  const onTouchMove = (e: TouchEvent) => {
    if (phase === 'idle') return
    const el = panel.value
    if (!el) return
    const t = ownTouch(e.changedTouches)
    if (!t) {
      // Still ours to cancel: left alone, a second finger spreading away from
      // the dragging one pinch-zoomed the page under the sheet (scale 1 → 5
      // over CDP touch in Chrome 153).
      if (phase === 'dragging' && e.cancelable) e.preventDefault()
      return
    }

    const at = eventTime(e)
    samples.push({ t: at, d: along(t) })
    while (samples.length > 2 && at - samples[0]!.t > VELOCITY_WINDOW) samples.shift()

    const dx = t.clientX - startX
    const dy = t.clientY - startY
    // Travel toward dismissal, and across it.
    const main = sign() * (isVertical() ? dy : dx)
    const cross = isVertical() ? dx : dy

    if (phase === 'pending') {
      if (Math.abs(dy) < DRAG_START_THRESHOLD && Math.abs(dx) < DRAG_START_THRESHOLD) {
        return
      }
      // A move mostly across the axis belongs to something else: a carousel,
      // a slider or text under a bottom sheet, the list's own vertical scroll
      // in a side drawer.
      if (Math.abs(cross) > Math.abs(main)) {
        phase = 'idle'
        return
      }
      // Away from the edge is always the content's — it scrolls, or it doesn't.
      if (main <= 0) {
        phase = 'idle'
        return
      }
      const target = t.target instanceof Element ? t.target : null
      // The content keeps the swipe until it can scroll no further that way.
      if (isScrollableToward(target, dir) || ownsAxisGesture(target, el, dir)) {
        phase = 'idle'
        return
      }
      phase = 'dragging'
      // Clamped to the viewport, as vaul clamps it: with
      // `scrollBehavior="outside"` the panel can be taller than the screen, and
      // a quarter of an 1800px panel is a swipe no thumb can finish.
      const rect = el.getBoundingClientRect()
      panelSize = isVertical()
        ? Math.min(rect.height, window.innerHeight)
        : Math.min(rect.width, window.innerWidth)
      el.style.transition = 'none'
      el.style.willChange = 'transform'
      const backdrop = fade?.value
      if (backdrop) backdrop.style.transition = 'none'
    }

    // Ours now: stop the browser scrolling/overscrolling underneath the drag.
    if (e.cancelable) e.preventDefault()
    setStyles(main > 0 ? main : -rubberBand(-main))
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (phase === 'idle' || !ownTouch(e.changedTouches)) return
    if (phase !== 'dragging') {
      phase = 'idle'
      return
    }
    phase = 'idle'
    // Swallow the compatibility click, or a drag that started on a button
    // dismisses the sheet AND fires that button on the way out.
    if (e.cancelable) e.preventDefault()

    // A flick decides on its own, either way: AndroidX DrawerLayout keeps a
    // drawer open on any fling back toward open however far it was dragged,
    // where vaul and MUI let distance alone close it, so a reader who drags
    // half way, changes their mind and flicks back still lost the sheet.
    const v = velocity()
    const shouldClose =
      offset > 0 &&
      (v > CLOSE_VELOCITY ||
        (v >= -CLOSE_VELOCITY &&
          offset >= Math.max(panelSize, 1) * CLOSE_DISTANCE_RATIO))
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
