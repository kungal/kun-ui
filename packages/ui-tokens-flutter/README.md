# kun_ui_tokens

The Dart/Flutter token layer of [KunUI](https://github.com/kungal/kun-ui), the
shared design system of the NextMoe/KunGal ecosystem. It is the sibling of the
npm package `@kungal/ui-tokens`: the same generator emits the web stylesheet,
this package, and a [DTCG](https://www.designtokens.org/tr/2025.10/format/)
export from one in-memory model, so the two platforms cannot drift.

Component code is not shared — Flutter has no DOM and no CSS cascade, so the
widgets are written separately. Tokens are shared, and they are generated.

## Install

```yaml
dependencies:
  kun_ui_tokens: ^2.45.0
```

Requires Flutter `>=3.27.0`: every color is a `const Color.from(...)`, the
normalised-double constructor from the wide-gamut migration.

## Use

```dart
import 'package:flutter/widgets.dart';
import 'package:kun_ui_tokens/kun_ui_tokens.dart';

final scheme = MediaQuery.platformBrightnessOf(context) == Brightness.dark
    ? KunColors.dark
    : KunColors.light;

Container(
  decoration: BoxDecoration(
    color: scheme.primary.solid,
    borderRadius: BorderRadius.circular(KunRadius.md),
    boxShadow: KunShadows.md,
  ),
  padding: const EdgeInsets.symmetric(
    horizontal: KunSpacing.unit * 4, // web px-4
    vertical: KunSpacing.unit * 2, // web py-2
  ),
  child: Text(
    'Kun',
    style: KunText.sm.copyWith(color: scheme.primary.onSolid),
  ),
);

AnimatedContainer(
  duration: KunDurations.base,
  curve: KunEasing.standard,
  // ...
);
```

There is deliberately no `KunTheme` here. This package is theme-system
agnostic — plain `const` holders, no `ThemeExtension`, no Material coupling —
so the eventual widget layer stays free to pick its own theming model.

`KunSpacing`, `KunText`, `KunFontWeights`, `KunRounded`,
`KunContainerWidths`, `KunBreakpointWidths`, `KunBlur`, `KunShadows.glow`,
`KunDefaultTransition`, `KunPulse` and `KunSpin` are the Tailwind v4 defaults
KunUI's components are written against — `--spacing`, `--text-*`,
`--font-weight-*`, `--radius-*`, `--container-*`, `--breakpoint-*`,
`--blur-*`, `--shadow-lg`, the default transition, `animate-pulse` and
`animate-spin`. KunUI does not redeclare them, so the generator reads them
straight out of Tailwind's `theme.css`. A site that overrides them in its own
`@theme` renders differently; these are the design values. Each `KunText`
style sets `leadingDistribution: TextLeadingDistribution.even` — CSS's
half-leading — because Flutter's default, `proportional`, sets the glyphs
lower in the line box than a browser does. `KunPulse.curve` eases each half
of the cycle, not the whole of it; the class doc shows the controller that
draws the web's fade.

`KunFontFamilies.mono` is KunUI's own: the code face `tokens.css` declares as
`--kun-font-mono`, which `.kun-prose` sets code and `kbd` in. A CSS stack
becomes a `fontFamily` plus a `fontFamilyFallback` list, minus the CSS-only
keyword `ui-monospace`; merge `KunFontFamilies.monoStyle` onto a `KunText`
step to use it.

`scheme.border` is the hairline the web's `border-kun` draws on inputs, cards
and dividers. `KunColors.globalOpacity` is the alpha the web draws
`background` and `neutral.shade100` at; the schemes store both opaque.

Blur needs care in one direction only. A `KunBlur` step is a Gaussian
standard deviation, which is what both CSS `blur()` and `ImageFilter.blur`
take, so it passes straight through. `BoxShadow.blurRadius` is not a CSS
shadow blur: CSS blurs a shadow with σ = blur / 2 and Flutter with
σ = 0.57735 × blurRadius + 0.5, so every `blurRadius` in `KunShadows` is
converted, and a shadow written by hand from a CSS value needs the same
conversion.

Beyond the easing/duration scale, `KunShatterPhysics` carries the ballistic
model behind the web `KunShatter` component — outward impulse, air-drag
decay, gravity as a t² acceleration — as plain constants with the equations
in the doc comments. A Flutter shatter that samples that model bakes the
same trajectories the web bakes into its keyframes, instead of re-tuning
the feel by eye. `KunSwipeDismissPhysics` does the same for dragging a
bottom sheet closed: the distance and flick velocity that dismiss it, and
how hard it resists an upward drag.

## Guarantees

- **Contrast.** Every `onSolid` clears WCAG AA (≥ 4.5:1) against its `solid`
  in both modes. The generator asserts it and exits non-zero otherwise, so an
  illegible pair cannot reach a release.
- **Parity.** Colors are sRGB-clamped OKLCH, the same `clampChroma` pass the
  CSS goes through, so an app and the websites render the same color.
- **Coverage.** Every theme value a KunUI web component uses, Tailwind's or
  KunUI's own, is here, except the few that
  [`theme-coverage.mjs`](https://github.com/kungal/kun-ui/blob/main/packages/ui-tokens/scripts/theme-coverage.mjs)
  lists with a reason, the z-index layers and KunLoli's popup choreography
  among them. The generator scans the components with Tailwind's own
  compiler and fails on anything else, so a component cannot start using a
  value this package lacks.
- **Version lockstep.** This package's version always equals the version of
  the four `@kungal/*` npm packages; they are bumped together and published
  from one commit. This release is `kun_ui_tokens 2.45.0`.

## Contributing

`lib/src/*.g.dart` is generated. Edit
[`packages/ui-tokens/scripts/gen-tokens.mjs`](https://github.com/kungal/kun-ui/blob/main/packages/ui-tokens/scripts/gen-tokens.mjs)
and run `pnpm --filter @kungal/ui-tokens gen`; a PR that edits `lib/src`
directly is regenerated away by CI.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
