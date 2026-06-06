// Sidebar navigation. Only list pages that exist — add an entry when you add a
// component page under app/pages/components/.
export interface NavItem {
  label: string
  to: string
}
export interface NavSection {
  title: string
  items: NavItem[]
}

export const nav: NavSection[] = [
  {
    title: 'Getting Started',
    items: [{ label: 'Introduction', to: '/' }],
  },
  {
    title: 'Components',
    items: [
      { label: 'Button', to: '/components/button' },
      { label: 'Card', to: '/components/card' },
      { label: 'Chip', to: '/components/chip' },
      { label: 'Input', to: '/components/input' },
      { label: 'Modal', to: '/components/modal' },
      { label: 'Switch', to: '/components/switch' },
    ],
  },
]
