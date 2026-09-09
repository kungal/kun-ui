/// Generated design tokens for the KunUI design system.
///
/// This package is the Dart sibling of the npm package `@kungal/ui-tokens`.
/// Both are emitted from one generator — `gen-tokens.mjs` in the kun-ui
/// monorepo — from one in-memory model, so a color here is the exact value
/// the web stylesheet ships rather than a transcription of it.
///
/// It is theme-system agnostic on purpose: plain `const` holders, no
/// `ThemeExtension` and no Material coupling, so an app can hang them off
/// whatever theme it already has.
library;

export 'src/colors.g.dart';
export 'src/motion.g.dart';
export 'src/radius.g.dart';
export 'src/shadows.g.dart';
