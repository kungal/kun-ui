---
'@kungal/ui-core': minor
---

Icons now generate into two targets: the web bundle and a `kun_ui_icons` package on pub.dev

The icon list in `@kungal/ui-core` has always been the single source for every
icon KunUI renders — a fixed set, extracted from `@iconify-json` at build time
and inlined, so the library never fetches an icon at runtime. It now emits two
outputs from that one list instead of one:

- **`icons-data.ts` — byte-identical.** Nothing about the web layer changes.
  Same icons, same data, same bundle size. The list itself moved out of
  `gen-icons.mjs` into `scripts/icons-manifest.mjs` so both generators read it;
  the generated file is unchanged.
- **`kun_ui_icons` on pub.dev**, generated into `packages/ui-icons-flutter`.
  The NextMoe/KunGal apps are Flutter, and Flutter has no DOM to hand an SVG
  body to — its native icon delivery is a font plus `IconData`, which is what
  buys free `IconTheme` colour and size inheritance, `--tree-shake-icons`, and
  no runtime dependency. So the generator outlines the icons and packs them
  into a bundled TTF with one `const IconData` each:
  `Icon(KunIcons.circleCheck)`. Its version is locked to the npm version, like
  `kun_ui_tokens`: `2.33.0` here is `2.33.0` there.

lucide draws with **strokes**, and a font glyph has no stroke — only filled
contours. The generator therefore runs lucide's own font pipeline (rasterise at
800px, trace back to an outline, pack at a 1000-unit em), which is the proof
these exact shapes convert: it is how lucide's official icon font is built. The
codepoints are allocated once into a committed manifest and never reassigned,
so an app compiled against an older version keeps rendering the icon it
compiled against.

One icon does not cross. `svg-spinners:90-ring-with-bg` is an *animated* SVG,
and no static font format carries motion, so the Flutter package ships 30 of
the 31 bundled icons; a Flutter app wants a real progress-indicator widget for
that one anyway. Nothing about the spinner changes on the web.

Nothing to do as a consumer of the npm packages: no component, no icon and no
generated data changed.
