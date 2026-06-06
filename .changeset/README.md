# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).
It is how KunUI versions and publishes its packages.

## How to release (day-to-day)

1. Make your code change on a branch.
2. Run `pnpm changeset` and answer the prompts:
   - All four packages share **one locked version** (the `fixed` group in
     `config.json`), so picking a bump for any of them bumps them all together.
   - Choose `patch` / `minor` / `major` and write a short summary — it becomes
     the CHANGELOG entry.
3. Commit the generated `.changeset/*.md` file alongside your code and open a PR.
4. After merge to `main`, the **Release** workflow opens (or updates) a
   "Version Packages" PR that applies the bump + writes CHANGELOGs.
5. Merge that PR → CI builds and publishes to npm via OIDC trusted publishing
   (no token, with provenance).

A PR with no changeset publishes nothing — that's expected for docs/CI-only
changes.
