---
"@kungal/ui-tokens": patch
---

fix(tokens): restore Modal / Drawer / Tab-indicator / toast / FadeCard animations

The motion duration tokens (`--kun-dur-fast/base/slow/exit`) were declared only
inside `@theme`. Tailwind v4 only emits an `@theme` variable to `:root` when its
scanner sees it "used", and these tokens have no utility namespace and are read
solely via `var(--kun-dur-base)` inside component `<style>` blocks / inline
styles — which Tailwind never scans. So in a normal downstream build they were
tree-shaken out of `:root`, every `transition: … var(--kun-dur-…) …` resolved to
`var(<undefined>)`, the whole shorthand was invalidated, and the enter/leave
animations on Modal, Drawer, the Tab indicator, toasts and FadeCard silently
collapsed to instant (regression from the "unified motion system" change).

They are now mirrored into a plain `:root` block (never tree-shaken), exactly
like the z-index fallbacks, so the animations resolve in every consumer build.
No API change.
