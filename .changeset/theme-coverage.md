---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
---

`kun_ui_tokens` now carries every theme value a KunUI component uses, and the generator fails when a component starts using one it does not.

**For the Flutter port**

- `KunPulse` (`animate-pulse`: 2 s, `Cubic(0.4, 0, 0.6, 1)`, `midOpacity` 0.5) and `KunSpin` (`animate-spin`: 1 s, linear) unblock KunSkeleton, KunAvatar's loading layer and KunProgress's indeterminate ring. The web eases each *half* of a pulse cycle. An `AnimationController` of half `KunPulse.duration` running `repeat(reverse: true)` under a `CurvedAnimation` with `KunPulse.curve` matched Chromium within 0.0008 opacity across two cycles; easing the whole cycle once is off by up to 0.14.
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
