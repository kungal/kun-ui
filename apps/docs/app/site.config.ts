// Single source of truth for the docs site's SEO. `site` holds the global
// constants; `pageMeta` maps each route to its title + description. The
// useKunSeoMeta() composable (called once in app.vue) reads this reactively,
// so every page gets a unique title / description / OG / canonical with no
// per-page boilerplate. Add an entry here when you add a page.

export const site = {
  name: 'KunUI',
  url: 'https://ui.kungal.com',
  description:
    'KunUI — a cross-framework (Vue / Nuxt) component library: 53 Tailwind v4 components, framework-agnostic tokens + core, bundled icons, and a Nuxt layer.',
  keywords: [
    'KunUI',
    'Vue',
    'Nuxt',
    'component library',
    'Vue components',
    'Tailwind CSS',
    'UI library',
    'design system',
    'kungal',
  ],
  ogImage: '/kungalgame.webp',
  locale: 'en',
} as const

export interface PageMeta {
  title: string
  description: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': { title: site.name, description: site.description },

  '/components/avatar': { title: 'Avatar', description: 'User avatar from a KunUser, with a deterministic sticker fallback and click-to-profile navigation.' },
  '/components/avatargroup': { title: 'AvatarGroup', description: 'Stacked avatars with a +N overflow chip.' },
  '/components/badge': { title: 'Badge', description: 'A count or dot badge that wraps a trigger; max caps the displayed count.' },
  '/components/brand': { title: 'Brand', description: 'A logo + name block that links home, with an optional badge.' },
  '/components/button': { title: 'Button', description: 'Button with color, variant and size options, a loading state, and link rendering via href.' },
  '/components/card': { title: 'Card', description: 'A container with color, border and hover options; becomes a link with href.' },
  '/components/checkbox': { title: 'Checkbox', description: 'A boolean checkbox (v-model) with an optional label.' },
  '/components/chip': { title: 'Chip', description: 'A small tag / pill with color, variant and size.' },
  '/components/content': { title: 'Content', description: 'Renders trusted HTML with spoiler + inline-image lightbox. Does NOT sanitize — sanitize untrusted HTML yourself.' },
  '/components/contextmenu': { title: 'ContextMenu', description: 'A positioned menu you open at a point, e.g. on right-click.' },
  '/components/copy': { title: 'Copy', description: 'A copy-to-clipboard button with success feedback.' },
  '/components/datepicker': { title: 'DatePicker', description: 'A date / date-range picker (date-fns) with format, min/max and disabled-date control.' },
  '/components/divider': { title: 'Divider', description: 'A horizontal or vertical separator, optionally with a centered label.' },
  '/components/drawer': { title: 'Drawer', description: 'A slide-in panel from any edge, with size and title options.' },
  '/components/dropdown': { title: 'Dropdown', description: 'A menu of items anchored to a trigger slot.' },
  '/components/fadecard': { title: 'FadeCard', description: 'A transition wrapper that fades and expands its content in and out.' },
  '/components/favicon': { title: 'Favicon', description: 'The KunUI mascot logo as an inline SVG.' },
  '/components/feedback': { title: 'Feedback', description: 'Toasts, confirm dialogs and the mascot — useKunMessage / useKunAlert / useKunLoliInfo and their providers.' },
  '/components/fileinput': { title: 'FileInput', description: 'A styled file picker button (v-model File | File[]) with a customisable trigger.' },
  '/components/header': { title: 'Header', description: 'A styled section heading (h1–h3) with an optional description.' },
  '/components/icon': { title: 'Icon', description: 'Inline SVG icon from the bundled registry — never fetches; inherits text color.' },
  '/components/image': { title: 'Image', description: 'Image with skeleton, aspect-ratio and object-fit; renders through @nuxt/image under the Nuxt layer.' },
  '/components/imagenative': { title: 'ImageNative', description: 'A bare <img> with class merging, for cases that need no optimization pipeline.' },
  '/components/info': { title: 'Info', description: 'An inline callout box with color, icon, title and description.' },
  '/components/input': { title: 'Input', description: 'Text input (v-model) with label, helper / error text and sizes.' },
  '/components/lightbox': { title: 'Lightbox', description: 'Image lightbox with a gallery wrapper + items, or used standalone.' },
  '/components/link': { title: 'Link', description: 'A styled link rendered through the injected link component (NuxtLink under Nuxt).' },
  '/components/loading': { title: 'Loading', description: 'A loading state: an overlay over wrapped content or a standalone loader; bundled image.' },
  '/components/markdown': { title: 'Markdown', description: 'The KunUI markdown glyph (inline SVG).' },
  '/components/modal': { title: 'Modal', description: 'A dialog teleported to body, focus-trapped, scroll-locked, Escape to close.' },
  '/components/null': { title: 'Null', description: 'An empty-state placeholder with a bundled mascot image and a caption.' },
  '/components/pagination': { title: 'Pagination', description: 'Page navigation (v-model:current-page + total-page) with a quick-jump.' },
  '/components/popover': { title: 'Popover', description: 'A floating panel anchored to a trigger slot.' },
  '/components/progress': { title: 'Progress', description: 'A progress bar: solid / striped / gradient / circle, indeterminate, optional label.' },
  '/components/radiogroup': { title: 'RadioGroup', description: 'A single-choice group (v-model + options) with classic / card variants.' },
  '/components/rating': { title: 'Rating', description: 'A star rating input (v-model number) with readonly and sizes.' },
  '/components/ripple': { title: 'Ripple', description: 'The ripple-effect renderer, driven by the useRipple composable.' },
  '/components/scrollshadow': { title: 'ScrollShadow', description: 'A scroll container with edge fade shadows where there is more content.' },
  '/components/select': { title: 'Select', description: 'A dropdown select (v-model) driven by an options array.' },
  '/components/slider': { title: 'Slider', description: 'A range slider (v-model number) with min / max / step.' },
  '/components/switch': { title: 'Switch', description: 'A boolean toggle (v-model) with an optional label.' },
  '/components/tab': { title: 'Tab', description: 'A tabbed interface (v-model + items) with variants and orientation.' },
  '/components/taginput': { title: 'TagInput', description: 'Tag entry (v-model string[]) with split characters, validation and a counter.' },
  '/components/text': { title: 'Text', description: 'A text block that wraps safely, including long URLs and underscores.' },
  '/components/textarea': { title: 'Textarea', description: 'A multiline input (v-model) with auto-grow, resize control and a counter.' },
  '/components/tooltip': { title: 'Tooltip', description: 'A hover / focus tooltip around a trigger, positionable on any side.' },
  '/components/upload': { title: 'Upload', description: 'Drag / drop image upload with built-in cropping.' },
  '/components/userchip': { title: 'UserChip', description: 'An avatar + name + description chip for a KunUser.' },
}
