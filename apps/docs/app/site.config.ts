// Single source of truth for the docs site's SEO + visible copy. `site` holds
// the global constants; `pageMeta` maps each route to its title (English API
// name), Chinese name (`cn`), and description. This one file feeds:
//   - SEO meta + <title>  (useKunSeoMeta)
//   - the page <h1>        (<DocTitle>)   → "Input (输入框)"
//   - the sidebar labels   (navLabel)     → "Input (输入框)"
//   - the page intro <p>   (<DocIntro>)
// so the Chinese copy lives in ONE place and never drifts. Component NAMES stay
// English (they're the API); the prose is Chinese. (i18n is a later concern.)

export const site = {
  name: 'KunUI',
  url: 'https://ui.kungal.com',
  slogan: '专为 ACGN 网站设计的现代无头 UI 组件库',
  description:
    'KunUI —— 专为 ACGN 网站设计的现代无头 UI 组件库。当前支持 Vue / Nuxt(React、Next.js、SolidJS、SolidStart 规划中):极致 SSR 支持、超低延迟、零外部依赖、生产就绪,助你更快交付 Web 应用。',
  keywords: [
    'KunUI',
    'ACGN',
    '二次元',
    'galgame',
    '组件库',
    '无头 UI',
    'headless UI',
    'Vue 组件库',
    'Nuxt 组件库',
    'Vue3',
    'Nuxt',
    'React',
    'SSR',
    'Tailwind CSS',
    'UI 组件库',
    '设计系统',
    'kungal',
  ],
  ogImage: '/kungalgame.webp',
  locale: 'zh-CN',
} as const

export interface PageMeta {
  /** English API name (also the page H1 base). */
  title: string
  /** Chinese name, shown as "Title (cn)" in nav + H1 + <title>. */
  cn?: string
  description: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': { title: site.name, description: site.description },
  '/getting-started': { title: '快速开始', description: '几分钟把 KunUI 接入你的 Vue / Nuxt 项目:安装、CSS 入口、核心规则、暗色模式与反馈 Provider。' },
  '/playground': { title: 'Playground', cn: '在线试玩', description: '在浏览器里实时编辑单文件组件并渲染 KunUI —— 改代码即见效果,无需本地搭建。' },
  '/changelog': { title: 'Changelog', cn: '更新日志', description: 'KunUI 各版本变更,随每次发布自动生成(源自 changeset)。四个包锁步同版本。' },
  '/upgrade': { title: 'Upgrade', cn: '升级与迁移', description: '按版本跨度的迁移指南:1.x 升级摘要,以及从 0.5.2 到 1.0 的破坏性迁移。' },

  '/components/accordion': { title: 'Accordion', cn: '手风琴', description: '可折叠区块(KunAccordion + KunAccordionItem):单开/多开、v-model、grid 揭示动画,SSR 安全且无障碍。' },
  '/components/autocomplete': { title: 'Autocomplete', cn: '自动完成', description: '组合框:文本输入 + 过滤建议列表(v-model 字符串);支持 allowCustomValue 与手动过滤。' },
  '/components/avatar': { title: 'Avatar', cn: '头像', description: '基于 KunUser 的用户头像,支持确定性贴纸兜底与点击跳转个人主页。' },
  '/components/avatargroup': { title: 'AvatarGroup', cn: '头像组', description: '层叠头像组,超出部分以 +N 角标展示。' },
  '/components/badge': { title: 'Badge', cn: '徽标', description: '包裹触发元素的计数或圆点角标;max 限制显示的最大计数。' },
  '/components/brand': { title: 'Brand', cn: '品牌', description: 'logo + 名称的品牌块,点击回到首页,可带徽标。' },
  '/components/button': { title: 'Button', cn: '按钮', description: '按钮,支持颜色、变体与尺寸、加载状态,并可通过 href 渲染为链接。' },
  '/components/card': { title: 'Card', cn: '卡片', description: '带颜色、边框与悬停效果的容器;传入 href 即变为链接。' },
  '/components/carousel': { title: 'Carousel', cn: '轮播', description: '横向轮播(KunCarousel + KunCarouselItem):原生滚动吸附 + 触摸滑动,箭头/圆点/自动播放为渐进增强。' },
  '/components/checkbox': { title: 'Checkbox', cn: '复选框', description: '布尔复选框(v-model),可带标签。' },
  '/components/chip': { title: 'Chip', cn: '胶囊', description: '小巧的标签 / 胶囊,支持颜色、变体与尺寸。' },
  '/components/content': { title: 'Content', cn: '内容', description: '渲染可信 HTML(支持剧透与内联图片灯箱)。不做 sanitize —— 不可信 HTML 请自行处理。' },
  '/components/contextmenu': { title: 'ContextMenu', cn: '右键菜单', description: '在指定坐标打开的菜单,例如右键菜单。' },
  '/components/copy': { title: 'Copy', cn: '复制', description: '一键复制到剪贴板,带成功反馈。' },
  '/components/datepicker': { title: 'DatePicker', cn: '日期选择器', description: '日期 / 日期范围选择器(基于 date-fns),支持格式化、最小/最大值与禁用日期。' },
  '/components/divider': { title: 'Divider', cn: '分割线', description: '横向或纵向分割线,可带居中标签。' },
  '/components/drawer': { title: 'Drawer', cn: '抽屉', description: '从任意边缘滑出的抽屉面板,支持尺寸与标题。' },
  '/components/dropdown': { title: 'Dropdown', cn: '下拉菜单', description: '锚定在触发元素上的下拉菜单。' },
  '/components/fadecard': { title: 'FadeCard', cn: '淡入卡片', description: '淡入淡出 + 展开收起的过渡容器。' },
  '/components/feedback': { title: 'Feedback', cn: '反馈', description: '消息提示、确认弹窗与看板娘 —— useKunMessage / useKunAlert / useKunLoliInfo 及其 Provider。' },
  '/components/fileinput': { title: 'FileInput', cn: '文件选择', description: '样式化的文件选择按钮(v-model File | File[]),触发器可自定义。' },
  '/components/header': { title: 'Header', cn: '标题', description: '带样式的区块标题(h1–h3),可带描述。' },
  '/components/icon': { title: 'Icon', cn: '图标', description: '来自内置注册表的内联 SVG 图标 —— 绝不联网请求;继承文字颜色。' },
  '/components/image': { title: 'Image', cn: '图片', description: '带骨架屏、宽高比与 object-fit 的图片;在 Nuxt 层下经由 @nuxt/image 渲染。' },
  '/components/imagenative': { title: 'ImageNative', cn: '原生图片', description: '原生 <img> + class 合并,适用于无需优化管线的场景。' },
  '/components/info': { title: 'Info', cn: '提示框', description: '带颜色、图标、标题与描述的内联提示框。' },
  '/components/input': { title: 'Input', cn: '输入框', description: '文本输入框(v-model),带标签、辅助 / 错误文本与尺寸。' },
  '/components/lightbox': { title: 'Lightbox', cn: '灯箱', description: '图片灯箱,可用画廊容器 + 项,或独立使用。' },
  '/components/link': { title: 'Link', cn: '链接', description: '样式化链接,经由注入的链接组件渲染(Nuxt 下为 NuxtLink)。' },
  '/components/loading': { title: 'Loading', cn: '加载', description: '加载态:覆盖内容的遮罩或独立加载器;内置图片。' },
  '/components/markdown': { title: 'Markdown', cn: 'Markdown 字形', description: 'KunUI markdown 字形(内联 SVG)。' },
  '/components/modal': { title: 'Modal', cn: '对话框', description: '传送到 body 的对话框,焦点锁定、滚动锁定,可按 Esc 关闭。' },
  '/components/null': { title: 'Null', cn: '空状态', description: '空状态占位,内置看板娘图片与文案。' },
  '/components/numberinput': { title: 'NumberInput', cn: '数字输入框', description: '数字输入(v-model number|null),带步进按钮、min/max/step、小数精度与自动钳制。' },
  '/components/pagination': { title: 'Pagination', cn: '分页', description: '分页导航(v-model:current-page + total-page),带快速跳页。' },
  '/components/pininput': { title: 'PinInput', cn: 'PIN 输入框', description: 'OTP / PIN 分段输入(v-model 字符串):逐格输入、粘贴分发、掩码、填满触发 complete。' },
  '/components/popover': { title: 'Popover', cn: '气泡卡片', description: '锚定在触发槽上的浮层面板。' },
  '/components/progress': { title: 'Progress', cn: '进度条', description: '进度条:实心 / 条纹 / 渐变 / 环形,支持不确定态与标签。' },
  '/components/radiogroup': { title: 'RadioGroup', cn: '单选组', description: '单选组(v-model + options),支持经典 / 卡片变体。' },
  '/components/rating': { title: 'Rating', cn: '评分', description: '星级评分输入(v-model number),支持只读与尺寸。' },
  '/components/ripple': { title: 'Ripple', cn: '水波纹', description: '水波纹渲染组件,由 useRipple 组合式驱动。' },
  '/components/scrollshadow': { title: 'ScrollShadow', cn: '滚动阴影', description: '带边缘渐隐阴影的滚动容器,仅在有更多内容时出现。' },
  '/components/select': { title: 'Select', cn: '选择器', description: '下拉选择框(v-model),由 options 数组驱动。' },
  '/components/skeleton': { title: 'Skeleton', cn: '骨架屏', description: '内容加载占位:text / rect / circle 形状,loaded 切换为真实内容,脉冲动画尊重 reduced-motion。' },
  '/components/slider': { title: 'Slider', cn: '滑块', description: '范围滑块(v-model number),支持 min / max / step。' },
  '/components/steps': { title: 'Steps', cn: '步骤条', description: '多步流程(items + current):横向/纵向、完成/进行/待办状态,数据驱动且 SSR 安全。' },
  '/components/switch': { title: 'Switch', cn: '开关', description: '布尔开关(v-model),可带标签。' },
  '/components/tab': { title: 'Tab', cn: '标签页', description: '标签页(v-model + items),支持多种变体与方向。' },
  '/components/taginput': { title: 'TagInput', cn: '标签输入', description: '标签输入(v-model string[]),支持分隔符、校验与计数。' },
  '/components/text': { title: 'Text', cn: '文本', description: '安全换行的文本块,可正确折行长 URL 与下划线串。' },
  '/components/textarea': { title: 'Textarea', cn: '文本域', description: '多行输入(v-model),支持自动增高、调整大小与字数统计。' },
  '/components/timeline': { title: 'Timeline', cn: '时间线', description: '纵向时间线(KunTimeline + KunTimelineItem):彩色圆点或图标徽章 + 内容,纯 CSS 连线。' },
  '/components/tooltip': { title: 'Tooltip', cn: '文字提示', description: '围绕触发元素的悬停 / 聚焦提示,可定位到任意一侧。' },
  '/components/upload': { title: 'Upload', cn: '上传', description: '拖拽图片上传,内置裁剪。' },
  '/components/userchip': { title: 'UserChip', cn: '用户胶囊', description: 'KunUser 的头像 + 名称 + 描述胶囊。' },
}

/** pageMeta lookup tolerant of a trailing slash (static hosting serves
 *  /foo/ while keys are /foo). */
export const getPageMeta = (path: string): PageMeta | undefined =>
  pageMeta[path] ?? pageMeta[path !== '/' ? path.replace(/\/$/, '') : path]

/** Display label "Title (中文)" for nav + headings. */
export const displayLabel = (path: string): string => {
  const m = getPageMeta(path)
  if (!m) return path
  return m.cn ? `${m.title} (${m.cn})` : m.title
}
