// Keyboard-shortcut display: the parser, the per-platform labels and the
// modifier order behind KunKbd, KunTooltip's `shortcut` and the menu items'
// `shortcut`. Display only — binding the key is the app's job.
//
// The grammar is aria-keyshortcuts' (`+` joins a chord, whitespace separates a
// sequence) plus `Mod`, the key that is ⌘ on Apple and Ctrl everywhere else,
// the same abstraction as tinykeys' `$mod`, ProseMirror's `Mod-` and GitHub
// Primer's KeybindingHint. Names are case-insensitive and take the common
// aliases, so `cmd+shift+p` and `Shift+Mod+P` resolve to the same chord.

export type KunShortcutPlatform = 'apple' | 'other'

/** Keys whose spoken name comes from the locale (`kbd.<name>`) rather than
 *  from the label: a glyph such as ⌘ or ↑, or an abbreviation such as Esc. */
export type KunKbdKeyName =
  | 'control'
  | 'alt'
  | 'option'
  | 'shift'
  | 'command'
  | 'meta'
  | 'enter'
  | 'escape'
  | 'backspace'
  | 'delete'
  | 'tab'
  | 'space'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'pageUp'
  | 'pageDown'
  | 'home'
  | 'end'
  | 'plus'

export interface KunShortcutKey {
  /** Canonical key: `Control`, `Alt`, `Shift`, `Meta`, `Enter`, `ArrowUp`, `K`, `+`… */
  key: string
  /** What the key shows on this platform: `⌘`, `Ctrl`, `K`. */
  label: string
  /** The locale key (under `kbd`) a screen reader hears instead of `label`;
   *  null when the label reads as itself (a letter, a digit, F5). */
  spoken: KunKbdKeyName | null
}

const ALIASES: Record<string, string> = {
  mod: 'Mod',
  ctrl: 'Control',
  control: 'Control',
  alt: 'Alt',
  option: 'Alt',
  opt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
  cmd: 'Meta',
  command: 'Meta',
  super: 'Meta',
  win: 'Meta',
  enter: 'Enter',
  return: 'Enter',
  esc: 'Escape',
  escape: 'Escape',
  backspace: 'Backspace',
  del: 'Delete',
  delete: 'Delete',
  tab: 'Tab',
  space: 'Space',
  spacebar: 'Space',
  up: 'ArrowUp',
  arrowup: 'ArrowUp',
  down: 'ArrowDown',
  arrowdown: 'ArrowDown',
  left: 'ArrowLeft',
  arrowleft: 'ArrowLeft',
  right: 'ArrowRight',
  arrowright: 'ArrowRight',
  pageup: 'PageUp',
  pgup: 'PageUp',
  pagedown: 'PageDown',
  pgdn: 'PageDown',
  home: 'Home',
  end: 'End',
  plus: '+',
}

// Apple's Human Interface Guidelines list modifiers as Control, Option, Shift,
// Command (⌃⌥⇧⌘). Elsewhere this follows Primer's KeybindingHint: Ctrl, Win,
// Alt, Shift. A chord is sorted into that order whatever order it was written
// in, so one command table renders consistently.
const MODIFIER_ORDER: Record<KunShortcutPlatform, string[]> = {
  apple: ['Control', 'Alt', 'Shift', 'Meta'],
  other: ['Control', 'Meta', 'Alt', 'Shift'],
}

type KeyDisplay = { apple: string; other: string; spoken: (p: KunShortcutPlatform) => KunKbdKeyName }

const NAMED: Record<string, KeyDisplay> = {
  Control: { apple: '⌃', other: 'Ctrl', spoken: () => 'control' },
  Alt: { apple: '⌥', other: 'Alt', spoken: (p) => (p === 'apple' ? 'option' : 'alt') },
  Shift: { apple: '⇧', other: 'Shift', spoken: () => 'shift' },
  Meta: { apple: '⌘', other: 'Win', spoken: (p) => (p === 'apple' ? 'command' : 'meta') },
  Enter: { apple: '↩', other: 'Enter', spoken: () => 'enter' },
  Escape: { apple: 'Esc', other: 'Esc', spoken: () => 'escape' },
  Backspace: { apple: '⌫', other: 'Backspace', spoken: () => 'backspace' },
  Delete: { apple: '⌦', other: 'Del', spoken: () => 'delete' },
  Tab: { apple: '⇥', other: 'Tab', spoken: () => 'tab' },
  Space: { apple: 'Space', other: 'Space', spoken: () => 'space' },
  ArrowUp: { apple: '↑', other: '↑', spoken: () => 'up' },
  ArrowDown: { apple: '↓', other: '↓', spoken: () => 'down' },
  ArrowLeft: { apple: '←', other: '←', spoken: () => 'left' },
  ArrowRight: { apple: '→', other: '→', spoken: () => 'right' },
  PageUp: { apple: 'PgUp', other: 'PgUp', spoken: () => 'pageUp' },
  PageDown: { apple: 'PgDn', other: 'PgDn', spoken: () => 'pageDown' },
  Home: { apple: 'Home', other: 'Home', spoken: () => 'home' },
  End: { apple: 'End', other: 'End', spoken: () => 'end' },
  '+': { apple: '+', other: '+', spoken: () => 'plus' },
}

const canonicalKey = (token: string): string => {
  const alias = ALIASES[token.toLowerCase()]
  if (alias) return alias
  if (/^f\d{1,2}$/i.test(token)) return token.toUpperCase()
  return token.length === 1 ? token.toUpperCase() : token
}

// `Mod++` is Mod and the plus key, and a lone `+` is the plus key: a `+` that
// has nothing after it is a key, not a joiner.
const splitChord = (chord: string): string[] => {
  if (chord === '+') return ['+']
  const plusKey = chord.endsWith('++')
  const body = plusKey ? chord.slice(0, -2) : chord
  const keys = body.split('+').filter(Boolean)
  return plusKey ? [...keys, '+'] : keys
}

/** Parse a shortcut into its chords of canonical key names, `Mod` unresolved:
 *  `'Shift+cmd+Z'` → `[['Shift', 'Meta', 'Z']]`, `'G G'` → `[['G'], ['G']]`. */
export const parseKunShortcut = (keys: string): string[][] =>
  keys
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chord) => splitChord(chord).map(canonicalKey))
    .filter((chord) => chord.length > 0)

/** Resolve a shortcut for one platform: `Mod` becomes Meta on Apple and
 *  Control elsewhere, repeated modifiers collapse, modifiers are sorted into
 *  the platform's order, and every key carries its label and spoken name. */
export const resolveKunShortcut = (
  keys: string,
  platform: KunShortcutPlatform
): KunShortcutKey[][] => {
  const order = MODIFIER_ORDER[platform]
  return parseKunShortcut(keys).map((chord) => {
    const resolved = chord.map((key) =>
      key === 'Mod' ? (platform === 'apple' ? 'Meta' : 'Control') : key
    )
    const modifiers = order.filter((m) => resolved.includes(m))
    const rest = resolved.filter((k, i) => !order.includes(k) && resolved.indexOf(k) === i)
    return [...modifiers, ...rest].map((key) => {
      const named = NAMED[key]
      return named
        ? { key, label: named[platform], spoken: named.spoken(platform) }
        : { key, label: key, spoken: null }
    })
  })
}

/** One-line form, as a menu shows it: `⇧⌘Z` on Apple (no joiner, the macOS
 *  menu convention) and `Ctrl+Shift+Z` elsewhere; chords of a sequence are
 *  separated by a space. */
export const formatKunShortcut = (keys: string, platform: KunShortcutPlatform): string =>
  resolveKunShortcut(keys, platform)
    .map((chord) => chord.map((k) => k.label).join(platform === 'apple' ? '' : '+'))
    .join(' ')

/** What a screen reader should hear: `Command Shift Z`, chords of a sequence
 *  joined by the locale's "then". `name` maps a spoken key to its word. */
export const speakKunShortcut = (
  sequence: KunShortcutKey[][],
  name: (key: KunKbdKeyName) => string,
  then: string
): string =>
  sequence
    .map((chord) => chord.map((k) => (k.spoken ? name(k.spoken) : k.label)).join(' '))
    .join(` ${then} `)
