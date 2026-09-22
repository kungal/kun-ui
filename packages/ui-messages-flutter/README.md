# kun_ui_messages

The Dart/Flutter string layer of [KunUI](https://github.com/kungal/kun-ui), the
shared design system of the NextMoe/KunGal ecosystem. It is the sibling of the
catalogs bundled into the npm package `@kungal/ui-core`: one generator reads one
set of catalogs and emits both, so a string cannot exist on one platform only.

Component code is not shared — Flutter has no DOM and no CSS cascade, so the
widgets are written separately. Tokens, icons and now strings are shared, and
they are generated.

## Install

```yaml
dependencies:
  kun_ui_messages: ^2.42.3
```

Pure Dart: no Flutter import, no dependencies.

## Use

```dart
import 'package:kun_ui_messages/kun_ui_messages.dart';

const messages = KunMessages.zhCN;

Semantics(label: messages.input.clear, child: child);
Text(messages.pagination.page(page: 3));
Text(messages.datePicker.monthCell(year: 2026, month: '9月'));
```

Pick one by tag when your app already has a `Locale`:

```dart
final messages = KunMessages.byCode[locale.toLanguageTag()] ?? KunMessages.zhCN;
```

`zh-CN` is KunUI's built-in default, the same as on the web.

## Why the templated strings are methods

A string with a `{placeholder}` is a method with **required named parameters**,
not a field:

```dart
messages.datePicker.monthCell(year: 2026, month: '9月')  // 2026年9月
messages.avatarGroup.label(count: 3)                     // 3 位用户
```

The whole sentence is one template because a value's position moves between
languages — `Decrease {field}` in en-US is `{field} verringern` in de-DE — so it
can never be assembled from fragments at the call site. Requiring the parameters
is what the web side cannot do: TypeScript proves the *path* is spelled right,
but not that every placeholder was supplied, so a forgotten one ships a literal
`{month}` into an accessibility label. In Dart that is a compile error.

Values are interpolated with `'$value'`, matching the web's `String(value)`. A
count that needs locale-aware number formatting must be formatted before it gets
here; this package does not do plurals, and neither does the web layer.

## What is in it

Every string KunUI's own components render by themselves: accessible names for
icon-only controls, empty and loading states, and the handful of built-in button
labels. Two catalogs — `zh-CN` and `en`.

One namespace is renamed: the web's `null` (for `KunNull`) is `nullState` here,
because `null` is a Dart reserved word. Contract entries still say
`null.description`; the mapping is recorded in
[`contracts/README.md`](https://github.com/kungal/kun-ui/blob/main/contracts/README.md).

What is **not** in it: the calendar grid's weekday and month names. Those are
dates, not strings — on the web they come from a date-fns locale, and on Flutter
they come from the SDK's own date symbols, resolved from `KunMessages.code`.

## Guarantees

- **Parity.** The catalogs are the ones the web bundle is generated from. The
  generator fails if a key or a `{placeholder}` exists in one language and not
  another, so a string cannot go missing when an app switches language.
- **Version lockstep.** This package's version always equals the version of
  the four `@kungal/*` npm packages and of `kun_ui_tokens` and `kun_ui_icons`;
  they are bumped together and published from one commit. This release is
  `kun_ui_messages 2.42.3`.

## Contributing

`lib/kun_ui_messages.dart` is generated. Edit the catalogs in
[`packages/ui-core/src/locale`](https://github.com/kungal/kun-ui/blob/main/packages/ui-core/src/locale)
and run `pnpm gen`; a PR that edits `lib` directly is regenerated away by CI.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
