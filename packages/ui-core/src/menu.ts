// The menu entry list behind KunContextMenu and KunDropdown, framework-free so
// the Flutter port collapses separators the same way.

/** Drop separators that would render as stray lines: leading, trailing, and
 *  all but the first of a run. An app filters one command table per context
 *  (no "Delete" for a post you do not own) and its separators have to follow;
 *  React Spectrum S2 hides the same three cases. */
export const normalizeKunMenuSeparators = <T extends { type?: string }>(
  entries: readonly T[]
): T[] => {
  const out: T[] = []
  for (const entry of entries) {
    const last = out[out.length - 1]
    if (entry.type === 'separator' && (!last || last.type === 'separator')) continue
    out.push(entry)
  }
  while (out.length && out[out.length - 1]!.type === 'separator') out.pop()
  return out
}
