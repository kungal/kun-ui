// Sidebar navigation. Order is defined here; labels come from site.config
// (displayLabel → "Input (输入框)") so the Chinese names live in one place.
// Add a component to a category below when you add its page — anything left out
// still shows under "其它" (see the catch-all), so a page can never silently
// vanish from the nav.
import { displayLabel, pageMeta } from './site.config'

export interface NavItem {
  label: string
  to: string
}
export interface NavSection {
  title: string
  items: NavItem[]
}

const item = (to: string): NavItem => ({ label: displayLabel(to), to })
const toPath = (slug: string) => `/components/${slug}`

// Components grouped like modern UI libraries (MUI / Ant Design / Nuxt UI). The
// order here is the display order; `slugs` are the `/components/<slug>` names.
const componentCategories: { title: string; slugs: string[] }[] = [
  {
    title: '通用',
    slugs: ['button', 'icon', 'brand', 'copy', 'header', 'link', 'reaction'],
  },
  {
    title: '布局',
    slugs: ['card', 'divider', 'scrollshadow'],
  },
  {
    title: '表单',
    slugs: [
      'input',
      'textarea',
      'numberinput',
      'pininput',
      'select',
      'autocomplete',
      'checkbox',
      'radiogroup',
      'switch',
      'slider',
      'rating',
      'datepicker',
      'fileinput',
      'upload',
      'taginput',
    ],
  },
  {
    title: '数据展示',
    slugs: [
      'avatar',
      'avatargroup',
      'userchip',
      'badge',
      'chip',
      'accordion',
      'carousel',
      'image',
      'imagenative',
      'content',
      'markdown',
      'text',
      'timeline',
    ],
  },
  {
    title: '导航',
    slugs: ['tab', 'pagination', 'steps'],
  },
  {
    title: '浮层',
    slugs: [
      'modal',
      'drawer',
      'popover',
      'tooltip',
      'dropdown',
      'contextmenu',
      'commandpalette',
      'lightbox',
    ],
  },
  {
    title: '反馈',
    slugs: ['feedback', 'info', 'loading', 'progress', 'skeleton', 'null'],
  },
  {
    title: '动效',
    slugs: ['ripple', 'shatter', 'fadecard'],
  },
]

// Every component route that actually exists — used to keep the nav honest: only
// render curated routes that have a page, and sweep any un-categorized route into
// "其它" so nothing is lost.
const allComponentRoutes = Object.keys(pageMeta).filter((p) =>
  p.startsWith('/components/')
)
const categorized = new Set(
  componentCategories.flatMap((c) => c.slugs.map(toPath))
)
const uncategorized = allComponentRoutes
  .filter((p) => !categorized.has(p))
  .sort()

const componentSections: NavSection[] = componentCategories.map((c) => ({
  title: c.title,
  items: c.slugs
    .map(toPath)
    .filter((p) => allComponentRoutes.includes(p))
    .map(item),
}))
if (uncategorized.length) {
  componentSections.push({ title: '其它', items: uncategorized.map(item) })
}

export const nav: NavSection[] = [
  {
    title: '开始使用',
    items: [
      { label: '简介', to: '/' },
      { label: '快速开始', to: '/getting-started' },
      item('/colors'),
      item('/playground'),
      item('/changelog'),
      item('/upgrade'),
    ],
  },
  ...componentSections,
]
