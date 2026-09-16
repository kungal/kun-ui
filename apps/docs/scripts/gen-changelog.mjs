// Generate app/generated/changelog.json from the CHANGELOG.md files of the
// version-locked group. Each release, the Release workflow runs `changeset
// version` (which rewrites them) and then this script, committing the refreshed
// JSON — so the docs /changelog page is fed automatically with zero
// hand-written docs. The Markdown is rendered to HTML HERE (Node, build-time)
// so `marked` never ships to the client.
//
// ui-vue's file sets the version list and leads each entry, but a changeset
// lands only in the CHANGELOGs of the packages it names; the fixed group gives
// the others a bare version bump. Reading ui-vue alone showed 13 releases whose
// changeset named ui-core, ui-tokens or ui-nuxt (2.38.0 among them) as
// "随依赖更新" with a Patch chip.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { escapeDefineTokens } from './viteDefineSafe.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const changelogOf = (dir) => join(here, `../../../packages/${dir}/CHANGELOG.md`)
const OUT = join(here, '../app/generated/changelog.json')

// Split into version sections on `## <semver>` headings.
const sectionsOf = (file) => {
  const sections = []
  let cur = null
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^##\s+(\d+\.\d+\.\d+\S*)\s*$/)
    if (m) {
      if (cur) sections.push(cur)
      cur = { version: m[1], body: [] }
    } else if (cur) {
      cur.body.push(line)
    }
  }
  if (cur) sections.push(cur)
  return sections
}

const sections = sectionsOf(changelogOf('vue'))
const others = ['ui-core', 'ui-tokens', 'nuxt'].map(
  (dir) => new Map(sectionsOf(changelogOf(dir)).map((s) => [s.version, s.body]))
)

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

// One entry per changeset: changesets writes each as a column-0 bullet with its
// body indented beneath it, under the heading of its bump type.
const RANK = { patch: 0, minor: 1, major: 2 }
const entriesOf = (body) => {
  const entries = []
  let type = 'patch'
  for (const line of body) {
    const heading = line.match(/^###\s+(Major|Minor|Patch)\s+Changes\s*$/)
    if (heading) type = heading[1].toLowerCase()
    else if (line.startsWith('- ')) entries.push({ type, lines: [line] })
    else entries.at(-1)?.lines.push(line)
  }
  return entries.map((e) => ({ type: e.type, md: clean(e.lines) })).filter((e) => e.md)
}

const out = sections.map(({ version, body }) => {
  let type = body.some((l) => /Major Changes/.test(l))
    ? 'major'
    : body.some((l) => /Minor Changes/.test(l))
      ? 'minor'
      : 'patch'
  // A changeset naming several packages is in each of their CHANGELOGs.
  const seen = new Set(entriesOf(body).map((e) => e.md))
  const extra = []
  for (const other of others) {
    for (const e of entriesOf(other.get(version) ?? [])) {
      if (seen.has(e.md)) continue
      seen.add(e.md)
      extra.push(e.md)
      if (RANK[e.type] > RANK[type]) type = e.type
    }
  }
  const md = [clean(body), ...extra].filter(Boolean).join('\n\n')
  // escapeDefineTokens: this JSON is imported as a module, so Vite's `define`
  // reaches inside it — see viteDefineSafe.mjs.
  return { version, type, html: md ? escapeDefineTokens(marked.parse(md)) : '' }
})

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(`wrote changelog.json — ${out.length} versions`)
