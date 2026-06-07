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

## Consuming from another project (e.g. infra)

```jsonc
// package.json
"dependencies": { "@kungal/ui-nuxt": "^0.1.0" }
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['@kungal/ui-nuxt'] })
```
