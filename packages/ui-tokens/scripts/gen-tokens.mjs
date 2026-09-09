// ─────────────────────────────────────────────────────────────────────────────
// KunUI palette generator — the SINGLE SOURCE OF TRUTH for every semantic color.
//
// Why this exists: hand-authored HSL scales are perceptually non-uniform (HSL's
// `L` lies — amber at L55% looks far brighter than blue at L47%), which forces a
// per-color, per-mode "white or black text?" judgement that silently breaks when
// a color changes. This generator instead defines each color by an OKLCH hue +
// peak chroma, lays every shade on ONE perceptual lightness ramp (so "-500" means
// the same perceived lightness for every hue), and DERIVES the on-color (text on
// a solid fill) by measured WCAG contrast — guaranteeing AA in both modes by
// construction. Adding a color or retheming can never again ship an illegible
// solid: this script asserts AA and exits non-zero on any miss.
//
// Output: ../src/palette.generated.css (committed). Run: `pnpm --filter
// @kungal/ui-tokens gen`. Tune colors ONLY here, never in the generated CSS.
// ─────────────────────────────────────────────────────────────────────────────
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { oklch, clampChroma, wcagContrast, formatHex, parse, rgb } from 'culori'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '../src/palette.generated.css')

// Hue identities preserved from the original palette (measured in OKLCH); only
// the lightness/chroma are rebuilt perceptually. `c` is the peak chroma we aim
// for at mid tones — clamped per shade to whatever sRGB actually allows.
// Each hue's SOLID/brand tone (`--color-{c}`) sits at its natural vivid lightness
// — the bright, HeroUI-like look — via `solidL`. Physics then decides the text:
// medium hues (blue/red/zinc, L≈0.55-0.58) take WHITE; the intrinsically-bright
// hues (magenta/green/cyan/amber, L≈0.68-0.80) take a refined DARK tint. The OLD
// palette looked muddy because its solid variant DARKENED these to ~-600 and put
// pure black on them; keeping them bright + tinted-dark is the clean HeroUI way.
// solidL values mirror HeroUI's own measured OKLCH lightness per hue.
const HUES = {
  primary: { h: 257.9, c: 0.2, name: 'Blue', solidL: 0.57 },
  secondary: { h: 341.5, c: 0.26, name: 'Magenta', solidL: 0.8 },
  success: { h: 150.9, c: 0.18, name: 'Green', solidL: 0.72 },
  warning: { h: 72.2, c: 0.17, name: 'Amber', solidL: 0.8 },
  danger: { h: 11.1, c: 0.23, name: 'Red', solidL: 0.58 },
  info: { h: 218.5, c: 0.15, name: 'Cyan', solidL: 0.7 },
  default: { h: 285.9, c: 0.015, name: 'Neutral', solidL: 0.55 }, // near-grey (zinc-like)
}

// ONE perceptual lightness ramp shared by every hue (light mode). Dark mode is
// the mirror, so the same shade KEY flips brightness per mode (HeroUI model:
// `bg-{c}-100` is a faint tint in BOTH themes). -500 stays vivid for accents.
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const RAMP_L_LIGHT = {
  50: 0.972, 100: 0.945, 200: 0.892, 300: 0.82, 400: 0.715,
  500: 0.62, 600: 0.52, 700: 0.44, 800: 0.36, 900: 0.28, 950: 0.215,
}
// Dark = mirror of light (50↔950 … 500 fixed), so -50 is darkest in dark mode.
const RAMP_L_DARK = Object.fromEntries(
  SHADES.map((s, i) => [s, RAMP_L_LIGHT[SHADES[SHADES.length - 1 - i]]])
)

// Fallback solid lightness if a hue omits `solidL`. Same in both modes — a solid
// button reads as the same color in light and dark (HeroUI/Material convention),
// which also means NO per-mode `dark:` pin is needed on solids.
const ACCENT_L = 0.6

// On-color (text on a solid `bg-{c}`). White stays pure for maximum contrast
// headroom on the medium hues; the dark on-color is a near-black tint of the hue
// (it has 7-10:1 headroom to spare), which reads warmer/"designed" vs pure black.
const onLight = () => ({ mode: 'oklch', l: 1, c: 0, h: 0 }) // white
const onDark = (h) => ({ mode: 'oklch', l: 0.2, c: 0.03, h }) // near-black, hue-tinted

const AA_NORMAL = 4.5
const AA_LARGE = 3.0

// OKLCH triplet → "L C H" channel string (what the CSS var stores; wrapped in
// `oklch(var(--x))`). Gamut-clamped so we never emit an out-of-sRGB color.
const chan = (color) => {
  const c = clampChroma({ ...color, mode: 'oklch' }, 'oklch', 'rgb')
  return `${round(c.l, 4)} ${round(c.c, 4)} ${round(c.h ?? 0, 2)}`
}
const round = (n, d) => {
  const f = 10 ** d
  return Math.round(n * f) / f
}
const ofChan = (s) => parse(`oklch(${s})`)

// Build one color's shades + accent + on-color for a given mode ramp.
function buildColor(key, ramp) {
  const { h, c, solidL } = HUES[key]
  const shades = {}
  for (const s of SHADES) shades[s] = chan({ mode: 'oklch', l: ramp[s], c, h })
  const accent = chan({ mode: 'oklch', l: solidL ?? ACCENT_L, c, h })
  // Pick the on-color that clears AA on the accent fill; prefer white (the look
  // we want), fall back to the dark tint. Report exact ratios for the audit.
  const fill = ofChan(accent)
  const cw = wcagContrast(fill, formatHex(onLight()))
  const cb = wcagContrast(fill, formatHex(onDark(h)))
  const useWhite = cw >= AA_NORMAL || cw >= cb
  const on = chan(useWhite ? onLight() : onDark(h))
  const onRatio = useWhite ? cw : cb
  return { shades, accent, on, onRatio, useWhite, accentFill: fill }
}

// Neutrals (surfaces / text) — an ELEVATION scale, [light, dark].
//   background  = the page. A soft neutral (NOT pure #fff/#000) so raised
//                 surfaces read as raised by fill alone.
//   content1    = cards / popovers / menus — the raised surface (pops on the page).
//   content2-4  = progressively deeper greys (hovers, wells, code blocks).
// Inputs/selects are now borderless and use `content1` (the card surface) + a
// small shadow, so they match a card; no separate fill token is needed.
const NEUTRALS = {
  background: ['#f4f4f7', '#0a0a0a'],
  foreground: ['hsl(202 24% 9%)', 'hsl(210 6% 93%)'],
  content1: ['hsl(0 0% 100%)', 'hsl(240 6% 10%)'],
  content2: ['hsl(240 5% 96%)', 'hsl(240 4% 16%)'],
  content3: ['hsl(240 6% 90%)', 'hsl(240 5% 26%)'],
  content4: ['hsl(240 5% 84%)', 'hsl(240 5% 34%)'],
}
const neutralChan = (css) => {
  const o = oklch(css)
  return `${round(o.l, 4)} ${round(o.c ?? 0, 4)} ${round(o.h ?? 0, 2)}`
}

// ── generate both modes ──
const modes = {
  light: { ramp: RAMP_L_LIGHT, sel: ':root' },
  dark: { ramp: RAMP_L_DARK, sel: '.kun-dark-mode' },
}
const data = {}
for (const [mode, { ramp }] of Object.entries(modes)) {
  data[mode] = {}
  for (const key of Object.keys(HUES)) data[mode][key] = buildColor(key, ramp)
}

// ── AA guarantee: every solid (fill, on-color) pair, both modes ──
const report = []
let fail = false
for (const mode of ['light', 'dark']) {
  for (const key of Object.keys(HUES)) {
    const c = data[mode][key]
    const ratio = c.onRatio
    const accentOnBg = wcagContrast(
      c.accentFill,
      mode === 'light' ? '#ffffff' : '#000000'
    )
    const ok = ratio >= AA_NORMAL
    if (!ok) fail = true
    report.push(
      `  ${mode.padEnd(5)} ${key.padEnd(10)} solid:${c.useWhite ? 'white' : 'black'} ${ratio.toFixed(2)}${ok ? ' AA' : ' ✗FAIL'}   accent-on-bg ${accentOnBg.toFixed(2)}${accentOnBg >= AA_NORMAL ? '' : accentOnBg >= AA_LARGE ? ' (AA-large)' : ' ✗'}`
    )
  }
}

// ── emit CSS ──
const COLORS = Object.keys(HUES)
const themeColorLines = []
themeColorLines.push(`  --color-background: oklch(var(--background) / var(--kun-global-opacity));`)
themeColorLines.push(`  --color-foreground: oklch(var(--foreground));`)
// content1 is the raised surface (cards/popovers/inputs); its opacity is themeable
// via --kun-surface-opacity (default 1 = opaque) so a bg-image site can frost every
// surface at once. content2-4 stay opaque (small wells/accents).
themeColorLines.push(`  --color-content1: oklch(var(--content1) / var(--kun-surface-opacity));`)
for (const n of [2, 3, 4]) themeColorLines.push(`  --color-content${n}: oklch(var(--content${n}));`)
themeColorLines.push('')
for (const key of COLORS) {
  themeColorLines.push(`  --color-${key}: oklch(var(--${key}-accent));`)
  themeColorLines.push(`  --color-${key}-foreground: oklch(var(--${key}-on));`)
  for (const s of SHADES) {
    // default-100 keeps the global-opacity "glass" alpha used by surfaces.
    if (key === 'default' && s === 100) {
      themeColorLines.push(`  --color-default-100: oklch(var(--default-100) / var(--kun-global-opacity));`)
    } else {
      themeColorLines.push(`  --color-${key}-${s}: oklch(var(--${key}-${s}));`)
    }
  }
  themeColorLines.push('')
}

function channelBlock(mode) {
  const lines = []
  const { background, foreground, content1, content2, content3, content4 } = NEUTRALS
  const idx = mode === 'light' ? 0 : 1
  lines.push(`    --background: ${neutralChan(background[idx])};`)
  lines.push(`    --foreground: ${neutralChan(foreground[idx])};`)
  lines.push(`    --content1: ${neutralChan(content1[idx])};`)
  lines.push(`    --content2: ${neutralChan(content2[idx])};`)
  lines.push(`    --content3: ${neutralChan(content3[idx])};`)
  lines.push(`    --content4: ${neutralChan(content4[idx])};`)
  for (const key of COLORS) {
    const c = data[mode][key]
    lines.push('')
    lines.push(`    /* ${HUES[key].name} */`)
    lines.push(`    --${key}-accent: ${c.accent};`)
    lines.push(`    --${key}-on: ${c.on};`)
    for (const s of SHADES) lines.push(`    --${key}-${s}: ${c.shades[s]};`)
  }
  return lines.join('\n')
}

const css = `/* ───────────────────────────────────────────────────────────────────────────
 * AUTO-GENERATED by scripts/gen-tokens.mjs — DO NOT EDIT BY HAND.
 * Edit packages/ui-tokens/scripts/gen-tokens.mjs (the HUES / ramp / accent
 * policy) and rerun \`pnpm --filter @kungal/ui-tokens gen\`.
 *
 * Every solid (fill, on-color) pair below is WCAG-AA-verified in BOTH modes by
 * the generator; the build fails if any pair regresses. Colors are OKLCH for
 * perceptual uniformity (one shade key = one perceived lightness across hues).
 * ─────────────────────────────────────────────────────────────────────────── */

@theme {
${themeColorLines.join('\n')}}

@layer base {
  :root {
${channelBlock('light')}
  }

  .kun-dark-mode {
${channelBlock('dark')}
  }
}
`

writeFileSync(OUT, css)

// ── siblings of the CSS: generated Dart + a DTCG export ──────────────────────
// Same in-memory model, two more render targets. Generation is the whole point:
// every Flutter port of a web design system that hand-transcribes its palette
// (shadcn's zinc.dart is the exhibit) stops tracking the web on the first
// retheme. Colors here are the exact values the CSS ships — same clampChroma
// pass, same numbers — so parity is by construction rather than by review.
const CSS_SRC = join(HERE, '../src/tokens.css')
const DTCG_OUT = join(HERE, '../src/tokens.dtcg.json')
const DART_DIR = join(HERE, '../../ui-tokens-flutter/lib/src')
const PUBSPEC = join(HERE, '../../ui-tokens-flutter/pubspec.yaml')
const PKG_JSON = join(HERE, '../package.json')

const npmVersion = JSON.parse(readFileSync(PKG_JSON, 'utf8')).version
const pubVersion = readFileSync(PUBSPEC, 'utf8').match(/^version:\s*(\S+)/m)?.[1]
if (pubVersion !== npmVersion) {
  console.error(
    `\n✗ version lockstep broken: @kungal/ui-tokens is ${npmVersion}, but ` +
      `packages/ui-tokens-flutter/pubspec.yaml is ${pubVersion ?? '(none)'}.\n` +
      '  pub.dev rejects a publish whose pubspec version does not match the\n' +
      '  release tag. Run `pnpm sync:pub` to bring the pub package back in line.'
  )
  process.exit(1)
}

// ── read the hand-authored tokens (radius / motion / elevation) out of CSS ──
const cssText = readFileSync(CSS_SRC, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const cssValues = (name) =>
  [...cssText.matchAll(new RegExp(`${name}:\\s*([^;]+);`, 'g'))].map((m) =>
    m[1].replace(/\s+/g, ' ').trim()
  )
// tokens.css declares the easings and durations TWICE — once in `@theme` (which
// generates the utilities) and once in a plain `:root` mirror (which survives
// Tailwind's tree-shaker). Its comment asks a human to keep the two in sync;
// requiring every declaration of a token to agree makes that a machine check.
const cssValue = (name) => {
  const vs = cssValues(name)
  if (!vs.length) throw new Error(`tokens.css declares no ${name}`)
  const [first] = vs
  if (vs.some((v) => v !== first))
    throw new Error(`tokens.css declares ${name} more than once, disagreeing: ${vs.join(' | ')}`)
  return first
}

const px = (v) => {
  if (v === '0') return 0
  const scaled = v.match(/^calc\(([\d.]+)rem \* var\(--kun-radius-scale/)
  if (scaled) return Number(scaled[1]) * 16
  const literal = v.match(/^(-?[\d.]+)px$/)
  if (literal) return Number(literal[1])
  throw new Error(`cannot read a px length from "${v}"`)
}
const bezier = (v) => {
  const m = v.match(/^cubic-bezier\(([^)]+)\)$/)
  if (!m) throw new Error(`not a cubic-bezier: "${v}"`)
  return m[1].split(',').map((n) => Number(n.trim()))
}
const ms = (v) => {
  const m = v.match(/^(\d+)ms$/)
  if (!m) throw new Error(`not a duration in ms: "${v}"`)
  return Number(m[1])
}
const splitTopLevel = (v) => {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of v) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}
const SHADOW_LAYER =
  /^(-?[\d.]+)(?:px)? (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px rgb\(0 0 0 \/ ([\d.]+)\)$/
const shadowLayers = (v) =>
  splitTopLevel(v).map((layer) => {
    const m = layer.match(SHADOW_LAYER)
    if (!m) throw new Error(`unrecognised shadow layer: "${layer}"`)
    return {
      x: Number(m[1]),
      y: Number(m[2]),
      blur: Number(m[3]),
      spread: Number(m[4]),
      alpha: Number(m[5]),
    }
  })

const RADII = ['none', 'sm', 'md', 'lg', 'full']
const EASINGS = ['standard', 'out', 'in', 'emphasized']
const DURATIONS = ['fast', 'base', 'slow', 'exit']
const ELEVATIONS = ['sm', 'md', 'lg']
const radius = Object.fromEntries(
  RADII.map((k) => [k, px(cssValue(`--radius-kun-${k}`))])
)
const easings = Object.fromEntries(
  EASINGS.map((k) => [k, bezier(cssValue(`--ease-kun-${k}`))])
)
const durations = Object.fromEntries(
  DURATIONS.map((k) => [k, ms(cssValue(`--kun-dur-${k}`))])
)
const elevations = Object.fromEntries(
  ELEVATIONS.map((k) => [k, shadowLayers(cssValue(`--shadow-kun-${k}`))])
)

// ── Dart emitter ────────────────────────────────────────────────────────────
// `Color.from` takes normalised doubles and is const from Flutter 3.27, which
// is what makes a `static const` token class possible and keeps the generator's
// precision instead of quantising to 8-bit hex the way Style Dictionary's
// `color/hex8flutter` transform does.
const dartNum = (n) => String(round(n, 4))
const dartColor = (chanStr) => {
  const c = rgb(ofChan(chanStr))
  const ch = (n) => dartNum(Math.min(1, Math.max(0, n)))
  return `Color.from(alpha: 1, red: ${ch(c.r)}, green: ${ch(c.g)}, blue: ${ch(c.b)})`
}
const DART_BANNER = [
  '// AUTO-GENERATED by packages/ui-tokens/scripts/gen-tokens.mjs — DO NOT EDIT.',
  '// Regenerate: pnpm --filter @kungal/ui-tokens gen',
]
// dart format ("tall style") keeps an argument list on one line only when it
// has no trailing comma, so `Color.from(...)` is written without one and the
// outer const constructor call is written with one to stay vertical.
const dartDoc = (indent, lines) =>
  lines.map((l) => `${' '.repeat(indent)}///${l ? ` ${l}` : ''}`)
const dartField = (indent, name, chanStr) =>
  `${' '.repeat(indent)}${name}: ${dartColor(chanStr)},`

const DART_HUE_NAMES = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  default: 'neutral',
}
const SCALE_FIELDS = [...SHADES.map((s) => `shade${s}`), 'solid', 'onSolid']
const SCALE_DOCS = Object.fromEntries(
  SHADES.map((s) => [`shade${s}`, [`Web token \`--color-<hue>-${s}\`.`]])
)
SCALE_DOCS.shade50 = [
  "Web token `--color-<hue>-50`, the ramp's faintest step — a tint that",
  "barely lifts off the mode's background.",
]
SCALE_DOCS.shade500 = [
  "Web token `--color-<hue>-500`, the ramp's fixed midpoint — the one step",
  'whose value is identical in light and dark.',
]
SCALE_DOCS.shade950 = [
  "Web token `--color-<hue>-950`, the ramp's strongest step — the most",
  "contrast against the mode's background.",
]
SCALE_DOCS.solid = ['Web token `--color-<hue>`, the brand fill: buttons, badges, chips.']
SCALE_DOCS.onSolid = [
  'Web token `--color-<hue>-foreground`, for text and icons drawn on `solid`.',
  '',
  'Contrast against `solid` is at least 4.5:1 (WCAG AA) in both modes by',
  'construction: the generator measures every pair and fails the build when',
  'one misses.',
]
const SCHEME_FIELDS = [
  ['background', 'Color', [
    'Web token `--color-background`, the page beneath everything.',
    '',
    'The opaque base color. The web layer composites glass and alpha',
    'surfaces on top of it per component; nothing here is translucent.',
  ]],
  ['foreground', 'Color', ['Web token `--color-foreground`, the default text color.']],
  ['content1', 'Color', [
    'Web token `--color-content1`, the raised surface: cards, popovers,',
    'menus, inputs.',
  ]],
  ['content2', 'Color', ['Web token `--color-content2`, a shallow well (hover, tracks).']],
  ['content3', 'Color', ['Web token `--color-content3`, a deeper well.']],
  ['content4', 'Color', ['Web token `--color-content4`, the deepest neutral fill.']],
  ['primary', 'KunColorScale', ['The brand hue — blue.']],
  ['secondary', 'KunColorScale', ['The secondary hue — magenta.']],
  ['success', 'KunColorScale', ['The success hue — green.']],
  ['warning', 'KunColorScale', ['The warning hue — amber.']],
  ['danger', 'KunColorScale', ['The danger hue — red.']],
  ['info', 'KunColorScale', ['The informational hue — cyan.']],
  ['neutral', 'KunColorScale', [
    'The neutral hue — near-grey.',
    '',
    'Named `neutral` rather than the web token name `default`, which is a',
    'Dart reserved word.',
  ]],
]

const schemeLiteral = (mode) => {
  const idx = mode === 'light' ? 0 : 1
  const lines = [`  static const KunColorScheme ${mode} = KunColorScheme(`]
  for (const n of Object.keys(NEUTRALS))
    lines.push(dartField(4, n, neutralChan(NEUTRALS[n][idx])))
  for (const [web, dart] of Object.entries(DART_HUE_NAMES)) {
    const c = data[mode][web]
    lines.push(`    ${dart}: KunColorScale(`)
    for (const s of SHADES) lines.push(dartField(6, `shade${s}`, c.shades[s]))
    lines.push(dartField(6, 'solid', c.accent))
    lines.push(dartField(6, 'onSolid', c.on))
    lines.push('    ),')
  }
  lines.push('  );')
  return lines
}

const colorsDart = [
  ...DART_BANNER,
  '',
  "import 'dart:ui';",
  '',
  ...dartDoc(0, [
    'One semantic hue: an 11-step tint ramp, the solid fill, and the color',
    'that stays legible on that fill.',
    '',
    'The dark ramp is the mirror of the light one (50 <-> 950, 500 fixed), so',
    'a step key names the same tint weight in both modes.',
  ]),
  'class KunColorScale {',
  ...dartDoc(2, ['Creates a scale with every step given explicitly.']),
  '  const KunColorScale({',
  ...SCALE_FIELDS.map((f) => `    required this.${f},`),
  '  });',
  ...SCALE_FIELDS.flatMap((f) => ['', ...dartDoc(2, SCALE_DOCS[f]), `  final Color ${f};`]),
  '}',
  '',
  ...dartDoc(0, [
    'Every KunUI color for one mode.',
    '',
    'The two generated instances are `KunColors.light` and `KunColors.dark`.',
  ]),
  'class KunColorScheme {',
  ...dartDoc(2, ['Creates a scheme with every surface and hue given explicitly.']),
  '  const KunColorScheme({',
  ...SCHEME_FIELDS.map(([f]) => `    required this.${f},`),
  '  });',
  ...SCHEME_FIELDS.flatMap(([f, type, doc]) => [
    '',
    ...dartDoc(2, doc),
    `  final ${type} ${f};`,
  ]),
  '}',
  '',
  ...dartDoc(0, ['The two generated KunUI color schemes.']),
  'abstract final class KunColors {',
  ...dartDoc(2, ['The light scheme — what `:root` ships on the web.']),
  ...schemeLiteral('light'),
  '',
  ...dartDoc(2, ['The dark scheme — what `.kun-dark-mode` ships on the web.']),
  ...schemeLiteral('dark'),
  '}',
  '',
].join('\n')

const EASING_DART = [
  ['standard', 'standard', ['Web token `--ease-kun-standard`, the default in-screen transition.']],
  ['enter', 'out', [
    'Web token `--ease-kun-out` — decelerate, for entering elements.',
  ]],
  ['exit', 'in', [
    'Web token `--ease-kun-in` — accelerate, for leaving elements.',
    '',
    'Named `exit` because `in` is a Dart reserved word.',
  ]],
  ['emphasized', 'emphasized', ['Web token `--ease-kun-emphasized`, the premium settle.']],
]
const DURATION_DOCS = {
  fast: ['Web token `--kun-dur-fast`, for hover, selection and micro-interactions.'],
  base: ['Web token `--kun-dur-base`, for component enter and in-screen moves.'],
  slow: ['Web token `--kun-dur-slow`, for larger surfaces.'],
  exit: ['Web token `--kun-dur-exit`. Exits run about 30% shorter than enters.'],
}

const motionDart = [
  ...DART_BANNER,
  '',
  "import 'package:flutter/animation.dart';",
  '',
  ...dartDoc(0, [
    'The KunUI easing set — one rhythm every component shares.',
    '',
    'Asymmetric by design: decelerate on enter, accelerate on exit.',
  ]),
  'abstract final class KunEasing {',
  ...EASING_DART.flatMap(([dart, web, doc], i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, doc),
    `  static const Curve ${dart} = Cubic(${easings[web].map(String).join(', ')});`,
  ]),
  '}',
  '',
  ...dartDoc(0, [
    'The KunUI duration scale.',
    '',
    '`Duration` is `dart:core`; the import above is for `Curve` and `Cubic`.',
  ]),
  'abstract final class KunDurations {',
  ...DURATIONS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, DURATION_DOCS[k]),
    `  static const Duration ${k} = Duration(milliseconds: ${durations[k]});`,
  ]),
  '}',
  '',
].join('\n')

const RADIUS_DOCS = {
  none: ['Web token `--radius-kun-none`. A square corner.'],
  sm: ['Web token `--radius-kun-sm`, for small controls.'],
  md: ['Web token `--radius-kun-md`, the default control radius.'],
  lg: ['Web token `--radius-kun-lg`, for containers and floating panels.'],
  full: ['Web token `--radius-kun-full`. A pill: clamp it to half the height.'],
}
const radiusDart = [
  ...DART_BANNER,
  '',
  ...dartDoc(0, [
    'The KunUI corner radius buckets, in logical pixels.',
    '',
    'The web multiplies `sm`, `md` and `lg` by `--kun-radius-scale`, a runtime',
    'knob that squares or rounds every corner at once. That knob is a theme',
    'concern for a higher layer; `none` and `full` are never scaled.',
  ]),
  'abstract final class KunRadius {',
  ...RADII.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, RADIUS_DOCS[k]),
    `  static const double ${k} = ${dartNum(radius[k])};`,
  ]),
  '}',
  '',
].join('\n')

const ELEVATION_DOCS = {
  sm: ['Web token `--shadow-kun-sm`, for tooltips and small hints.'],
  md: ['Web token `--shadow-kun-md`, for popovers, dropdowns, menus and toasts.'],
  lg: ['Web token `--shadow-kun-lg`, for modals and drawers.'],
}
const shadowsDart = [
  ...DART_BANNER,
  '',
  // painting re-exports dart:ui's Color and Offset (via basic_types.dart), so
  // adding `import 'dart:ui'` here would be an unused-import analyzer error.
  "import 'package:flutter/painting.dart';",
  '',
  ...dartDoc(0, [
    'The KunUI elevation scale — one shadow per tier, so every floating',
    'surface of a kind shares an elevation instead of picking one ad hoc.',
  ]),
  'abstract final class KunShadows {',
  ...ELEVATIONS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, ELEVATION_DOCS[k]),
    `  static const List<BoxShadow> ${k} = [`,
    // No `const` on the elements: the list initializer is already a const
    // context, and a redundant one trips the `unnecessary_const` lint.
    ...elevations[k].flatMap((l) => [
      '    BoxShadow(',
      `      color: Color.from(alpha: ${l.alpha}, red: 0, green: 0, blue: 0),`,
      `      offset: Offset(${l.x}, ${l.y}),`,
      `      blurRadius: ${l.blur},`,
      `      spreadRadius: ${l.spread},`,
      '    ),',
    ]),
    '  ];',
  ]),
  '}',
  '',
].join('\n')

mkdirSync(DART_DIR, { recursive: true })
const dartFiles = {
  'colors.g.dart': colorsDart,
  'motion.g.dart': motionDart,
  'radius.g.dart': radiusDart,
  'shadows.g.dart': shadowsDart,
}
for (const [name, body] of Object.entries(dartFiles))
  writeFileSync(join(DART_DIR, name), body)

// ── DTCG 2025.10 export ─────────────────────────────────────────────────────
// An export, not the pivot: the source of truth is the policy in this file
// (HUES, the ramp, the AA assertion), none of which a resolved-value format can
// carry. This exists for what DTCG is good at — Figma and external tooling.
const dtcgColor = (chanStr) => ({
  $type: 'color',
  $value: {
    colorSpace: 'oklch',
    components: chanStr.split(' ').map(Number),
    alpha: 1,
    hex: formatHex(ofChan(chanStr)),
  },
})
const dtcgDimension = (value) => ({ value, unit: 'px' })
const dtcgMode = (mode) => {
  const idx = mode === 'light' ? 0 : 1
  const group = {}
  for (const key of COLORS) {
    const c = data[mode][key]
    const scale = {}
    for (const s of SHADES) scale[String(s)] = dtcgColor(c.shades[s])
    scale.solid = dtcgColor(c.accent)
    scale.on = dtcgColor(c.on)
    group[key] = scale
  }
  for (const n of Object.keys(NEUTRALS))
    group[n] = dtcgColor(neutralChan(NEUTRALS[n][idx]))
  return group
}

const dtcg = {
  $description:
    'KunUI design tokens, DTCG Format Module 2025.10. Generated by ' +
    'packages/ui-tokens/scripts/gen-tokens.mjs from the same model that emits ' +
    'palette.generated.css and the kun_ui_tokens Dart package. Do not edit.',
  color: { light: dtcgMode('light'), dark: dtcgMode('dark') },
  radius: Object.fromEntries(
    RADII.map((k) => [k, { $type: 'dimension', $value: dtcgDimension(radius[k]) }])
  ),
  motion: {
    easing: Object.fromEntries(
      EASINGS.map((k) => [k, { $type: 'cubicBezier', $value: easings[k] }])
    ),
    duration: Object.fromEntries(
      DURATIONS.map((k) => [
        k,
        { $type: 'duration', $value: { value: durations[k], unit: 'ms' } },
      ])
    ),
  },
  elevation: Object.fromEntries(
    ELEVATIONS.map((k) => [
      k,
      {
        $type: 'shadow',
        $value: elevations[k].map((l) => ({
          color: {
            colorSpace: 'srgb',
            components: [0, 0, 0],
            alpha: l.alpha,
            hex: '#000000',
          },
          offsetX: dtcgDimension(l.x),
          offsetY: dtcgDimension(l.y),
          blur: dtcgDimension(l.blur),
          spread: dtcgDimension(l.spread),
        })),
      },
    ])
  ),
}
writeFileSync(DTCG_OUT, JSON.stringify(dtcg, null, 2) + '\n')

console.log(`wrote ${DTCG_OUT.split('/').slice(-2).join('/')}`)
for (const name of Object.keys(dartFiles))
  console.log(`wrote kun_ui_tokens lib/src/${name}`)
console.log(`(pub lockstep ok — kun_ui_tokens ${pubVersion})\n`)

console.log('— KunUI palette AA audit (solid = text on bg-{color}) —')
console.log(report.join('\n'))
console.log(`\nwrote ${OUT.split('/').slice(-2).join('/')}`)
if (fail) {
  console.error('\n✗ AA FAILURE: a solid pair is below 4.5:1. Adjust the ramp/accent and rerun.')
  process.exit(1)
}
console.log('✓ all solid pairs ≥ 4.5:1 (WCAG AA) in both modes')
