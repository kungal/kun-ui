import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatKunChatMarkdown, parseKunChatMarkdown } from './markdown.ts'
import { normalizeKunChatEntities } from './entities.ts'
import type { KunChatEntity } from './types.ts'

const e = (type: KunChatEntity['type'], offset: number, length: number, extra = {}) =>
  ({ type, offset, length, ...extra }) as KunChatEntity

const parses = (source: string, text: string, entities: KunChatEntity[] = []) =>
  assert.deepEqual(parseKunChatMarkdown(source), { text, entities }, source)

test('every marker', () => {
  parses('**b**', 'b', [e('bold', 0, 1)])
  parses('__i__', 'i', [e('italic', 0, 1)])
  parses('++u++', 'u', [e('underline', 0, 1)])
  parses('~~s~~', 's', [e('strikethrough', 0, 1)])
  parses('||x||', 'x', [e('spoiler', 0, 1)])
  parses('`c`', 'c', [e('code', 0, 1)])
  parses('```go\nfmt.Println()\n```', 'fmt.Println()', [e('pre', 0, 13, { language: 'go' })])
  parses('[moyu](https://moyu.moe)', 'moyu', [e('text_link', 0, 4, { url: 'https://moyu.moe' })])
  parses('[@鲲](mention:42)', '@鲲', [e('mention', 0, 2, { user_id: '42' })])
  parses('> quoted', 'quoted', [e('blockquote', 0, 6)])
})

test('markers work inside words, which Chinese needs', () => {
  parses('这是**粗体**文字', '这是粗体文字', [e('bold', 2, 2)])
  parses('a__b__c', 'abc', [e('italic', 1, 1)])
})

test('nesting, and markers inside code staying literal', () => {
  parses('**a __b__ c**', 'a b c', [e('bold', 0, 5), e('italic', 2, 1)])
  parses('`a **b** c`', 'a **b** c', [e('code', 0, 9)])
  parses('**a `**` b**', 'a ** b', [e('bold', 0, 6), e('code', 2, 2)])
  parses('||[x](https://a)||', 'x', [e('spoiler', 0, 1), e('text_link', 0, 1, { url: 'https://a' })].sort(
    (a, b) => (a.type === 'text_link' ? -1 : b.type === 'text_link' ? 1 : 0)
  ))
})

test('what does not close stays text', () => {
  parses('**open', '**open')
  parses('a ** b', 'a ** b')
  parses('****', '****')
  parses('``', '``')
  parses('[no link]', '[no link]')
  parses('[x]()', '[x]()')
})

test('a marker is exactly two characters', () => {
  parses('***a***', '***a***')
  parses('~~~', '~~~')
})

test('pre blocks: language line, no language, and a one-line block', () => {
  parses('```\nplain\n```', 'plain', [e('pre', 0, 5)])
  parses('```inline```', 'inline', [e('pre', 0, 6)])
  parses('```hello world\ncode```', 'hello world\ncode', [e('pre', 0, 16)])
  // "go" alone on the first line with nothing after is content, not a language
  parses('```go\n```', 'go', [e('pre', 0, 2)])
  parses('see\n```js\nx\n```\nok', 'see\nx\nok', [e('pre', 4, 1, { language: 'js' })])
})

test('quote lines: consecutive lines are one quote', () => {
  parses('> a\n> b\nc', 'a\nb\nc', [e('blockquote', 0, 3)])
  parses('> a\n\n> b', 'a\n\nb', [e('blockquote', 0, 1), e('blockquote', 3, 1)])
  parses('> **a**', 'a', [e('blockquote', 0, 1), e('bold', 0, 1)])
  parses('\\> not a quote', '> not a quote')
  parses('a > b', 'a > b')
})

test('backslashes escape only what could be markup', () => {
  parses('\\*\\*not bold\\*\\*', '**not bold**')
  parses('C:\\Users\\kun', 'C:\\Users\\kun')
  parses('¯\\_(ツ)_/¯', '¯\\_(ツ)_/¯')
  parses('a\\_b', 'a\\_b')
  parses('\\`tick\\`', '`tick`')
  parses('\\\\**b**', '\\b', [e('bold', 1, 1)])
})

test('format writes back what parse reads', () => {
  const cases: [string, KunChatEntity[]][] = [
    ['plain', []],
    ['a*b', []],
    ['2**10', []],
    ['snake__case__name', []],
    ['C:\\Users', []],
    ['¯\\_(ツ)_/¯', []],
    ['> not a quote', []],
    ['[1] citation', []],
    ['bold', [e('bold', 0, 4)]],
    ['*star*', [e('bold', 1, 4)]],
    ['a`b', [e('code', 0, 3)]],
    ['x\\', [e('code', 0, 2)]],
    ['one\ntwo', [e('blockquote', 0, 7), e('bold', 4, 3)]],
    ['func() {}', [e('pre', 0, 9, { language: 'go' })]],
    ['```', [e('pre', 0, 3)]],
    ['a)b', [e('text_link', 0, 3, { url: 'https://x.com/a_(b)' })]],
    ['@kun', [e('mention', 0, 4, { user_id: '9' })]],
    ['[x]', [e('text_link', 0, 3, { url: 'https://a' })]],
  ]
  for (const [text, entities] of cases) {
    const source = formatKunChatMarkdown(text, entities)
    assert.deepEqual(
      parseKunChatMarkdown(source),
      { text, entities: normalizeKunChatEntities(text, entities) },
      `${JSON.stringify(text)} → ${JSON.stringify(source)}`
    )
  }
  assert.equal(formatKunChatMarkdown('plain', []), 'plain')
  assert.equal(formatKunChatMarkdown('bold', [e('bold', 0, 4)]), '**bold**')
})

test('a link label ending in a line break leaves the next line to the parser', () => {
  // The parser checks for `> ` and `\\>` after the label's `](…)`, where the
  // new line's text begins, so the writer escapes there too.
  const cases: [string, KunChatEntity[], string][] = [
    ['a\n\\>b', [e('mention', 1, 1, { user_id: '12' })], 'a[\n](mention:12)\\\\>b'],
    [
      ')\n>',
      [e('blockquote', 0, 1), e('blockquote', 1, 2), e('mention', 1, 1, { user_id: '12' })],
      '> )[\n](mention:12)\\>',
    ],
    ['a\n> b', [e('text_link', 0, 2, { url: 'https://a' })], '[a\n](https://a)\\> b'],
    // a quote that starts there is read as one
    ['a\nb', [e('mention', 0, 2, { user_id: '1' }), e('blockquote', 2, 1)], '[a\n](mention:1)> b'],
    // inside a quote the `> ` prefix sits in the label, and the check is spent
    ['x\n\\>y', [e('blockquote', 0, 5), e('mention', 0, 2, { user_id: '1' })], '> [x\n> ](mention:1)\\>y'],
  ]
  for (const [text, entities, source] of cases) {
    assert.equal(formatKunChatMarkdown(text, entities), source)
    const kept = normalizeKunChatEntities(text, entities).filter(
      (x) => !(x.type === 'blockquote' && x.offset === 1)
    )
    assert.deepEqual(parseKunChatMarkdown(source), { text, entities: kept }, source)
  }
})

test('format drops url entities and quotes that are not whole lines', () => {
  assert.equal(formatKunChatMarkdown('https://a.b', [e('url', 0, 11)]), 'https://a.b')
  assert.equal(formatKunChatMarkdown('a b', [e('blockquote', 2, 1)]), 'a b')
})

// Property: parse(format(m)) === m for every message the syntax can spell.

// mulberry32. The LCG this replaced, `seed * 1103515245 + 12345` in doubles,
// overflowed the 53-bit mantissa and cycled after about 10,000 draws, so the
// random tests replayed the same few hundred cases.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
// Every character the syntax treats specially, and a few it does not.
const CHARS = ['a', 'b', ' ', '\n', '\n', '中', '😀', '*', '_', '+', '~', '|', '`', '[', ']', '(', ')', '>', '\\', '\\', '#']
const INLINE: KunChatEntity['type'][] = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'spoiler',
  'code',
  'pre',
  'text_link',
  'mention',
]
const URLS = ['https://a', 'https://x/(y)', 'https://x/a\\)b', 'x)\\']
const LANGUAGES = [undefined, 'go', 'c++', 'objective-c']

const randomMessage = (r: () => number) => {
  const pick = <T>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)]!
  const text = Array.from({ length: Math.floor(r() * 24) }, () => pick(CHARS)).join('')
  const entities: KunChatEntity[] = []
  for (let n = Math.floor(r() * 7); n > 0; n--) {
    const offset = Math.floor(r() * (text.length + 1))
    const length = 1 + Math.floor(r() * 8)
    const type = pick(INLINE)
    entities.push(
      e(type, offset, length, {
        ...(type === 'text_link' ? { url: pick(URLS) } : {}),
        ...(type === 'mention' ? { user_id: String(1 + Math.floor(r() * 99)) } : {}),
        ...(type === 'pre' && pick(LANGUAGES) ? { language: pick(['go', 'c++', 'objective-c']) } : {}),
      })
    )
  }
  // Whole-line quotes, never on consecutive lines: what the syntax can spell.
  const lines = text.split('\n')
  let at = 0
  let lastQuoted = -2
  lines.forEach((line, i) => {
    if (line && i - lastQuoted > 1 && r() < 0.3) {
      entities.push(e('blockquote', at, line.length))
      lastQuoted = i
    }
    at += line.length + 1
  })
  return { text, entities }
}

test('parse(format(m)) returns m, normalized (random)', () => {
  const r = rng(20260927)
  for (let round = 0; round < 20000; round++) {
    const { text, entities } = randomMessage(r)
    const expected = normalizeKunChatEntities(text, entities)
    // Quotes that normalization cut down to fewer lines, or that became
    // neighbours of one another, fall outside what the syntax can spell.
    const quotes = expected.filter((q) => q.type === 'blockquote')
    const raw = expected.filter((x) => x.type === 'code' || x.type === 'pre')
    const textBreak = (i: number) =>
      text[i] === '\n' && !raw.some((x) => x.offset <= i && i < x.offset + x.length)
    const spellable = quotes.every((q, i) => {
      const end = q.offset + q.length
      const aligned =
        (q.offset === 0 || textBreak(q.offset - 1)) && (end === text.length || textBreak(end))
      const prev = quotes[i - 1]
      return aligned && !(prev && prev.offset + prev.length + 1 === q.offset)
    })
    if (!spellable) continue
    const source = formatKunChatMarkdown(text, entities)
    assert.deepEqual(
      parseKunChatMarkdown(source),
      { text, entities: expected },
      JSON.stringify({ text, entities, source })
    )
  }
})

test('format is stable over its own output (random)', () => {
  const r = rng(7)
  for (let round = 0; round < 5000; round++) {
    const { text, entities } = randomMessage(r)
    const once = parseKunChatMarkdown(formatKunChatMarkdown(text, entities))
    const twice = parseKunChatMarkdown(formatKunChatMarkdown(once.text, once.entities))
    assert.deepEqual(twice, once, JSON.stringify({ text, entities }))
  }
})

test('pathological input stays fast', () => {
  const nasty = '**`['.repeat(1024)
  const start = performance.now()
  parseKunChatMarkdown(nasty)
  assert.ok(performance.now() - start < 1000, `${performance.now() - start} ms`)
})
