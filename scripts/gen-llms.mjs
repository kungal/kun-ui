// Generate llms.txt + llms-full.txt from a single source of truth.
//
//   node scripts/gen-llms.mjs
//
// These files make KunUI legible to AI coding tools (Claude Code, Cursor, …):
// `llms.txt` is a compact index (rules + component map) that fits any context
// window; `llms-full.txt` inlines the entire integration guide + a component
// reference. The component metadata below is the canonical AI-facing source —
// keep it in sync when adding/removing components (it can also feed the docs
// site and an MCP server later).
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
  tagline:
    'Cross-framework component library — 53 Tailwind v4 Vue components, framework-agnostic design tokens + core, with a Nuxt layer. Published on npm under the @kungal scope; the four packages are versioned in lockstep.',
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
  ['KunInfo', 'Layout & display', 'Inline callout box (color, icon, title, description; solid/flat/bordered).'],
  ['KunProgress', 'Layout & display', 'Progress bar: linear/striped/gradient/circle, indeterminate, optional label.'],
  ['KunBadge', 'Layout & display', 'Count/dot badge wrapping a trigger (e.g. a button/icon); `max` caps the count.'],
  ['KunChip', 'Layout & display', 'Small tag/pill with color + variant.'],
  ['KunScrollShadow', 'Layout & display', 'Horizontal scroll container with edge fade shadows.'],
  ['KunFadeCard', 'Layout & display', 'Fade + expand transition wrapper for conditional content.'],
  ['KunNull', 'Layout & display', 'Empty-state placeholder with a bundled mascot image + caption (`description`, `src`, `isShowSticker`).'],
  // Buttons & feedback
  ['KunButton', 'Buttons & feedback', 'Button: color/variant/size, loading state; renders as a link with href/to.'],
  ['KunRipple', 'Buttons & feedback', 'Material-style ripple effect.'],
  ['KunLoading', 'Buttons & feedback', 'Loading state: overlay over wrapped content (default slot) or standalone; bundled mascot image (`src`, `loading`, `description`).'],
  ['KunCopy', 'Buttons & feedback', 'Copy-to-clipboard button with feedback.'],
  ['KunRating', 'Buttons & feedback', 'Star rating input (v-model number).'],
  // Media & content
  ['KunImage', 'Media & content', 'Image with skeleton/aspect/objectFit; uses the injected image component (NuxtImg in Nuxt).'],
  ['KunImageNative', 'Media & content', 'Bare <img> with class merging (no optimization pipeline).'],
  ['KunIcon', 'Media & content', 'Inline SVG icon from the bundled registry; never fetches. `name` like `lucide:x`. Inherits text color.'],
  ['KunBrand', 'Media & content', 'Logo + name brand block, links home; optional badge.'],
  ['KunContent', 'Media & content', 'Renders HTML (`content`) via v-html with spoiler + inline-image lightbox. DOES NOT sanitize — caller must.'],
  ['KunText', 'Media & content', 'Safe-wrapping text block (handles long URLs/underscores).'],
  ['KunMarkdown', 'Media & content', 'The KunUI markdown glyph.'],
  // Navigation & overlays
  ['KunLink', 'Navigation & overlays', 'Styled link; uses the injected link component (NuxtLink in Nuxt).'],
  ['KunTab', 'Navigation & overlays', 'Tabbed interface (v-model value, items array; variants, orientation).'],
  ['KunModal', 'Navigation & overlays', 'Dialog teleported to body, focus-trapped, body-scroll-locked, Escape to close (v-model boolean).'],
  ['KunDrawer', 'Navigation & overlays', 'Slide-in panel from any edge (placement, size; v-model boolean).'],
  ['KunTooltip', 'Navigation & overlays', 'Hover/focus tooltip (text + trigger slot).'],
  ['KunPopover', 'Navigation & overlays', 'Floating popover anchored to a trigger slot.'],
  ['KunDropdown', 'Navigation & overlays', 'Menu of items anchored to a trigger (items array).'],
  ['KunContextMenu', 'Navigation & overlays', 'Right-click context menu (items array).'],
  ['KunPagination', 'Navigation & overlays', 'Page navigation (v-model:current-page, total-page) with quick-jump.'],
  ['KunLightbox', 'Navigation & overlays', 'Image lightbox/viewer (v-model:is-open, images array).'],
  ['KunLightboxGallery', 'Navigation & overlays', 'Gallery wrapper; click an item to open the lightbox.'],
  ['KunLightboxGalleryItem', 'Navigation & overlays', 'A single gallery item (src + slot for the thumbnail).'],
  // Forms
  ['KunInput', 'Forms', 'Text input (v-model) with label/helper/error, sizes, variants.'],
  ['KunTextarea', 'Forms', 'Multiline input (v-model) with optional counter.'],
  ['KunSelect', 'Forms', 'Select dropdown (v-model, options array).'],
  ['KunSwitch', 'Forms', 'Toggle switch (v-model boolean).'],
  ['KunCheckBox', 'Forms', 'Checkbox (v-model boolean).'],
  ['KunSlider', 'Forms', 'Range slider (v-model number; min/max/step).'],
  ['KunRadioGroup', 'Forms', 'Radio group (v-model, options array; card/classic variants).'],
  ['KunDatePicker', 'Forms', 'Date / date-range picker (date-fns based; v-model).'],
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
