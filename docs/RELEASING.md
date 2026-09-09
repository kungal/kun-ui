# Releasing KunUI to npm

KunUI publishes four public packages, **all locked to one shared version**
(the `fixed` group in `.changeset/config.json`):

- `@kungal/ui-tokens`
- `@kungal/ui-core`
- `@kungal/ui-vue`
- `@kungal/ui-nuxt`

Releases are driven by [Changesets](https://github.com/changesets/changesets)
and published from GitHub Actions using **npm OIDC trusted publishing** — no
`NPM_TOKEN` secret, with provenance attestation on every release.

---

## One-time bootstrap (must be done by a human, once)

OIDC trusted publishing can only be configured for a package that **already
exists** on npm. So the very first release is manual; everything after is
automated.

### 1. Publish 0.1.0 by hand

```bash
# from the repo root, logged in as an npm user with publish rights on @kungal
npm login
pnpm install
pnpm -r --filter "./packages/*" build   # core + vue produce dist/
pnpm -r --filter "./packages/*" publish --access public --no-git-checks
```

`pnpm publish` rewrites every `workspace:*` internal dep to the real `0.1.0`
before uploading, and skips the private root + apps automatically.

> This first publish uses your local npm auth (a token / 2FA), **not** OIDC.

### 2. Turn on trusted publishing for each package

For **each** of the four packages, on npmjs.com go to
`https://www.npmjs.com/package/<name>/access` → **Trusted Publisher** →
add a GitHub Actions publisher with:

| Field             | Value              |
| ----------------- | ------------------ |
| Organization/user | `kungal`           |
| Repository        | `kun-ui`           |
| Workflow filename | `release.yml`      |
| Environment       | *(leave empty)*    |
| Allowed actions   | `npm publish`      |

After this, CI never needs a token again.

---

## Day-to-day releases (fully automated)

1. On your feature branch, after making a change that should ship:
   ```bash
   pnpm changeset
   ```
   Pick a bump (`patch` / `minor` / `major`) and write a one-line summary.
   Because the four packages are a `fixed` group, the bump applies to all of
   them and they stay on the same version. Commit the generated
   `.changeset/*.md` with your code.

2. Open a PR and merge it to `main`.

3. The **Release** workflow (`.github/workflows/release.yml`) sees the pending
   changeset and opens/updates a **"Version Packages"** PR that applies the
   version bump and writes the CHANGELOGs.

4. Merge the "Version Packages" PR. Now there are no pending changesets, so the
   same workflow runs `changeset publish`, which **builds then publishes** the
   bumped packages to npm over OIDC (with provenance) and pushes git tags.

```
change + pnpm changeset → PR → merge to main
   → bot opens "Version Packages" PR
   → merge it → CI builds + publishes to npm (OIDC + provenance)
```

A PR with no changeset publishes nothing — correct for docs/CI-only changes.

---

## Notes

- **npm version**: the workflow runs `npm install -g npm@latest` because OIDC
  trusted publishing needs npm ≥ 11.5.1.
- **Why `changeset publish` and not `pnpm publish -r`**: OIDC must flow through
  `npm publish`; pnpm's own publisher does not support OIDC yet
  (pnpm#9812). `changeset publish` shells out to npm, so OIDC works, and it
  still strips the `workspace:` protocol correctly.
- **Provenance** is emitted automatically under trusted publishing (the
  `--provenance` flag is not needed), and only works because this repo is
  public.
- The **first** workflow run on `main` before the bootstrap above is complete
  will fail at the publish step (no package on npm / OIDC not configured yet).
  That is expected — it goes green once the bootstrap is done.

## The pub.dev packages: `kun_ui_tokens` and `kun_ui_icons`

Two Dart packages ride the same release train and publish to a different
registry. Both are wholly generated — `packages/ui-tokens-flutter` by
`packages/ui-tokens/scripts/gen-tokens.mjs`, `packages/ui-icons-flutter` by
`packages/ui-core/scripts/gen-icons-flutter.mjs` — and everything below applies
to each of them, with its own name, directory and workflow:

| pub package | directory | workflow | tag |
| --- | --- | --- | --- |
| `kun_ui_tokens` | `packages/ui-tokens-flutter` | `publish-pub.yml` | `kun_ui_tokens-v<version>` |
| `kun_ui_icons` | `packages/ui-icons-flutter` | `publish-pub-icons.yml` | `kun_ui_icons-v<version>` |

- **Version lockstep.** Every pub version always equals the npm version. The
  `Version and publish` step runs `node scripts/sync-pub-version.mjs` right
  after `changeset version`, which rewrites both `pubspec.yaml` files, mirrors
  the newest CHANGELOG block into both, and rewrites the version literals in
  both `README.md` files — a pub README is the package page, so a stale
  version there is published, and `kun_ui_tokens` advertised `2.32.1` for the
  whole of `2.33.0` before this was synced. It all travels inside the one
  `ci: release packages` commit. Run it by hand with `pnpm sync:pub`. Each
  generator refuses to run when its pubspec disagrees — a diverged pubspec
  would otherwise fail at the registry, after npm had already shipped.
- **Dispatched OIDC publish.** After pushing the npm tags, `release.yml` loops
  over the two packages: it pushes each tag (guarded, so a re-run skips an
  existing tag) and then **dispatches** that package's workflow on the tag ref
  with `gh workflow run`. The dispatch is not belt-and-braces, it is the
  trigger: the tags are pushed with `GITHUB_TOKEN`, and GitHub never starts
  workflows for events made with that token — the 2.33.0 tag push started
  nothing. `workflow_dispatch` is exempt from that suppression. Each workflow
  calls `dart-lang/setup-dart/.github/workflows/publish.yml@v1`, which installs
  Flutter and publishes with `id-token: write` — no token secret, same model
  as npm; pub.dev verifies server-side that the tag's `{{version}}` equals
  the pubspec version.
- **If a pub leg didn't run** (npm published but pub.dev is a version
  behind): re-push that package's tag with your own credentials —
  `git push origin :refs/tags/<tag> && git push origin <tag>` — or
  `gh workflow run <workflow> --ref <tag>`. Both are idempotent from pub.dev's
  side; a duplicate publish of an existing version is refused, not shipped
  twice.
- **A package's first release must be manual.** pub.dev only offers automated
  publishing for a package that already exists, so version one goes out as
  `dart pub publish` from that package's directory by a human with an
  authenticated `dart pub login`.
- **Then enable it on pub.dev**: package page → **Admin** → *Automated
  publishing* → *Enable publishing from GitHub Actions*, with repository
  `kungal/kun-ui` and tag pattern `kun_ui_tokens-v{{version}}` or
  `kun_ui_icons-v{{version}}`. Leave the "require GitHub Actions environment"
  box empty — neither workflow declares an environment.
- **CI gate.** `check.yml`'s `flutter-tokens` job runs `flutter pub get`,
  `dart format --set-exit-if-changed` and `flutter analyze --fatal-infos` over
  both packages on every PR. The generated Dart is written by Node scripts, so
  this is the only thing between the emitters and pub.dev.

## Consuming from another project (e.g. infra)

```jsonc
// package.json
"dependencies": { "@kungal/ui-nuxt": "^0.1.0" }
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['@kungal/ui-nuxt'] })
```
