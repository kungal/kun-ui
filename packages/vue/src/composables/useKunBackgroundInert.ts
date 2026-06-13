// Marks the page background `inert` while a modal overlay is open, so assistive
// tech and Tab can't reach anything behind it — stronger isolation than
// `aria-modal` alone. Refcounted and module-scoped (mirrors useBodyScrollLock):
// the FIRST overlay inerts every <body> child that isn't a KunUI overlay; the
// LAST overlay to close clears it. Overlays tag their teleported root with
// `data-kun-overlay` so they (and each other) are never inerted.

let inertCount = 0
const inerted: HTMLElement[] = []

const applyInert = () => {
  if (typeof document === 'undefined') return
  for (const el of Array.from(document.body.children)) {
    // `inert` isn't in older lib.dom typings — feature-detect via `in`.
    if (
      el instanceof HTMLElement &&
      !el.hasAttribute('data-kun-overlay') &&
      'inert' in el &&
      !(el as HTMLElement & { inert: boolean }).inert
    ) {
      ;(el as HTMLElement & { inert: boolean }).inert = true
      inerted.push(el)
    }
  }
}

const releaseInert = () => {
  for (const el of inerted) {
    ;(el as HTMLElement & { inert: boolean }).inert = false
  }
  inerted.length = 0
}

export const useKunBackgroundInert = () => {
  const activate = () => {
    if (inertCount++ === 0) applyInert()
  }
  const deactivate = () => {
    inertCount--
    if (inertCount <= 0) {
      inertCount = 0
      releaseInert()
    }
  }
  return { activate, deactivate }
}
