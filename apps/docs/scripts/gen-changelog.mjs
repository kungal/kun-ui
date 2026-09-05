// Generate app/generated/changelog.json from @kungal/ui-vue's CHANGELOG.md
// (the canonical one for the version-locked group). Each release, the Release
// workflow runs `changeset version` (which rewrites CHANGELOG.md) and then this
// script, committing the refreshed JSON — so the docs /changelog page is fed
// automatically with zero hand-written docs. The Markdown is rendered to HTML
// HERE (Node, build-time) so `marked` never ships to the client.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { escapeDefineTokens } from './viteDefineSafe.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = join(here, '../../../packages/vue/CHANGELOG.md')
const OUT = join(here, '../app/generated/changelog.json')

const raw = readFileSync(SRC, 'utf8')

// Split into version sections on `## <semver>` headings.
const sections = []
let cur = null
for (const line of raw.split('\n')) {
  const m = line.match(/^##\s+(\d+\.\d+\.\d+\S*)\s*$/)
  if (m) {
    if (cur) sections.push(cur)
    cur = { version: m[1], body: [] }
  } else if (cur) {
    cur.body.push(line)
  }
}
if (cur) sections.push(cur)

// Drop the `### X Changes` headings and the `Updated dependencies` noise (the
// locked group bumps in lockstep, so the dep lines are redundant), and strip the
// leading commit hash from each bullet.
const clean = (lines) =>
  lines
    .filter((l) => !/^###\s+(Major|Minor|Patch)\s+Changes\s*$/.test(l))
    .filter((l) => !/^\s*-\s+Updated dependencies/.test(l))
    .filter((l) => !/^\s*-\s+@kungal\//.test(l))
    .map((l) => l.replace(/^(\s*-\s+)[0-9a-f]{7,}:\s*/, '$1'))
    .join('\n')
    .trim()

const out = sections.map(({ version, body }) => {
  const type = body.some((l) => /Major Changes/.test(l))
    ? 'major'
    : body.some((l) => /Minor Changes/.test(l))
      ? 'minor'
      : 'patch'
  const md = clean(body)
  // escapeDefineTokens: this JSON is imported as a module, so Vite's `define`
  // reaches inside it — see viteDefineSafe.mjs.
  return { version, type, html: md ? escapeDefineTokens(marked.parse(md)) : '' }
})

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(`wrote changelog.json — ${out.length} versions`)
