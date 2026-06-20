---
"@kungal/ui-tokens": minor
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

feat(tokens): regenerate the semantic palette in OKLCH with contrast-guaranteed on-colors

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
