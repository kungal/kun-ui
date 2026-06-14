---
"@kungal/ui-core": patch
---

fix(core): consistent dark-mode fill for solid / shadow buttons

Filled (`solid` / `shadow`) buttons keep white text in both themes, but the dark
color scale is inverted — `bg-{color}` (a `-500`/`-600` step) renders *light* in
dark mode, so the fills came out pale and at wildly different levels: `info`
≈ L88% (near-white, white text barely legible), `default` ≈ L65%, `secondary`
≈ L72%, and `success` disagreed between the two variants (solid pinned
`dark:bg-success-300` ≈ L35% while shadow used the un-pinned `bg-success-600`
≈ L66%).

Each color now pins a `dark:bg-{color}-{n}` so every solid/shadow button lands at
a consistent ~L44–55% in dark mode (info/success/default → ~L44–46, the rest
~L47–55) — one saturated tier with legible white text. Light mode is unchanged.
