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
      { label: 'Avatar', to: '/components/avatar' },
      { label: 'Badge', to: '/components/badge' },
      { label: 'Brand', to: '/components/brand' },
      { label: 'Button', to: '/components/button' },
      { label: 'Card', to: '/components/card' },
      { label: 'Checkbox', to: '/components/checkbox' },
      { label: 'Chip', to: '/components/chip' },
      { label: 'Copy', to: '/components/copy' },
      { label: 'DatePicker', to: '/components/datepicker' },
      { label: 'Divider', to: '/components/divider' },
      { label: 'FadeCard', to: '/components/fadecard' },
      { label: 'FileInput', to: '/components/fileinput' },
      { label: 'Header', to: '/components/header' },
      { label: 'Info', to: '/components/info' },
      { label: 'Input', to: '/components/input' },
      { label: 'Modal', to: '/components/modal' },
      { label: 'Null', to: '/components/null' },
      { label: 'Progress', to: '/components/progress' },
      { label: 'RadioGroup', to: '/components/radiogroup' },
      { label: 'Rating', to: '/components/rating' },
      { label: 'Ripple', to: '/components/ripple' },
      { label: 'ScrollShadow', to: '/components/scrollshadow' },
      { label: 'Select', to: '/components/select' },
      { label: 'Slider', to: '/components/slider' },
      { label: 'Switch', to: '/components/switch' },
      { label: 'Tab', to: '/components/tab' },
      { label: 'TagInput', to: '/components/taginput' },
      { label: 'Textarea', to: '/components/textarea' },
      { label: 'Tooltip', to: '/components/tooltip' },
      { label: 'Upload', to: '/components/upload' },
    ],
  },
]
