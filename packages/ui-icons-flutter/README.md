# kun_ui_icons

The Dart/Flutter icon layer of [KunUI](https://github.com/kungal/kun-ui), the
shared design system of the NextMoe/KunGal ecosystem. It is the sibling of the
icons bundled into the npm package `@kungal/ui-core`: one generator reads one
list of icon names and emits both the inline SVG the web renders and the font
this package ships, so the two platforms cannot drift.

Component code is not shared — Flutter has no DOM and no CSS cascade, so the
widgets are written separately. Tokens and icons are shared, and they are
generated.

## Install

```yaml
dependencies:
  kun_ui_icons: ^2.34.0
```

The font is bundled by the package; there is nothing to declare in your own
`pubspec.yaml`.

## Use

```dart
import 'package:flutter/material.dart';
import 'package:kun_ui_icons/kun_ui_icons.dart';

const Icon(KunIcons.circleCheck);

IconButton(
  icon: const Icon(KunIcons.chevronLeft),
  onPressed: () => Navigator.of(context).pop(),
);
```

`KunIcons` members are plain `IconData`, so they inherit colour and size from
the enclosing `IconTheme` and are dropped from release builds by Flutter's
`--tree-shake-icons` like any other const icon.

## What is in it

Every [lucide](https://lucide.dev) icon KunUI's own components use. One icon in
the web set does not cross: `svg-spinners:90-ring-with-bg` is an animated SVG,
and no static font format carries motion — a Flutter app should use a
`CircularProgressIndicator` or KunUI's own spinner widget instead.

The glyphs are outlined, not stroked. lucide draws with strokes; a font glyph
has only filled contours, so the generator runs lucide's own font pipeline
(rasterise, trace, pack) to convert them. The shapes are the ones lucide's
official icon font ships, not a re-drawing.

## Guarantees

- **Stable codepoints.** An icon's codepoint is allocated once and never
  reassigned. A build compiled against an older version keeps rendering the
  icon it compiled against.
- **Parity.** The icon list is the same list the web bundle is generated from.
  An icon cannot exist on one platform only.
- **Version lockstep.** This package's version always equals the version of
  the four `@kungal/*` npm packages and of `kun_ui_tokens`; they are bumped
  together and published from one commit. This release is
  `kun_ui_icons 2.34.0`.

## Contributing

`lib/kun_ui_icons.dart` and `lib/fonts/KunUiIcons.ttf` are generated. Add an
icon to `WANT` in
[`packages/ui-core/scripts/icons-manifest.mjs`](https://github.com/kungal/kun-ui/blob/main/packages/ui-core/scripts/icons-manifest.mjs)
and run `pnpm gen:icons && pnpm gen:icons:flutter`; a PR that edits `lib`
directly is regenerated away by CI.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
