import type { KunCommandGroup, KunCommandItem } from '../components/types'

export interface KunCommandRow<T extends KunCommandItem> {
  item: T
  index: number
}

export interface KunCommandRowGroup<T extends KunCommandItem> {
  label?: string
  items: KunCommandRow<T>[]
}

export const commandItemKey = (item: KunCommandItem): string | number =>
  item.value ?? item.label

export const toCommandRows = <T extends KunCommandItem>(
  items: readonly T[] | readonly KunCommandGroup<T>[] | undefined
): KunCommandRowGroup<T>[] => {
  const raw = items ?? []
  if (!raw.length) return []
  const groups =
    'items' in (raw[0] as object)
      ? (raw as readonly KunCommandGroup<T>[])
      : [{ items: raw as readonly T[] }]
  let i = 0
  return groups
    .filter((g) => g.items.length > 0)
    .map((g) => ({
      label: g.label,
      items: g.items.map((item) => ({ item, index: i++ })),
    }))
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string
  )

export const createCommandHighlighter = (query: string, enabled: boolean) => {
  const terms = enabled
    ? query.trim().toLowerCase().split(/\s+/).filter(Boolean).map(escapeRegExp)
    : []
  const re = terms.length ? new RegExp(`(${terms.join('|')})`, 'gi') : null
  return (text: string): string =>
    re
      ? text
          .split(re)
          .map((part, i) =>
            i % 2
              ? `<mark class="bg-primary/20 text-foreground rounded-sm px-0.5">${escapeHtml(part)}</mark>`
              : escapeHtml(part)
          )
          .join('')
      : escapeHtml(text)
}
