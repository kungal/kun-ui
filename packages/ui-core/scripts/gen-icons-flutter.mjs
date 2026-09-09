// ─────────────────────────────────────────────────────────────────────────────
// The Flutter half of the icon pipeline: one SVG source, two outputs.
//
// gen-icons.mjs turns the icons in WANT into inline SVG for the web. Flutter
// has no DOM to hand an SVG body to, and its native icon delivery is a font +
// `IconData` — that is what buys free IconTheme colour/size inheritance,
// `--tree-shake-icons`, and zero runtime dependencies. So this script emits the
// pub.dev package `kun_ui_icons` from the same WANT list: an outlined TTF plus
// one const per icon.
//
// The pipeline is lucide's own font build (lucide-icons/lucide,
// tools/build-font), which is the proof these exact stroke icons survive the
// conversion: rasterise at 800px, potrace back to a filled outline, pack at
// fontHeight 1000 with normalize off. lucide icons are STROKED — a font glyph
// has no stroke, only a filled contour — so the outline step is not an
// optimisation, it is the only way these shapes become glyphs at all.
//
// Run: pnpm --filter @kungal/ui-core gen:icons:flutter
// ─────────────────────────────────────────────────────────────────────────────
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import SVGFixer from 'oslllo-svg-fixer'
import svg2ttf from 'svg2ttf'
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont'
import { PKG, WANT } from './icons-manifest.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUB_DIR = join(HERE, '../../ui-icons-flutter')
const FONT_OUT = join(PUB_DIR, 'lib/fonts/KunUiIcons.ttf')
const DART_OUT = join(PUB_DIR, 'lib/kun_ui_icons.dart')
const PUBSPEC = join(PUB_DIR, 'pubspec.yaml')
const CODEPOINTS = join(HERE, 'icon-codepoints.json')
const NPM_PKG = join(HERE, '../../ui-tokens/package.json')

const PUB_NAME = 'kun_ui_icons'
const FAMILY = 'KunUiIcons'
// Unicode's Private Use Area: no standard character lives here to collide with.
const PUA_FIRST = 0xe000
// lucide's own build parameters. 800 is the raster the outliner traces at.
// svgicons2svgfont warns below a fontHeight of 1000: "further steps (rounding
// in svg2ttf) could lead to ugly results".
const TRACE_RESOLUTION = 800
const FONT_HEIGHT = 1000

// `svg-spinners:90-ring-with-bg` is an ANIMATED SVG — its motion lives in
// <animateTransform>, and no static font format carries that. It crosses in
// tier 4 as a hand-written rotating-arc widget instead. Honest count for this
// package: every lucide icon in WANT, and this one left behind.
const EXCLUDE = new Set(['svg-spinners:90-ring-with-bg'])

// ── version lockstep ────────────────────────────────────────────────────────
const npmVersion = JSON.parse(readFileSync(NPM_PKG, 'utf8')).version
const pubVersion = readFileSync(PUBSPEC, 'utf8').match(/^version:\s*(\S+)/m)?.[1]
if (pubVersion !== npmVersion) {
  console.error(
    `\n✗ version lockstep broken: @kungal/ui-tokens is ${npmVersion}, but ` +
      `packages/ui-icons-flutter/pubspec.yaml is ${pubVersion ?? '(none)'}.\n` +
      '  pub.dev rejects a publish whose pubspec version does not match the\n' +
      '  release tag. Run `pnpm sync:pub` to bring the pub package back in line.'
  )
  process.exit(1)
}

// ── which icons cross, and what they are called in Dart ─────────────────────
const DART_RESERVED = new Set([
  'assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if',
  'in', 'is', 'new', 'null', 'rethrow', 'return', 'super', 'switch', 'this',
  'throw', 'true', 'try', 'var', 'void', 'while', 'with',
])
const camel = (kebab) =>
  kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

const crossing = []
for (const [prefix, names] of Object.entries(WANT)) {
  for (const name of names) {
    const key = `${prefix}:${name}`
    if (EXCLUDE.has(key)) continue
    const dart = camel(name)
    if (!/^[a-z][A-Za-z0-9]*$/.test(dart) || DART_RESERVED.has(dart)) {
      console.error(
        `\n✗ ${key} does not yield a usable Dart identifier (got "${dart}").\n` +
          '  Rename it upstream, or add it to EXCLUDE here with the reason.\n' +
          '  Failing loudly on purpose: an icon silently missing from the font\n' +
          '  renders as tofu in the app, with nothing to point at.'
      )
      process.exit(1)
    }
    crossing.push({ key, prefix, name, dart })
  }
}

// ── codepoints: allocated once, never moved ─────────────────────────────────
// A codepoint is part of the published API — an app that has already compiled
// against `KunIcons.x` holds 0xE000, so reshuffling on every regeneration would
// silently repaint every icon in a consumer's build. lucide keeps its map in a
// Vercel blob for the same reason; ours is committed next to this file, where
// a reviewer can see a reallocation in the diff.
const codepointsRaw = readFileSync(CODEPOINTS, 'utf8')
const codepoints = JSON.parse(codepointsRaw)
let next = Math.max(PUA_FIRST - 1, ...Object.values(codepoints).map(Number))
const allocated = []
for (const icon of crossing) {
  if (codepoints[icon.key] === undefined) {
    codepoints[icon.key] = `0x${(++next).toString(16).toUpperCase()}`
    allocated.push(icon.key)
  }
  icon.codepoint = Number(codepoints[icon.key])
}
// An icon dropped from WANT keeps its entry: retiring a codepoint and handing
// it to the next new icon is the one way this file can repaint a consumer's
// build.
const codepointsOut = JSON.stringify(codepoints, null, 2) + '\n'
if (codepointsOut !== codepointsRaw) writeFileSync(CODEPOINTS, codepointsOut)

// ── extract the SVGs ────────────────────────────────────────────────────────
// Rebuild the file lucide ships in its `icons/` directory. iconify has already
// pushed the stroke attributes down onto the body's children, but it has
// nowhere to keep the root <svg> — and without a viewBox the coordinates have
// no size to trace at. The stroke attributes go back on the root as well, so a
// body that leaves them to inheritance outlines the same.
const iconify = {}
for (const prefix of new Set(crossing.map((i) => i.prefix))) {
  iconify[prefix] = JSON.parse(
    readFileSync(new URL(`../node_modules/${PKG[prefix]}/icons.json`, import.meta.url), 'utf8')
  )
}
for (const icon of crossing) {
  const set = iconify[icon.prefix]
  const data = set.icons[icon.name]
  if (!data) {
    console.error(`MISSING ${icon.key}`)
    process.exit(1)
  }
  icon.width = data.width ?? set.width ?? 24
  icon.height = data.height ?? set.height ?? 24
  icon.svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${icon.width}" height="${icon.height}" ` +
    `viewBox="0 0 ${icon.width} ${icon.height}" fill="none" stroke="currentColor" ` +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    `${data.body}</svg>`
}

// svgicons2svgfont scales every glyph by ONE ratio (fontHeight / tallest
// glyph), so icons of unequal height come out at different scales. It does warn
// — through `debug('svgicons2svgfont')`, which prints nothing unless DEBUG is
// set, so the warning would never be seen. Assert instead.
const boxes = new Set(crossing.map((i) => `${i.width}x${i.height}`))
if (boxes.size !== 1) {
  console.error(
    `\n✗ the crossing icons do not share one box: ${[...boxes].join(', ')}.\n` +
      '  svgicons2svgfont would scale them against the tallest one and the odd\n' +
      '  icons would ship visibly smaller.'
  )
  process.exit(1)
}

// ── stroke → outline ────────────────────────────────────────────────────────
// fixString is the same Svg.process() the directory API runs, without its
// temp-file round trip and piscina worker pool — so nothing is written outside
// the package and the tracing stays single-threaded and ordered.
for (const icon of crossing) {
  icon.outlined = await SVGFixer.fixString(icon.svg, TRACE_RESOLUTION)
}

// ── SVG font → TTF ──────────────────────────────────────────────────────────
const fontStream = new SVGIcons2SVGFontStream({
  fontName: FAMILY,
  fontHeight: FONT_HEIGHT,
  normalize: false,
})
const chunks = []
fontStream.on('data', (chunk) => chunks.push(chunk))
const flushed = new Promise((resolve, reject) => {
  fontStream.on('finish', resolve)
  fontStream.on('error', reject)
})
for (const icon of crossing) {
  const glyph = Readable.from([icon.outlined])
  glyph.metadata = { unicode: [String.fromCodePoint(icon.codepoint)], name: icon.dart }
  fontStream.write(glyph)
}
fontStream.end()
await flushed

// `ts: 0` pins the TTF's created/modified dates, which otherwise default to
// `new Date()`. check.yml regenerates everything and fails on any porcelain
// output, so a font stamped with the current time would fail every CI run.
const ttf = Buffer.from(svg2ttf(chunks.join(''), { ts: 0 }).buffer)
mkdirSync(dirname(FONT_OUT), { recursive: true })
writeFileSync(FONT_OUT, ttf)

// ── Dart ────────────────────────────────────────────────────────────────────
// Emitted pre-wrapped in dart format's tall style: CI runs
// `dart format --set-exit-if-changed` and there is no formatting step that
// could fix the output up afterwards.
const hex = (n) => `0x${n.toString(16).toUpperCase()}`
const dart = [
  '// AUTO-GENERATED by packages/ui-core/scripts/gen-icons-flutter.mjs — DO NOT EDIT.',
  '// Regenerate: pnpm --filter @kungal/ui-core gen:icons:flutter',
  '',
  "import 'package:flutter/widgets.dart';",
  '',
  `const String _family = '${FAMILY}';`,
  '',
  '/// Required for a font that ships inside a package: without it the family',
  '/// resolves only within this package and every icon renders as tofu.',
  `const String _package = '${PUB_NAME}';`,
  '',
  '/// The KunUI icon set.',
  '///',
  '/// The same icons the web components render, converted from lucide strokes',
  '/// to filled glyphs and packed into the bundled `KunUiIcons` font. Use them',
  '/// anywhere an `IconData` goes:',
  '///',
  '/// ```dart',
  '/// Icon(KunIcons.circleCheck, size: 20)',
  '/// ```',
  '///',
  '/// Codepoints are stable across releases: they are allocated once, in',
  '/// `packages/ui-core/scripts/icon-codepoints.json`, and never reassigned.',
  'abstract final class KunIcons {',
  ...crossing.flatMap((icon, i) => [
    ...(i ? [''] : []),
    `  /// ${icon.prefix}: ${icon.name}`,
    `  static const IconData ${icon.dart} = IconData(`,
    `    ${hex(icon.codepoint)},`,
    '    fontFamily: _family,',
    '    fontPackage: _package,',
    '  );',
  ]),
  '}',
  '',
].join('\n')
writeFileSync(DART_OUT, dart)

console.log(
  `gen-icons-flutter: ${crossing.length} icons → ${PUB_NAME} ` +
    `(${[...EXCLUDE].join(', ')} excluded — animated)`
)
console.log(`  lib/fonts/KunUiIcons.ttf  ${ttf.length} bytes`)
const used = crossing.map((i) => i.codepoint)
console.log(
  `  lib/kun_ui_icons.dart     ${hex(Math.min(...used))}..${hex(Math.max(...used))}`
)
console.log(
  allocated.length
    ? `  icon-codepoints.json      allocated ${allocated.length}: ${allocated.join(', ')}`
    : '  icon-codepoints.json      unchanged'
)
console.log(`(pub lockstep ok — ${PUB_NAME} ${pubVersion})`)
