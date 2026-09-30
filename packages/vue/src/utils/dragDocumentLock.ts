// While a divider is dragged, the pointer runs ahead of it over the rest of the
// page: the cursor must stay col-resize and nothing may get text-selected. The
// lock sits on <html> and is refcounted, because saving and restoring per drag
// broke when two drags overlapped — a finger landing on the divider during a
// mouse drag saved the already-locked values as the originals and left the
// page stuck on col-resize (Chromium 153, measured). Client-only: it is called
// from pointer handlers.
let locks = 0
let saved: { cursor: string; userSelect: string; webkitUserSelect: string } | null = null

export const lockDocumentForDrag = (cursor: string) => {
  if (locks++ > 0) return
  const style = document.documentElement.style
  saved = {
    cursor: style.cursor,
    userSelect: style.userSelect,
    webkitUserSelect: style.getPropertyValue('-webkit-user-select'),
  }
  style.cursor = cursor
  style.userSelect = 'none'
  style.setProperty('-webkit-user-select', 'none')
}

export const unlockDocumentForDrag = () => {
  if (locks === 0 || --locks > 0 || !saved) return
  const style = document.documentElement.style
  style.cursor = saved.cursor
  style.userSelect = saved.userSelect
  style.setProperty('-webkit-user-select', saved.webkitUserSelect)
  saved = null
}
