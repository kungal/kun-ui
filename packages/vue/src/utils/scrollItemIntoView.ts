// Scroll a list item into view *within its scroll container only* — never the
// window. `Element.scrollIntoView()` walks every scrollable ancestor up to the
// document, so when a teleported overlay is momentarily at (0,0) (before
// floating-ui's first async measurement lands) it yanks the whole page to the
// top on first open. Adjusting the container's own scrollTop avoids that
// entirely while keeping `block: 'nearest'` semantics.
export const scrollItemIntoView = (
  container: HTMLElement | null | undefined,
  item: Element | null | undefined
): void => {
  if (!container || !item) return
  const c = container.getBoundingClientRect()
  const i = item.getBoundingClientRect()
  if (i.top < c.top) {
    container.scrollTop -= c.top - i.top
  } else if (i.bottom > c.bottom) {
    container.scrollTop += i.bottom - c.bottom
  }
}
