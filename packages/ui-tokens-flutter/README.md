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
  kun_ui_tokens: ^2.34.0
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
  child: Text('Kun', style: TextStyle(color: scheme.primary.onSolid)),
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

## Guarantees

- **Contrast.** Every `onSolid` clears WCAG AA (≥ 4.5:1) against its `solid`
  in both modes. The generator asserts it and exits non-zero otherwise, so an
  illegible pair cannot reach a release.
- **Parity.** Colors are sRGB-clamped OKLCH, the same `clampChroma` pass the
  CSS goes through, so an app and the websites render the same color.
- **Version lockstep.** This package's version always equals the version of
  the four `@kungal/*` npm packages; they are bumped together and published
  from one commit. This release is `kun_ui_tokens 2.34.0`.

## Contributing

`lib/src/*.g.dart` is generated. Edit
[`packages/ui-tokens/scripts/gen-tokens.mjs`](https://github.com/kungal/kun-ui/blob/main/packages/ui-tokens/scripts/gen-tokens.mjs)
and run `pnpm --filter @kungal/ui-tokens gen`; a PR that edits `lib/src`
directly is regenerated away by CI.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
