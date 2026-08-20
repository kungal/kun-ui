// Android back button / back gesture closes the topmost overlay instead of
// navigating away, via the platform's CloseWatcher API.
//
// Browsers model "the user wants to dismiss the thing on screen" as a CLOSE
// REQUEST, a platform-agnostic signal: Esc on desktop, the back button or back
// gesture on Android, the TalkBack back gesture, the canonical back button on a
// game controller. A native `<dialog>` opened with showModal() (KunLightbox) and
// anything using the Popover API answer close requests for free — that is why
// pressing back over a native dialog on Android closes it rather than leaving
// the page. A `div[role="dialog"]` gets nothing, so KunModal / KunDrawer opt in
// by hand here.
//
// What this deliberately is NOT: the `history.pushState` trick. Pushing a fake
// entry on open and closing on `popstate` is the widespread workaround, and for
// a COMPONENT LIBRARY it is the wrong tool — the WICG explainer for this very
// API lists why, ending on the one that settles it for us: "A shared component
// that attempts to use the history API to implement these techniques can easily
// corrupt a web application's router." @kungal/ui-vue does not depend on
// vue-router and cannot know what the host app's router keeps in history.state,
// so it must not write there. An app that wants a route-bound modal still can —
// that belongs in the app's router, not in the component.
//
// Android only, on purpose. The only close-request signal a desktop browser
// sends is Esc, which Modal/Drawer already handle with their own keydown
// listener, so a watcher there would just double-handle the same key (verified:
// the keydown still reaches ordinary listeners and is not defaultPrevented).
// Base UI's Drawer gates its CloseWatcher the same way and for the same reason.

import { onScopeDispose, ref, watchEffect } from 'vue'

// Not in TypeScript's lib.dom as of 5.9 — the minimum shape we touch.
type CloseWatcherLike = {
  addEventListener: (type: 'close', listener: () => void) => void
  destroy: () => void
}
type CloseWatcherCtor = new () => CloseWatcherLike

// At most ONE live watcher per page, module-scoped like the z-index stack.
//
// This is not a micro-optimisation, it is the correctness fix for stacked
// overlays. The spec groups close watchers created without transient user
// activation, and a single close request closes every watcher in a group — so
// two live watchers can mean one back press closing two modals. When the top
// modal closes, the one underneath becomes topmost and creates its watcher in
// the same flush, possibly BEFORE the closing one has run its cleanup. Routing
// every create through here makes the order irrelevant: taking the slot evicts
// whatever held it.
let currentOwner: symbol | null = null
let currentWatcher: CloseWatcherLike | null = null

const evictSlot = () => {
  currentWatcher?.destroy()
  currentWatcher = null
  currentOwner = null
}

const releaseSlot = (owner: symbol) => {
  if (currentOwner === owner) evictSlot()
}

const isAndroid = (): boolean => {
  if (typeof navigator === 'undefined') return false
  // UA-CH first: Chromium reports a clean 'Android' here even where the UA
  // string has been frozen or reduced.
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData
  if (uaData?.platform) return uaData.platform === 'Android'
  return /Android/i.test(navigator.userAgent)
}

/**
 * Close the overlay on a platform close request while `isActive()` holds.
 *
 * Callers pass `open && isTopmost && dismissable` — a watcher exists only for
 * the overlay a close request should actually reach. When the overlay is not
 * dismissable no watcher is created at all, so the back press navigates as it
 * always did; swallowing it to keep the user on the page would be the
 * back-button trapping that browsers ship interventions against.
 *
 * Returns `isWatching`, which the caller MUST use to stand its own Escape
 * handler down. Escape is itself a close request, so with both live a single
 * Escape closes two stacked overlays: the keydown handler closes the top one,
 * the overlay below it becomes topmost and registers its watcher inside the
 * same flush, and the close request — dispatched after the keydown — then finds
 * that new watcher and closes that one too. Verified in Chrome 151; letting the
 * watcher be the only handler while it exists is what fixes it.
 */
export const useKunCloseRequest = (
  isActive: () => boolean,
  onClose: () => void
) => {
  const owner = Symbol('kun-close-request')
  const isWatching = ref(false)

  watchEffect((onCleanup) => {
    isWatching.value = false
    if (!isActive()) return
    // SSR, and browsers without the API (Safari as of 26.x) — both just keep
    // the pre-existing behaviour.
    if (typeof window === 'undefined') return
    if (!isAndroid()) return

    const Ctor = (window as Window & { CloseWatcher?: CloseWatcherCtor })
      .CloseWatcher
    if (!Ctor) return

    evictSlot()
    const watcher = new Ctor()
    watcher.addEventListener('close', () => {
      // Guard against a close event arriving after the overlay went away by
      // some other route (backdrop, close button) in the same frame.
      if (isActive()) onClose()
    })
    currentWatcher = watcher
    currentOwner = owner
    isWatching.value = true

    onCleanup(() => {
      isWatching.value = false
      releaseSlot(owner)
    })
  })

  // watchEffect's cleanup already runs on scope stop; this is the belt-and-
  // braces for a component torn down while its effect is mid-flight.
  onScopeDispose(() => releaseSlot(owner))

  return { isWatching }
}
