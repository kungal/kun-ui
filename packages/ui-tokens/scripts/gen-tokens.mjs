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
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { oklch, clampChroma, wcagContrast, formatHex, parse, rgb } from 'culori'
import { SHATTER_PHYSICS, SWIPE_DISMISS_PHYSICS } from './motion-physics.mjs'
import { checkThemeCoverage } from './theme-coverage.mjs'

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

// Every web variable a Dart value is generated from, for checkThemeCoverage.
const published = new Set([...css.matchAll(/(--[\w-]+):/g)].map((m) => m[1]))

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
  published.add(name)
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
const BASE_COLORS = ['white', 'black']
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
const baseColors = Object.fromEntries(
  BASE_COLORS.map((k) => [k, rgb(parse(cssValue(`--color-${k}`)))])
)
const borderStep = cssValue('--color-kun-border').match(/^oklch\(var\(--(\w+)-(\d+)\)\)$/)
if (!borderStep || !HUES[borderStep[1]] || !SHADES.includes(Number(borderStep[2])))
  throw new Error('--color-kun-border is no longer one palette step')
const globalOpacity = Number(cssValue('--kun-global-opacity'))
if (!(globalOpacity >= 0 && globalOpacity <= 1))
  throw new Error('--kun-global-opacity is not an alpha')
const translucent = themeColorLines
  .filter((l) => l.includes('var(--kun-global-opacity)'))
  .map((l) => l.match(/--[\w-]+/)[0])

// ── Tailwind's defaults, read from Tailwind ─────────────────────────────────
// KunUI never declares the Tailwind scales its components use (`--spacing`,
// `--text-*`, `--radius-*`, …), the default transition or `animate-pulse`;
// the components are written against Tailwind v4's default theme, so that
// file is what these are read from. Restated here, the numbers would go stale
// silently on a Tailwind upgrade; read, a changed default is a diff in the
// generated files and fails the CI gate. Which ones a component uses is
// theme-coverage.mjs's inventory, not this list.
const twTheme = readFileSync(
  createRequire(import.meta.url).resolve('tailwindcss/theme.css'),
  'utf8'
)
const twValue = (name) => {
  if (cssValues(name).length)
    throw new Error(`tokens.css now declares ${name}; read it from there, not from Tailwind`)
  const m = twTheme.match(new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm'))
  if (!m) throw new Error(`tailwindcss/theme.css declares no ${name}`)
  published.add(name)
  return m[1].trim()
}
const remPx = (v) => {
  const m = v.match(/^([\d.]+)rem$/)
  if (!m) throw new Error(`not a rem length: "${v}"`)
  return Number(m[1]) * 16
}
const ratio = (v) => {
  if (/^[\d.]+$/.test(v)) return Number(v)
  const m = v.match(/^calc\(([\d.]+) \/ ([\d.]+)\)$/)
  if (!m) throw new Error(`not a unitless line height: "${v}"`)
  return Number(m[1]) / Number(m[2])
}

const TEXT_STEPS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']
const FONT_WEIGHT_STEPS = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black']
const ROUNDED_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
const CONTAINER_STEPS = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']
const BREAKPOINT_STEPS = ['sm', 'md', 'lg', 'xl', '2xl']
const BLUR_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
const spacingUnit = remPx(twValue('--spacing'))
const scaleOf = (steps, prefix, read) =>
  Object.fromEntries(steps.map((k) => [k, read(twValue(`${prefix}${k}`))]))
const containers = scaleOf(CONTAINER_STEPS, '--container-', remPx)
const breakpoints = scaleOf(BREAKPOINT_STEPS, '--breakpoint-', remPx)
const blurs = scaleOf(BLUR_STEPS, '--blur-', px)
const rounded = scaleOf(ROUNDED_STEPS, '--radius-', remPx)
const fontWeights = scaleOf(FONT_WEIGHT_STEPS, '--font-weight-', (v) => {
  const n = Number(v)
  if (!(Number.isInteger(n / 100) && n >= 100 && n <= 900)) throw new Error(`FontWeight has no w${v}`)
  return n
})
// KunUI's `shadow` variant is `shadow-lg shadow-{color}/…`: Tailwind's
// geometry, with every layer's color replaced by the tint.
const glowLayers = shadowLayers(twValue('--shadow-lg'))
// What `transition`, `transition-colors` and friends run at when a component
// gives no `duration-*` / `ease-*` class — most of KunUI's hover and press
// feedback.
const defaultTransition = {
  duration: ms(twValue('--default-transition-duration')),
  easing: bezier(twValue('--default-transition-timing-function')),
}
const twKeyframes = (name) => {
  const at = twTheme.indexOf(`@keyframes ${name} {`)
  if (at < 0) throw new Error(`tailwindcss/theme.css declares no @keyframes ${name}`)
  const open = twTheme.indexOf('{', at)
  let depth = 0
  for (let i = open; i < twTheme.length; i++) {
    if (twTheme[i] === '{') depth++
    else if (twTheme[i] === '}' && --depth === 0)
      return twTheme.slice(open + 1, i).replace(/\s+/g, ' ').trim()
  }
  throw new Error(`@keyframes ${name} never closes`)
}
const twAnimation = (name, framesPattern) => {
  const v = twValue(`--animate-${name}`)
  const m = v.match(/^(\S+) ([\d.]+)(ms|s) (linear|cubic-bezier\([^)]+\)) infinite$/)
  if (!m || m[1] !== name) throw new Error(`unrecognised --animate-${name}: "${v}"`)
  const duration = Number(m[2]) * (m[3] === 's' ? 1000 : 1)
  if (!Number.isInteger(duration)) throw new Error(`--animate-${name} is not a whole ms`)
  const frames = twKeyframes(name).match(framesPattern)
  if (!frames) throw new Error(`unrecognised @keyframes ${name}: "${twKeyframes(name)}"`)
  return { duration, easing: m[4] === 'linear' ? null : bezier(m[4]), frames }
}
const pulse = twAnimation('pulse', /^50% \{ opacity: ([\d.]+); \}$/)
// KunPulse's doc has the port play the second half as the first one
// reversed, which is the same ease only for a curve symmetric about the
// centre.
const [pulseX1, pulseY1, pulseX2, pulseY2] = pulse.easing ?? []
if (!pulse.easing || Math.abs(pulseX1 + pulseX2 - 1) > 1e-9 || Math.abs(pulseY1 + pulseY2 - 1) > 1e-9)
  throw new Error(`--animate-pulse no longer runs a symmetric cubic-bezier: ${pulse.easing}`)
const spin = twAnimation('spin', /^to \{ transform: rotate\(360deg\); \}$/)
if (spin.easing) throw new Error('--animate-spin no longer runs linear')
const textScale = Object.fromEntries(
  TEXT_STEPS.map((k) => {
    const fontSize = remPx(twValue(`--text-${k}`))
    const lineHeight = ratio(twValue(`--text-${k}--line-height`))
    return [k, { fontSize, lineHeight, linePx: round(fontSize * lineHeight, 4) }]
  })
)
// A CSS generic like `ui-monospace` is resolved by the browser and names no
// installed family, so Flutter, which asks the platform for each name in turn,
// could never match it. `monospace` is different: Android's fonts.xml and
// Linux's fontconfig both answer to that name.
const CSS_ONLY_FAMILIES = new Set(['ui-monospace', 'ui-sans-serif', 'ui-serif', 'ui-rounded', 'system-ui'])
const monoStack = cssValue('--kun-font-mono')
  .split(',')
  .map((f) => f.trim().replace(/^(['"])(.*)\1$/, '$2'))
const monoFamilies = monoStack.filter((f) => !CSS_ONLY_FAMILIES.has(f))
if (monoFamilies.length < 2 || monoFamilies.at(-1) !== 'monospace')
  throw new Error(`--kun-font-mono no longer ends in a stack Flutter can walk: ${monoStack.join(', ')}`)

// ── Dart emitter ────────────────────────────────────────────────────────────
// `Color.from` takes normalised doubles and is const from Flutter 3.27, which
// is what makes a `static const` token class possible and keeps the generator's
// precision instead of quantising to 8-bit hex the way Style Dictionary's
// `color/hex8flutter` transform does.
const dartNum = (n) => String(round(n, 4))
// The spec draws a box-shadow's blur as "a Gaussian blur with a standard
// deviation equal to half the blur radius" (css-backgrounds-3); Flutter turns
// `BoxShadow.blurRadius` into σ = 0.57735·r + 0.5 (Shadow.convertRadiusToSigma).
// Up to 2.38.0 the CSS number went through unchanged and every shadow drew
// about 20% softer: against Chromium 153, a black 6px blur was off by up to
// 18/255 per pixel, and by 0–1/255 once converted.
const dartBlurRadius = (cssBlur) => {
  if (cssBlur === 0) return 0
  const r = (cssBlur / 2 - 0.5) / 0.57735
  if (r <= 0) throw new Error(`BoxShadow cannot express a ${cssBlur}px CSS blur`)
  return r
}
const dartScaleName = (k) => k.replace(/^(\d)(xs|xl)$/, '$2$1')
const digitNames = (steps) =>
  steps.includes('3xs')
    ? ['A Dart name cannot start with a digit, so `3xs` is `xs3` and `2xl` is', '`xl2`.']
    : ['A Dart name cannot start with a digit, so `2xl` is `xl2`.']
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
// For a doc sentence built from generated names; a member doc is indented 2.
const wrapDoc = (text, width = 74) =>
  text.match(/(?:`[^`]*`|\S)+/g).reduce((lines, word) => {
    const last = lines.at(-1)
    if (last !== undefined && `${last} ${word}`.length <= width) lines[lines.length - 1] += ` ${word}`
    else lines.push(word)
    return lines
  }, [])
const TAILWIND_NOTE = [
  "The values are Tailwind v4's default theme, which KunUI's components are",
  'written against and never redeclare. A site that overrides them in its own',
  '`@theme` renders differently from these; these are what the components',
  'were designed at.',
]
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
SCALE_DOCS.shade100 = [
  'Web token `--color-<hue>-100`.',
  '',
  "The web draws the `neutral` scale's step at [KunColors.globalOpacity];",
  'the value here is opaque.',
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
    'Stored opaque, like every color here; the web draws it at',
    '[KunColors.globalOpacity].',
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
  '',
  ...dartDoc(2, wrapDoc(
    'Web token `--color-kun-border` (the `border-kun` utility), the hairline ' +
      `on inputs, cards, dividers and popovers: [${DART_HUE_NAMES[borderStep[1]]}]'s ` +
      `\`shade${borderStep[2]}\`, drawn opaque.`
  )),
  `  Color get border => ${DART_HUE_NAMES[borderStep[1]]}.shade${borderStep[2]};`,
  '}',
  '',
  ...dartDoc(0, [
    'The two generated KunUI color schemes, and what does not change with',
    'the mode.',
  ]),
  'abstract final class KunColors {',
  ...dartDoc(2, [
    ...wrapDoc(
      `Web \`--kun-global-opacity\`. On the web, ${translucent.map((n) => `\`${n}\``).join(' and ')} ` +
        'carry this alpha; the schemes store them opaque, so web `bg-default-100` is ' +
        '`neutral.shade100.withValues(alpha: globalOpacity)`.'
    ),
    '',
    'This is the default; a site may set its own.',
  ]),
  `  static const double globalOpacity = ${dartNum(globalOpacity)};`,
  '',
  ...BASE_COLORS.flatMap((k) => {
    const c = baseColors[k]
    return [
      ...dartDoc(2, [
        `Web token \`--color-${k}\`, the same in light and dark.`,
      ]),
      `  static const Color ${k} = Color.from(alpha: 1, red: ${dartNum(c.r)}, green: ${dartNum(c.g)}, blue: ${dartNum(c.b)});`,
      '',
    ]
  }),
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

// The ballistic model's constants come from motion-physics.mjs — the same
// module Shatter.vue consumes (via ui-core's gen-motion.mjs) — so the Dart
// class below and the web keyframes can never disagree. Sampled spline tables
// (CatmullRomCurve.precompute) were considered and rejected: every curve in
// this model has a closed form, and a table would only approximate what the
// exponents state exactly.
const PHYSICS_DART = [
  ['int', 'keyframeSteps', String(SHATTER_PHYSICS.keyframeSteps), [
    'How many linear keyframe segments each trajectory is sampled into.',
  ]],
  ['double', 'reachFactor', String(SHATTER_PHYSICS.reachFactor), [
    'reach = spread × elementDiagonal × `reachFactor` — the distance scale',
    'every other length-like constant multiplies.',
  ]],
  ['double', 'launchMin', String(SHATTER_PHYSICS.launchMin), [
    'Outward launch speed, in units of reach:',
    '`launchMin` + rng·`launchSpan`. A gentle push, not a hard snap.',
  ]],
  ['double', 'launchSpan', String(SHATTER_PHYSICS.launchSpan), [
    'The random span above [launchMin].',
  ]],
  ['double', 'verticalFactor', String(SHATTER_PHYSICS.verticalFactor), [
    'Vertical launch damping — shards fly a little flatter than their',
    'radial direction, and gravity then owns the vertical.',
  ]],
  ['double', 'gravityMin', String(SHATTER_PHYSICS.gravityMin), [
    'Downward acceleration, in units of reach, applied ×t²:',
    '`gravityMin` + rng·`gravitySpan`.',
  ]],
  ['double', 'gravitySpan', String(SHATTER_PHYSICS.gravitySpan), [
    'The random span above [gravityMin].',
  ]],
  ['double', 'dragExponent', String(SHATTER_PHYSICS.dragExponent), [
    'drag(t) = 1 − (1−t)^`dragExponent` — how fast the launch impulse',
    'decays against air drag.',
  ]],
  ['double', 'scaleEndMin', String(SHATTER_PHYSICS.scaleEndMin), [
    'Shards shrink slightly as they fly: end scale =',
    '`scaleEndMin` + rng·`scaleEndSpan`.',
  ]],
  ['double', 'scaleEndSpan', String(SHATTER_PHYSICS.scaleEndSpan), [
    'The random span above [scaleEndMin].',
  ]],
  ['double', 'fadeOutStartMin', String(SHATTER_PHYSICS.fadeOutStartMin), [
    'Fade starts late in the flight, at `fadeOutStartMin` +',
    'rng·`fadeOutStartSpan` of t — the glass is seen flying, not',
    'dissolving.',
  ]],
  ['double', 'fadeOutStartSpan', String(SHATTER_PHYSICS.fadeOutStartSpan), [
    'The random span above [fadeOutStartMin].',
  ]],
  ['double', 'settleExponent', String(SHATTER_PHYSICS.settleExponent), [
    'Reassemble eases home along 1 − (1−t)^`settleExponent` — decelerate',
    'into place.',
  ]],
  ['double', 'fadeInWindow', String(SHATTER_PHYSICS.fadeInWindow), [
    'Reassembling shards fade in over the first `fadeInWindow` of t.',
  ]],
  ['double', 'staggerFraction', String(SHATTER_PHYSICS.staggerFraction), [
    'Shards nearest the impact let go first: delay = (dist/maxDist) ×',
    'min(duration×`staggerFraction`, `staggerCapMs`).',
  ]],
  ['int', 'staggerCapMs', String(SHATTER_PHYSICS.staggerCapMs), [
    'The stagger ceiling, in milliseconds.',
  ]],
  ['Duration', 'defaultDuration',
    `Duration(milliseconds: ${SHATTER_PHYSICS.defaultDurationMs})`, [
    'The tuned flight duration.',
  ]],
  ['double', 'defaultRotationDeg', String(SHATTER_PHYSICS.defaultRotationDeg), [
    'The tuned maximum random spin per shard, in degrees:',
    'spin = (2·rng−1) × rotation.',
  ]],
]

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
  ...dartDoc(0, [
    'What a web transition utility (`transition`, `transition-colors`, …)',
    'runs at when the component names no `duration-*` or `ease-*`: most of',
    "KunUI's hover and press feedback.",
    '',
    ...TAILWIND_NOTE,
  ]),
  'abstract final class KunDefaultTransition {',
  ...dartDoc(2, ['Web `--default-transition-duration`.']),
  `  static const Duration duration = Duration(milliseconds: ${defaultTransition.duration});`,
  '',
  ...dartDoc(2, ['Web `--default-transition-timing-function`.']),
  `  static const Curve curve = Cubic(${defaultTransition.easing.map(String).join(', ')});`,
  '}',
  '',
  ...dartDoc(0, [
    'Web `animate-pulse`: a loading placeholder fading down and back up,',
    'over and over.',
    '',
    ...TAILWIND_NOTE,
    '',
    'The web eases each half of a cycle with [curve], down to [midOpacity]',
    'and back, rather than easing the whole cycle once. [curve] is symmetric,',
    'so an `AnimationController` of half [duration] running',
    '`repeat(reverse: true)` under a `CurvedAnimation` with [curve] draws the',
    'same fade.',
  ]),
  'abstract final class KunPulse {',
  ...dartDoc(2, ['One full cycle: web `--animate-pulse`.']),
  `  static const Duration duration = Duration(milliseconds: ${pulse.duration});`,
  '',
  ...dartDoc(2, ['The ease of each half-cycle.']),
  `  static const Curve curve = Cubic(${pulse.easing.map(String).join(', ')});`,
  '',
  ...dartDoc(2, [
    'The opacity half-way through a cycle, which starts and ends at the',
    "widget's own opacity.",
  ]),
  `  static const double midOpacity = ${dartNum(Number(pulse.frames[1]))};`,
  '}',
  '',
  ...dartDoc(0, [
    'Web `animate-spin`: one clockwise turn per [duration] at constant speed,',
    'over and over.',
    '',
    ...TAILWIND_NOTE,
  ]),
  'abstract final class KunSpin {',
  ...dartDoc(2, ['One full turn: web `--animate-spin`.']),
  `  static const Duration duration = Duration(milliseconds: ${spin.duration});`,
  '',
  ...dartDoc(2, ['Constant speed: web `linear`.']),
  '  static const Curve curve = Curves.linear;',
  '}',
  '',
  ...dartDoc(0, [
    'The ballistic model behind the web `KunShatter` component, as data.',
    '',
    'These are the physics parameters one level above the sampled keyframes:',
    'the web bakes its per-shard WAAPI keyframes from exactly these numbers,',
    'so a Flutter shatter that samples this model reproduces the same motion',
    'instead of re-tuning the feel by eye.',
    '',
    'The model, per shard (rng() uniform in [0,1); lengths in logical px):',
    '```',
    'reach   = spread × elementDiagonal × reachFactor',
    'launch  = reach × (launchMin + rng·launchSpan)',
    'vx, vy  = dirX × launch,  dirY × launch × verticalFactor',
    'g       = gravity × reach × (gravityMin + rng·gravitySpan)',
    '```',
    'over normalised time t ∈ [0,1], sampled into [keyframeSteps] linear',
    'segments:',
    '```',
    'drag(t)  = 1 − (1−t)^dragExponent',
    'x(t)     = vx·drag(t)',
    'y(t)     = vy·drag(t) + g·t²',
    'rot(t)   = spin·t,  spin = (2·rng−1) × rotation',
    'scale(t) = 1 − (1−scaleEnd)·t',
    '```',
    'Gravity is a t² acceleration, not a linear end-offset, and the samples',
    'are joined linearly — one fat ease over the whole flight reads as',
    '"snap, then freeze" rather than physical.',
  ]),
  'abstract final class KunShatterPhysics {',
  ...PHYSICS_DART.flatMap(([type, name, value, doc], i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, doc),
    `  static const ${type} ${name} = ${value};`,
  ]),
  '}',
  '',
  ...dartDoc(0, [
    'Drag-to-dismiss on a bottom sheet — the feel of the web `KunModal` and',
    '`KunDrawer` sheets, as data.',
    '',
    'On release the sheet dismisses when it moved down and either',
    '```',
    'velocity > closeVelocity',
    'offset  >= min(panelHeight, viewportHeight) × closeDistanceRatio',
    '```',
    'An upward drag of d px moves the panel',
    '`rubberBandLimit × (1 − e^(−d / rubberBandLimit))`: it yields at first',
    'and then firmly stops.',
    '',
    'The drag slop, velocity sampling and scroll hand-off are not here: the web',
    "tunes those to browser behaviour, and Flutter's gesture arena,",
    '`VelocityTracker` and scroll notifications own them.',
  ]),
  'abstract final class KunSwipeDismissPhysics {',
  ...dartDoc(2, [
    'The fraction of the panel height, capped at the viewport, that',
    'dismisses on release.',
  ]),
  `  static const double closeDistanceRatio = ${dartNum(SWIPE_DISMISS_PHYSICS.closeDistanceRatio)};`,
  '',
  ...dartDoc(2, [
    'The release velocity that dismisses regardless of distance, in logical',
    'pixels per second — the unit of `DragEndDetails.primaryVelocity`. The',
    `web states it as ${SWIPE_DISMISS_PHYSICS.closeVelocity} px/ms.`,
  ]),
  `  static const double closeVelocity = ${dartNum(SWIPE_DISMISS_PHYSICS.closeVelocity * 1000)};`,
  '',
  ...dartDoc(2, ['The asymptote of an upward overdrag, in logical pixels.']),
  `  static const double rubberBandLimit = ${dartNum(SWIPE_DISMISS_PHYSICS.rubberBandLimit)};`,
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
  ...dartDoc(0, [
    "Tailwind's own corner radius scale, in logical pixels: web `rounded-md`",
    'and the other steps without `kun-`, which a few components use instead',
    'of [KunRadius].',
    '',
    ...TAILWIND_NOTE,
    '',
    'Unlike [KunRadius], these ignore `--kun-radius-scale`.',
    '',
    ...digitNames(ROUNDED_STEPS),
  ]),
  'abstract final class KunRounded {',
  ...ROUNDED_STEPS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, [`Web \`--radius-${k}\`.`]),
    `  static const double ${dartScaleName(k)} = ${dartNum(rounded[k])};`,
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
    '',
    "Each `blurRadius` is converted from the web's blur, not copied: CSS",
    'blurs a shadow with σ = blur / 2, and `BoxShadow` with',
    'σ = 0.57735 × blurRadius + 0.5. Convert the same way when writing a',
    'shadow from a CSS value by hand.',
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
      `      blurRadius: ${dartNum(dartBlurRadius(l.blur))},`,
      `      spreadRadius: ${l.spread},`,
      '    ),',
    ]),
    '  ];',
  ]),
  '',
  ...dartDoc(2, [
    "Web `shadow-lg` tinted by `shadow-<color>`: Tailwind's `--shadow-lg`",
    'geometry with every layer drawn in [color], which is how Tailwind',
    "applies a shadow color. KunUI's `shadow` variant is this glow; its tint",
    "is set in ui-core's `variants.ts`.",
  ]),
  '  static List<BoxShadow> glow(Color color) {',
  '    return [',
  ...glowLayers.flatMap((l) => [
    '      BoxShadow(',
    '        color: color,',
    `        offset: const Offset(${l.x}, ${l.y}),`,
    `        blurRadius: ${dartNum(dartBlurRadius(l.blur))},`,
    `        spreadRadius: ${l.spread},`,
    '      ),',
  ]),
  '    ];',
  '  }',
  '}',
  '',
].join('\n')

const spacingDart = [
  ...DART_BANNER,
  '',
  ...dartDoc(0, [
    'The KunUI spacing scale, in logical pixels.',
    '',
    ...TAILWIND_NOTE,
  ]),
  'abstract final class KunSpacing {',
  ...dartDoc(2, [
    'Web token `--spacing`, the step every spacing utility multiplies:',
    '`mt-1` is `unit`, `px-4` is `unit * 4`, `py-1.5` is `unit * 1.5`.',
    '',
    'A product of consts is itself const, so `unit * 4` works inside a',
    '`const` widget.',
  ]),
  `  static const double unit = ${dartNum(spacingUnit)};`,
  '}',
  '',
].join('\n')

const textDart = [
  ...DART_BANNER,
  '',
  "import 'package:flutter/painting.dart';",
  '',
  ...dartDoc(0, [
    'The KunUI type scale: font size and line height, nothing else.',
    '',
    ...TAILWIND_NOTE,
    '',
    'Color, weight and family are left null, so they inherit from the',
    'ambient `DefaultTextStyle`; add them with `copyWith`, taking the weight',
    'from [KunFontWeights] and a family from [KunFontFamilies].',
    '',
    'Every style sets `leadingDistribution` to',
    "`TextLeadingDistribution.even`, which is CSS's half-leading. Flutter's",
    'default, `proportional`, splits the extra line height by the font\'s',
    'ascent/descent ratio, which sets the glyphs lower in the line box than',
    'the web does.',
    '',
    '`text-2xl` to `text-9xl` are named `xl2` to `xl9`: a Dart name cannot',
    'start with a digit.',
  ]),
  'abstract final class KunText {',
  ...TEXT_STEPS.flatMap((k, i) => {
    const { fontSize, linePx } = textScale[k]
    const height = linePx === fontSize ? '1' : `${dartNum(linePx)} / ${dartNum(fontSize)}`
    return [
      ...(i ? [''] : []),
      ...dartDoc(2, [`Web \`text-${k}\`: ${dartNum(fontSize)}px on a ${dartNum(linePx)}px line.`]),
      `  static const TextStyle ${dartScaleName(k)} = TextStyle(`,
      `    fontSize: ${dartNum(fontSize)},`,
      `    height: ${height},`,
      '    leadingDistribution: TextLeadingDistribution.even,',
      '  );',
    ]
  }),
  '}',
  '',
  ...dartDoc(0, [
    "Tailwind's font weight scale: web `font-medium` is [medium].",
    '',
    ...TAILWIND_NOTE,
  ]),
  'abstract final class KunFontWeights {',
  ...FONT_WEIGHT_STEPS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, [`Web \`--font-weight-${k}\`.`]),
    `  static const FontWeight ${k} = FontWeight.w${fontWeights[k]};`,
  ]),
  '}',
  '',
  ...dartDoc(0, [
    "KunUI's font stacks, as Flutter family lists.",
    '',
    'A CSS `font-family` is a list the browser walks until a family is',
    'installed; a `TextStyle` takes the first name as `fontFamily` and the',
    'rest as `fontFamilyFallback`, which the engine walks the same way.',
    '',
    'These name system fonts. Flutter on the web reaches none of them, so a',
    'web build that must show code in a fixed-width face bundles one and',
    'puts it first.',
  ]),
  'abstract final class KunFontFamilies {',
  ...dartDoc(2, [
    `Web \`--kun-font-mono\`, the face \`.kun-prose\` sets code and \`kbd\` in:`,
    `the first family of \`${monoStack.join(', ')}\``,
    'that names an installed font rather than a CSS keyword.',
  ]),
  `  static const String mono = '${monoFamilies[0]}';`,
  '',
  ...dartDoc(2, [
    'The rest of the [mono] stack, in order. `monospace` last is the',
    "platform's own fixed-width face on Android and Linux.",
  ]),
  '  static const List<String> monoFallback = <String>[',
  ...monoFamilies.slice(1).map((f) => `    '${f}',`),
  '  ];',
  '',
  ...dartDoc(2, [
    '[mono] and [monoFallback] as a style to merge onto a [KunText] step:',
    '`KunText.sm.merge(KunFontFamilies.monoStyle)`.',
  ]),
  '  static const TextStyle monoStyle = TextStyle(',
  '    fontFamily: mono,',
  '    fontFamilyFallback: monoFallback,',
  '  );',
  '}',
  '',
].join('\n')

const layoutDart = [
  ...DART_BANNER,
  '',
  ...dartDoc(0, [
    'The KunUI container widths, in logical pixels: what a named size in',
    '`max-w-*`, `w-*` and the other sizing utilities resolves to.',
    '',
    ...TAILWIND_NOTE,
    '',
    ...digitNames(CONTAINER_STEPS),
  ]),
  'abstract final class KunContainerWidths {',
  ...CONTAINER_STEPS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, [`Web \`--container-${k}\`.`]),
    `  static const double ${dartScaleName(k)} = ${dartNum(containers[k])};`,
  ]),
  '}',
  '',
  ...dartDoc(0, [
    'The KunUI responsive breakpoints, in logical pixels. A web `md:` class',
    'applies from `width >= md`, and a `max-md:` class below it.',
    '',
    ...TAILWIND_NOTE,
    '',
    ...digitNames(BREAKPOINT_STEPS),
  ]),
  'abstract final class KunBreakpointWidths {',
  ...BREAKPOINT_STEPS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, [`Web \`--breakpoint-${k}\`.`]),
    `  static const double ${dartScaleName(k)} = ${dartNum(breakpoints[k])};`,
  ]),
  '}',
  '',
].join('\n')

const blurDart = [
  ...DART_BANNER,
  '',
  ...dartDoc(0, [
    'The KunUI blur scale, used by `blur-*` and `backdrop-blur-*`.',
    '',
    ...TAILWIND_NOTE,
    '',
    'A step is a Gaussian standard deviation in logical pixels. CSS `blur()`',
    'and `ImageFilter.blur` both take exactly that, so a step passes straight',
    'through: `ImageFilter.blur(sigmaX: KunBlur.sm, sigmaY: KunBlur.sm)`.',
    '`BoxShadow.blurRadius` is a different unit; see `KunShadows`.',
    '',
    ...digitNames(BLUR_STEPS),
  ]),
  'abstract final class KunBlur {',
  ...BLUR_STEPS.flatMap((k, i) => [
    ...(i ? [''] : []),
    ...dartDoc(2, [`Web \`--blur-${k}\`.`]),
    `  static const double ${dartScaleName(k)} = ${dartNum(blurs[k])};`,
  ]),
  '}',
  '',
].join('\n')

mkdirSync(DART_DIR, { recursive: true })
const dartFiles = {
  'blur.g.dart': blurDart,
  'colors.g.dart': colorsDart,
  'layout.g.dart': layoutDart,
  'motion.g.dart': motionDart,
  'radius.g.dart': radiusDart,
  'shadows.g.dart': shadowsDart,
  'spacing.g.dart': spacingDart,
  'text.g.dart': textDart,
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
const TAILWIND_DTCG_NOTE = TAILWIND_NOTE.join(' ').replace(/`/g, '')
const dtcgScale = (steps, values) => ({
  $description: TAILWIND_DTCG_NOTE,
  ...Object.fromEntries(
    steps.map((k) => [k, { $type: 'dimension', $value: dtcgDimension(values[k]) }])
  ),
})
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
  group.border = { $type: 'color', $value: `{color.${mode}.${borderStep[1]}.${borderStep[2]}}` }
  return group
}

const dtcg = {
  $description:
    'KunUI design tokens, DTCG Format Module 2025.10. Generated by ' +
    'packages/ui-tokens/scripts/gen-tokens.mjs from the same model that emits ' +
    'palette.generated.css and the kun_ui_tokens Dart package. Do not edit.',
  color: {
    ...Object.fromEntries(
      BASE_COLORS.map((k) => {
        const c = baseColors[k]
        return [
          k,
          {
            $type: 'color',
            $value: {
              colorSpace: 'srgb',
              components: [c.r, c.g, c.b],
              alpha: 1,
              hex: formatHex(c),
            },
          },
        ]
      })
    ),
    light: dtcgMode('light'),
    dark: dtcgMode('dark'),
  },
  opacity: {
    global: {
      $description: `The alpha of ${translucent.join(' and ')}; the color tokens store both opaque.`,
      $type: 'number',
      $value: globalOpacity,
    },
  },
  radius: Object.fromEntries(
    RADII.map((k) => [k, { $type: 'dimension', $value: dtcgDimension(radius[k]) }])
  ),
  rounded: dtcgScale(ROUNDED_STEPS, rounded),
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
    defaultTransition: {
      $description: TAILWIND_DTCG_NOTE,
      duration: {
        $type: 'duration',
        $value: { value: defaultTransition.duration, unit: 'ms' },
      },
      easing: { $type: 'cubicBezier', $value: defaultTransition.easing },
    },
    pulse: {
      $description: `${TAILWIND_DTCG_NOTE} The easing applies to each half of a cycle.`,
      duration: { $type: 'duration', $value: { value: pulse.duration, unit: 'ms' } },
      easing: { $type: 'cubicBezier', $value: pulse.easing },
      midOpacity: { $type: 'number', $value: Number(pulse.frames[1]) },
    },
    spin: {
      $description: `${TAILWIND_DTCG_NOTE} One full turn per duration.`,
      duration: { $type: 'duration', $value: { value: spin.duration, unit: 'ms' } },
      easing: { $type: 'cubicBezier', $value: [0, 0, 1, 1] },
    },
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
  spacing: {
    $description: TAILWIND_DTCG_NOTE,
    unit: { $type: 'dimension', $value: dtcgDimension(spacingUnit) },
  },
  container: dtcgScale(CONTAINER_STEPS, containers),
  breakpoint: dtcgScale(BREAKPOINT_STEPS, breakpoints),
  blur: dtcgScale(BLUR_STEPS, blurs),
  // Plain fontSize/lineHeight pairs, not the `typography` composite: 2025.10
  // makes all five of its sub-values required, and fontFamily, fontWeight and
  // letterSpacing are not part of this scale.
  fontFamily: {
    mono: { $type: 'fontFamily', $value: monoStack },
  },
  fontWeight: {
    $description: TAILWIND_DTCG_NOTE,
    ...Object.fromEntries(
      FONT_WEIGHT_STEPS.map((k) => [k, { $type: 'fontWeight', $value: fontWeights[k] }])
    ),
  },
  text: {
    $description: TAILWIND_DTCG_NOTE,
    ...Object.fromEntries(
      TEXT_STEPS.map((k) => [
        k,
        {
          fontSize: { $type: 'dimension', $value: dtcgDimension(textScale[k].fontSize) },
          lineHeight: { $type: 'number', $value: textScale[k].lineHeight },
        },
      ])
    ),
  },
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

const coverage = await checkThemeCoverage(published)
if (coverage.problems.length) {
  console.error('\n✗ theme coverage — kun_ui_tokens and the components disagree:')
  for (const p of coverage.problems) console.error(`  ${p}`)
  console.error(
    '  Generate the value in this file, or list it with a reason in\n' +
      '  scripts/theme-coverage.mjs NOT_GENERATED.'
  )
  process.exit(1)
}
console.log(
  `✓ kun_ui_tokens carries all ${coverage.deps.size - coverage.excused} theme values the components use ` +
    `(${coverage.excused} more are listed in NOT_GENERATED)`
)
