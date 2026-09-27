import type { KunChatEntity, KunChatFormattedText } from './types.ts'
import { normalizeKunChatEntities } from './entities.ts'

// Composer shortcuts ↔ entities. The composer is a plain textarea: what the
// user types is parsed into `{ text, entities }` on send, and editing a sent
// message formats it back. `formatKunChatMarkdown` is the inverse of
// `parseKunChatMarkdown` — `parse(format(m))` returns `m` — for every message
// except the few shapes the syntax cannot spell, listed on `format` below.
//
// The syntax, all of it:
//
//   **bold**  __italic__  ++underline++  ~~strikethrough~~  ||spoiler||
//   `code`    ```lang⏎ pre ⏎```    [label](https://…)    [label](mention:42)
//   > quoted line (at the start of a line; consecutive lines form one quote)
//
// Markers work inside words — Chinese has no spaces to anchor them to — and
// only need non-empty content. A marker is exactly two characters: `***` is
// text, as in TDLib's parser. A marker without a partner stays literal text.
//
// Escaping. A run of k backslashes before a special character stands for
// ⌊k/2⌋ backslashes, and escapes that character when k is odd. Before
// anything else a backslash is literal. In text, ` [ ] are always special,
// and * _ + ~ | are special only next to their own twin (backslashes in
// between don't count) — a lone one can never be a marker, so `a\_b`,
// `C:\Users` and `¯\_(ツ)_/¯` keep their backslashes. Inside `code` and a pre
// block the only special character is `, inside a link target it is ). A line
// whose text starts with backslashes and then `>` loses one backslash: `\>`
// is how a line starts with a literal `>`.

const PAIRS: ReadonlyArray<readonly [string, KunChatEntity['type']]> = [
  ['**', 'bold'],
  ['__', 'italic'],
  ['++', 'underline'],
  ['~~', 'strikethrough'],
  ['||', 'spoiler'],
]
const PAIR_BY_TYPE = new Map(PAIRS.map(([m, t]) => [t, m]))
const PAIR_CHARS = new Set(['*', '_', '+', '~', '|'])
const TEXT_SPECIAL = new Set(['*', '_', '+', '~', '|', '`', '[', ']'])
const LANGUAGE = /^[A-Za-z0-9_+#.-]*$/
const MENTION = /^mention:(\d+)$/

const backslashRun = (s: string, i: number, end: number) => {
  let k = 0
  while (i + k < end && s[i + k] === '\\') k++
  return k
}

/** The nearest character from `i` in direction `step` that is not a
 *  backslash — the whole source, not just the current range, so a marker's
 *  neighbour counts. */
const nonBackslash = (s: string, i: number, step: 1 | -1) => {
  while (i >= 0 && i < s.length && s[i] === '\\') i += step
  return s[i]
}

/** At the backslash run starting at `i`: its length, and whether it is
 *  followed by a special character (and so escapes it when odd). The
 *  character after the run is read past `end`: a run that ends a range sits
 *  right before the range's closing marker, and the writer doubled it. */
const escapeAt = (s: string, i: number, end: number) => {
  const k = backslashRun(s, i, end)
  const j = i + k
  const c = s[j] ?? ''
  const special =
    c === '`' || c === '[' || c === ']'
      ? true
      : PAIR_CHARS.has(c) && (nonBackslash(s, i - 1, -1) === c || nonBackslash(s, j + 1, 1) === c)
  return { k, c, special }
}

/** Where scanning resumes after the backslash run at `i`. */
const skipEscape = (s: string, i: number, end: number) => {
  const { k, special } = escapeAt(s, i, end)
  return i + (special && k % 2 === 1 && i + k < end ? k + 1 : k)
}


interface RawSpan {
  /** Index just past the closing marker. */
  end: number
  contentStart: number
  contentEnd: number
  language?: string
}

/** The next unescaped `closer` at or after `from`, in a raw context whose
 *  only special character is `special`; -1 when there is none. */
const findRawCloser = (
  s: string,
  from: number,
  end: number,
  closer: string,
  special: string
): number => {
  let p = from
  while (p < end) {
    if (s[p] === '\\') {
      const k = backslashRun(s, p, end)
      p += s[p + k] === special && k % 2 === 1 ? k + 1 : k
      continue
    }
    if (p + closer.length <= end && s.startsWith(closer, p)) return p
    p++
  }
  return -1
}

/** Undo raw-context escaping: backslash runs before `special` halve. A run
 *  at the very end counts as before `special` when the closer follows it. */
const unescapeRaw = (s: string, special: string, closerFollows: boolean): string => {
  let out = ''
  let p = 0
  while (p < s.length) {
    if (s[p] !== '\\') {
      out += s[p]
      p++
      continue
    }
    const k = backslashRun(s, p, s.length)
    const next = p + k < s.length ? s[p + k] : closerFollows ? special : ''
    if (next !== special) {
      out += '\\'.repeat(k)
      p += k
    } else if (k % 2 === 1) {
      out += '\\'.repeat((k - 1) / 2) + special
      p += k + 1
    } else {
      out += '\\'.repeat(k / 2)
      p += k
    }
  }
  return out
}

const matchCode = (s: string, i: number, end: number): RawSpan | null => {
  if (s[i] !== '`') return null
  const close = findRawCloser(s, i + 1, end, '`', '`')
  if (close <= i + 1) return null
  return { end: close + 1, contentStart: i + 1, contentEnd: close }
}

const matchPre = (s: string, i: number, end: number): RawSpan | null => {
  if (!s.startsWith('```', i)) return null
  const open = i + 3
  const close = findRawCloser(s, open, end, '```', '`')
  if (close < 0) return null
  const trimEnd = (from: number) =>
    close > from && s[close - 1] === '\n' ? close - 1 : close
  const nl = s.indexOf('\n', open)
  if (nl >= 0 && nl < close && LANGUAGE.test(s.slice(open, nl))) {
    const contentEnd = trimEnd(nl + 1)
    if (contentEnd > nl + 1) {
      const language = s.slice(open, nl) || undefined
      return { end: close + 3, contentStart: nl + 1, contentEnd, language }
    }
    // "```go⏎```" is a block whose one line is "go", not an empty Go block.
  }
  const contentEnd = trimEnd(open)
  if (contentEnd <= open) return null
  return { end: close + 3, contentStart: open, contentEnd }
}

interface LinkSpan {
  end: number
  labelStart: number
  labelEnd: number
  target: string
}

const matchLink = (s: string, i: number, end: number): LinkSpan | null => {
  if (s[i] !== '[') return null
  let p = i + 1
  while (p < end) {
    if (s[p] === '\\') {
      p = skipEscape(s, p, end)
      continue
    }
    // A later `[` owns the `](` we would find: this one is literal text.
    if (s[p] === '[') return null
    if (s[p] === ']' && s[p + 1] === '(') {
      if (p === i + 1) return null
      const close = findRawCloser(s, p + 2, end, ')', ')')
      if (close <= p + 2) return null
      return {
        end: close + 1,
        labelStart: i + 1,
        labelEnd: p,
        target: unescapeRaw(s.slice(p + 2, close), ')', true),
      }
    }
    const raw = matchPre(s, p, end) ?? matchCode(s, p, end)
    p = raw ? raw.end : p + 1
  }
  return null
}

/** Length of the run of `s[i]` starting at `i`. */
const charRun = (s: string, i: number, end: number) => {
  let k = 1
  while (i + k < end && s[i + k] === s[i]) k++
  return k
}

const findPairCloser = (s: string, from: number, end: number, marker: string) => {
  let p = from
  while (p < end) {
    if (s[p] === '\\') {
      p = skipEscape(s, p, end)
      continue
    }
    if (PAIR_CHARS.has(s[p]!)) {
      const run = charRun(s, p, end)
      if (run === 2 && p > from && s.startsWith(marker, p)) return p
      p += run
      continue
    }
    // Code, pre blocks and links are opaque: a marker inside one of them
    // cannot close a pair that started outside.
    const atom = matchPre(s, p, end) ?? matchCode(s, p, end) ?? matchLink(s, p, end)
    p = atom ? atom.end : p + 1
  }
  return -1
}

/**
 * Parse composer input into message text and entities. Never throws: input
 * that is not valid shortcut syntax stays literal text.
 */
export const parseKunChatMarkdown = (source: string): KunChatFormattedText => {
  let text = ''
  const entities: KunChatEntity[] = []
  const quotedLines: [number, number][] = []
  let atLineStart = true
  let lineQuoted = false
  let lineOffset = 0

  const endLine = () => {
    if (lineQuoted) quotedLines.push([lineOffset, text.length])
  }

  const parseRange = (start: number, end: number) => {
    let i = start
    while (i < end) {
      if (atLineStart) {
        atLineStart = false
        lineOffset = text.length
        lineQuoted = false
        if (i + 2 <= end && source.startsWith('> ', i)) {
          lineQuoted = true
          i += 2
        } else if (source[i] === '>' && (i + 1 === end || source[i + 1] === '\n')) {
          lineQuoted = true
          i += 1
        }
        if (source[i] === '\\' && source[i + backslashRun(source, i, end)] === '>') i += 1
        continue
      }

      const c = source[i]!
      if (c === '\\') {
        const { k, c: next, special } = escapeAt(source, i, end)
        if (!special) {
          text += '\\'.repeat(k)
          i += k
        } else if (k % 2 === 1 && i + k < end) {
          text += '\\'.repeat((k - 1) / 2) + next
          i += k + 1
        } else {
          text += '\\'.repeat(k / 2)
          i += k
        }
        continue
      }

      if (c === '\n') {
        endLine()
        text += '\n'
        atLineStart = true
        i++
        continue
      }

      const raw = matchPre(source, i, end)
      const code = raw ? null : matchCode(source, i, end)
      const span = raw ?? code
      if (span) {
        const offset = text.length
        text += unescapeRaw(
          source.slice(span.contentStart, span.contentEnd),
          '`',
          source[span.contentEnd] === '`'
        )
        const entity: KunChatEntity = {
          type: raw ? 'pre' : 'code',
          offset,
          length: text.length - offset,
        }
        if (span.language) entity.language = span.language
        entities.push(entity)
        i = span.end
        continue
      }

      const link = matchLink(source, i, end)
      if (link) {
        const offset = text.length
        parseRange(link.labelStart, link.labelEnd)
        const length = text.length - offset
        const mention = link.target.match(MENTION)
        if (length > 0) {
          entities.push(
            mention
              ? { type: 'mention', offset, length, user_id: mention[1] }
              : { type: 'text_link', offset, length, url: link.target }
          )
        }
        i = link.end
        continue
      }

      if (PAIR_CHARS.has(c)) {
        // Exactly two: `***` or `****` is not a marker, it is text.
        const run = charRun(source, i, end)
        if (run !== 2) {
          text += c.repeat(run)
          i += run
          continue
        }
        const [marker, type] = PAIRS.find(([m]) => m[0] === c)!
        const close = findPairCloser(source, i + 2, end, marker)
        if (close > i + 2) {
          const offset = text.length
          parseRange(i + 2, close)
          const length = text.length - offset
          if (length > 0) entities.push({ type, offset, length })
          i = close + 2
        } else {
          text += marker
          i += 2
        }
        continue
      }

      text += c
      i++
    }
  }

  parseRange(0, source.length)
  endLine()

  // Consecutive quoted lines form one quote, the line breaks between included.
  for (let q = 0; q < quotedLines.length; q++) {
    const start = quotedLines[q]![0]
    let end = quotedLines[q]![1]
    while (q + 1 < quotedLines.length && quotedLines[q + 1]![0] === end + 1) {
      end = quotedLines[++q]![1]
    }
    if (end > start) entities.push({ type: 'blockquote', offset: start, length: end - start })
  }

  return { text, entities: normalizeKunChatEntities(text, entities) }
}


type Context = 'text' | 'code' | 'pre' | 'url'

interface LitAtom {
  kind: 'lit'
  ch: string
  ctx: Context
  /** Inside a link label, where a literal `[` must be escaped. */
  inLabel: boolean
  escape: boolean
}
interface MarkAtom {
  kind: 'mark'
  s: string
}
type Atom = LitAtom | MarkAtom

interface FormatNode {
  entity: KunChatEntity | null
  start: number
  end: number
  children: FormatNode[]
}

/**
 * Turn message text + entities back into composer input — for editing a sent
 * message, or restoring a draft. Parsing the result gives back the same text
 * and (normalized) entities, except for what the syntax cannot spell:
 *
 * - `url` entities are dropped; the server detects links again on save.
 * - A blockquote is dropped unless it starts and ends at line breaks that
 *   are text — not inside a code span or pre block.
 * - Blockquotes on consecutive lines are written, and come back, as one.
 * - A `pre` language with characters outside `A-Z a-z 0-9 _ + # . -` is
 *   dropped, as is a `text_link` whose URL is itself `mention:<digits>`.
 */
export const formatKunChatMarkdown = (
  text: string,
  entities: readonly KunChatEntity[] | null | undefined
): string => {
  // A quote is spelled as `> ` lines, so it needs a line break on each side
  // that the parser reads as text — not one inside a code span or pre block.
  // Quotes that cannot be spelled go, and the rest is normalized again from
  // the original entities, so whatever those quotes had cut apart joins up.
  const withoutUrls = (entities ?? []).filter((e) => e.type !== 'url')
  const first = normalizeKunChatEntities(text, withoutUrls)
  const inRaw = (i: number) =>
    first.some((r) => (r.type === 'code' || r.type === 'pre') && r.offset <= i && i < r.offset + r.length)
  const breakAt = (i: number) => text[i] === '\n' && !inRaw(i)
  const quotes: KunChatEntity[] = []
  for (const q of first) {
    if (q.type !== 'blockquote') continue
    const end = q.offset + q.length
    if (!(q.offset === 0 || breakAt(q.offset - 1)) || !(end === text.length || breakAt(end))) continue
    const prev = quotes[quotes.length - 1]
    if (prev && prev.offset + prev.length + 1 === q.offset) prev.length = end - prev.offset
    else quotes.push({ ...q })
  }
  const list = normalizeKunChatEntities(text, [
    ...withoutUrls.filter((e) => e.type !== 'blockquote'),
    ...quotes,
  ])

  const root: FormatNode = { entity: null, start: 0, end: text.length, children: [] }
  const stack: FormatNode[] = [root]
  for (const entity of list) {
    const node: FormatNode = {
      entity,
      start: entity.offset,
      end: entity.offset + entity.length,
      children: [],
    }
    while (stack.length > 1 && stack[stack.length - 1]!.end <= node.start) stack.pop()
    stack[stack.length - 1]!.children.push(node)
    stack.push(node)
  }

  const atoms: Atom[] = []
  const mark = (s: string) => atoms.push({ kind: 'mark', s })
  const lit = (ch: string, ctx: Context, inLabel: boolean) =>
    atoms.push({ kind: 'lit', ch, ctx, inLabel, escape: false })
  let quoteDepth = 0

  const emitText = (from: number, to: number, inLabel: boolean) => {
    for (let i = from; i < to; i++) {
      lit(text[i]!, 'text', inLabel)
      // A normalized quote never ends in a line break, so every break inside
      // one is followed by another quoted line.
      if (text[i] === '\n' && quoteDepth > 0) mark('> ')
    }
  }
  const emitRaw = (from: number, to: number, ctx: Context) => {
    for (let i = from; i < to; i++) lit(text[i]!, ctx, false)
  }

  const walk = (node: FormatNode, inLabel: boolean) => {
    let cursor = node.start
    for (const child of node.children) {
      emitText(cursor, child.start, inLabel)
      emitEntity(child, inLabel)
      cursor = child.end
    }
    emitText(cursor, node.end, inLabel)
  }

  const emitEntity = (node: FormatNode, inLabel: boolean) => {
    const e = node.entity!
    const pair = PAIR_BY_TYPE.get(e.type)
    if (pair) {
      mark(pair)
      walk(node, inLabel)
      mark(pair)
    } else if (e.type === 'code') {
      mark('`')
      emitRaw(node.start, node.end, 'code')
      mark('`')
    } else if (e.type === 'pre') {
      const language = e.language && LANGUAGE.test(e.language) ? e.language : ''
      mark(`\`\`\`${language}\n`)
      emitRaw(node.start, node.end, 'pre')
      mark('\n```')
    } else if (e.type === 'text_link' || e.type === 'mention') {
      mark('[')
      walk(node, true)
      mark('](')
      const target = e.type === 'mention' ? `mention:${e.user_id}` : e.url!
      for (const ch of target) lit(ch, 'url', false)
      mark(')')
    } else if (e.type === 'blockquote') {
      mark('> ')
      quoteDepth++
      walk(node, inLabel)
      quoteDepth--
    } else {
      walk(node, inLabel)
    }
  }

  walk(root, false)
  return serialize(atoms)
}

const isLit = (a: Atom | undefined, ch: string, ctx: Context): a is LitAtom =>
  a?.kind === 'lit' && a.ch === ch && a.ctx === ctx

const firstChar = (a: Atom | undefined) =>
  a === undefined ? undefined : a.kind === 'mark' ? a.s[0] : a.ch

/** The first character after atom `from` that is not a backslash, as it
 *  will be written. */
const rawCharFrom = (atoms: Atom[], from: number): string | undefined => {
  for (let i = from; i < atoms.length; i++) {
    const a = atoms[i]!
    if (a.kind === 'mark') {
      const c = [...a.s].find((ch) => ch !== '\\')
      if (c !== undefined) return c
    } else if (a.escape || a.ch !== '\\') {
      return a.ch
    }
  }
  return undefined
}

const lastNonBackslash = (out: string) => {
  let i = out.length - 1
  while (i >= 0 && out[i] === '\\') i--
  return out[i]
}

/** Whether a backslash run written before atom `j` would be read as an
 *  escape — mirrors the parser's `escapeAt` — in which case it is doubled. */
const beforeSpecial = (atoms: Atom[], j: number, ctx: Context, out: string): boolean => {
  const next = atoms[j]
  if (next === undefined) return false
  if (next.kind === 'lit' && next.escape) return true
  const c = next.kind === 'mark' ? next.s[0]! : next.ch
  if (ctx !== 'text') return c === (ctx === 'url' ? ')' : '`')
  if (next.kind === 'mark') return TEXT_SPECIAL.has(c)
  if (c === '`' || c === '[' || c === ']') return true
  return PAIR_CHARS.has(c) && (lastNonBackslash(out) === c || rawCharFrom(atoms, j + 1) === c)
}

/** Where the parser checks for a quote prefix and a leading `>`. */
const atTextLineStart = (out: string) =>
  out === '' || out.endsWith('\n') || out === '> ' || out.endsWith('\n> ')

const serialize = (atoms: Atom[]): string => {
  // Which literals need a backslash.
  atoms.forEach((a, i) => {
    if (a.kind !== 'lit') return
    const prev = atoms[i - 1]
    const next = atoms[i + 1]
    if (a.ctx === 'text') {
      if (PAIR_CHARS.has(a.ch)) {
        // No two active copies of a pair character may touch, or they would
        // read as a marker.
        const prevActive =
          prev?.kind === 'mark'
            ? prev.s.endsWith(a.ch)
            : prev !== undefined && !prev.escape && prev.ch === a.ch
        a.escape = prevActive || firstChar(next) === a.ch
      } else if (a.ch === '`') {
        a.escape = true
      } else if (a.ch === '[') {
        a.escape = a.inLabel
      } else if (a.ch === ']') {
        a.escape = next?.kind === 'lit' && next.ch === '('
      }
    } else if (a.ctx === 'code') {
      a.escape = a.ch === '`'
    } else if (a.ctx === 'url') {
      a.escape = a.ch === ')'
    } else if (a.ch === '`') {
      // In a pre block only three backticks in a row can close it.
      let s = i
      while (isLit(atoms[s - 1], '`', 'pre')) s--
      let e = i
      while (isLit(atoms[e + 1], '`', 'pre')) e++
      a.escape = e - s + 1 >= 3
    }
  })

  let out = ''
  let i = 0
  while (i < atoms.length) {
    const a = atoms[i]!
    if (a.kind === 'mark') {
      out += a.s
      i++
      continue
    }
    if (a.ctx === 'text' && atTextLineStart(out)) {
      let j = i
      while (isLit(atoms[j], '\\', 'text')) j++
      if (isLit(atoms[j], '>', 'text')) out += '\\'
    }
    if (a.ch === '\\') {
      let j = i
      while (isLit(atoms[j], '\\', a.ctx)) j++
      out += '\\'.repeat(beforeSpecial(atoms, j, a.ctx, out) ? 2 * (j - i) : j - i)
      i = j
      continue
    }
    out += a.escape ? `\\${a.ch}` : a.ch
    i++
  }
  return out
}
