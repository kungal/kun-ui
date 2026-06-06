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
      { label: 'AvatarGroup', to: '/components/avatargroup' },
      { label: 'Badge', to: '/components/badge' },
      { label: 'Brand', to: '/components/brand' },
      { label: 'Button', to: '/components/button' },
      { label: 'Card', to: '/components/card' },
      { label: 'Checkbox', to: '/components/checkbox' },
      { label: 'Chip', to: '/components/chip' },
      { label: 'Content', to: '/components/content' },
      { label: 'ContextMenu', to: '/components/contextmenu' },
      { label: 'Copy', to: '/components/copy' },
      { label: 'DatePicker', to: '/components/datepicker' },
      { label: 'Divider', to: '/components/divider' },
      { label: 'Drawer', to: '/components/drawer' },
      { label: 'Dropdown', to: '/components/dropdown' },
      { label: 'FadeCard', to: '/components/fadecard' },
      { label: 'Favicon', to: '/components/favicon' },
      { label: 'Feedback', to: '/components/feedback' },
      { label: 'FileInput', to: '/components/fileinput' },
      { label: 'Header', to: '/components/header' },
      { label: 'Icon', to: '/components/icon' },
      { label: 'Image', to: '/components/image' },
      { label: 'ImageNative', to: '/components/imagenative' },
      { label: 'Info', to: '/components/info' },
      { label: 'Input', to: '/components/input' },
      { label: 'Lightbox', to: '/components/lightbox' },
      { label: 'Link', to: '/components/link' },
      { label: 'Loading', to: '/components/loading' },
      { label: 'Markdown', to: '/components/markdown' },
      { label: 'Modal', to: '/components/modal' },
      { label: 'Null', to: '/components/null' },
      { label: 'Pagination', to: '/components/pagination' },
      { label: 'Popover', to: '/components/popover' },
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
      { label: 'Text', to: '/components/text' },
      { label: 'Textarea', to: '/components/textarea' },
      { label: 'Tooltip', to: '/components/tooltip' },
      { label: 'Upload', to: '/components/upload' },
      { label: 'UserChip', to: '/components/userchip' },
    ],
  },
]
