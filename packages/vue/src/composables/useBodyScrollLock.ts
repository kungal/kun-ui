// Body scroll-lock with a refcount shared across every consumer on the
// page. Required so nested overlays (Modal inside Modal, Modal opening a
// Lightbox, etc.) don't unlock the body when the inner one closes.
//
// The state lives at module scope so a single counter is shared by every
// consumer importing this file — a `let count = 0` inside a component's
// <script setup> would give each instance its own counter, re-introducing
// the "inner closes → body scroll unlocks while outer still open" bug.

let count = 0

const apply = (locked: boolean) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = locked ? 'hidden' : ''
  document.body.style.paddingRight = locked
    ? `${window.innerWidth - document.documentElement.clientWidth}px`
    : ''
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
