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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createJiti } from 'jiti'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const vuePkg = join(root, 'packages', 'vue')
const tsconfig = join(vuePkg, 'tsconfig.json')

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
        default:
          p.default ??
          p.tags?.find((t) => t.name === 'default')?.text?.trim() ??
          undefined,
        description: (p.description || '').replace(/\s+/g, ' ').trim() || undefined,
      }))
      // model props (v-model) first, then required, then alpha
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
    out[name] = { props }
    okProps += props.length
  } catch (e) {
    console.error(`! meta failed for ${name}: ${e.message}`)
    failed.push(name)
    out[name] = { props: [] }
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

const dir = join(here, '..', 'app', 'generated')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'component-meta.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(`wrote component-meta.json — ${Object.keys(out).length} components, ${okProps} props total`)
