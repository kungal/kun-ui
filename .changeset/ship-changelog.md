---
'@kungal/ui-tokens': patch
'@kungal/ui-core': patch
'@kungal/ui-vue': patch
'@kungal/ui-nuxt': patch
---

chore: ship CHANGELOG.md in the published packages

`CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
so downstream can read the per-version changes straight from the npm package
page — not only from the GitHub repo. (Releases also now appear on GitHub
Releases and the docs site's auto-generated /changelog page.)
