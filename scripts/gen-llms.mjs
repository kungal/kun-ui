// Generate llms.txt + llms-full.txt from a single source of truth.
//
//   pnpm gen        (from the repo root — runs every generator in order)
//
// These files make KunUI legible to AI coding tools (Claude Code, Cursor, …):
// `llms.txt` is a compact index (rules + component map) that fits any context
// window; `llms-full.txt` inlines the entire integration guide + a component
// reference. The component metadata below is the canonical AI-facing source —
// add a row when you add a component; the guard further down refuses to generate
// if the list falls behind KUN_COMPONENT_NAMES, and the `check` workflow runs
// this on every PR.
//
// Links default to the GitHub repo; pass a site base URL once the docs site
// ships: `node scripts/gen-llms.mjs https://kun-ui.example.com`.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS_BASE = process.argv[2] || 'https://github.com/kungal/kun-ui/blob/main'

const meta = {
  name: 'KunUI',
  // tagline is assigned below — its component count is derived from `components`
  // rather than typed in, because a hand-written number goes stale silently.
  packages: [
    ['@kungal/ui-tokens', 'Tailwind v4 design tokens (CSS): semantic colors, radius, z-index, animations, dark variant, optional base layer.'],
    ['@kungal/ui-core', 'Framework-agnostic TypeScript core: cn(), the variant/class matrix, the radius system, the bundled-icon registry, shared types (KunUIColor, KunUser, …).'],
    ['@kungal/ui-vue', 'The Vue 3 component layer (works in any Vue 3.5+ app).'],
    ['@kungal/ui-nuxt', 'A Nuxt 4 layer that wraps @kungal/ui-vue and auto-imports everything + injects NuxtLink / @nuxt/icon / @nuxt/image.'],
  ],
}

// The three counterintuitive rules an agent MUST know to use KunUI correctly.
const rules = [
  [
    'HTML is never sanitized',
    'KunUI ships no sanitizer. KunContent (the `content` prop, rendered via v-html) and useKunMessage(msg, type, dur, richText=true) render raw HTML exactly as given. Sanitize untrusted/user HTML yourself (e.g. DOMPurify) BEFORE passing it in. Fully-trusted/author content may be passed directly.',
  ],
  [
    'Icons are bundled, never fetched',
    'KunIcon renders inline SVG from an in-memory registry seeded with the icons the components need — it NEVER calls the Iconify API at runtime. Use bundled names like `lucide:check`. Register your own with registerKunIcon(name, {body}) / registerKunIcons({...}) from @kungal/ui-core at startup. Unknown names render the injected iconComponent fallback (the Nuxt layer wires @nuxt/icon; plain Vue renders nothing).',
  ],
  [
    'The consumer owns the Tailwind entry',
    "KunUI does NOT ship one all-in-one stylesheet. Your app's CSS entry must contain: `@import 'tailwindcss';` then `@import '@kungal/ui-tokens';` then `@import '@kungal/ui-vue/style.css';` (scoped component styles) plus `@source` directives pointing at @kungal/ui-vue and @kungal/ui-core so Tailwind generates the utility classes the components use. Under pnpm, install @kungal/ui-vue and @kungal/ui-core as DIRECT deps so the @import/@source resolve. Dark mode = toggle the `kun-dark-mode` class on <html>.",
  ],
]

const install = {
  nuxt: 'pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite',
  vue: 'pnpm add @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite',
}

// Canonical component list (single source of truth). category drives grouping.
const components = [
  // Layout & display
  ['KunCard', 'Layout & display', 'Container/panel with color + variant; renders as a link when given href/to.'],
  ['KunDivider', 'Layout & display', 'Horizontal/vertical separator with an optional centered label.'],
  ['KunHeader', 'Layout & display', 'Section heading (scale h1–h6) with brand styling.'],
  ['KunInfo', 'Layout & display', 'Inline callout box (color, icon, title, description; solid/flat/bordered). Rich body content goes in the default slot — there is no `description` slot; the heading has a `title` slot.'],
  ['KunProgress', 'Layout & display', 'Progress bar: linear/striped/gradient/circle, indeterminate, optional label.'],
  ['KunBadge', 'Layout & display', 'Count/dot badge wrapping a trigger (e.g. a button/icon); `max` caps the count.'],
  ['KunChip', 'Layout & display', 'Small tag/pill with color + variant.'],
  ['KunScrollShadow', 'Layout & display', 'Horizontal scroll container with edge fade shadows.'],
  ['KunFadeCard', 'Layout & display', 'Fade + expand transition wrapper for conditional content.'],
  ['KunNull', 'Layout & display', 'Empty-state placeholder with a bundled mascot image + caption (`description`, `src`, `isShowSticker`).'],
  ['KunAccordion', 'Layout & display', 'Collapsible sections (v-model string | string[]; `multiple`, variants light/bordered/splitted). Wraps KunAccordionItem.'],
  ['KunAccordionItem', 'Layout & display', 'One accordion section: `value` (required), `title`/`icon` or the `title` slot, `disabled`.'],
  ['KunSkeleton', 'Layout & display', 'Loading placeholder (variant text/circle/rect, width/height); set `loaded` to swap in the real content.'],
  ['KunSteps', 'Layout & display', 'Step / progress indicator (items array, `current` index; horizontal or vertical).'],
  ['KunTimeline', 'Layout & display', 'Vertical timeline container for KunTimelineItem.'],
  ['KunTimelineItem', 'Layout & display', 'One timeline entry (title, time, icon, color + default slot for the body).'],
  // Buttons & feedback
  ['KunButton', 'Buttons & feedback', 'Button: color/variant/size, loading state; renders as a link with href/to.'],
  ['KunButtonGroup', 'Buttons & feedback', 'Joins adjacent KunButtons into one segmented control (horizontal/vertical; merges the touching radii).'],
  ['KunRipple', 'Buttons & feedback', 'Material-style ripple effect.'],
  ['KunLoading', 'Buttons & feedback', 'Loading state: overlay over wrapped content (default slot) or standalone; bundled mascot image (`src`, `loading`, `description`).'],
  ['KunCopy', 'Buttons & feedback', 'Copy-to-clipboard button with feedback.'],
  ['KunRating', 'Buttons & feedback', 'Star rating input (v-model number).'],
  ['KunReaction', 'Buttons & feedback', 'Like / reaction toggle (v-model boolean) with an animated icon and an optional `count`.'],
  ['KunShatter', 'Buttons & feedback', 'Breaks its slot content into flying glass shards on click, and can fly them back (`pieces`, `gravity`, `reassemble`, `autoRestore`). Compositor-only (transform + opacity), zero deps.'],
  // Media & content
  ['KunImage', 'Media & content', 'Image with skeleton/aspect/objectFit; uses the injected image component (NuxtImg in Nuxt).'],
  ['KunCarousel', 'Media & content', 'Swipeable carousel (arrows, indicators, `loop`, `autoplay` ms, `slidesPerView`). Wraps KunCarouselItem.'],
  ['KunCarouselItem', 'Media & content', 'One carousel slide.'],
  ['KunImageNative', 'Media & content', 'Bare <img> with class merging (no optimization pipeline).'],
  ['KunIcon', 'Media & content', 'Inline SVG icon from the bundled registry; never fetches. `name` like `lucide:x`. Inherits text color.'],
  ['KunBrand', 'Media & content', 'Logo + name brand block, links home; optional badge.'],
  ['KunContent', 'Media & content', 'Renders HTML (`content`) via v-html with spoiler + inline-image lightbox. DOES NOT sanitize — caller must.'],
  ['KunText', 'Media & content', 'Safe-wrapping text block (handles long URLs/underscores).'],
  ['KunMarkdown', 'Media & content', 'The KunUI markdown glyph.'],
  // Navigation & overlays
  ['KunLink', 'Navigation & overlays', 'Styled link; uses the injected link component (NuxtLink in Nuxt).'],
  ['KunTab', 'Navigation & overlays', 'Tab bar (v-model value, items array; variants, orientation). Items with `href` render real <a> for crawlable tab-as-route.'],
  ['KunTabPanel', 'Navigation & overlays', "One tab's content. SEO-first: mount=eager (default) SSRs every panel and hides inactive ones with hidden=\"until-found\" (indexable + findable); mount=lazy/unmount opt out. Pairs with KunTab via `value`/`name`."],
  ['KunTabPanels', 'Navigation & overlays', 'Optional wrapper sharing active (v-model) + mount/hiddenStrategy defaults across KunTabPanels, and auto-wiring find-in-page reveal.'],
  ['KunModal', 'Navigation & overlays', 'Dialog teleported to body, focus-trapped, body-scroll-locked, Escape to close (v-model boolean).'],
  ['KunDrawer', 'Navigation & overlays', 'Slide-in panel from any edge (placement, size; v-model boolean).'],
  ['KunTooltip', 'Navigation & overlays', 'Hover/focus tooltip (text + trigger slot).'],
  ['KunPopover', 'Navigation & overlays', 'Floating popover anchored to a trigger slot.'],
  ['KunDropdown', 'Navigation & overlays', 'Menu of items anchored to a trigger (items array).'],
  ['KunContextMenu', 'Navigation & overlays', 'Right-click context menu (items array).'],
  ['KunCommandPalette', 'Navigation & overlays', 'Command-palette SHELL (v-model:open + ⌘K/Ctrl-K, v-model:query): dialog, keyboard nav, grouped rendering, match highlighting, a11y. It does NOT search — YOU compute `items` (flat, or KunCommandGroup[]) from `query`; picking one emits @select.'],
  ['KunPagination', 'Navigation & overlays', 'Page navigation (v-model:current-page, total-page) with quick-jump.'],
  ['KunLightbox', 'Navigation & overlays', 'Image lightbox/viewer (v-model:is-open, images array).'],
  ['KunLightboxGallery', 'Navigation & overlays', 'Gallery wrapper; click an item to open the lightbox.'],
  ['KunLightboxGalleryItem', 'Navigation & overlays', 'A single gallery item (src + slot for the thumbnail).'],
  // Forms
  ['KunInput', 'Forms', 'Text input (v-model) with label/helper/error, sizes, variants.'],
  ['KunTextarea', 'Forms', 'Multiline input (v-model) with optional counter.'],
  ['KunNumberInput', 'Forms', 'Numeric input (v-model number|null) with steppers, min/max/step, precision, clamping.'],
  ['KunPinInput', 'Forms', 'OTP / PIN segmented input (v-model string): per-cell entry, paste, masking, complete event.'],
  ['KunSelect', 'Forms', 'Select dropdown (v-model, options array); single/multiple, searchable, clearable. Remote sources via manualFilter + @search + loading + debounce; maxVisibleTags collapses chips; fullWidth/icon/popupWidth/classNames shape it into a filter pill.'],
  ['KunAutocomplete', 'Forms', 'Combobox: a text field (v-model string) with a filtered suggestion list; allowCustomValue / manualFilter.'],
  ['KunSwitch', 'Forms', 'Toggle switch (v-model boolean).'],
  ['KunCheckBox', 'Forms', 'Checkbox (v-model boolean).'],
  ['KunCheckBoxGroup', 'Forms', 'Multi-select checkbox group (v-model array, options array; `max`, orientation, label/error).'],
  ['KunSlider', 'Forms', 'Range slider (v-model number; min/max/step).'],
  ['KunRadioGroup', 'Forms', 'Radio group (v-model, options array; card/classic variants).'],
  ['KunDatePicker', 'Forms', 'Date / date-range picker (date-fns based; v-model). `precision` picks a day, month or year (value \'yyyy-MM-dd\' / \'yyyy-MM\' / \'yyyy\'), orthogonal to `mode`; the panel header zooms out day → month → year.'],
  ['KunFileInput', 'Forms', 'File picker button (v-model File | File[]); default trigger icon is bundled.'],
  ['KunTagInput', 'Forms', 'Tag entry input (v-model string[]; split chars, validation, max).'],
  ['KunUpload', 'Forms', 'Drag/drop image upload with crop (size, aspect).'],
  // People
  ['KunAvatar', 'People', 'User avatar (KunUser); navigates to userLinkTemplate on click; sticker fallback.'],
  ['KunAvatarGroup', 'People', 'Stacked avatars with +N overflow.'],
  ['KunUserChip', 'People', 'Avatar + name + description chip.'],
  // Overlay providers
  ['KunMessageProvider', 'Overlay providers (mount once near app root)', 'Renders toasts triggered by useKunMessage(). Mount once.'],
  ['KunAlertProvider', 'Overlay providers (mount once near app root)', 'Renders confirm dialogs triggered by useKunAlert(). Mount once.'],
  ['KunLoliProvider', 'Overlay providers (mount once near app root)', 'Renders the mascot popup triggered by useKunLoliInfo(). Mount once.'],
  ['KunLoli', 'Overlay providers (mount once near app root)', 'The standalone mascot popup component.'],
]

meta.tagline = `Cross-framework component library — ${components.length} Tailwind v4 Vue components, framework-agnostic design tokens + core, with a Nuxt layer. Published on npm under the @kungal scope; the four packages are versioned in lockstep.`

// The list above is hand-written on purpose — each row carries a one-line summary
// no generator can invent. The cost is that it falls behind the library silently:
// by the time this guard was added it was 13 components stale, so llms.txt was
// telling agents that KunAccordion, KunCarousel, KunCommandPalette and friends
// didn't exist. KUN_COMPONENT_NAMES is the single source of truth; diverging from
// it now fails the generator instead.
//
// Read as text rather than imported: this script is plain node from the repo root
// with no TS loader, and `@kungal/ui-vue` would resolve to dist (a build we don't
// want to require just to write a text file).
const exported = new Set(
  [
    ...readFileSync(join(root, 'packages/vue/src/componentNames.ts'), 'utf8')
      .match(/export const KUN_COMPONENT_NAMES = \[([\s\S]*?)\]/)[1]
      .matchAll(/'(Kun\w+)'/g),
  ].map((m) => m[1])
)
const listed = new Set(components.map(([name]) => name))
const missing = [...exported].filter((n) => !listed.has(n))
const extra = [...listed].filter((n) => !exported.has(n))
if (missing.length || extra.length) {
  console.error('gen-llms: the `components` list is out of sync with KUN_COMPONENT_NAMES.')
  if (missing.length) console.error(`  missing (add a summary): ${missing.join(', ')}`)
  if (extra.length) console.error(`  no longer exported (remove): ${extra.join(', ')}`)
  process.exit(1)
}

const composables = [
  ['useKunMessage / useKunMessageState', 'Trigger / read toasts. useKunMessage(message, type, duration=3000, richText=false, position="top-center").'],
  ['useKunAlert / useKunAlertState', 'Trigger / read confirm dialogs. useKunAlert(opts?) returns Promise<boolean>.'],
  ['useKunLoliInfo / useKunLoliState', 'Trigger / read the mascot popup.'],
  ['useKunUIConfig / provideKunUIConfig / installKunUIConfig', 'Read/set KunUIConfig (rounded, linkComponent, navigate, imageComponent, iconComponent, userLinkTemplate).'],
  ['useKunCopy', 'Copy-to-clipboard helper.'],
  ['useKunUniqueId', 'SSR-safe unique id generation.'],
  ['useResolvedRounded', "Resolve a component's effective radius."],
  ['useRipple', 'Ripple effect logic.'],
  ['useFilePicker', 'Programmatic file selection.'],
  ['useContentLightbox / useSpoilerContent', 'Enhancers used by KunContent.'],
]

const coreExports =
  'From @kungal/ui-core (framework-agnostic): cn, registerKunIcon, registerKunIcons, getKunIcon, hasKunIcon, the variant class helpers (kunBgClasses, kunTextClasses, kunRingClasses, …), and types KunUIColor, KunUISize, KunUIVariant, KunUIRounded, KunUser.'

const docs = [
  ['Integration guide', 'docs/INTEGRATION.md', 'Full setup for Nuxt and plain Vue: install, the Tailwind entry CSS, dark mode, icons, KunUIConfig, providers, security, SSR, full reference.'],
  ['Using KunUI with AI tools', 'docs/USING-WITH-AI.md', 'How to point Claude Code / Cursor at KunUI and a paste-able rules block.'],
  ['Releasing', 'docs/RELEASING.md', 'How the four packages are versioned and published (Changesets + npm OIDC).'],
  ['Architecture', 'docs/architecture.md', 'Why the library is split into tokens / core / vue / nuxt.'],
]

const groupBy = (arr, i) => {
  const out = new Map()
  for (const row of arr) {
    if (!out.has(row[i])) out.set(row[i], [])
    out.get(row[i]).push(row)
  }
  return out
}

// ── llms.txt ────────────────────────────────────────────────────────────
const lines = []
lines.push(`# ${meta.name}`, '')
lines.push(`> ${meta.tagline}`, '')
lines.push('Packages:')
for (const [name, desc] of meta.packages) lines.push(`- ${name}: ${desc}`)
lines.push('')
lines.push('## Critical rules (read before using)', '')
for (const [title, body] of rules) lines.push(`- **${title}.** ${body}`)
lines.push('')
lines.push('## Install', '')
lines.push('Nuxt — `extends: ["@kungal/ui-nuxt"]` in nuxt.config, then add the CSS entry:', '')
lines.push('```bash', install.nuxt, '```', '')
lines.push('Plain Vue — `app.use(KunUI)` (or import components directly):', '')
lines.push('```bash', install.vue, '```', '')
lines.push('See the Integration guide for the required Tailwind entry stylesheet.', '')
lines.push('## Documentation', '')
for (const [title, path, desc] of docs)
  lines.push(`- [${title}](${DOCS_BASE}/${path}): ${desc}`)
lines.push('')
lines.push('## Components', '')
lines.push(
  'In Nuxt all are auto-imported. In plain Vue import them from @kungal/ui-vue (or register globally via app.use(KunUI)).',
  ''
)
for (const [cat, rows] of groupBy(components, 1)) {
  lines.push(`### ${cat}`)
  for (const [name, , summary] of rows) lines.push(`- ${name}: ${summary}`)
  lines.push('')
}
lines.push('## Composables', '')
for (const [name, summary] of composables) lines.push(`- ${name}: ${summary}`)
lines.push('')
lines.push(coreExports, '')

// Write to the repo root (canonical, GitHub-visible) AND the docs site's
// public/ so the live site serves /llms.txt (and /llms-full.txt).
const publicDir = join(root, 'apps/docs/public')
const writeBoth = (name, content) => {
  writeFileSync(join(root, name), content)
  writeFileSync(join(publicDir, name), content)
}

writeBoth('llms.txt', lines.join('\n'))

// ── llms-full.txt ───────────────────────────────────────────────────────
// Section 12 of INTEGRATION.md was a hand-typed copy of the same list, and it
// drifted the same way: 18 names behind (no KunAccordion / KunCarousel /
// KunCommandPalette / KunSteps / KunSkeleton / …) under a heading that still
// said 53. llms-full.txt inlines this file verbatim, so that stale list was what
// agents read. It is now written from `components` above, which the guard has
// just pinned to KUN_COMPONENT_NAMES. Rewritten BEFORE the file is read below.
{
  const path = join(root, 'docs/INTEGRATION.md')
  const src = readFileSync(path, 'utf8')
  const START = '<!-- AUTO-GENERATED component reference (pnpm gen:llms) — do not edit -->'
  const END = '<!-- END AUTO-GENERATED component reference -->'
  const i = src.indexOf(START)
  const j = src.indexOf(END)
  if (i === -1 || j === -1) {
    console.error(`gen-llms: docs/INTEGRATION.md is missing the component-reference markers.`)
    process.exit(1)
  }
  const body = [`## 12. Component reference (${components.length})`, '']
  for (const [cat, rows] of groupBy(components, 1)) {
    body.push(`**${cat}:** ${rows.map(([n]) => `\`${n}\``).join(' · ')}`, '')
  }
  body.push(
    'In Nuxt all are auto-imported. In plain Vue they\'re named exports of',
    '`@kungal/ui-vue` (or registered globally via `app.use(KunUI)`).'
  )
  const next = src.slice(0, i + START.length) + '\n' + body.join('\n') + '\n' + src.slice(j)
  // The package table in section 1 carries the same number.
  writeFileSync(
    path,
    next.replace(
      /The Vue 3 component layer \(\d+ components\)/,
      `The Vue 3 component layer (${components.length} components)`
    )
  )
}

const integration = readFileSync(join(root, 'docs/INTEGRATION.md'), 'utf8')
const full = []
full.push(`# ${meta.name} — full documentation for LLMs`, '')
full.push(`> ${meta.tagline}`, '')
full.push(
  'This file inlines the integration guide plus a component reference. For the compact index see llms.txt.',
  ''
)
full.push('---', '', '# Critical rules', '')
for (const [title, body] of rules) full.push(`## ${title}`, '', body, '')
full.push('---', '', integration.trim(), '')
full.push('---', '', '# Component reference', '')
for (const [cat, rows] of groupBy(components, 1)) {
  full.push(`## ${cat}`, '')
  for (const [name, , summary] of rows) full.push(`- **${name}** — ${summary}`)
  full.push('')
}
full.push('# Composable reference', '')
for (const [name, summary] of composables) full.push(`- **${name}** — ${summary}`)
full.push('', coreExports, '')
writeBoth('llms-full.txt', full.join('\n'))

const n = components.length
console.log(`Generated llms.txt + llms-full.txt (${n} components, base: ${DOCS_BASE})`)
