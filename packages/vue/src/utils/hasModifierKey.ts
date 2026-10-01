export const hasModifierKey = (e: MouseEvent | KeyboardEvent) =>
  e.metaKey || e.ctrlKey || e.altKey || e.shiftKey
