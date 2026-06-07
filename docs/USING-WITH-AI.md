# Using KunUI with AI coding tools

KunUI ships machine-readable docs so AI assistants (Claude Code, Cursor, Copilot,
…) can use it **correctly** instead of hallucinating APIs.

## What's available

- **[`llms.txt`](../llms.txt)** — a compact index (~a few KB): the critical
  rules, install commands, and a one-line description of every component and
  composable. Fits any context window.
- **[`llms-full.txt`](../llms-full.txt)** — the full integration guide plus a
  component reference inlined into one markdown file, for tools that ingest a lot
  of context.

Both are generated from a single source of truth (`scripts/gen-llms.mjs`); run
`pnpm gen:llms` after changing components.

## How to use it

**Claude Code / Cursor (point the agent at the docs):**

```
Read https://github.com/kungal/kun-ui/blob/main/llms.txt and use KunUI to …
```

or fetch the full docs for deeper tasks:

```
Read https://github.com/kungal/kun-ui/blob/main/llms-full.txt then build …
```

**Pin the rules into your repo (recommended).** Add a KunUI section to your
project's `AGENTS.md` / `CLAUDE.md` / `.cursorrules` so every session has the
non-obvious rules without fetching anything. Copy this block:

```md
## KunUI (@kungal/ui-vue / @kungal/ui-nuxt)

- HTML is NEVER sanitized. Before passing user/untrusted HTML to `<KunContent>`
  or `useKunMessage(..., richText=true)`, sanitize it yourself (e.g. DOMPurify).
- Icons are bundled, never fetched. Use `<KunIcon name="lucide:check" />` with
  bundled names; register custom ones with `registerKunIcon(s)` from
  `@kungal/ui-core`. Never rely on a runtime Iconify fetch.
- The app owns its Tailwind v4 entry stylesheet. It must contain, in order:
  `@import 'tailwindcss';` · `@import '@kungal/ui-tokens';` ·
  `@import '@kungal/ui-vue/style.css';` and `@source` directives pointing at
  `@kungal/ui-vue` and `@kungal/ui-core`. Install both as direct deps (pnpm).
- Dark mode = toggle the `kun-dark-mode` class on `<html>`.
- Mount `<KunMessageProvider/>`, `<KunAlertProvider/>`, `<KunLoliProvider/>`
  once near the app root if you use toasts / confirm dialogs / the mascot.
- Full setup: docs/INTEGRATION.md.
```

**Context7 (zero-setup, version-specific docs in your editor):** point Context7
at the public repo so Cursor / Claude Code pull real KunUI docs on demand —
see https://context7.com.

## Why this matters

Without machine-readable docs, agents guess prop names, miss the sanitize rule,
forget the `@source` lines, or try to fetch icons at runtime. `llms.txt` +
`llms-full.txt` + a pinned rules block eliminate those failure modes.
