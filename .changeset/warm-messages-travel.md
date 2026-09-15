---
'@kungal/ui-vue': patch
---

KunUI's strings are now a Dart package too: `kun_ui_messages` on pub.dev.

It is generated from the same catalogs the web resolves from, so a string
cannot exist on one platform only, and it rides the existing release train at
the same version as `kun_ui_tokens` and `kun_ui_icons`. Pure Dart — it declares
no Flutter dependency.

A string with a `{placeholder}` becomes a **method with required named
parameters**, not a field:

```dart
messages.datePicker.monthCell(year: 2026, month: '9月')  // 2026年9月
messages.avatarGroup.label(count: 3)                     // 3 位用户
```

That is the one thing the web side cannot offer. TypeScript proves a message
path is spelled right, because `KunMessagePath` is a template-literal union,
but it cannot prove every placeholder was supplied — a forgotten one ships a
literal `{month}` into an accessibility label. In Dart it is a compile error.

The generator refuses to run when a key or a `{placeholder}` exists in one
language and not another, so a translation cannot silently drop a value.

Nothing changes for npm consumers; this is a patch bump to carry the pub
package onto the train.
