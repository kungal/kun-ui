---
'@kungal/ui-core': minor
'@kungal/ui-vue': patch
---

fix(vue): legible foreground on solid/filled color variants (esp. dark mode)

Solid fills painted white text on `bg-{color}`, which has two problems verified
by contrast measurement:

1. The dark color scale is inverted, so a plain `bg-{color}` renders **pale** in
   dark mode — white text dropped to ~1.0–2.5:1 (the `solid` Info `info` callout
   was essentially invisible, white on near-white).
2. The light hues (secondary / success / warning / info) are light in **both**
   modes, so white text fails WCAG everywhere (~2:1), not just in dark mode.

New single source of truth in `@kungal/ui-core` — `kunSolidClasses`,
`kunSolidBgClasses`, `kunSolidFgClasses` — pairs each fill with a `dark:bg-*`
pin (stays saturated in dark mode) and a contrast-correct foreground: the dark
hues (default / primary / danger) keep white, the light hues take dark text.
Every solid foreground now clears WCAG AA in both modes (≈4.1–10.3:1).

Applied to: Button / Chip (shared variant matrix), Info (`solid` / `shadow` — the
reported bug; its title no longer overrides the box foreground), Badge, Progress
(on-bar label), Tab (`solid` / `pills`), DatePicker (selected day), CheckBox
(checked fill + check/dash mark), Switch (on-track).

Visible change: `secondary` / `success` / `warning` / `info` solid components now
use dark text instead of (illegible) white.
