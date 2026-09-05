// Extract real prop metadata (name, type, default, required, JSDoc description)
// from the @kungal/ui-vue component sources using vue-component-meta, so the
// docs' props tables are generated from the TypeScript types and can never
// drift. Output: app/generated/component-meta.json (committed — the docs image
// builds from it rather than running vue-component-meta).
//
//   pnpm gen        (from the repo root — runs every generator in order)
//
// Re-run after changing component props. You don't have to remember: the
// `check` workflow regenerates everything on each PR and fails if the committed
// output differs.

import { createChecker } from 'vue-component-meta'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { createJiti } from 'jiti'
import { findDefineTokens } from './viteDefineSafe.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const vuePkg = join(root, 'packages', 'vue')
const tsconfig = join(vuePkg, 'tsconfig.json')

// ── @kungal/ui-core must be built ───────────────────────────────────────
// This reads component *sources*, but it does so through a real TypeScript
// program, and `packages/vue` imports its shared types (KunUIColor, KunUISize,
// KunUIRounded, KunUser, …) from @kungal/ui-core — a `workspace:*` dependency
// whose `exports` point at dist/index.d.ts.
//
// When that file is absent TypeScript does not fail. It widens every type it
// couldn't resolve to `any` and the run "succeeds": 83 prop types collapse to
// `any`, unions come back reordered, and the generator commits the lot. That is
// the worst kind of failure here — a green run that quietly guts the docs — so
// check first, before spending a minute generating.
const corePkgDir = join(root, 'packages', 'ui-core')
const coreTypes = join(
  corePkgDir,
  JSON.parse(readFileSync(join(corePkgDir, 'package.json'), 'utf8')).types
)
if (!existsSync(coreTypes)) {
  console.error(
    `gen-meta: ${relative(root, coreTypes)} is missing, so every type imported from @kungal/ui-core would silently become \`any\`.`
  )
  console.error(
    'gen-meta: build it first — `pnpm --filter @kungal/ui-core build`, or `pnpm build`.'
  )
  process.exit(1)
}

// Public components — derived from the SAME single source the library + Nuxt
// layer use (KUN_COMPONENT_NAMES), so the docs can never miss a component.
// File name = component name without the `Kun` prefix.
//
// Read from `src/`, not from the package entry: `@kungal/ui-vue` resolves to
// `dist/`, which would force a full library build before the docs metadata
// could be regenerated (and silently generate against a stale dist if one
// happened to be lying around). This script already reads every component
// straight out of `src/` — the name list should come from there too.
const jiti = createJiti(import.meta.url)
const { KUN_COMPONENT_NAMES: names } = await jiti.import(
  join(vuePkg, 'src', 'componentNames.ts')
)

const checker = createChecker(tsconfig, {
  forceUseTs: true,
  printer: { newLine: 1 },
})

// Keep type strings readable: collapse whitespace, trim a wrapping `| undefined`.
const cleanType = (t) =>
  String(t)
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*undefined\b/g, '')
    .trim()

// ── Generic components ──────────────────────────────────────────────────
// vue-component-meta reports an *uninstantiated* generic SFC, so a prop typed
// `items: T[]` comes back as the literal `"T[]"` — accurate to the source and
// useless in a docs table. Every generic here is written as
// `T extends Constraint = Default`, and `Default` is exactly what a caller who
// doesn't reach for the generic gets, so that's what the table should show.
//
// Substitution runs to a fixpoint because a later parameter's default may name
// an earlier one (KunSelect: `O extends KunSelectOption<T> = KunSelectOption<T>`
// → `KunSelectOption<KunSelectValue>`).
const splitTopLevel = (s) => {
  const parts = []
  let depth = 0
  let start = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '<' || c === '(' || c === '[' || c === '{') depth++
    else if (c === '>' || c === ')' || c === ']' || c === '}') depth--
    else if (c === ',' && depth === 0) {
      parts.push(s.slice(start, i))
      start = i + 1
    }
  }
  parts.push(s.slice(start))
  return parts.map((p) => p.trim()).filter(Boolean)
}

const genericDefaults = (file) => {
  const attr = readFileSync(file, 'utf8').match(
    /<script[^>]*\bgeneric="([^"]*)"/
  )?.[1]
  if (!attr) return null
  const map = new Map()
  for (const param of splitTopLevel(attr)) {
    // `T extends C = D` → D (what an unparameterised caller gets); with no `=`,
    // fall back to the constraint, which is the closest honest description.
    const m = param.match(/^(\w+)\s*(?:extends\s+([\s\S]+?))?\s*(?:=\s*([\s\S]+))?$/)
    if (!m) continue
    const [, name, constraint, dflt] = m
    const value = (dflt ?? constraint)?.trim()
    if (value && value !== name) map.set(name, value)
  }
  return map.size ? map : null
}

const resolveGenerics = (type, map) => {
  if (!map) return type
  let prev
  let next = type
  // Bounded: each pass must change something to continue, and the parameter set
  // is tiny — this is just a guard against a pathological self-referential default.
  for (let i = 0; i < 8 && next !== prev; i++) {
    prev = next
    for (const [param, value] of map) {
      next = next.replace(new RegExp(`\\b${param}\\b`, 'g'), value)
    }
  }
  return next
}

// ── Emit descriptions ───────────────────────────────────────────────────
// vue-component-meta reports every event's name, payload and signature, but its
// `description` comes back "" even when the `defineEmits` member carries a
// JSDoc block — in both the tuple (`add: [tag: string]`) and the call-signature
// (`(e: 'add', tag: string): void`) form. The compiler has already folded the
// type literal into overloads by the time the checker sees it and the doc
// comments do not survive. So read them out of the SFC, the same way
// genericDefaults reads the `generic=` attribute.
const emitDocs = (file) => {
  const src = readFileSync(file, 'utf8')
  const start = src.indexOf('defineEmits<{')
  if (start === -1) return null
  let depth = 0
  const open = src.indexOf('{', start)
  let end = open
  for (; end < src.length; end++) {
    if (src[end] === '{') depth++
    else if (src[end] === '}' && --depth === 0) break
  }
  const body = src.slice(open + 1, end)
  const map = new Map()
  const re =
    /\/\*\*([\s\S]*?)\*\/\s*(?:\(\s*(?:e|event)\s*:\s*'([\w:]+)'|'?([\w:]+)'?\s*:)/g
  for (const m of body.matchAll(re)) {
    const name = m[2] ?? m[3]
    const text = m[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*/, '').trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (name && text) map.set(name, text)
  }
  return map.size ? map : null
}

const out = {}
const failed = []
let okProps = 0
for (const name of names) {
  const file = join(vuePkg, 'src', 'components', `${name.replace(/^Kun/, '')}.vue`)
  try {
    const meta = checker.getComponentMeta(file)
    const generics = genericDefaults(file)
    const props = meta.props
      .filter((p) => !p.global)
      .map((p) => ({
        name: p.name,
        type: resolveGenerics(cleanType(p.type), generics),
        required: !!p.required,
        // `withDefaults` is the source of truth, but a default that can't be a
        // literal there — one computed from another prop, like KunTab's
        // orientation-aware `align` — is declared with a JSDoc `@default` tag
        // on the prop instead. Without this the table showed "—" for a prop
        // that very much has a default.
        // A literal `undefined` in withDefaults is the ABSENCE of a default,
        // not a default of undefined — `format: undefined` there means "resolve
        // it from `precision` at runtime". Treat it as absent so the JSDoc tag
        // still wins, or the table claims a conditional default is `undefined`.
        default:
          (p.default === 'undefined' ? undefined : p.default) ??
          p.tags?.find((t) => t.name === 'default')?.text?.trim() ??
          undefined,
        description: (p.description || '').replace(/\s+/g, ' ').trim() || undefined,
      }))
      // model props (v-model) first, then required, then alpha
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
    // Events and slots are public API too, and until now they appeared in no
    // generated surface at all — not the props table, not the page Markdown,
    // not llms.txt. A consumer could not discover `@search` or `#option`
    // without opening the SFC.
    const docs = emitDocs(file)
    const events = meta.events
      .map((e) => ({
        name: e.name,
        // The payload tuple, minus the tuple brackets: `[query: string]` is how
        // an emits type is declared but not how it is read.
        type: resolveGenerics(cleanType(e.type), generics).replace(/^\[(.*)\]$/, '$1'),
        description:
          docs?.get(e.name) ??
          ((e.description || '').replace(/\s+/g, ' ').trim() || undefined),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    const slots = meta.slots
      .map((s) => ({
        name: s.name,
        type: resolveGenerics(cleanType(s.type), generics),
        description: (s.description || '').replace(/\s+/g, ' ').trim() || undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    out[name] = { props, events, slots }
    okProps += props.length
  } catch (e) {
    console.error(`! meta failed for ${name}: ${e.message}`)
    failed.push(name)
    out[name] = { props: [], events: [], slots: [] }
  }
}

// A component whose meta throws would otherwise be written out with zero props —
// a props table that silently goes blank, and (now that CI diffs this file) a
// blank one that gets committed and then passes the check forever. Refuse to
// write instead.
if (failed.length) {
  console.error(
    `gen-meta: ${failed.length} component(s) produced no metadata: ${failed.join(', ')}`
  )
  process.exit(1)
}

// Backstop for the same degradation arriving by some other route than a missing
// ui-core build — a moved export, a tsconfig path that stops resolving. `any` is
// exactly what broken type resolution looks like, and no public prop in the
// library is typed that way today, so treat it as the failure it almost
// certainly is rather than publishing a table that says nothing. If a prop ever
// genuinely needs `any`, narrow it — or relax this check deliberately.
const anyTyped = Object.entries(out).flatMap(([name, { props, events }]) =>
  [...props, ...events]
    .filter((p) => /\bany\b/.test(p.type))
    .map((p) => `${name}.${p.name}: ${p.type}`)
)
if (anyTyped.length) {
  console.error(
    `gen-meta: ${anyTyped.length} prop(s) resolved to \`any\`, which means type resolution broke:`
  )
  for (const p of anyTyped.slice(0, 10)) console.error(`  ${p}`)
  if (anyTyped.length > 10) console.error(`  … and ${anyTyped.length - 10} more`)
  process.exit(1)
}

// These descriptions are rendered as plain text, so the HTML-entity trick the
// changelog uses would show up literally. Refuse instead: a JSDoc block naming
// one of Nuxt's define keys would be silently rewritten by the bundler — a
// sentence about `import.meta.env.DEV` would ship reading `false`.
const defineTokened = Object.entries(out).flatMap(([name, { props, events }]) =>
  [...props, ...events].flatMap((p) =>
    findDefineTokens(p.description).map((t) => `${name}.${p.name}: ${t}`)
  )
)
if (defineTokened.length) {
  console.error(
    `gen-meta: ${defineTokened.length} description(s) name a Vite define key, which the docs bundle would substitute:`
  )
  for (const d of defineTokened) console.error(`  ${d}`)
  console.error(
    'gen-meta: reword them (e.g. "NODE_ENV" alone) — see scripts/viteDefineSafe.mjs.'
  )
  process.exit(1)
}

const dir = join(here, '..', 'app', 'generated')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'component-meta.json'), `${JSON.stringify(out, null, 2)}\n`)
const totals = Object.values(out).reduce(
  (acc, c) => ({ events: acc.events + c.events.length, slots: acc.slots + c.slots.length }),
  { events: 0, slots: 0 }
)
console.log(
  `wrote component-meta.json — ${Object.keys(out).length} components, ${okProps} props, ${totals.events} events, ${totals.slots} slots`
)
