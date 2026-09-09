// Brings packages/ui-tokens-flutter (the pub.dev package `kun_ui_tokens`) back
// into version lockstep with @kungal/ui-tokens after `changeset version`.
//
// pub.dev refuses a publish whose pubspec version does not match the git tag
// that triggered it, and release.yml derives that tag from the npm version — so
// a pubspec left behind does not fail loudly, it fails at the registry after
// the npm packages have already shipped. gen-tokens.mjs therefore hard-fails
// when the two disagree, and this script is the fix it points at.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const NPM_PKG = join(ROOT, 'packages/ui-tokens/package.json')
const NPM_CHANGELOG = join(ROOT, 'packages/ui-tokens/CHANGELOG.md')
const PUBSPEC = join(ROOT, 'packages/ui-tokens-flutter/pubspec.yaml')
const PUB_CHANGELOG = join(ROOT, 'packages/ui-tokens-flutter/CHANGELOG.md')

const version = JSON.parse(readFileSync(NPM_PKG, 'utf8')).version
const done = []

const pubspec = readFileSync(PUBSPEC, 'utf8')
const current = pubspec.match(/^version:\s*(\S+)/m)?.[1]
if (current !== version) {
  writeFileSync(PUBSPEC, pubspec.replace(/^version:\s*\S+$/m, `version: ${version}`))
  done.push(`pubspec.yaml: ${current ?? '(unset)'} → ${version}`)
}

// changeset writes the newest entry at the top of the npm CHANGELOG; mirror
// that block so pub.dev shows real release notes instead of one stale line.
const pubChangelog = readFileSync(PUB_CHANGELOG, 'utf8')
if (!pubChangelog.startsWith(`## ${version}`)) {
  const npmChangelog = readFileSync(NPM_CHANGELOG, 'utf8')
  const first = npmChangelog.indexOf('\n## ')
  if (first === -1) throw new Error(`${NPM_CHANGELOG} has no '## ' release heading`)
  const bodyStart = npmChangelog.indexOf('\n', first + 1)
  const next = npmChangelog.indexOf('\n## ', bodyStart)
  const body = npmChangelog.slice(bodyStart + 1, next === -1 ? undefined : next + 1).trim()
  // The four npm packages are a changesets `fixed` group, so ui-tokens takes a
  // version bump on every release and its CHANGELOG block is usually empty.
  const notes = body || '- Version bump only, to stay in lockstep with the KunUI release train.'
  writeFileSync(PUB_CHANGELOG, `## ${version}\n\n${notes}\n\n${pubChangelog}`)
  done.push(`CHANGELOG.md: prepended the ${version} block`)
}

console.log(
  done.length
    ? `kun_ui_tokens synced to ${version}\n  ${done.join('\n  ')}`
    : `kun_ui_tokens already in lockstep at ${version} — nothing to do`
)
