import { onScopeDispose, watch, type Ref } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// useKunPointerMenu — the ONE place hover-menu intent is solved, reused by every
// floating component (Popover today; nav menus / nested submenus later).
//
// Why a composable, not per-component timers:
//  • Coordinate-based SAFE TRIANGLE — on leaving the trigger we allow the pointer
//    to travel toward the panel without closing. It is computed purely from
//    clientX/Y + getBoundingClientRect(), so it works even though our panels are
//    `Teleport`ed to <body> (DOM-containment-based safe-polygons break across
//    portals/stacking contexts — coordinates don't).
//  • Open/close DELAYS + a shared GROUP so a menu bar switches instantly between
//    siblings (skip the open delay while the group is "hot") and only one stays
//    open (mutual exclusion) — the NavigationMenu feel.
//  • Touch/pen DEGRADE to click (hover only fires for pointerType 'mouse'), so
//    the first tap doesn't follow a link instead of opening — the classic a11y
//    trap. Keyboard / click / Esc stay owned by the host component.
// ─────────────────────────────────────────────────────────────────────────────

export interface KunPointerMenuOptions {
  /** The open state to drive. Flipped directly (no focus side effects), so a
   *  hover-open never steals focus the way a click-open intentionally does. */
  open: Ref<boolean>
  /** Disable entirely (e.g. `trigger !== 'hover'`) — returns no-op handlers. */
  enabled?: boolean
  /** ms before a hover opens (debounce accidental passes). Default 100. */
  openDelay?: number
  /** ms grace after leaving, to cross the gap / safe triangle. Default 120. */
  closeDelay?: number
  /** Shared id: siblings switch instantly + only one is open at a time. */
  group?: string
}

// Module-level group coordination (siblings are separate component instances).
const groupOpenMember = new Map<string, symbol>() // group → currently-open member id
const groupClosers = new Map<symbol, () => void>() // member id → its close()
const groupHotUntil = new Map<string, number>() // group → time until skip-delay applies

const isClient = typeof window !== 'undefined'
const now = () =>
  typeof performance !== 'undefined' ? performance.now() : Date.now()

const sign = (
  px: number, py: number, ax: number, ay: number, bx: number, by: number
) => (px - bx) * (ay - by) - (ax - bx) * (py - by)

const pointInTriangle = (
  px: number, py: number,
  ax: number, ay: number, bx: number, by: number, cx: number, cy: number
) => {
  const d1 = sign(px, py, ax, ay, bx, by)
  const d2 = sign(px, py, bx, by, cx, cy)
  const d3 = sign(px, py, cx, cy, ax, ay)
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNeg && hasPos)
}

// Is the pointer inside the triangle from the trigger-exit point to the two
// corners of the panel edge that faces the pointer? = "still heading to panel".
const inSafeTriangle = (
  px: number, py: number, ex: number, ey: number, r: DOMRect
) => {
  let c1x: number, c1y: number, c2x: number, c2y: number
  if (ey <= r.top) {
    c1x = r.left; c1y = r.top; c2x = r.right; c2y = r.top
  } else if (ey >= r.bottom) {
    c1x = r.left; c1y = r.bottom; c2x = r.right; c2y = r.bottom
  } else if (ex <= r.left) {
    c1x = r.left; c1y = r.top; c2x = r.left; c2y = r.bottom
  } else {
    c1x = r.right; c1y = r.top; c2x = r.right; c2y = r.bottom
  }
  return pointInTriangle(px, py, ex, ey, c1x, c1y, c2x, c2y)
}

type Handlers = {
  pointerenter: (e: PointerEvent) => void
  pointerleave: (e: PointerEvent) => void
}
const NOOP: Handlers = { pointerenter: () => {}, pointerleave: () => {} }

export function useKunPointerMenu(
  panelRef: Ref<HTMLElement | null>,
  options: KunPointerMenuOptions
): { triggerHandlers: Handlers; panelHandlers: Handlers } {
  if (options.enabled === false || !isClient) {
    return { triggerHandlers: NOOP, panelHandlers: NOOP }
  }

  const id = Symbol('kun-pointer-menu')
  const openDelay = options.openDelay ?? 100
  const closeDelay = options.closeDelay ?? 120
  const group = options.group
  const SKIP_WINDOW = 300 // ms after a group close during which siblings skip the open delay

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let moveListener: ((e: PointerEvent) => void) | null = null

  const clearOpenTimer = () => {
    if (openTimer) { clearTimeout(openTimer); openTimer = undefined }
  }
  const clearCloseTimer = () => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = undefined }
  }
  const removeMoveListener = () => {
    if (moveListener) {
      document.removeEventListener('pointermove', moveListener)
      moveListener = null
    }
  }

  const groupIsHot = () =>
    !!group &&
    (groupOpenMember.has(group) || (groupHotUntil.get(group) ?? 0) > now())

  const doOpen = () => {
    clearOpenTimer()
    if (options.open.value) return
    if (group) {
      const other = groupOpenMember.get(group)
      if (other && other !== id) groupClosers.get(other)?.()
      groupOpenMember.set(group, id)
    }
    options.open.value = true
  }

  const doClose = () => {
    clearOpenTimer(); clearCloseTimer(); removeMoveListener()
    if (!options.open.value) return
    options.open.value = false
    if (group) {
      if (groupOpenMember.get(group) === id) groupOpenMember.delete(group)
      groupHotUntil.set(group, now() + SKIP_WINDOW)
    }
  }

  const requestOpen = () => {
    clearCloseTimer(); removeMoveListener()
    if (options.open.value || openTimer) return
    const delay = groupIsHot() ? 0 : openDelay
    if (delay <= 0) doOpen()
    else openTimer = setTimeout(doOpen, delay)
  }

  // Leave: keep a grace timer alive while the pointer heads toward the panel
  // (inside the safe triangle) or sits over it; otherwise close at once.
  const requestClose = (exitX: number, exitY: number) => {
    clearOpenTimer()
    removeMoveListener()
    const startGrace = () => {
      clearCloseTimer()
      closeTimer = setTimeout(doClose, closeDelay)
    }
    startGrace()
    moveListener = (e: PointerEvent) => {
      const panel = panelRef.value
      if (!panel) return // grace timer will close it
      const r = panel.getBoundingClientRect()
      const overPanel =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom
      if (overPanel) {
        clearCloseTimer(); removeMoveListener() // panel's own enter takes over
      } else if (inSafeTriangle(e.clientX, e.clientY, exitX, exitY, r)) {
        startGrace() // still heading there — extend the grace
      } else {
        doClose()
      }
    }
    document.addEventListener('pointermove', moveListener)
  }

  const onTriggerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') requestOpen()
  }
  const onTriggerLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') requestClose(e.clientX, e.clientY)
  }
  const onPanelEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') { clearCloseTimer(); removeMoveListener() }
  }
  const onPanelLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') requestClose(e.clientX, e.clientY)
  }

  // Let group siblings close us, and stay consistent if the host closes the menu
  // by other means (Esc / click-outside / click toggle).
  groupClosers.set(id, doClose)
  watch(options.open, (v) => {
    if (v) {
      if (group) {
        const other = groupOpenMember.get(group)
        if (other && other !== id) groupClosers.get(other)?.()
        groupOpenMember.set(group, id)
      }
    } else {
      clearOpenTimer(); clearCloseTimer(); removeMoveListener()
      if (group && groupOpenMember.get(group) === id) {
        groupOpenMember.delete(group)
        groupHotUntil.set(group, now() + SKIP_WINDOW)
      }
    }
  })

  onScopeDispose(() => {
    clearOpenTimer(); clearCloseTimer(); removeMoveListener()
    if (group && groupOpenMember.get(group) === id) groupOpenMember.delete(group)
    groupClosers.delete(id)
  })

  return {
    triggerHandlers: { pointerenter: onTriggerEnter, pointerleave: onTriggerLeave },
    panelHandlers: { pointerenter: onPanelEnter, pointerleave: onPanelLeave },
  }
}
