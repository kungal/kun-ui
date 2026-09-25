# @kungal/ui-tokens

## 2.45.0

### Minor Changes

- ff569d7: `KunNavItem`, one destination of an app shell's navigation. Every kungal site has hand-written it: the forum's rail and sidebar are lists of `KunButton`s, `flat` for the current page and `light` otherwise. The kungal Flutter app wrote the same thing a second time. It is a full-width `KunButton` with a `label`, an `icon` (or an `#icon` slot, which takes a `KunBadge`-wrapped icon for an unread count), and an `href`. `current` paints the item `flat` in `color` and adds `aria-current="page"`, so a screen reader announces the current page. The forum's hand-written items never announced it. `stacked` puts the icon over the label for a rail or a bottom bar. KunUI does not read the route: the app decides which item is current, and it arranges the items itself, in a rail, a sidebar or a bar.

  The code face is a token now. `tokens.css` declares `--kun-font-mono`, and `.kun-prose` sets both `code` and `kbd` in it, so `kbd` gains the full stack in place of `ui-monospace, monospace`. `kun_ui_tokens` carries it as `KunFontFamilies.mono`, with `monoFallback` and a `monoStyle` to merge onto a `KunText` step. Flutter has no `ui-monospace` keyword, so that entry is dropped from the Dart stack. `monospace` stays last, because Android and Linux resolve that name to the system's fixed-width face.

  `KunImage` is portable in the Flutter contract. It had been marked web-only for its `@nuxt/image` pipeline, but the layer KunImage adds itself also crosses to Flutter: the ThumbHash blur-up, the pulse skeleton, the aspect-ratio box, `objectFit`, `fallbackSrc` and the `load` / `error` events. Only the `<NuxtImg>` optimisation props and the native `<img>` hints (`loading`, `decoding`, `fetchpriority`) stay web-only.

  `KunImage`'s blur-up now cross-fades as its comments always said it did. The ThumbHash placeholder and the skeleton were removed the moment the image loaded, so the image faded in over the bare page: measured in Chromium, the placeholder was gone from the DOM in the same frame the image's opacity left 0, and the midpoint of the fade was a washed-out image on white. The placeholder now stays at full opacity until the image has finished fading in (`--kun-dur-slow`), and only then fades itself, so a transparent image does not keep it showing through. A failed load still fades it out at once, and a new `src` brings it back with no transition.

## 2.44.0

## 2.43.0

### Minor Changes

- 070a75a: **`KunImages.loadingImage` reaches the Flutter icon package.** `KunLoading`'s mascot has always been inlined in `@kungal/ui-vue` as `KUN_LOADING_IMAGE`, but the Flutter generator emitted only `nullImage` and `avatarFallback`, so `kun_ui_icons` carried two of the three bitmaps KunUI draws. A Flutter port of `KunLoading` therefore could not exist: the component's default form _is_ that image, and taking it as a required parameter instead would be a different component from the web's. The generator now decodes it alongside the other two — the same 500×333 WebP the web renders, bundled as a package asset, so nothing needs declaring in a consumer's own `pubspec.yaml`. Nothing changes for a web consumer.

  **`KunProgress` no longer reports a range a screen reader cannot use.** `aria-valuenow` has always carried the _percentage_, while `aria-valuemax` carried `max` — so a bar of 60 out of 60 announced "100 out of 60" to assistive technology whenever `max` was not 100, and the ratio a screen reader computes from the two was wrong for every `max` but the default. The ceiling is `100` now, which is the range `aria-valuenow` was already being measured against, and it agrees with the percentage `showLabel` renders. `max` still scales the input; it simply is not the reported ceiling. No visual change, and no template change for a consumer.

## 2.42.3

## 2.42.2

## 2.42.1

## 2.42.0

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

## 2.40.2

## 2.40.1

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

## 2.36.0

## 2.35.1

## 2.35.0

## 2.34.0

## 2.33.0

### Minor Changes

- d672af5: Tokens now generate into three targets: the CSS, a Dart package, and a DTCG export

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
    easing, duration and elevation carry their spec types. It is an _export_, not
    the pivot — a resolved-value format cannot express the hue policy or the
    contrast assertion, so the generator stays the source of truth.

  The generator also now reads the radius, motion and elevation tokens back out of
  `tokens.css` rather than duplicating them, which turns that file's "keep the
  `@theme` and `:root` copies in sync" instruction into a build failure when they
  disagree.

  Nothing to do as a consumer: no CSS changed, and the new export subpath is
  additive.

## 2.32.1

## 2.32.0

## 2.31.1

## 2.31.0

## 2.30.0

### Minor Changes

- 1ec5cc6: Scroll lock: publish the scrollbar width it removes, and stop compensating a page that lost nothing

  Opening a Modal, Drawer, Lightbox or CommandPalette hides the page scrollbar.
  KunUI compensates by padding `<body>`, which holds in-flow content still but
  cannot reach anything `position: fixed` — fixed positioning resolves against the
  initial containing block, and that grows by the scrollbar width. Measured on
  this repo's own docs site (Chromium 152, 15.2px classic scrollbar): a
  `top-right` toast went from `right = 1458.4` to `right = 1473.6` when the
  command palette opened, and a probe fixed at `right: 1rem` moved the same
  15.2px. There was no way for a consumer to correct it either, because the number
  was never exposed.

  It is now published on `<html>` as `--kun-scrollbar-width` for as long as a lock
  is held, so a fixed header, FAB or side rail can take it back:

  ```css
  .my-fixed-toolbar {
    right: 1rem;
    margin-right: var(--kun-scrollbar-width, 0px);
  }
  ```

  Apply it as a **margin**, not folded into `left`/`right`: a declaration
  containing `var()` is only validated after substitution, so a value that isn't a
  length invalidates the whole declaration — a dropped margin merely loses the
  compensation, a dropped `left` sends the element to its static position.
  `@kungal/ui-tokens` ships the `0px` resting value; keep the `0px` fallback
  anyway if you may be used without it. This is the same contract Radix
  (`--removed-body-scroll-bar-size`) and Reka (`--scrollbar-width`) expose.

  `KunMessageProvider` now uses it to hold its own toasts still — all of the width
  for the right-anchored placements, half for the centred ones, none for the
  left-anchored ones.

  **Also fixed:** a page that already set `scrollbar-gutter: stable` on `<html>`
  was compensated on top of a gutter that was never lost, so KunUI's padding _was_
  the layout shift — measured at 16px of content shrink on every open. The lock
  now detects a reserved gutter and adds nothing. On overlay-scrollbar platforms
  (macOS, iOS, most mobile) nothing is removed either, and the published width is
  `0px` in both cases, so one consumer declaration is correct everywhere.

  **Why KunUI does not set `scrollbar-gutter: stable` itself**, though it would
  hold fixed elements still and react-aria and Base UI both do it: a reserved
  gutter sits outside the initial containing block, and page content cannot paint
  there by any means — measured in Chrome 152, `right: -32px`, `width: 100vw` and
  a negative margin all still clipped at the ICB edge, and
  `document.elementFromPoint()` in the gutter returned `null`. Every full-bleed
  backdrop would stop ~15px short of the screen edge and show the page background
  as a bright band down the side of a dim modal, and a right-anchored Drawer would
  float 15.6px off the edge. Reserving the gutter is only viable together with
  keeping the scrollbar _rendered_, which is a larger change than this one.

  The scroll lock's standing limitations are now written down in
  `docs/INTEGRATION.md` §5 — most usefully, it does nothing at all on a page whose
  scroll container is `<html>` rather than `<body>` (`html { overflow-y: scroll }`
  and friends), which has always been true and is now stated.

  **What it costs you:** nothing to change. The only new thing KunUI touches is
  one custom property on `<html>`, saved and put back on close so a value of your
  own survives; if you observe root attribute mutations, expect a `style` change
  on open and on close. If you were correcting KunUI's shift by hand in an app
  stylesheet, replace it with the variable — it is correct on the platforms where
  your hand-rolled constant was not.

## 2.29.0

## 2.28.0

## 2.27.0

## 2.26.3

## 2.26.2

## 2.26.1

## 2.26.0

## 2.25.1

## 2.25.0

## 2.24.0

## 2.23.0

## 2.22.0

## 2.21.0

## 2.20.0

## 2.19.1

## 2.19.0

## 2.18.2

## 2.18.1

## 2.18.0

## 2.17.0

## 2.16.0

## 2.15.1

## 2.15.0

## 2.14.1

## 2.14.0

## 2.13.1

## 2.13.0

## 2.12.2

## 2.12.1

## 2.12.0

## 2.11.0

## 2.10.0

## 2.9.1

## 2.9.0

## 2.8.3

## 2.8.2

## 2.8.1

## 2.8.0

## 2.7.1

## 2.7.0

## 2.6.0

## 2.5.0

## 2.4.0

## 2.3.1

## 2.3.0

## 2.2.0

## 2.1.1

## 2.1.0

## 2.0.1

## 2.0.0

## 1.14.2

### Patch Changes

- c27e274: fix(tokens): lighten the secondary colour to a softer pink

  `secondary`'s solid lightness goes 0.74 → 0.80 (OKLCH `0.8 0.152 341.5`) — a paler,
  fresher pink. Its foreground flips to dark (white is illegible on the lighter fill);
  the generator re-derives it by measured contrast and still asserts WCAG AA on every
  solid pair in both light and dark.

## 1.14.1

## 1.14.0

## 1.13.0

## 1.12.1

## 1.12.0

## 1.11.0

## 1.10.1

## 1.10.0

## 1.9.5

## 1.9.4

## 1.9.3

### Patch Changes

- 0b42fd3: perf: stop shipping backdrop-filter on every surface (mobile scroll jank)

  KunCard shipped `backdrop-filter: blur(var(--kun-background-blur))` on EVERY card —
  and the default blur was `0px` over an opaque surface, so it did nothing visually
  while still promoting each card to a compositing layer and running the backdrop
  pipeline. `backdrop-filter: blur()` is the #1 cause of janky scrolling on mobile
  (a 120Hz phone can drop to ~30–60Hz). With many cards per page the layers piled up.

  - KunCard / KunModal now emit `backdrop-filter` only via the new opt-in
    `kun-backdrop` utility, which is `none` by default (free — no layer, no blur pass).
  - New token `--kun-backdrop-filter` (default `none`) **replaces `--kun-background-blur`**.
    A glass site opts in for every raised surface at once:
    `:root { --kun-surface-opacity: 0.7; --kun-backdrop-filter: blur(12px); }`

  BREAKING (glass only): if you set `--kun-background-blur: 12px`, switch to
  `--kun-backdrop-filter: blur(12px)`. Sites that never enabled glass are unaffected
  (and get smoother scrolling for free).

## 1.9.2

### Patch Changes

- b673935: fix(tokens,vue): softer neutral hairline + bordered cards by default

  - KunCard shows a faint hairline border by default again (it was borderless during
    the filled-surface work) — with the lighter page and softer shadows, a hairline
    delineates the card better than shadow alone.
  - The shared neutral border token (`--color-kun-border` / the `border-kun` utility)
    drops from `default-200` to `default-100` — a lighter hairline that delineates a
    surface without framing it. Every consumer softens at once: inputs, textarea,
    select & other controls, accordion, tabs, dividers, drawer rules, etc. Error
    borders (danger) and focus rings are unaffected.

## 1.9.1

### Patch Changes

- 7a2c64d: fix(vue,tokens): bordered inputs, softer shadows, lighter page background

  - Form controls (Input, Textarea, Select, NumberInput, Autocomplete, DatePicker,
    TagInput flat, PinInput, Pagination jump field, Select's inline search) get a
    card-like neutral border back on top of the filled surface — the borderless
    fill was too hard to spot on a card. Error state recolours the border to danger
    instead of a persistent ring. (= the shadcn "border + fill + subtle shadow" input.)
  - Elevation scale softened ~30% across all three tiers (sm/md/lg) — lighter, tighter
    shadows on cards, inputs, dropdowns, modals.
  - Light page background nudged brighter (#f2f2f5 → #f4f4f7). Dark unchanged.

## 1.9.0

## 1.8.3

### Patch Changes

- 2c352d6: fix(tokens): lighten the page background a touch

  The light page background goes from `#eeeef1` back up to `#f2f2f5` — the previous
  value made the step up to a white card feel abrupt. Cards still pop (≈13 units)
  but the transition is gentler. Dark mode unchanged.

## 1.8.2

### Patch Changes

- 117063e: fix(tokens,vue): give surfaces breathing room + refine KunCard hover

  - The light page background is a touch deeper (`#f5f5f7` → `#eeeef1`) so white
    cards/surfaces pop more (≈17 vs ≈10 units) and there's room for interaction
    states. Dark mode is unchanged (it already had ample headroom).
  - KunCard hover feedback now applies only to interactive cards (`href` /
    `clickable`) or an explicit `isHoverable`; a plain static card no longer reacts.
  - Hover is a faint `foreground` state layer (≈3%, via `::after`) — darkens
    slightly in light, lightens in dark — and stays clearly brighter than the page
    (no surface-colour swap, no shadow change).
  - KunNumberInput stepper buttons use `hover:bg-foreground/8` (a normal control
    hover) instead of the absolute `bg-default-100`.

## 1.8.1

### Patch Changes

- c2f4bda: feat(tokens): add `--kun-surface-opacity` for themeable surface transparency (glass)

  The raised surface (`content1` — cards, popovers, dropdowns, inputs, modal,
  drawer) now resolves its alpha through `--kun-surface-opacity`, default `1`
  (fully opaque, no visual change). A site with a background image (e.g. a galgame
  page) can make every surface see-through at once, with no component changes:

  ```css
  :root {
    --kun-surface-opacity: 0.7;
    --kun-background-blur: 12px;
  }
  ```

  Components don't ship a `backdrop-blur` on every surface, so set
  `--kun-background-blur` too if you want true frosted glass rather than plain
  translucency. Default sites are unaffected.

## 1.8.0

### Minor Changes

- 3e821c4: feat(tokens,vue): surface-elevation system — cards & inputs pop by fill+shadow, not borders

  Move from a border-defined look to an elevation scale. The page background is now
  a soft neutral (light `#f5f5f7`, dark near-black `#0a0a0a`) instead of pure
  white/black, so raised surfaces read as raised:

  - **Card** is a raised surface — `bg-content1` (`#fff` / `#18181b`) + `shadow-kun-sm`;
    border is now OFF by default (`bordered` is opt-in). It no longer shares the
    page background.
  - **Inputs are borderless and share the card surface**: Input, Textarea, Select,
    NumberInput, TagInput, PinInput, Autocomplete, DatePicker trigger and the
    Pagination field use `bg-content1` + `shadow-kun-sm` (same fill as a card, lifted
    by a small shadow). The error state is a danger **ring**, not a border.
  - **Floating panels lose their border** and rely on shadow + the `content1`
    surface: Dropdown, Select/Autocomplete lists, ContextMenu, Popover, Tooltip,
    DatePicker calendar, Modal, Drawer.
  - **Placeholder** now uses a theme-adaptive `::placeholder` colour (the browser
    default grey didn't follow light/dark).

  Visual change only; component APIs are unchanged except `KunCard`'s `bordered`
  default (true→false) and `KunTagInput`'s `variant` default (bordered→flat).

## 1.7.0

### Minor Changes

- 82de3b5: feat(tokens): regenerate the semantic palette in OKLCH with contrast-guaranteed on-colors

  The whole semantic color system is now **generated** (scripts/gen-tokens.mjs,
  OKLCH via culori) instead of hand-authored HSL. Each hue is defined once by its
  OKLCH hue + a vivid `solidL`; every shade is laid on a perceptual lightness ramp
  (so `-500` means the same perceived lightness for every color), and each color
  ships a paired **`--color-{c}-foreground`** on-color DERIVED by measured WCAG
  contrast. The generator asserts AA on every solid (fill, text) pair in BOTH light
  and dark and fails the build on any regression — illegible solids can't ship
  again. Adds the previously-missing `-950` shade.

  What changes visually: solids keep HeroUI-style vivid fills (bright amber warning,
  bright green success — no more muddy darkened `-600` fills), with white text on
  the medium hues (primary/danger/default) and a refined dark tint on the bright
  ones (secondary/success/warning/info). Solids are now mode-independent, so the
  per-variant `dark:bg-{c}-{n}` pins are gone. **This is a visual change** to every
  colored surface; the component API (color/variant names) is unchanged.

  `@kungal/ui-core`: `kunSolidClasses` / `kunSolidFgClasses` / `kunSolidBgClasses`
  and the Button solid/shadow rows now use `bg-{c} text-{c}-foreground`. CheckBox,
  DatePicker, Switch, Carousel drop their hardcoded white/black + dark pins.

## 1.6.3

## 1.6.2

### Patch Changes

- 05f2bee: chore: ship CHANGELOG.md in the published packages

  `CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
  so downstream can read the per-version changes straight from the npm package
  page — not only from the GitHub repo. (Releases also now appear on GitHub
  Releases and the docs site's auto-generated /changelog page.)

## 1.6.1

## 1.6.0

## 1.5.0

## 1.4.2

## 1.4.1

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.1

## 1.1.0

## 1.0.0

### Major Changes

- ac0bd4e: 1.0.0 — first stable release.

  The component set (57 Vue components) and the design-token system are stable and
  documented. Over the 0.14 → 0.22 line every cross-cutting surface was routed
  through a single source of truth: borders (`--color-kun-border` / `border-kun`),
  focus rings (`kunFocusRingClasses`), corner radius (`rounded-kun-*` /
  `--kun-radius-scale`), elevation (`--shadow-kun-*`), motion (`--kun-dur-*` +
  `duration-kun-*` + `ease-kun-*`), and sizing (`kunControlSize` /
  `kunSelectionSize` / `kunChipSize`).

  Also fixes a registration gap surfaced while completing the docs: `KunAutocomplete`,
  `KunNumberInput`, and `KunPinInput` (added in 0.14.0) were never added to the Nuxt
  layer's auto-import list, so Nuxt consumers hit "Failed to resolve component". They
  now auto-import like every other component (plain-Vue `app.use(KunUI)` already
  registered them). Their docs pages, prop tables, and `llms.txt` entries are added.

## 0.22.4

## 0.22.3

## 0.22.2

## 0.22.1

## 0.22.0

## 0.21.0

## 0.20.0

### Minor Changes

- 40e8abf: feat: unified elevation scale + misc token cleanups

  **Elevation scale** — floating surfaces were assigned `shadow-md` / `shadow-lg` /
  `shadow-2xl` ad hoc, so same-kind surfaces disagreed (Select & Autocomplete
  option lists were `shadow-lg`, but Dropdown & ContextMenu menus were `shadow-2xl`;
  Modal had no shadow at all). New three-tier scale in `@kungal/ui-tokens` —
  `--shadow-kun-sm` / `-md` / `-lg`, generating `shadow-kun-sm|md|lg` utilities
  (they compose with `ring-*` via `--tw-shadow`, so a ringed toast still gets its
  elevation). Applied by tier:

  - **sm** — tooltips, slider value bubble
  - **md** — popovers, dropdowns, context menus, select/autocomplete/date lists, toasts
  - **lg** — modals (now actually elevated), drawers

  **Misc consistency cleanups:**

  - Raw Tailwind radii routed through the token scale: `KunBrand` / `KunNull`
    `rounded-2xl` → `rounded-kun-lg`; `KunLoading` `rounded-lg` → `rounded-kun-md`
    (so `--kun-radius-scale` now affects them too). The dark `KunLightbox` viewer
    chrome keeps its own radii intentionally.
  - `KunNumberInput` stepper buttons: `disabled:opacity-40` → `disabled:opacity-50`
    to match every other disabled control.

- 40e8abf: feat: route component transitions through the motion scale

  Transitions hardcoded raw `duration-150/200/300` and raw `ease-in/out/in-out`
  that didn't match the designed motion tokens (overlay enters were `200ms` but
  `--kun-dur-base` is `250ms`; some controls used symmetric `ease-in-out` while the
  rest used the asymmetric `ease-kun-*` curves). Now unified:

  - New `duration-kun-fast | base | slow | exit` utilities bound to `--kun-dur-*`
    (with literal fallbacks). Every component transition routes through them, so a
    global motion retune via the tokens actually propagates.
  - Mapped by role, preserving the asymmetric rhythm (enter decelerates, exit
    accelerates): overlay **enter → base**, **leave → exit**, hover/selection/focus
    **micro → fast**, skeleton/fade/large **→ slow**.
  - Remaining raw `ease-in-out` / `ease-out` Tailwind classes (Avatar, Input,
    Textarea, Progress) switched to `ease-kun-standard` / `ease-kun-out`; scoped-style
    easings (Content, Ripple) now read `var(--ease-kun-*)`. The looping indeterminate
    progress keyframe and the dark Lightbox viewer keep their own timing.

  Net effect: a single, consistent motion feel across every control. No API changes.

## 0.19.1

## 0.19.0

## 0.18.1

## 0.18.0

### Minor Changes

- 6fa75bb: feat(tokens,vue): unified neutral border token (`--color-kun-border` / `border-kun`)

  Every structural hairline (inputs, textareas, selects, autocomplete, date picker,
  cards, dividers, tabs, tooltips, popovers, dropdowns, context menus, drawers,
  pagination, slider tooltip, radio cards, tag input) now resolves to ONE semantic
  token instead of a scatter of `border-default-200` / `border-default/20` /
  `dark:border-default-200` + a per-component `darkBorder` toggle.

  - **New:** `--color-kun-border` (defaults to the `default-200` step, so it flips
    light↔dark automatically) and a `border-kun` utility. Retheme every border at
    once by overriding `--color-kun-border` (set it under `.kun-dark-mode` too for a
    fixed non-flipping value). The global `*` border-color (opinionated base layer)
    now points at this token as well, so a bare `border` matches `border-kun`.
  - **Fixed:** `KunDivider` (and any control that used the translucent
    `border-default/20` without a dark override) was ~half as bright as other
    hairlines in dark mode (L13% vs L26%); it now matches everything else (L26%).
  - **Consistency:** light mode is visually unchanged (the old `default/20`-over-white
    already ≈ `default-200`); dark mode now collapses to a single neutral border value
    across all components.
  - Interactive-control borders intentionally stay one step stronger (checkbox/radio
    boxes `default-300`, slider thumb) per common design-system practice — they are
    not structural hairlines.
  - **Deprecated (no-op):** the `darkBorder` prop on Input/Textarea/NumberInput/
    Select/Autocomplete/DatePicker/Card. Safe to remove from call sites; kept for
    backward compatibility. Note: an un-bordered `KunCard` that relied on
    `darkBorder` to show a dark-only border should now use `bordered`.

## 0.17.2

### Patch Changes

- 9989b7c: fix(tokens): restore Modal / Drawer / Tab-indicator / toast / FadeCard animations

  The motion duration tokens (`--kun-dur-fast/base/slow/exit`) were declared only
  inside `@theme`. Tailwind v4 only emits an `@theme` variable to `:root` when its
  scanner sees it "used", and these tokens have no utility namespace and are read
  solely via `var(--kun-dur-base)` inside component `<style>` blocks / inline
  styles — which Tailwind never scans. So in a normal downstream build they were
  tree-shaken out of `:root`, every `transition: … var(--kun-dur-…) …` resolved to
  `var(<undefined>)`, the whole shorthand was invalidated, and the enter/leave
  animations on Modal, Drawer, the Tab indicator, toasts and FadeCard silently
  collapsed to instant (regression from the "unified motion system" change).

  They are now mirrored into a plain `:root` block (never tree-shaken), exactly
  like the z-index fallbacks, so the animations resolve in every consumer build.
  No API change.

## 0.17.1

## 0.17.0

## 0.16.0

## 0.15.0

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

## 0.10.0

### Minor Changes

- 7f8495d: A unified motion system — smoother, more consistent animation across every
  component.

  **Motion tokens (@kungal/ui-tokens).** One easing set + duration scale so the
  whole library shares a rhythm instead of each component inventing its own:
  `--ease-kun-standard / -out / -in / -emphasized` (also exposed as Tailwind
  `ease-kun-*` utilities) and `--kun-dur-fast / -base / -slow / -exit`. Curves are
  asymmetric by design — decelerate on enter, accelerate on exit — and exits run
  ~30% shorter than enters. The opinionated base layer now also honours
  `prefers-reduced-motion: reduce` (WCAG 2.3.3).

  **Killed the layout-thrashing animations** (these caused visible stutter):

  - **KunTab** indicator no longer transitions `height` (it never changes between
    same-row tabs); it slides via `transform` and only its `width` animates.
  - **KunFadeCard** expands via the grid `0fr → 1fr` trick instead of `max-height`
    — no more `max-h-96` clipping of tall content, no per-frame height recalc.
  - **KunMessage** progress bar shrinks via `transform: scaleX` (compositor)
    instead of animating `width`.

  **Overlays retuned and made origin-aware.** KunModal now fades its backdrop
  (opacity only) while the panel rises + scales independently; KunDrawer’s backdrop
  and panel are timing-matched. KunDropdown / KunSelect / KunPopover / KunDatePicker
  / KunContextMenu now **grow out of their trigger** — `transform-origin` follows
  the floating-ui placement, so a menu that flips above its trigger correctly grows
  from its bottom edge. Every overlay shares the `ease-kun-*` curves and timing.

  **Micro-interactions.** KunSlider’s thumb gains a hover/focus ring halo (it had
  no feedback before); KunSwitch gains a keyboard `focus-visible` ring and a
  springier thumb settle; KunCheckBox’s check eases in with the emphasized curve.

  No component API changed. KunFadeCard now wraps its slot in a grid container (a
  DOM-structure change); if you targeted its immediate child with CSS, retarget the
  inner content.

## 0.9.0

### Minor Changes

- 0a57065: Make the default corner radius rounder, HeroUI-style.

  The `--radius-kun-*` scale grows so the default control radius lands at HeroUI's
  12px (it was 8px):

  | bucket | before      | after |
  | ------ | ----------- | ----- |
  | sm     | 4px         | 6px   |
  | md     | 12 ←default | 12px  |
  | lg     | 12px        | 16px  |

  `md` (every component's default) is now **12px**, `lg` (floating panels — dropdown
  / context-menu / toast) is **16px**, which keeps their concentric nesting exact
  (panel 16 = item 12 + the 4px `p-1` inset). The `--kun-radius-scale` runtime knob
  still multiplies on top, and `none` / `full` still don't scale.

  One component needed a fix at the larger radius: **KunCheckBox**. Its small square
  box would look circular at a 12px token radius (12px ≈ half a 16–20px box), so the
  box now uses a proportional `35%` radius — a rounded square at every size, never a
  circle (matching how HeroUI derives its checkbox radius). The radio-look variant
  stays a full circle. No other component needed a size change; pill/circle controls
  (chips, avatars, switch, slider) are unaffected.

## 0.8.0

## 0.7.0

## 0.6.2

## 0.6.1

## 0.6.0

## 0.5.2

## 0.5.1

### Patch Changes

- bef6580: Add a runtime `--kun-radius-scale` knob for corner radius.

  The scalable radius tokens (`sm` / `md` / `lg`) now multiply their base by
  `var(--kun-radius-scale, 1)`, so a consumer can drive **every** KunUI corner at
  once from a single CSS variable — live, with no re-render and no config change:

  ```css
  :root {
    --kun-radius-scale: 0;
  } /* square corners everywhere */
  :root {
    --kun-radius-scale: 1.5;
  } /* 50% rounder everywhere   */
  ```

  The default (`1`) leaves everything unchanged. `none` and `full` deliberately
  don't scale (a square stays square; a pill stays a pill). Because
  `--kun-radius-scale` is a separate, consumer-owned variable that the token
  `calc()` reads, it avoids the cascade-order trap of trying to override
  `--radius-kun-*` directly. (Small controls clamp `border-radius` to ~half their
  height, so a button can't get rounder than a pill — by design.)

## 0.5.0

## 0.4.1

## 0.4.0

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

### Patch Changes

- 24de30a: Fix floating layers (popover / tooltip / modal / dropdown / drawer / select /
  context-menu / alert / message) stacking at `auto` and getting covered by
  positioned elements (carousels, sticky headers) in some consumer builds.

  The `z-kun-*` z-index utilities deref a `@theme` variable with no fallback
  (`z-index: var(--z-kun-popover)`). Tailwind v4 only emits a `@theme` variable to
  `:root` when its tree-shaker considers it "used", and a custom `@utility`
  referencing the var does not reliably count as usage across consumer
  builds/versions — so `--z-kun-*` can be dropped from `:root`, leaving
  `z-index: var(<undefined>)` → no z-index. Each utility now carries a literal
  fallback (e.g. `var(--z-kun-popover, 9300)`), so the z-index always resolves;
  a consumer's `:root { --z-kun-*: … }` override still wins when present.

## 0.3.0

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.1

## 0.2.0

### Minor Changes

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
