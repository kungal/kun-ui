---
"@kungal/ui-vue": minor
---

**KunContent: opt-in editorial prose typography + first-class code-copy & compact density.**

- **New opt-in stylesheet `@kungal/ui-vue/prose.css`** — a token-driven editorial type system for any `.kun-prose` container (comfortable measure, modular heading scale, generous CJK-friendly leading, refined lists/blockquote/code/table/links, auto light/dark). It is a *separate import on purpose*: KunContent's `style.css` still ships only behaviour, so downstreams that already own their own `.kun-prose` typography are unaffected — they simply don't import it.
- **Code-block copy button is now built in.** KunContent auto-injects a self-styled (token-aware, dark-mode-aware) copy button into each code block, with click-to-copy + instant icon feedback. Idempotent: a block that already carries a `.copy` button (e.g. one emitted by a Markdown pipeline) is left untouched, so it never doubles up — downstreams can drop their own copy implementations.
- **New `compact` prop** on KunContent (adds `.kun-prose-compact`) for tighter comment/reply streams — smaller base size, leading and spacing, full-width instead of the 40rem measure. Visual effect requires importing `@kungal/ui-vue/prose.css`.

Syntax highlighting remains a content-pipeline concern (not bundled); the prose styles theme plain code blocks neutrally and compose with pre-highlighted markup.
