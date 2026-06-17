// Sidebar navigation. Order is defined here; labels come from site.config
// (displayLabel → "Input (输入框)") so the Chinese names live in one place.
// Add a route here when you add a component page.
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

const componentRoutes = Object.keys(pageMeta)
  .filter((p) => p.startsWith('/components/'))
  .sort()

export const nav: NavSection[] = [
  {
    title: '开始使用',
    items: [
      { label: '简介', to: '/' },
      { label: '快速开始', to: '/getting-started' },
      item('/playground'),
    ],
  },
  {
    title: '组件',
    items: componentRoutes.map(item),
  },
]
