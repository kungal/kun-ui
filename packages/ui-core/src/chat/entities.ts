import type { KunChatEntity, KunChatEntityType } from './types.ts'

// Entities → a render tree. This file is the specification the Flutter port
// copies line for line, so every rule is spelled out and none depends on a
// JavaScript quirk: offsets are UTF-16 code units, which is what both
// `String.prototype.slice` and Dart's `String.substring` index.

const KNOWN_TYPES: ReadonlySet<string> = new Set<KunChatEntityType>([
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'spoiler',
  'code',
  'pre',
  'blockquote',
  'text_link',
  'mention',
  'url',
])

/** Types whose content is literal: nothing may nest inside them. */
const LEAF_TYPES: ReadonlySet<string> = new Set(['code', 'pre'])

/** Types rendered as links. A link inside a link is invalid HTML (`<a>` in
 *  `<a>`), so the inner one is dropped. */
const LINK_TYPES: ReadonlySet<string> = new Set(['text_link', 'mention', 'url'])

/** Types that break the line around themselves. */
export const KUN_CHAT_BLOCK_ENTITY_TYPES: ReadonlySet<string> = new Set([
  'pre',
  'blockquote',
])

// Tie-break for entities covering the exact same range: the earlier type is
// the outer one. Blocks outermost, links outside formatting (a link keeps its
// whole styled label clickable), code innermost.
const NESTING_ORDER: readonly KunChatEntityType[] = [
  'blockquote',
  'pre',
  'text_link',
  'mention',
  'url',
  'spoiler',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
]
const rank = (type: string) => NESTING_ORDER.indexOf(type as KunChatEntityType)

const isHighSurrogate = (code: number) => code >= 0xd800 && code <= 0xdbff
const isLowSurrogate = (code: number) => code >= 0xdc00 && code <= 0xdfff

/** Whether `index` falls between the two halves of a surrogate pair. */
const splitsPair = (text: string, index: number) =>
  index > 0 &&
  index < text.length &&
  isHighSurrogate(text.charCodeAt(index - 1)) &&
  isLowSurrogate(text.charCodeAt(index))

interface Range {
  entity: KunChatEntity
  start: number
  end: number
}

const compareRanges = (a: Range, b: Range) =>
  a.start - b.start || b.end - a.end || rank(a.entity.type) - rank(b.entity.type)

const cleanEntity = (e: KunChatEntity, offset: number, length: number): KunChatEntity => {
  const out: KunChatEntity = { type: e.type, offset, length }
  if (e.type === 'mention') out.user_id = e.user_id
  if (e.type === 'text_link') out.url = e.url
  if (e.type === 'pre' && e.language) out.language = e.language
  return out
}

/** Inline formatting: no link, no block, no literal content. Touching runs of
 *  one type are one run, and a line break at either end draws nothing. */
const FORMAT_TYPES: ReadonlySet<string> = new Set([
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'spoiler',
])

const mergeTouching = (ranges: Range[]): Range[] => {
  const out: Range[] = []
  const last = new Map<string, Range>()
  for (const r of [...ranges].sort(compareRanges)) {
    const prev = FORMAT_TYPES.has(r.entity.type) ? last.get(r.entity.type) : undefined
    if (prev && r.start <= prev.end) {
      prev.end = Math.max(prev.end, r.end)
      continue
    }
    out.push(r)
    if (FORMAT_TYPES.has(r.entity.type)) last.set(r.entity.type, r)
  }
  return out
}

// A quote is a block, so it must sit outside every inline entity: anything
// that straddles a quote boundary is cut there. `quotes` must be the quotes
// that survive nesting: cutting at one that is later dropped leaves a cut
// with no cause, which the next pass merges away.
const splitAtQuotes = (ranges: Range[], quotes: Range[]): Range[] => {
  const cuts = quotes.flatMap((r) => [r.start, r.end])
  return ranges.flatMap((r) => {
    const inner = cuts.filter((c) => c > r.start && c < r.end).sort((a, b) => a - b)
    const points = [r.start, ...new Set(inner), r.end]
    return points.slice(1).map((end, i) => ({ entity: r.entity, start: points[i]!, end }))
  })
}

/**
 * Make an entity list safe to render, without ever changing `text`:
 *
 * 1. Drop unknown types, non-integer or negative positions, empty ranges, a
 *    `text_link` without a `url` and a `mention` without a `user_id`; clamp
 *    the end to the text. Widen a range that would cut a surrogate pair (an
 *    emoji) in half. Pull a blockquote's end in over trailing line breaks.
 * 2. Merge touching or overlapping runs of one inline format (bold, italic,
 *    underline, strikethrough, spoiler).
 * 3. Settle the blockquotes among themselves (steps 5 and 6, quotes only),
 *    then cut every other entity at the boundaries of a quote that survived,
 *    so quotes are always outermost.
 * 4. Pull the ends of an inline format in over line breaks, which draw
 *    nothing there (a blockquote's end, before step 3).
 * 5. Order by start, then longer first, then by nesting order; split an
 *    entity that partially crosses another at the boundary, so every pair
 *    nests or is disjoint.
 * 6. Drop what cannot nest: anything inside `code`/`pre`, a type inside the
 *    same type, a link inside a link.
 *
 * The result is a fixed point: normalizing it again changes nothing. The
 * server already guarantees most of this; the client does it anyway so a bad
 * row renders instead of throwing.
 */
export const normalizeKunChatEntities = (
  text: string,
  entities: readonly KunChatEntity[] | null | undefined
): KunChatEntity[] => {
  if (!entities?.length || !text) return []

  let ranges: Range[] = []
  for (const e of entities) {
    if (!e || !KNOWN_TYPES.has(e.type)) continue
    if (!Number.isInteger(e.offset) || !Number.isInteger(e.length)) continue
    if (e.offset < 0 || e.length <= 0) continue
    if (e.type === 'text_link' && (typeof e.url !== 'string' || !e.url)) continue
    if (e.type === 'mention' && (typeof e.user_id !== 'string' || !e.user_id)) continue
    let start = e.offset
    let end = Math.min(e.offset + e.length, text.length)
    if (start >= end) continue
    if (splitsPair(text, start)) start -= 1
    if (splitsPair(text, end)) end += 1
    // Before the cuts below, which must see the quote's final boundaries.
    if (e.type === 'blockquote') while (end > start && text[end - 1] === '\n') end--
    if (start < end) ranges.push({ entity: e, start, end })
  }

  // Every piece made from here on, the crossing splits included, is trimmed,
  // or normalizing twice would trim what the first pass left.
  const trimmed = (r: Range) => {
    if (FORMAT_TYPES.has(r.entity.type)) {
      while (r.start < r.end && text[r.start] === '\n') r.start++
      while (r.end > r.start && text[r.end - 1] === '\n') r.end--
    }
    return r.start < r.end
  }
  const nest = (ranges: Range[]): Range[] => {
    const queue = ranges.filter(trimmed).sort(compareRanges)
    const enqueue = (r: Range) => {
      let i = 0
      while (i < queue.length && compareRanges(queue[i]!, r) <= 0) i++
      queue.splice(i, 0, r)
    }

    const out: Range[] = []
    const stack: Range[] = []
    while (queue.length) {
      const r = queue.shift()!
      while (stack.length && stack[stack.length - 1]!.end <= r.start) stack.pop()
      const parent = stack[stack.length - 1]
      if (parent && r.end > parent.end) {
        // Crosses the parent's end: keep the part inside, requeue the rest.
        const rest: Range = { entity: r.entity, start: parent.end, end: r.end }
        if (trimmed(rest)) enqueue(rest)
        r.end = parent.end
        if (!trimmed(r)) continue
        // Shorter now, it may sort after entities still waiting.
        if (queue.length && compareRanges(r, queue[0]!) > 0) {
          enqueue(r)
          continue
        }
      }
      const blocked = stack.some(
        (a) =>
          LEAF_TYPES.has(a.entity.type) ||
          a.entity.type === r.entity.type ||
          (LINK_TYPES.has(a.entity.type) && LINK_TYPES.has(r.entity.type))
      )
      if (blocked) continue
      stack.push(r)
      out.push(r)
    }
    return out
  }

  // Everything else is cut at the quotes' boundaries, so only a quote can
  // hold a quote: nesting the quotes alone settles which ones survive.
  const quotes = nest(ranges.filter((r) => r.entity.type === 'blockquote'))
  const inline = mergeTouching(ranges.filter((r) => r.entity.type !== 'blockquote'))
  const out = nest([...quotes, ...splitAtQuotes(inline, quotes)])

  return out.map((r) => cleanEntity(r.entity, r.start, r.end - r.start))
}

export interface KunChatTextLeaf {
  kind: 'text'
  text: string
  /** Where `text` starts in the message text, in UTF-16 code units. */
  offset: number
}

export interface KunChatEntityNode {
  kind: 'entity'
  entity: KunChatEntity
  children: KunChatTextNode[]
}

export type KunChatTextNode = KunChatTextLeaf | KunChatEntityNode

const isBlock = (node: KunChatTextNode | undefined) =>
  node?.kind === 'entity' && KUN_CHAT_BLOCK_ENTITY_TYPES.has(node.entity.type)

// A block (pre, blockquote) already starts and ends a line, so the `\n` that
// separates it from the surrounding text would render as an extra blank line.
// Drop exactly one line break on each side — the text keeps it; only the tree
// omits it.
const trimAroundBlocks = (nodes: KunChatTextNode[]): KunChatTextNode[] => {
  const out: KunChatTextNode[] = []
  nodes.forEach((node, i) => {
    if (node.kind === 'entity') {
      out.push({ ...node, children: trimAroundBlocks(node.children) })
      return
    }
    let { text, offset } = node
    if (isBlock(nodes[i - 1]) && text.startsWith('\n')) {
      text = text.slice(1)
      offset += 1
    }
    if (isBlock(nodes[i + 1]) && text.endsWith('\n')) text = text.slice(0, -1)
    if (text) out.push({ kind: 'text', text, offset })
  })
  return out
}

/**
 * Turn `text` + `entities` into a tree: entity nodes whose children are text
 * leaves and nested entity nodes, in document order. The entities are
 * normalized first (see `normalizeKunChatEntities`), so any input renders.
 */
export const buildKunChatEntityTree = (
  text: string,
  entities: readonly KunChatEntity[] | null | undefined
): KunChatTextNode[] => {
  const root: KunChatEntityNode = {
    kind: 'entity',
    entity: { type: 'bold', offset: 0, length: text.length },
    children: [],
  }
  const stack: { node: KunChatEntityNode; end: number; cursor: number }[] = [
    { node: root, end: text.length, cursor: 0 },
  ]
  const flushTo = (frame: (typeof stack)[number], to: number) => {
    if (to > frame.cursor) {
      frame.node.children.push({
        kind: 'text',
        text: text.slice(frame.cursor, to),
        offset: frame.cursor,
      })
    }
    frame.cursor = Math.max(frame.cursor, to)
  }
  const close = () => {
    const frame = stack.pop()!
    flushTo(frame, frame.end)
    stack[stack.length - 1]!.cursor = frame.end
  }

  for (const entity of normalizeKunChatEntities(text, entities)) {
    const start = entity.offset
    while (stack.length > 1 && stack[stack.length - 1]!.end <= start) close()
    const parent = stack[stack.length - 1]!
    flushTo(parent, start)
    const node: KunChatEntityNode = { kind: 'entity', entity, children: [] }
    parent.node.children.push(node)
    stack.push({ node, end: start + entity.length, cursor: start })
  }
  while (stack.length > 1) close()
  flushTo(stack[0]!, text.length)

  return trimAroundBlocks(root.children)
}

/** The plain text of a subtree, as rendered (block-adjacent breaks omitted). */
export const kunChatTreeText = (nodes: readonly KunChatTextNode[]): string =>
  nodes
    .map((n) => (n.kind === 'text' ? n.text : kunChatTreeText(n.children)))
    .join('')

/**
 * The part of a message from `start` to `end` (UTF-16 code units), with the
 * entities clipped to it and shifted to start at 0 — what a partial quote
 * carries. The range is widened rather than split through an emoji.
 */
export const sliceKunChatEntities = (
  text: string,
  entities: readonly KunChatEntity[] | null | undefined,
  start: number,
  end: number
): { text: string; entities: KunChatEntity[] } => {
  let from = Math.max(0, Math.min(start, text.length))
  let to = Math.max(from, Math.min(end, text.length))
  if (splitsPair(text, from)) from -= 1
  if (splitsPair(text, to)) to += 1
  const clipped = normalizeKunChatEntities(text, entities).flatMap((e) => {
    const s = Math.max(e.offset, from)
    const t = Math.min(e.offset + e.length, to)
    return t > s ? [{ ...e, offset: s - from, length: t - s }] : []
  })
  const sliced = text.slice(from, to)
  return { text: sliced, entities: normalizeKunChatEntities(sliced, clipped) }
}
