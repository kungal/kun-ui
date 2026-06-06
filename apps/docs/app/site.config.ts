// Single source of truth for the docs site's SEO + visible page intros. `site`
// holds the global constants; `pageMeta` maps each route to its title +
// description. useKunSeoMeta() (app.vue) reads this for meta tags, and
// <DocIntro> renders the description as each page's intro paragraph — so the
// Chinese copy lives in ONE place and never drifts.
//
// Component NAMES stay English (they're the API); the prose is Chinese.
// (i18n is a later concern.)

export const site = {
  name: 'KunUI',
  url: 'https://ui.kungal.com',
  description:
    'KunUI 是一个跨框架(Vue / Nuxt)组件库:53 个基于 Tailwind v4 的组件、与框架无关的设计令牌与核心、内置图标,并提供 Nuxt 层。',
  keywords: [
    'KunUI',
    'Vue',
    'Nuxt',
    '组件库',
    'Vue 组件库',
    'Nuxt 组件库',
    'Tailwind CSS',
    'UI 组件库',
    '设计系统',
    'kungal',
  ],
  ogImage: '/kungalgame.webp',
  locale: 'zh-CN',
} as const

export interface PageMeta {
  title: string
  description: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': { title: site.name, description: site.description },

  '/components/avatar': { title: 'Avatar', description: '基于 KunUser 的用户头像,支持确定性贴纸兜底与点击跳转个人主页。' },
  '/components/avatargroup': { title: 'AvatarGroup', description: '层叠头像组,超出部分以 +N 角标展示。' },
  '/components/badge': { title: 'Badge', description: '包裹触发元素的计数或圆点角标;max 限制显示的最大计数。' },
  '/components/brand': { title: 'Brand', description: 'logo + 名称的品牌块,点击回到首页,可带徽标。' },
  '/components/button': { title: 'Button', description: '按钮,支持颜色、变体与尺寸、加载状态,并可通过 href 渲染为链接。' },
  '/components/card': { title: 'Card', description: '带颜色、边框与悬停效果的容器;传入 href 即变为链接。' },
  '/components/checkbox': { title: 'Checkbox', description: '布尔复选框(v-model),可带标签。' },
  '/components/chip': { title: 'Chip', description: '小巧的标签 / 胶囊,支持颜色、变体与尺寸。' },
  '/components/content': { title: 'Content', description: '渲染可信 HTML(支持剧透与内联图片灯箱)。不做 sanitize —— 不可信 HTML 请自行处理。' },
  '/components/contextmenu': { title: 'ContextMenu', description: '在指定坐标打开的菜单,例如右键菜单。' },
  '/components/copy': { title: 'Copy', description: '一键复制到剪贴板,带成功反馈。' },
  '/components/datepicker': { title: 'DatePicker', description: '日期 / 日期范围选择器(基于 date-fns),支持格式化、最小/最大值与禁用日期。' },
  '/components/divider': { title: 'Divider', description: '横向或纵向分割线,可带居中标签。' },
  '/components/drawer': { title: 'Drawer', description: '从任意边缘滑出的抽屉面板,支持尺寸与标题。' },
  '/components/dropdown': { title: 'Dropdown', description: '锚定在触发元素上的下拉菜单。' },
  '/components/fadecard': { title: 'FadeCard', description: '淡入淡出 + 展开收起的过渡容器。' },
  '/components/favicon': { title: 'Favicon', description: 'KunUI 看板娘 logo,内联 SVG。' },
  '/components/feedback': { title: 'Feedback', description: '消息提示、确认弹窗与看板娘 —— useKunMessage / useKunAlert / useKunLoliInfo 及其 Provider。' },
  '/components/fileinput': { title: 'FileInput', description: '样式化的文件选择按钮(v-model File | File[]),触发器可自定义。' },
  '/components/header': { title: 'Header', description: '带样式的区块标题(h1–h3),可带描述。' },
  '/components/icon': { title: 'Icon', description: '来自内置注册表的内联 SVG 图标 —— 绝不联网请求;继承文字颜色。' },
  '/components/image': { title: 'Image', description: '带骨架屏、宽高比与 object-fit 的图片;在 Nuxt 层下经由 @nuxt/image 渲染。' },
  '/components/imagenative': { title: 'ImageNative', description: '原生 <img> + class 合并,适用于无需优化管线的场景。' },
  '/components/info': { title: 'Info', description: '带颜色、图标、标题与描述的内联提示框。' },
  '/components/input': { title: 'Input', description: '文本输入框(v-model),带标签、辅助 / 错误文本与尺寸。' },
  '/components/lightbox': { title: 'Lightbox', description: '图片灯箱,可用画廊容器 + 项,或独立使用。' },
  '/components/link': { title: 'Link', description: '样式化链接,经由注入的链接组件渲染(Nuxt 下为 NuxtLink)。' },
  '/components/loading': { title: 'Loading', description: '加载态:覆盖内容的遮罩或独立加载器;内置图片。' },
  '/components/markdown': { title: 'Markdown', description: 'KunUI markdown 字形(内联 SVG)。' },
  '/components/modal': { title: 'Modal', description: '传送到 body 的对话框,焦点锁定、滚动锁定,可按 Esc 关闭。' },
  '/components/null': { title: 'Null', description: '空状态占位,内置看板娘图片与文案。' },
  '/components/pagination': { title: 'Pagination', description: '分页导航(v-model:current-page + total-page),带快速跳页。' },
  '/components/popover': { title: 'Popover', description: '锚定在触发槽上的浮层面板。' },
  '/components/progress': { title: 'Progress', description: '进度条:实心 / 条纹 / 渐变 / 环形,支持不确定态与标签。' },
  '/components/radiogroup': { title: 'RadioGroup', description: '单选组(v-model + options),支持经典 / 卡片变体。' },
  '/components/rating': { title: 'Rating', description: '星级评分输入(v-model number),支持只读与尺寸。' },
  '/components/ripple': { title: 'Ripple', description: '水波纹渲染组件,由 useRipple 组合式驱动。' },
  '/components/scrollshadow': { title: 'ScrollShadow', description: '带边缘渐隐阴影的滚动容器,仅在有更多内容时出现。' },
  '/components/select': { title: 'Select', description: '下拉选择框(v-model),由 options 数组驱动。' },
  '/components/slider': { title: 'Slider', description: '范围滑块(v-model number),支持 min / max / step。' },
  '/components/switch': { title: 'Switch', description: '布尔开关(v-model),可带标签。' },
  '/components/tab': { title: 'Tab', description: '标签页(v-model + items),支持多种变体与方向。' },
  '/components/taginput': { title: 'TagInput', description: '标签输入(v-model string[]),支持分隔符、校验与计数。' },
  '/components/text': { title: 'Text', description: '安全换行的文本块,可正确折行长 URL 与下划线串。' },
  '/components/textarea': { title: 'Textarea', description: '多行输入(v-model),支持自动增高、调整大小与字数统计。' },
  '/components/tooltip': { title: 'Tooltip', description: '围绕触发元素的悬停 / 聚焦提示,可定位到任意一侧。' },
  '/components/upload': { title: 'Upload', description: '拖拽图片上传,内置裁剪。' },
  '/components/userchip': { title: 'UserChip', description: 'KunUser 的头像 + 名称 + 描述胶囊。' },
}
