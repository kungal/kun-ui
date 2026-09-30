import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  formatKunShortcut,
  parseKunShortcut,
  resolveKunShortcut,
  speakKunShortcut,
} from './shortcut.ts'
import { normalizeKunMenuSeparators } from './menu.ts'

test('parse: chords, sequences, aliases, case', () => {
  assert.deepEqual(parseKunShortcut('Mod+K'), [['Mod', 'K']])
  assert.deepEqual(parseKunShortcut('cmd+shift+p'), [['Meta', 'Shift', 'P']])
  assert.deepEqual(parseKunShortcut('G G'), [['G'], ['G']])
  assert.deepEqual(parseKunShortcut('  ctrl+k   ctrl+s '), [['Control', 'K'], ['Control', 'S']])
  assert.deepEqual(parseKunShortcut('esc'), [['Escape']])
  assert.deepEqual(parseKunShortcut('f5'), [['F5']])
  assert.deepEqual(parseKunShortcut(''), [])
})

test('parse: the plus key', () => {
  assert.deepEqual(parseKunShortcut('Mod++'), [['Mod', '+']])
  assert.deepEqual(parseKunShortcut('+'), [['+']])
  assert.deepEqual(parseKunShortcut('Mod+Plus'), [['Mod', '+']])
})

test('Mod is Command on Apple and Ctrl elsewhere', () => {
  assert.equal(formatKunShortcut('Mod+K', 'apple'), '⌘K')
  assert.equal(formatKunShortcut('Mod+K', 'other'), 'Ctrl+K')
})

test('modifiers sort into the platform order whatever the input order', () => {
  assert.equal(formatKunShortcut('Mod+Shift+Z', 'apple'), '⇧⌘Z')
  assert.equal(formatKunShortcut('Shift+Mod+Z', 'apple'), '⇧⌘Z')
  assert.equal(formatKunShortcut('Shift+Mod+Z', 'other'), 'Ctrl+Shift+Z')
  assert.equal(formatKunShortcut('Shift+Alt+Ctrl+Meta+X', 'apple'), '⌃⌥⇧⌘X')
  assert.equal(formatKunShortcut('Shift+Alt+Ctrl+Meta+X', 'other'), 'Ctrl+Win+Alt+Shift+X')
})

test('a repeated modifier collapses once Mod is resolved', () => {
  assert.equal(formatKunShortcut('Ctrl+Mod+K', 'other'), 'Ctrl+K')
  assert.equal(formatKunShortcut('Ctrl+Mod+K', 'apple'), '⌃⌘K')
})

test('named keys', () => {
  assert.equal(formatKunShortcut('Alt+ArrowUp', 'apple'), '⌥↑')
  assert.equal(formatKunShortcut('Alt+ArrowUp', 'other'), 'Alt+↑')
  assert.equal(formatKunShortcut('Shift+Delete', 'other'), 'Shift+Del')
  assert.equal(formatKunShortcut('Mod+Enter', 'apple'), '⌘↩')
  assert.equal(formatKunShortcut('Escape', 'apple'), 'Esc')
  assert.equal(formatKunShortcut('Mod+Space', 'apple'), '⌘Space')
  assert.equal(formatKunShortcut('Mod++', 'other'), 'Ctrl++')
})

test('a sequence keeps its chords apart', () => {
  assert.equal(formatKunShortcut('Mod+K Mod+S', 'apple'), '⌘K ⌘S')
  assert.equal(formatKunShortcut('Mod+K Mod+S', 'other'), 'Ctrl+K Ctrl+S')
})

test('each key carries its label and spoken name', () => {
  assert.deepEqual(resolveKunShortcut('Mod+Alt+K', 'apple'), [
    [
      { key: 'Alt', label: '⌥', spoken: 'option' },
      { key: 'Meta', label: '⌘', spoken: 'command' },
      { key: 'K', label: 'K', spoken: null },
    ],
  ])
  assert.deepEqual(resolveKunShortcut('Mod+Alt+K', 'other'), [
    [
      { key: 'Control', label: 'Ctrl', spoken: 'control' },
      { key: 'Alt', label: 'Alt', spoken: 'alt' },
      { key: 'K', label: 'K', spoken: null },
    ],
  ])
})

test('speak: spoken names, chords joined by "then"', () => {
  const names = { command: 'Command', shift: 'Shift', control: 'Control' } as Record<string, string>
  const name = (k: string) => names[k] ?? k
  assert.equal(speakKunShortcut(resolveKunShortcut('Mod+Shift+Z', 'apple'), name, 'then'), 'Shift Command Z')
  assert.equal(speakKunShortcut(resolveKunShortcut('Mod+K Mod+S', 'other'), name, 'then'), 'Control K then Control S')
})

test('menu separators: leading, trailing and doubled ones are dropped', () => {
  type Entry = { type?: 'separator'; key?: string }
  const s: Entry = { type: 'separator' }
  const a: Entry = { key: 'a' }
  const b: Entry = { key: 'b' }
  assert.deepEqual(normalizeKunMenuSeparators([s, a, s, s, b, s]), [a, s, b])
  assert.deepEqual(normalizeKunMenuSeparators([s, s]), [])
  assert.deepEqual(normalizeKunMenuSeparators([a, b]), [a, b])
  assert.deepEqual(normalizeKunMenuSeparators([]), [])
})
