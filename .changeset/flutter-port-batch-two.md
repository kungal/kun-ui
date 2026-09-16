---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
---

More of the web layer is now generated for Flutter — the rest of the Tailwind scales the components use, the sheet drag's feel, and the two offline images — and `KunShadows` now draws in Flutter the way the CSS does

**Web changes** (small, but visible):

- **`KunTextarea`'s counter no longer reads `n/100007`.** `maxlength` defaulted to 100007, so `show-char-count` without a `maxlength` printed that number as the limit, and downstream pages were showing it. The default is gone: with `maxlength` the counter reads `used/maxlength`, without it the bare count. The cost: a textarea with no `maxlength` no longer has a hidden native cap of 100007 characters. If your server enforces a length, pass it as `maxlength` so the field and the counter know about it.
- **`KunAvatar` and `KunUserChip`: `disableFloating` and `floatingPosition` are marked `@deprecated`.** Neither component has a floating card any more; the props still type-check so existing call sites compile, and your editor now shows them struck through. `KunUserChip` stopped passing them on to an avatar that ignored them.
- **`KunTab` and `KunCarousel` scroll buttons use `backdrop-blur-sm`** instead of the bare `backdrop-blur`, which Tailwind v4 keeps only as a deprecated alias. Both are 8px; nothing renders differently.
- **`@kungal/ui-core` exports `KUN_SWIPE_DISMISS_PHYSICS`** — the distance ratio, flick velocity and rubber-band limit behind the KunModal/KunDrawer drag-to-dismiss, now read from the shared motion manifest instead of literals in the composable. Same values, no behaviour change.
- The docs props tables and page Markdown now mark deprecated props, and `component-meta.json` / `contracts/component-contracts.json` carry a `deprecated` field on them.
- The docs changelog now shows the notes of releases whose changeset named `ui-core`, `ui-tokens` or `ui-nuxt` rather than `ui-vue`; 13 of them, 2.38.0 included, read "updated with dependencies" until now.

**Flutter (`kun_ui_tokens`, `kun_ui_icons`):**

- **`KunShadows` blur is converted, not copied — shadows look different, and correct.** CSS blurs a shadow with σ = blur / 2; `BoxShadow` turns `blurRadius` into σ = 0.57735 × blurRadius + 0.5. Every earlier release passed the CSS number straight through, so every elevation drew about 20% softer than the web. Measured against Chromium on the same shapes, `KunShadows.lg` on a rounded box had 6249 color channels more than 2/255 off before this fix and 33 after. If you wrote your own `BoxShadow` from a CSS value, it needs the same conversion.
- **More Tailwind defaults, read from Tailwind** (like `KunSpacing` and `KunText` in 2.38.0): `KunContainerWidths` (`max-w-*`, 3xs–7xl), `KunBreakpointWidths` (sm–2xl), `KunBlur` (`blur-*` / `backdrop-blur-*`; a step is a standard deviation and passes straight into `ImageFilter.blur`), `KunShadows.glow(color)` (`shadow-lg` in a tint — the `shadow` variant's glow) and `KunDefaultTransition` (the 150 ms curve that a bare `transition` runs, which is most of KunUI's hover and press feedback). Names with a leading digit become `xl2`, `xs3` and so on. `KunBreakpointWidths` is deliberately not `KunBreakpoints`, which `kun_ui` already defines.
- **`KunColors.white` and `KunColors.black`**, the two colors that do not change with the mode.
- **`KunSwipeDismissPhysics`** — the feel of dragging a bottom sheet closed, generated from the same manifest as the web constant. `closeVelocity` is in px/s, the unit of `DragEndDetails`. The web's other drag constants (claim slop, velocity window, scroll cooldown, open grace) are tuned to browser mechanics and stay web-only.
- **`KunImages.nullImage` and `KunImages.avatarFallback`** in `kun_ui_icons`: KunNull's mascot and KunAvatar's last fallback, bundled as package assets (the exact bytes the web inlines as data URIs), so a Flutter app draws them without a network request and without declaring anything in its own pubspec.
- **DTCG** gains `container`, `breakpoint`, `blur`, `motion.defaultTransition`, `color.white` and `color.black`.

Not generated, on purpose: Pagination's timings and pop keyframes and Select's type-ahead delay are one component's own choreography, so the Flutter port copies them from source. The `shadow` variant keeps Tailwind's `shadow-lg` rather than switching to `shadow-kun-lg`, which is the elevation scale and would restyle every `variant="shadow"` button.
