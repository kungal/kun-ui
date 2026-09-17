// Which theme values KunUI's components depend on, and the few kun_ui_tokens
// deliberately does not carry. gen-tokens.mjs fails on a dependency that is
// neither generated nor listed in NOT_GENERATED, and on an entry that no
// longer names one.
//
// The Flutter port may not restate a value KunUI owns, so a theme value with
// no Dart twin blocks every component that uses it. Up to 2.39.0 the generator
// read a hand-picked list and the port found the gaps one blocked component at
// a time: `--blur-*`, `--shadow-lg`, the default transition, then
// `animate-pulse` with KunSkeleton and KunAvatar waiting on it.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Scanner } from '@tailwindcss/oxide'
import { compile } from 'tailwindcss'

const LOLI =
  "KunLoli's popup choreography: animate.css keyframes in tokens.css that no other component uses. The port copies it with the component from the tag it pins, as it does Pagination's pop."
const GLASS =
  'A glass knob a site opts into. At its default (`1`, `none`) it changes nothing, so there is no value to draw.'

// Every reason is written for the Flutter port's reader. A key ending in `*`
// covers every variable with that prefix.
export const NOT_GENERATED = {
  '--z-kun-*':
    'Flutter stacks overlays in Overlay insertion order, not by z-index. The order the numbers encode, sticky < modal < popover < alert < message, is for the overlay API to keep.',
  '--animate-fadeInUp': LOLI,
  '--animate-fadeOutDown': LOLI,
  '--animate-swing': LOLI,
  '--animate-bounceInRight': LOLI,
  '--kun-surface-opacity': GLASS,
  '--kun-backdrop-filter': GLASS,
  '--kun-scrollbar-width':
    'A live measurement, not a design value: useBodyScrollLock writes it while a web overlay hides the page scrollbar.',
  '--ease-out':
    'No class uses it. The components write the CSS keyword `ease-out` in inline transitions and scoped keyframes, and the scanner cannot tell that from the utility.',
}

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '../../..')
// What a consumer's Tailwind scans. Sources rather than dist, so no build is
// needed: on 2.39.0 the two gave the same 133 theme variables.
const SOURCES = ['packages/vue/src', 'packages/ui-core/src']
const require = createRequire(import.meta.url)
const SHEETS = {
  theme: require.resolve('tailwindcss/theme.css'),
  utilities: require.resolve('tailwindcss/utilities.css'),
  tokens: join(HERE, '../src/tokens.css'),
}
// Tailwind copies these values into the utility instead of writing a var():
// `shadow-lg` and `md:` leave no trace in `:root` or in any var() of the
// output. Each one is swapped for a unique length so its use still shows.
const INLINED =
  /^(\s*)(--(?:shadow|inset-shadow|text-shadow|drop-shadow|breakpoint|container)-[\w-]+)\s*:[^;]+;/gm
const MARKER_BASE = 700000

const varRefs = (text) => [...text.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1])

export const themeDependencies = async () => {
  const declared = new Set()
  const markers = new Map()
  const load = (path) => {
    const css = readFileSync(path, 'utf8')
    for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:/g))
      declared.add(m[1])
    const content = css.replace(INLINED, (_, indent, name) => {
      const marker = `${MARKER_BASE + markers.size}px`
      markers.set(marker, name)
      const value = /^--(breakpoint|container)-/.test(name) ? marker : `0 0 ${marker} #000`
      return `${indent}${name}: ${value};`
    })
    return { path, base: dirname(path), content }
  }

  const scanner = new Scanner({
    sources: SOURCES.map((dir) => ({ base: join(ROOT, dir), pattern: '**/*', negated: false })),
  })
  const candidates = scanner.scan()
  const compiler = await compile(
    "@import 'theme' layer(theme);\n@import 'tokens';\n@import 'utilities' layer(utilities);",
    { base: ROOT, loadStylesheet: async (id, base) => load(SHEETS[id] ?? join(base, id)) }
  )
  const css = compiler.build(candidates)

  const used = new Set(varRefs(css))
  for (const file of scanner.files) for (const name of varRefs(readFileSync(file, 'utf8'))) used.add(name)
  const lengths = new Set(css.match(/(?<![\d.])\d+px/g))
  for (const [marker, name] of markers) if (lengths.has(marker)) used.add(name)
  return new Set([...used].filter((name) => declared.has(name)))
}

export const checkThemeCoverage = async (generated) => {
  const deps = await themeDependencies()
  const keys = Object.keys(NOT_GENERATED)
  const excusedBy = (name) =>
    keys.find((k) => (k.endsWith('*') ? name.startsWith(k.slice(0, -1)) : name === k))
  const problems = []
  for (const name of [...deps].sort())
    if (!generated.has(name) && !excusedBy(name))
      problems.push(`${name}: a component uses it, and kun_ui_tokens does not carry it.`)
  for (const key of keys) {
    const names = [...deps].filter((name) => excusedBy(name) === key)
    if (!names.length) problems.push(`NOT_GENERATED lists ${key}, which no component uses.`)
    for (const name of names.filter((n) => generated.has(n)))
      problems.push(`NOT_GENERATED lists ${name}, which kun_ui_tokens carries.`)
  }
  return { deps, excused: [...deps].filter(excusedBy).length, problems }
}
