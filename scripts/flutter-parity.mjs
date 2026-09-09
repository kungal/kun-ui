// The tier-3 parity report (docs/architecture-flutter.md §5): diff the Flutter
// port's manifest against contracts/component-contracts.json and fail on
// drift. Meant to run in the kun-ui-flutter repo's CI against this repo checked
// out at the release tag its kun_ui_tokens dependency pins — the manifest
// format is documented in contracts/README.md.
//
//   node scripts/flutter-parity.mjs <path-or-https-url-to-manifest.json>
//
// Absence is not drift: a portable component the manifest never mentions is
// reported informationally, because tier-4 scope comes from the Flutter apps
// on demand (§7 decision 3). Drift is a *claimed* component whose surface no
// longer matches — a contract prop the manifest neither covers nor omits (the
// web grew API the port has not answered for), or a manifest entry the
// contract no longer carries (the web removed or renamed it).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const arg = process.argv[2]
if (!arg) {
  console.error(
    'usage: node scripts/flutter-parity.mjs <path-or-https-url-to-manifest.json>'
  )
  process.exit(2)
}

const contract = JSON.parse(
  readFileSync(join(root, 'contracts', 'component-contracts.json'), 'utf8')
)
const manifest = /^https?:\/\//.test(arg)
  ? await (async () => {
      const res = await fetch(arg)
      if (!res.ok) {
        console.error(`flutter-parity: fetching ${arg} failed: ${res.status}`)
        process.exit(2)
      }
      return res.json()
    })()
  : JSON.parse(readFileSync(arg, 'utf8'))

if (typeof manifest.components !== 'object' || manifest.components === null) {
  console.error(
    'flutter-parity: the manifest has no `components` object — see contracts/README.md for the format.'
  )
  process.exit(2)
}

const errors = []
const lines = []
const omissions = []

const isOmit = (v) => typeof v === 'object' && v !== null && 'omit' in v

const checkSection = (name, section, contractItems, claimed) => {
  const claimedKeys = Object.keys(claimed)
  const contractNames = new Set(contractItems.map((i) => i.name))
  let covered = 0
  let omitted = 0
  for (const item of contractItems) {
    const v = claimed[item.name]
    if (v === undefined) {
      errors.push(
        `${name}: ${section} \`${item.name}\` is in the contract but the manifest neither covers nor omits it`
      )
    } else if (isOmit(v)) {
      omitted++
      omissions.push(`${name}.${item.name} (${section}): ${v.omit}`)
    } else {
      covered++
    }
  }
  for (const key of claimedKeys) {
    if (!contractNames.has(key)) {
      errors.push(
        `${name}: manifest ${section} \`${key}\` is not in the contract — removed or renamed upstream`
      )
    }
  }
  return { covered, omitted, total: contractItems.length }
}

for (const [name, entry] of Object.entries(manifest.components)) {
  const c = contract.components[name]
  if (!c) {
    errors.push(`${name}: not in the contract — removed or renamed upstream`)
    continue
  }
  if (c.status !== 'portable') {
    errors.push(
      `${name}: the contract classifies it web-only — ${c.reason}`
    )
    continue
  }
  const props = checkSection(name, 'prop', c.props, entry.props ?? {})
  const events = checkSection(name, 'event', c.events, entry.events ?? {})
  const slots = checkSection(name, 'slot', c.slots, entry.slots ?? {})
  const fmt = (s) => `${s.covered}/${s.total}${s.omitted ? ` (+${s.omitted} omitted)` : ''}`
  lines.push(
    `  ${name} → ${entry.widget ?? '?'}  props ${fmt(props)}, events ${fmt(events)}, slots ${fmt(slots)}`
  )
}

const portable = Object.entries(contract.components)
  .filter(([, c]) => c.status === 'portable')
  .map(([n]) => n)
const claimed = new Set(Object.keys(manifest.components))
const unported = portable.filter((n) => !claimed.has(n))

console.log(
  `flutter-parity — contract: ${portable.length} portable components; manifest claims ${claimed.size}`
)
if (lines.length) {
  console.log('\nClaimed:')
  for (const l of lines) console.log(l)
}
if (omissions.length) {
  console.log('\nOmitted with a reason:')
  for (const o of omissions) console.log(`  ${o}`)
}
if (unported.length) {
  console.log(
    `\nNot yet ported (on demand, not drift): ${unported.join(', ')}`
  )
}
if (errors.length) {
  console.log('\nDRIFT:')
  for (const e of errors) console.log(`  ${e}`)
  console.log(`\nparity: FAIL — ${errors.length} drift error(s)`)
  process.exit(1)
}
console.log('\nparity: OK')
