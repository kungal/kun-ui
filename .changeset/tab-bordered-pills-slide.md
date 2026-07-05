---
'@kungal/ui-vue': patch
---

fix(vue): KunTab `bordered` and `pills` now slide the active indicator

The sliding indicator (the element that animates between tabs via `transform`)
was only rendered for `underlined`/`solid`/`light` — `bordered` and `pills` fell
through to `indicatorClasses` returning `null`, so their active state only did an
in-place color fade and looked like it had no switch animation. Both variants now
get the same measured, sliding indicator (a rounded-full solid pill for `pills`,
a colored outline for `bordered`), with the per-tab fill/border gated to the
pre-hydration fallback exactly like `solid`/`light` — no hydration flash, no
layout shift. Respects `disableAnimation`.
