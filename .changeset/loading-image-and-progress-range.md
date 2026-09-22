---
'@kungal/ui-tokens': minor
'@kungal/ui-core': minor
'@kungal/ui-vue': minor
---

**`KunImages.loadingImage` reaches the Flutter icon package.** `KunLoading`'s mascot has always been inlined in `@kungal/ui-vue` as `KUN_LOADING_IMAGE`, but the Flutter generator emitted only `nullImage` and `avatarFallback`, so `kun_ui_icons` carried two of the three bitmaps KunUI draws. A Flutter port of `KunLoading` therefore could not exist: the component's default form *is* that image, and taking it as a required parameter instead would be a different component from the web's. The generator now decodes it alongside the other two — the same 500×333 WebP the web renders, bundled as a package asset, so nothing needs declaring in a consumer's own `pubspec.yaml`. Nothing changes for a web consumer.

**`KunProgress` no longer reports a range a screen reader cannot use.** `aria-valuenow` has always carried the *percentage*, while `aria-valuemax` carried `max` — so a bar of 60 out of 60 announced "100 out of 60" to assistive technology whenever `max` was not 100, and the ratio a screen reader computes from the two was wrong for every `max` but the default. The ceiling is `100` now, which is the range `aria-valuenow` was already being measured against, and it agrees with the percentage `showLabel` renders. `max` still scales the input; it simply is not the reported ceiling. No visual change, and no template change for a consumer.
