// The browser's top layer beats every z-index there is. KunLightbox is the one
// KunUI component that opens a native modal <dialog>, and everything outside
// that dialog's subtree — which is every other KunUI overlay, all of them
// Teleported to <body> — goes inert while it is open.
//
// Measured, Chrome 152: with a Lightbox open, opening KunCommandPalette left
// `document.activeElement` at BODY, neither component answered Escape, both
// stayed open and the scroll lock was never released (a backdrop click
// recovered it). The palette was painted under the ::backdrop, so the page just
// looked frozen.
//
// Nothing can be done about it at runtime — that is what the top layer is for —
// so this only names it. Dev-only via `process.env.NODE_ENV`, never
// `import.meta.env.DEV`, which Vite folds to `false` when it builds this
// package and would strip the warning from the published bundle.
export const warnTopLayerConflict = (component: string) => {
  if (process.env.NODE_ENV === 'production') return
  if (typeof document === 'undefined') return

  let dialog: Element | null = null
  try {
    dialog = document.querySelector('dialog:modal')
  } catch {
    // `:modal` is Chrome 105 / Firefox 103 / Safari 15.6; an older engine
    // throws SyntaxError on the selector and there is nothing to report.
    return
  }
  if (!dialog) return

  console.warn(
    `[${component}] opened while a modal <dialog> is open (KunLightbox, or one ` +
      `of your own). The dialog is in the browser's top layer, so ${component} ` +
      `paints beneath its ::backdrop, cannot be clicked, and will not answer ` +
      `Escape. Close the dialog first, or render this content inside it.`
  )
}
