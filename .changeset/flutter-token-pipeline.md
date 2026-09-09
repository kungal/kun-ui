---
'@kungal/ui-tokens': minor
---

Tokens now generate into three targets: the CSS, a Dart package, and a DTCG export

`gen-tokens.mjs` has always been the single source of truth for every KunUI
colour — the OKLCH hue policy, the shared lightness ramp, and the WCAG-AA
assertion that fails the build when a solid/on-colour pair drops below 4.5:1.
It now emits three sibling outputs from that one in-memory model instead of one:

- **`palette.generated.css` — byte-identical.** Nothing about the web layer
  changes. Same values, same file.
- **`kun_ui_tokens` on pub.dev**, generated into `packages/ui-tokens-flutter`.
  The NextMoe/KunGal apps are Flutter, which has no DOM, no CSS cascade and no
  Tailwind, so a Flutter app could only ever have hand-transcribed the palette.
  Every design system that does that drifts on its first retheme. This package
  is emitted from the same numbers the stylesheet ships — sRGB-clamped OKLCH
  through the same `clampChroma` pass — as plain `const` holders
  (`KunColors.light.primary.solid`, `KunEasing.standard`, `KunRadius.md`,
  `KunShadows.md`) with no `ThemeExtension` and no Material coupling. Its
  version is locked to the npm version: `2.32.1` here is `2.32.1` there.
- **A DTCG 2025.10 export** at the new subpath
  `@kungal/ui-tokens/tokens.dtcg.json`, for Figma and external token tooling.
  Colours carry their OKLCH components plus an sRGB `hex` fallback; radius,
  easing, duration and elevation carry their spec types. It is an *export*, not
  the pivot — a resolved-value format cannot express the hue policy or the
  contrast assertion, so the generator stays the source of truth.

The generator also now reads the radius, motion and elevation tokens back out of
`tokens.css` rather than duplicating them, which turns that file's "keep the
`@theme` and `:root` copies in sync" instruction into a build failure when they
disagree.

Nothing to do as a consumer: no CSS changed, and the new export subpath is
additive.
