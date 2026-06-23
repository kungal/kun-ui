// Extract real prop metadata (name, type, default, required, JSDoc description)
// from the @kungal/ui-vue component sources using vue-component-meta, so the
// docs' props tables are generated from the TypeScript types and can never
// drift. Output: app/generated/component-meta.json (committed).
//
//   pnpm gen:meta
//
// Re-run after changing component props.

import { createChecker } from 'vue-component-meta'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const vuePkg = join(root, 'packages', 'vue')
const tsconfig = join(vuePkg, 'tsconfig.json')

// The 57 public components. File name = component name without the `Kun` prefix.
const names = [
  'KunAccordion', 'KunAccordionItem',
  'KunAlertProvider', 'KunAutocomplete', 'KunAvatar', 'KunAvatarGroup', 'KunBadge', 'KunBrand',
  'KunButton', 'KunCard', 'KunCarousel', 'KunCarouselItem', 'KunCheckBox', 'KunChip', 'KunContent',
  'KunContextMenu', 'KunCopy', 'KunDatePicker', 'KunDivider', 'KunDrawer',
  'KunDropdown', 'KunFadeCard', 'KunFileInput', 'KunHeader',
  'KunIcon', 'KunImage', 'KunImageNative', 'KunInfo', 'KunInput',
  'KunLightbox', 'KunLightboxGallery', 'KunLightboxGalleryItem', 'KunLink',
  'KunLoading', 'KunLoli', 'KunLoliProvider', 'KunMarkdown', 'KunMessageProvider',
  'KunModal', 'KunNull', 'KunNumberInput', 'KunPagination', 'KunPinInput', 'KunPopover', 'KunProgress',
  'KunRadioGroup', 'KunRating', 'KunReaction', 'KunRipple', 'KunScrollShadow', 'KunSelect',
  'KunSkeleton', 'KunSlider', 'KunSteps', 'KunSwitch', 'KunTab', 'KunTabPanel', 'KunTabPanels',
  'KunTagInput', 'KunText', 'KunTextarea', 'KunTimeline', 'KunTimelineItem',
  'KunTooltip', 'KunUpload', 'KunUserChip',
]

const checker = createChecker(tsconfig, {
  forceUseTs: true,
  printer: { newLine: 1 },
})

// Keep type strings readable: collapse whitespace, trim a wrapping `| undefined`.
const cleanType = (t) =>
  String(t)
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*undefined\b/g, '')
    .trim()

const out = {}
let okProps = 0
for (const name of names) {
  const file = join(vuePkg, 'src', 'components', `${name.replace(/^Kun/, '')}.vue`)
  try {
    const meta = checker.getComponentMeta(file)
    const props = meta.props
      .filter((p) => !p.global)
      .map((p) => ({
        name: p.name,
        type: cleanType(p.type),
        required: !!p.required,
        default: p.default ?? undefined,
        description: (p.description || '').replace(/\s+/g, ' ').trim() || undefined,
      }))
      // model props (v-model) first, then required, then alpha
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
    out[name] = { props }
    okProps += props.length
  } catch (e) {
    console.warn(`! meta failed for ${name}: ${e.message}`)
    out[name] = { props: [] }
  }
}

const dir = join(here, '..', 'app', 'generated')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'component-meta.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(`wrote component-meta.json — ${Object.keys(out).length} components, ${okProps} props total`)
