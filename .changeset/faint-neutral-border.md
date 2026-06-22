---
"@kungal/ui-tokens": patch
"@kungal/ui-vue": patch
---

fix(tokens,vue): softer neutral hairline + bordered cards by default

- KunCard shows a faint hairline border by default again (it was borderless during
  the filled-surface work) — with the lighter page and softer shadows, a hairline
  delineates the card better than shadow alone.
- The shared neutral border token (`--color-kun-border` / the `border-kun` utility)
  drops from `default-200` to `default-100` — a lighter hairline that delineates a
  surface without framing it. Every consumer softens at once: inputs, textarea,
  select & other controls, accordion, tabs, dividers, drawer rules, etc. Error
  borders (danger) and focus rings are unaffected.
