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
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { oklch, clampChroma, wcagContrast, formatHex, parse } from 'culori'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/palette.generated.css')

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
  secondary: { h: 341.5, c: 0.26, name: 'Magenta', solidL: 0.74 },
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
  background: ['#f5f5f7', '#0a0a0a'],
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
for (const n of [1, 2, 3, 4]) themeColorLines.push(`  --color-content${n}: oklch(var(--content${n}));`)
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
console.log('— KunUI palette AA audit (solid = text on bg-{color}) —')
console.log(report.join('\n'))
console.log(`\nwrote ${OUT.split('/').slice(-2).join('/')}`)
if (fail) {
  console.error('\n✗ AA FAILURE: a solid pair is below 4.5:1. Adjust the ramp/accent and rerun.')
  process.exit(1)
}
console.log('✓ all solid pairs ≥ 4.5:1 (WCAG AA) in both modes')
