import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildKunChatEntityTree,
  kunChatTreeText,
  normalizeKunChatEntities,
  sliceKunChatEntities,
  type KunChatTextNode,
} from './entities.ts'
import type { KunChatEntity } from './types.ts'

// Compact rendering of a tree: text as-is, entities as <type>…</type>.
const show = (nodes: KunChatTextNode[]): string =>
  nodes
    .map((n) =>
      n.kind === 'text' ? n.text : `<${n.entity.type}>${show(n.children)}</${n.entity.type}>`
    )
    .join('')

const e = (type: KunChatEntity['type'], offset: number, length: number, extra = {}) =>
  ({ type, offset, length, ...extra }) as KunChatEntity

test('no entities: one text leaf, or nothing for empty text', () => {
  assert.deepEqual(buildKunChatEntityTree('hello', null), [
    { kind: 'text', text: 'hello', offset: 0 },
  ])
  assert.deepEqual(buildKunChatEntityTree('hello', []), [
    { kind: 'text', text: 'hello', offset: 0 },
  ])
  assert.deepEqual(buildKunChatEntityTree('', [e('bold', 0, 3)]), [])
})

test('flat, nested and adjacent entities', () => {
  assert.equal(show(buildKunChatEntityTree('abcdef', [e('bold', 1, 2)])), 'a<bold>bc</bold>def')
  assert.equal(
    show(buildKunChatEntityTree('abcdef', [e('italic', 2, 1), e('bold', 0, 4)])),
    '<bold>ab<italic>c</italic>d</bold>ef'
  )
  assert.equal(
    show(buildKunChatEntityTree('abcdef', [e('bold', 0, 3), e('italic', 3, 3)])),
    '<bold>abc</bold><italic>def</italic>'
  )
})

test('text leaves carry their offset into the message text', () => {
  const tree = buildKunChatEntityTree('ab cd', [e('bold', 3, 2)])
  assert.deepEqual(tree[0], { kind: 'text', text: 'ab ', offset: 0 })
  const bold = tree[1]
  assert.ok(bold?.kind === 'entity')
  assert.deepEqual(bold.children[0], { kind: 'text', text: 'cd', offset: 3 })
})

test('identical ranges nest by a fixed order: links outside formatting', () => {
  const tree = buildKunChatEntityTree('link', [
    e('bold', 0, 4),
    e('text_link', 0, 4, { url: 'https://moyu.moe' }),
  ])
  assert.equal(show(tree), '<text_link><bold>link</bold></text_link>')
})

test('offsets are UTF-16 code units; a cut surrogate pair is widened', () => {
  const text = 'a😀b' // 😀 is two code units, indices 1–2
  assert.equal(show(buildKunChatEntityTree(text, [e('bold', 1, 2)])), 'a<bold>😀</bold>b')
  assert.equal(show(buildKunChatEntityTree(text, [e('bold', 2, 1)])), 'a<bold>😀</bold>b')
  assert.equal(show(buildKunChatEntityTree(text, [e('bold', 0, 2)])), '<bold>a😀</bold>b')
})

test('invalid entities are dropped or clamped, never thrown on', () => {
  const text = 'abc'
  assert.deepEqual(
    normalizeKunChatEntities(text, [
      e('bold', -1, 2),
      e('bold', 1, 0),
      e('bold', 5, 1),
      e('bold', 1.5, 1),
      { type: 'marquee', offset: 0, length: 1 } as unknown as KunChatEntity,
      e('text_link', 0, 1),
      e('mention', 0, 1),
    ]),
    []
  )
  assert.deepEqual(normalizeKunChatEntities(text, [e('italic', 1, 99)]), [e('italic', 1, 2)])
})

test('a crossing entity is split at the boundary it crosses', () => {
  assert.deepEqual(normalizeKunChatEntities('abcdefgh', [e('bold', 0, 5), e('italic', 3, 5)]), [
    e('bold', 0, 5),
    e('italic', 3, 2),
    e('italic', 5, 3),
  ])
  assert.equal(
    show(buildKunChatEntityTree('abcdefgh', [e('bold', 0, 5), e('italic', 3, 5)])),
    '<bold>abc<italic>de</italic></bold><italic>fgh</italic>'
  )
})

test('what cannot nest is dropped', () => {
  // inside code
  assert.deepEqual(normalizeKunChatEntities('abcd', [e('code', 0, 4), e('bold', 1, 2)]), [
    e('code', 0, 4),
  ])
  // a link inside a link
  assert.deepEqual(
    normalizeKunChatEntities('abcd', [
      e('text_link', 0, 4, { url: 'https://a' }),
      e('mention', 1, 2, { user_id: '7' }),
    ]),
    [e('text_link', 0, 4, { url: 'https://a' })]
  )
  // a type inside itself (quote in quote)
  assert.deepEqual(
    normalizeKunChatEntities('abcd', [e('blockquote', 0, 4), e('blockquote', 1, 2)]),
    [e('blockquote', 0, 4)]
  )
})

test('touching or overlapping runs of one format merge', () => {
  assert.deepEqual(normalizeKunChatEntities('abcdef', [e('bold', 0, 3), e('bold', 3, 3)]), [
    e('bold', 0, 6),
  ])
  assert.deepEqual(normalizeKunChatEntities('abcdef', [e('bold', 0, 4), e('bold', 2, 4)]), [
    e('bold', 0, 6),
  ])
  // links never merge: two links are two targets
  assert.equal(
    normalizeKunChatEntities('abcd', [
      e('text_link', 0, 2, { url: 'https://a' }),
      e('text_link', 2, 2, { url: 'https://a' }),
    ]).length,
    2
  )
})

test('quotes stay outermost; formats lose line breaks at their ends', () => {
  const text = 'ab\ncd'
  assert.deepEqual(normalizeKunChatEntities(text, [e('bold', 0, 5), e('blockquote', 3, 2)]), [
    e('bold', 0, 2),
    e('blockquote', 3, 2),
    e('bold', 3, 2),
  ])
  assert.deepEqual(normalizeKunChatEntities('ab\n', [e('blockquote', 0, 3)]), [
    e('blockquote', 0, 2),
  ])
  assert.deepEqual(normalizeKunChatEntities('\nab\n', [e('spoiler', 0, 4)]), [e('spoiler', 1, 2)])
})

test('a quote that does not survive nesting cuts nothing', () => {
  // The quote at 5 is inside the one at 2 and is dropped, so the spoiler must
  // not keep a cut at 5: a second pass would have merged it away.
  const text = '中中b*bab'
  const once = normalizeKunChatEntities(text, [
    e('blockquote', 2, 8),
    e('url', 6, 2),
    e('blockquote', 5, 5),
    e('spoiler', 1, 6),
  ])
  assert.deepEqual(once, [
    e('spoiler', 1, 1),
    e('blockquote', 2, 5),
    e('spoiler', 2, 5),
    e('url', 6, 1),
  ])
  assert.deepEqual(normalizeKunChatEntities(text, once), once)
  // Crossing quotes: the second keeps only its part past the first.
  assert.deepEqual(
    normalizeKunChatEntities('abcdefgh', [e('blockquote', 0, 5), e('blockquote', 3, 5), e('bold', 1, 6)]),
    [e('blockquote', 0, 5), e('bold', 1, 4), e('blockquote', 5, 3), e('bold', 5, 2)]
  )
})

test('one line break on each side of a block is left out of the tree', () => {
  const text = 'look:\ncode\nok'
  const tree = buildKunChatEntityTree(text, [e('pre', 6, 4, { language: 'go' })])
  assert.equal(show(tree), 'look:<pre>code</pre>ok')
  assert.deepEqual(tree[2], { kind: 'text', text: 'ok', offset: 11 })
  // a second break is kept: it is a blank line the author typed
  assert.equal(
    show(buildKunChatEntityTree('a\n\nq', [e('blockquote', 3, 1)])),
    'a\n<blockquote>q</blockquote>'
  )
  assert.equal(kunChatTreeText(tree), 'look:codeok')
})

// Property: normalization is a fixed point, and the tree covers the text.

// mulberry32. The LCG this replaced, `seed * 1103515245 + 12345` in doubles,
// overflowed the 53-bit mantissa and cycled after about 10,000 draws, so the
// random tests replayed the same few hundred cases.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const TYPES: KunChatEntity['type'][] = [
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
]
const CHARS = ['a', 'b', ' ', '\n', '中', '😀', '*']

test('normalize is idempotent and the tree reproduces the text (random)', () => {
  const r = rng(42)
  for (let round = 0; round < 20000; round++) {
    const text = Array.from({ length: Math.floor(r() * 16) }, () => CHARS[Math.floor(r() * CHARS.length)]).join('')
    const entities = Array.from({ length: Math.floor(r() * 8) }, () => {
      const type = TYPES[Math.floor(r() * TYPES.length)]!
      return e(type, Math.floor(r() * 18) - 1, Math.floor(r() * 10), {
        url: 'https://x',
        user_id: '1',
        language: 'go',
      })
    })
    const once = normalizeKunChatEntities(text, entities)
    assert.deepEqual(normalizeKunChatEntities(text, once), once, JSON.stringify({ text, entities }))

    // Every leaf is the slice of the text it claims to be.
    const walk = (nodes: KunChatTextNode[]): void => {
      for (const n of nodes) {
        if (n.kind === 'text') assert.equal(text.slice(n.offset, n.offset + n.text.length), n.text)
        else walk(n.children)
      }
    }
    walk(buildKunChatEntityTree(text, entities))
  }
})

test('a slice keeps the entities inside it, clipped and shifted', () => {
  const text = 'say **hi** there'.replace(/\*/g, '') // "say hi there"
  const entities = [e('bold', 4, 2), e('italic', 0, 12)]
  assert.deepEqual(sliceKunChatEntities(text, entities, 4, 12), {
    text: 'hi there',
    entities: [e('italic', 0, 8), e('bold', 0, 2)],
  })
  // never through an emoji
  assert.equal(sliceKunChatEntities('a😀b', [], 2, 4).text, '😀b')
})
