---
'@kungal/ui-tokens': minor
---

Spacing and the type scale are now generated tokens: `KunSpacing` and `KunText` in `kun_ui_tokens`, `spacing` and `text` in `tokens.dtcg.json`

Until now the token exports carried colour, radius, motion and elevation, but not the two scales every component is laid out with. The Flutter port felt the gap first: a form label had to hand-type `fontSize: 14, height: 20 / 14`, and a gallery heading borrowed the control-size table because there was no type scale to take.

**Where the numbers come from.** KunUI has never declared `--spacing` or `--text-*` — its components are written against Tailwind v4's default theme. So `gen-tokens.mjs` reads both straight out of `tailwindcss/theme.css` rather than restating them: a Tailwind upgrade that changes a default shows up as a diff in the generated files, and the generator refuses to run if KunUI's own `tokens.css` ever starts declaring either. The values describe the scale the components were designed at; a site that overrides `--spacing` or `--text-*` in its own `@theme` renders differently from them.

- **Dart.** `KunSpacing.unit` (4) is the step every spacing utility multiplies — `px-4` is `KunSpacing.unit * 4`, which stays a `const` expression. `KunText.xs` … `KunText.xl9` are const `TextStyle`s carrying only `fontSize` and `height` (`2xl`–`9xl` become `xl2`–`xl9`, since a Dart name cannot start with a digit); colour, weight and family stay null and inherit.
- **Half-leading.** Every `KunText` style sets `leadingDistribution: TextLeadingDistribution.even`, which is what CSS does. Measured with the same font metrics in Chromium and `flutter test`, Flutter's default `proportional` sits the baseline 1.2–2.6 px lower than the browser at `xs`–`4xl`; `even` matches it to within Chromium's pixel rounding.
- **DTCG.** `spacing.unit` is a `dimension`; each `text.<step>` is a `fontSize` dimension plus a unitless `lineHeight` number. They are not `typography` composites, because the 2025.10 format requires all five of that type's sub-values, and family, weight and letter-spacing are not part of this scale.

Nothing changes for web consumers: no CSS changed.
