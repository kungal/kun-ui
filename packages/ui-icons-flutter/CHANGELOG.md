## 2.42.3

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.42.2

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.42.1

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.42.0

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.41.0

### Minor Changes

- 450db2e: **Keyboard focus is visible again.** `@kungal/ui-tokens/base.css` removed every outline with `*:focus { outline: none }` and drew nothing in its place. Tabbing through a KunUI app therefore showed no focus on many controls: the links in KunAvatar, KunUserChip, KunLink, KunBrand and a linked KunCard, and the buttons of KunTab, KunAccordion, KunRating, KunReaction and KunCarousel, among others. In Chrome 153, 26 of the docs site's component pages had at least one such control. The base layer now draws a ring on `:focus-visible`: 2px, primary at 50%, 2px outside the element. Keyboard focus shows it; a mouse click does not.

  What this changes for you if you import `base.css`:

  - **Your own elements get the ring too.** Buttons, links and `tabindex` elements show it when focused from the keyboard. If an element already draws its own focus style, add `outline-none` to it, as KunUI's own controls do; that utility wins over the base layer.
  - **Text fields are unchanged.** `input`, `textarea` and `[contenteditable]` keep the old reset, because they match `:focus-visible` on a click as well. KunUI's fields draw their ring on the wrapper instead.
  - **Interactive elements carry the ring's colour, width and offset while unfocused**, with no outline style, so that focusing changes only the style. Without this, an element with a `transition` class animated into the ring from a black 3px outline. The side effect: a bare `outline` utility with no colour on a button or link now draws in the ring's colour. Add a colour utility if you want `currentColor` back.

  Four components needed fixes of their own:

  - **KunSwitch:** its focus ring never appeared. The `peer-focus-visible` classes were on an element that is not a sibling of the input, which `peer-*` requires.
  - **KunRating and the remove button in KunTagInput:** both set `focus:outline-none` without drawing a ring of their own.
  - **KunTabPanel:** same as above. It is a tab stop while it is the active panel.
  - **KunTab:** the ring now sits inside the tab, in the tab's own text colour at 50%. Drawn outside, it was clipped by the scrolling tab strip on the underlined and pills variants. Drawn in primary, it disappeared on a selected primary solid or pills tab.

## 2.40.3

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.40.2

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.40.1

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.40.0

### Minor Changes

- 905b880: `kun_ui_tokens` now carries every theme value a KunUI component uses, and the generator fails when a component starts using one it does not.

  **For the Flutter port**

  - `KunPulse` (`animate-pulse`: 2 s, `Cubic(0.4, 0, 0.6, 1)`, `midOpacity` 0.5) and `KunSpin` (`animate-spin`: 1 s, linear) unblock KunSkeleton, KunAvatar's loading layer and KunProgress's indeterminate ring. The web eases each _half_ of a pulse cycle. An `AnimationController` of half `KunPulse.duration` running `repeat(reverse: true)` under a `CurvedAnimation` with `KunPulse.curve` matched Chromium within 0.0008 opacity across two cycles; easing the whole cycle once is off by up to 0.14.
  - `KunRounded` is Tailwind's own radius scale. KunSkeleton's text variant, KunLightbox and KunCommandPalette use `rounded-md` and its neighbours directly. Unlike `KunRadius`, the scale ignores `--kun-radius-scale`.
  - `KunFontWeights` is Tailwind's weight scale: `font-medium` is `KunFontWeights.medium`.
  - `KunColorScheme.border` is the `border-kun` hairline, `neutral.shade100`.
  - `KunColors.globalOpacity` (0.7) is the alpha the web draws `--color-background` and `--color-default-100` at. The schemes still store both opaque, so web `bg-default-100` is `neutral.shade100.withValues(alpha: KunColors.globalOpacity)`.
  - A few values stay unported on purpose, each with its reason in `packages/ui-tokens/scripts/theme-coverage.mjs`: the `--z-kun-*` layers, KunLoli's animate.css keyframes (copy them with the component, as with Pagination's pop), the opt-in glass knobs and the live `--kun-scrollbar-width`.
  - `tokens.dtcg.json` gains the same values: `fontWeight`, `rounded`, `motion.pulse`, `motion.spin`, `opacity.global` and a `border` alias in each mode.

  **For websites**

  - KunImage's loading placeholder, and with it KunAvatar's, now pulses only when the user has not asked for reduced motion, as KunSkeleton already did. Nothing else renders differently.

  **For contributors**

  - `pnpm gen:tokens` builds the Vue and core sources with Tailwind and fails when a component depends on a theme variable that `kun_ui_tokens` neither generates nor lists in `NOT_GENERATED` with a reason. A class, a breakpoint or a `var()` in a `<style>` block all count. `@kungal/ui-tokens` gains `@tailwindcss/oxide` and `tailwindcss` as dev dependencies for this; consumers install nothing new.

## 2.39.0

### Minor Changes

- 866effe: More of the web layer is now generated for Flutter — the rest of the Tailwind scales the components use, the sheet drag's feel, and the two offline images — and `KunShadows` now draws in Flutter the way the CSS does

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

## 2.38.0

### Minor Changes

- 8132bef: Spacing and the type scale are now generated tokens: `KunSpacing` and `KunText` in `kun_ui_tokens`, `spacing` and `text` in `tokens.dtcg.json`

  Until now the token exports carried colour, radius, motion and elevation, but not the two scales every component is laid out with. The Flutter port felt the gap first: a form label had to hand-type `fontSize: 14, height: 20 / 14`, and a gallery heading borrowed the control-size table because there was no type scale to take.

  **Where the numbers come from.** KunUI has never declared `--spacing` or `--text-*` — its components are written against Tailwind v4's default theme. So `gen-tokens.mjs` reads both straight out of `tailwindcss/theme.css` rather than restating them: a Tailwind upgrade that changes a default shows up as a diff in the generated files, and the generator refuses to run if KunUI's own `tokens.css` ever starts declaring either. The values describe the scale the components were designed at; a site that overrides `--spacing` or `--text-*` in its own `@theme` renders differently from them.

  - **Dart.** `KunSpacing.unit` (4) is the step every spacing utility multiplies — `px-4` is `KunSpacing.unit * 4`, which stays a `const` expression. `KunText.xs` … `KunText.xl9` are const `TextStyle`s carrying only `fontSize` and `height` (`2xl`–`9xl` become `xl2`–`xl9`, since a Dart name cannot start with a digit); colour, weight and family stay null and inherit.
  - **Half-leading.** Every `KunText` style sets `leadingDistribution: TextLeadingDistribution.even`, which is what CSS does. Measured with the same font metrics in Chromium and `flutter test`, Flutter's default `proportional` sits the baseline 1.2–2.6 px lower than the browser at `xs`–`4xl`; `even` matches it to within Chromium's pixel rounding.
  - **DTCG.** `spacing.unit` is a `dimension`; each `text.<step>` is a `fontSize` dimension plus a unitless `lineHeight` number. They are not `typography` composites, because the 2025.10 format requires all five of that type's sub-values, and family, weight and letter-spacing are not part of this scale.

  Nothing changes for web consumers: no CSS changed.

## 2.37.0

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.36.0

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.35.1

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.35.0

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.34.0

- Version bump only, to stay in lockstep with the KunUI release train.

## 2.33.0

- Initial release of the generated KunUI icon package.
