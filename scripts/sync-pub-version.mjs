// Brings the pub.dev packages (`kun_ui_tokens`, `kun_ui_icons`) back into
// version lockstep with @kungal/ui-tokens after `changeset version`.
//
// pub.dev refuses a publish whose pubspec version does not match the git tag
// that triggered it, and release.yml derives those tags from the npm version —
// so a pubspec left behind does not fail loudly, it fails at the registry after
// the npm packages have already shipped. Both generators therefore hard-fail
// when their pubspec disagrees, and this script is the fix they point at.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const NPM_PKG = join(ROOT, 'packages/ui-tokens/package.json')
const NPM_CHANGELOG = join(ROOT, 'packages/ui-tokens/CHANGELOG.md')
const PUB_PACKAGES = [
  ['kun_ui_tokens', 'packages/ui-tokens-flutter'],
  ['kun_ui_icons', 'packages/ui-icons-flutter'],
]

const version = JSON.parse(readFileSync(NPM_PKG, 'utf8')).version

// A pub README is the package page on pub.dev, so a version literal left
// behind in one is published: syncing only the pubspec and the CHANGELOG left
// kun_ui_tokens' README advertising 2.32.1 for the whole of 2.33.0. Both
// shapes are anchored on the package's own name, and each must appear exactly
// once — a reworded README that no longer matches stops the release train here,
// before anything is published, instead of quietly drifting again.
const readmeVersions = (name) => [
  ['install snippet', new RegExp(`^(\\s*${name}: \\^)\\d+\\.\\d+\\.\\d+$`, 'gm'), `$1${version}`],
  ['lockstep note', new RegExp(`(\`${name} )\\d+\\.\\d+\\.\\d+\``, 'g'), `$1${version}\``],
]

// changeset writes the newest entry at the top of the npm CHANGELOG; mirror
// that block so pub.dev shows real release notes instead of one stale line.
const releaseNotes = () => {
  const npmChangelog = readFileSync(NPM_CHANGELOG, 'utf8')
  const first = npmChangelog.indexOf('\n## ')
  if (first === -1) throw new Error(`${NPM_CHANGELOG} has no '## ' release heading`)
  const bodyStart = npmChangelog.indexOf('\n', first + 1)
  const next = npmChangelog.indexOf('\n## ', bodyStart)
  const body = npmChangelog.slice(bodyStart + 1, next === -1 ? undefined : next + 1).trim()
  // The four npm packages are a changesets `fixed` group, so ui-tokens takes a
  // version bump on every release and its CHANGELOG block is usually empty.
  return body || '- Version bump only, to stay in lockstep with the KunUI release train.'
}

for (const [name, dir] of PUB_PACKAGES) {
  const pubspecPath = join(ROOT, dir, 'pubspec.yaml')
  const changelogPath = join(ROOT, dir, 'CHANGELOG.md')
  const done = []

  const pubspec = readFileSync(pubspecPath, 'utf8')
  const current = pubspec.match(/^version:\s*(\S+)/m)?.[1]
  if (current !== version) {
    writeFileSync(pubspecPath, pubspec.replace(/^version:\s*\S+$/m, `version: ${version}`))
    done.push(`pubspec.yaml: ${current ?? '(unset)'} → ${version}`)
  }

  const changelog = readFileSync(changelogPath, 'utf8')
  if (!changelog.startsWith(`## ${version}`)) {
    writeFileSync(changelogPath, `## ${version}\n\n${releaseNotes()}\n\n${changelog}`)
    done.push(`CHANGELOG.md: prepended the ${version} block`)
  }

  const readmePath = join(ROOT, dir, 'README.md')
  const readme = readFileSync(readmePath, 'utf8')
  let synced = readme
  for (const [what, pattern, replacement] of readmeVersions(name)) {
    const hits = synced.match(pattern)?.length ?? 0
    if (hits !== 1) {
      throw new Error(
        `${dir}/README.md: expected exactly one ${what} version reference, found ${hits}. ` +
          'Restore the shape this script rewrites, or teach it the new one.'
      )
    }
    synced = synced.replace(pattern, replacement)
  }
  if (synced !== readme) {
    writeFileSync(readmePath, synced)
    done.push(`README.md: version references → ${version}`)
  }

  console.log(
    done.length
      ? `${name} synced to ${version}\n  ${done.join('\n  ')}`
      : `${name} already in lockstep at ${version} — nothing to do`
  )
}
