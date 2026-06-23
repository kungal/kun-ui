// Extract real prop metadata (name, type, default, required, JSDoc description)
// from the @kungal/ui-vue component sources using vue-component-meta, so the
// docs' props tables are generated from the TypeScript types and can never
// drift. Output: app/generated/component-meta.json (committed).
//
//   pnpm gen:meta
//
// Re-run after changing component props.

import { createChecker } from 'vue-component-meta'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { KUN_COMPONENT_NAMES } from '@kungal/ui-vue'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const vuePkg = join(root, 'packages', 'vue')
const tsconfig = join(vuePkg, 'tsconfig.json')

// Public components — derived from the SAME single source the library + Nuxt
// layer use (KUN_COMPONENT_NAMES), so the docs can never miss a component.
// File name = component name without the `Kun` prefix.
const names = KUN_COMPONENT_NAMES

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

const out = {}
let okProps = 0
for (const name of names) {
  const file = join(vuePkg, 'src', 'components', `${name.replace(/^Kun/, '')}.vue`)
  try {
    const meta = checker.getComponentMeta(file)
    const props = meta.props
      .filter((p) => !p.global)
      .map((p) => ({
        name: p.name,
        type: cleanType(p.type),
        required: !!p.required,
        default: p.default ?? undefined,
        description: (p.description || '').replace(/\s+/g, ' ').trim() || undefined,
      }))
      // model props (v-model) first, then required, then alpha
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
    out[name] = { props }
    okProps += props.length
  } catch (e) {
    console.warn(`! meta failed for ${name}: ${e.message}`)
    out[name] = { props: [] }
  }
}

const dir = join(here, '..', 'app', 'generated')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'component-meta.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(`wrote component-meta.json — ${Object.keys(out).length} components, ${okProps} props total`)
