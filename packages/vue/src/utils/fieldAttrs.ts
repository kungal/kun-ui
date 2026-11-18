import { useAttrs } from 'vue'

type Attrs = Record<string, unknown>

export const mergeIdRefs = (...refs: unknown[]): string | undefined => {
  const ids = new Set<string>()
  for (const ref of refs) {
    if (typeof ref !== 'string') continue
    for (const id of ref.split(/\s+/)) if (id) ids.add(id)
  }
  return ids.size ? [...ids].join(' ') : undefined
}

export type KunFieldAttrsForward = 'aria' | 'control' | 'all'

// Where a form field's fallthrough attributes land when its root is a wrapper
// and not the control:
//   'aria'    — only `aria-*` move to the control. For a composite widget, whose
//               root keeps every other attribute exactly as before.
//   'control' — everything but `class` / `style` moves. For a native text
//               control: `autocomplete`, `spellcheck`, `enterkeyhint`, `id`,
//               listeners mean nothing on a <div>. Layout stays on the root —
//               downstream styles KunTextarea through it with
//               `[&_textarea]:border-0` and puts `flex-1` on it.
//   'all'     — everything moves, `class` included. KunInput has shipped that
//               way, and consumers style the <input> through it.
//
// `aria-describedby` is merged, not overridden: a later binding replaces an
// earlier one outright in Vue's attribute merge, so a consumer's own
// description id was being dropped whenever the field showed a message (and,
// bound as `undefined`, when it did not). React Aria's useField joins the two
// lists the same way.
export const useKunFieldAttrs = (options: {
  forward: KunFieldAttrsForward
  /** Id of the error / description element, while one is rendered. */
  messageId: () => string | undefined
  invalid?: () => boolean
}) => {
  const attrs = useAttrs()

  const toControl = (key: string) =>
    options.forward === 'all' ||
    (options.forward === 'aria'
      ? key.startsWith('aria-')
      : key !== 'class' && key !== 'style')

  const rootAttrs = (): Attrs => {
    const out: Attrs = {}
    for (const key in attrs) if (!toControl(key)) out[key] = attrs[key]
    return out
  }

  const controlAttrs = (): Attrs => {
    const out: Attrs = {}
    for (const key in attrs) if (toControl(key)) out[key] = attrs[key]
    out['aria-describedby'] = mergeIdRefs(options.messageId(), attrs['aria-describedby'])
    if (options.invalid?.()) out['aria-invalid'] = 'true'
    return out
  }

  /** The control's id: the consumer's when it is forwarded there, so a
   *  `<label for>` of theirs and the field's own label both find it. */
  const controlId = (fallback: string): string => {
    const id = options.forward === 'aria' ? undefined : attrs.id
    return typeof id === 'string' && id ? id : fallback
  }

  return { rootAttrs, controlAttrs, controlId }
}
