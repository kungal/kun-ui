# @kungal/ui-vue

## 0.16.0

### Minor Changes

- 8cc6532: 反馈 / 状态层第三批升级:补齐 a11y(aria-live/role)、确认框可定制、Toast 体验。

  修正(a11y / 正确性)

  - **KunProgress** —— `variant="circle"` 现在带 `role="progressbar"` + `aria-valuenow/min/max`(此前圆环完全没有,读屏不可知);`indeterminate` 改为真正的不定动画(条形横扫 / 圆环旋转,此前只是静态满条);新增 `ariaLabel`。
  - **KunLoading** —— 加载态加 `role="status"` + `aria-live="polite"` + `aria-busy`,装饰图 `aria-hidden`;新增轻量 `spinner` 变体(内联小尺寸,用打包的 spinner 图标)+ `size`。
  - **KunMessage(toast)** —— error / warn 现在用 `role="alert"` + `aria-live="assertive"`(打断式),info / success 仍是 `status` / polite(此前一律 polite,错误可能被读屏忽略)。
  - **AlertProvider** —— 用 `role="alertdialog"` + `aria-label`(取自 title);确认按钮改为**强调色**(主操作)、取消按钮**中性**(此前取消是红色,与惯例相反);`danger` 类型确认按钮变红。
  - **useRipple** —— 涟漪 `key` 改用自增计数(此前 `Date.now()` 在同毫秒多次点击会 key 冲突)。

  升级

  - **useKunAlert** —— 新增 `confirmText` / `cancelText` / `type`('info'|'warning'|'danger')/ `confirmColor`(可本地化文案 + 危险确认)。
  - **KunModal** —— 新增 `role`('dialog' | 'alertdialog')。
  - **KunMessage(toast)** —— 每条 toast 加悬停显示的关闭按钮(`duration:0` 常驻 toast 也能手动关);每个位置最多并存 5 条(超出丢弃最旧);支持滑动关闭(触摸横向拖拽)。
  - **KunBadge** —— 无锚点 slot 时渲染为独立内联徽标;新增 `ariaLabel`(如 "5 条未读")。

  Behavior(0.x minor)

  - `AlertProvider` 的取消按钮不再是 danger 红色,改为中性;确认按钮改为主色/按 `type` 着色。

### Patch Changes

- @kungal/ui-core@0.16.0

## 0.15.0

### Minor Changes

- e5f8c89: 浮层 / 弹出层第二批升级:对标 Radix / HeroUI / Reka,修掉 Popover 与 ContextMenu 的 a11y 缺陷,统一浮层基建。

  修正(a11y 缺陷)

  - **KunPopover** —— 触发器不再被包裹层强加 `role="button"` + 假 `aria-label="popover-trigger"`(此前传 `<KunButton>` 会形成 button 套 button、真实可访问名被盖掉);现在是真正的对话框:打开时把焦点移入面板,关闭时归还给触发器,Esc 关闭。
  - **KunContextMenu** —— 从「一堆按钮」升级为真正的 WAI-ARIA 菜单:`role="menu"`/`menuitem`、roving tabindex、方向键 / Home / End / Enter / Esc 键盘导航、打开聚焦首项、关闭归还焦点(与 KunDropdown 一致)。
  - **KunModal / KunDrawer** —— 多个叠加时按 Esc 只关闭**栈顶**那一个(此前会一次性关掉所有)。

  升级

  - **KunModal** —— 新增 `size`(sm/md/lg/xl/full)、`scrollBehavior`(inside/outside)、`placement`(center/top)。
  - **KunModal / KunDrawer** —— 打开时给页面背景加 `inert`(比单靠 `aria-modal` 更强的隔离;辅助技术与 Tab 都无法进入背景)。
  - **KunTooltip / KunPopover** —— 新增 `showArrow` 指向触发器的小箭头。
  - **KunDropdown** —— 新增首字母 type-ahead(按字母跳到对应项)。

  内部重构(不破坏 API)

  - 新增 `useKunFloating` —— 收敛 Popover / Tooltip / Dropdown / Select / Autocomplete 的 floating-ui 配置(offset/flip/shift + transform-origin + 可选 arrow),消除重复与漂移。
  - 新增 `useKunBackgroundInert` —— 引用计数的背景 `inert` 管理器。
  - `useKunOverlayZIndex` 新增 `isTopmost`(开启顺序栈,供 Esc/背景判定栈顶)。

  Breaking(0.x minor)

  - `KunPopover` 触发器包裹层不再是 `role="button"`,也不再注入 tabindex —— 请传入**可聚焦**的触发器(如 `<KunButton>`,常规用法不受影响);非交互触发器(纯图标/文本)需自行加 `tabindex`。
  - `KunModal` 面板默认带 `max-w-md` 宽度上限(此前无上限);需要更宽的用 `size="lg|xl|full"`。

### Patch Changes

- @kungal/ui-core@0.15.0

## 0.14.0

### Minor Changes

- cd404aa: 表单 / 输入控件第一批升级:对标 HeroUI / Mantine / Ant Design / PrimeVue / Naive,补齐 API 完备性、一致性与高级控件。

  新增组件

  - **KunNumberInput** —— 数字步进输入:`min`/`max`/`step`/`precision` 钳制与四舍五入、−/+ 步进按钮(到边界自动禁用)、`ArrowUp/Down`·`PageUp/Down` 键盘、`role="spinbutton"` 无障碍、`name` 原生表单收集。
  - **KunPinInput** —— OTP / 验证码分段输入:`length`、`type`(numeric/text)、`mask`、自动前进/退格回退、粘贴自动分发、方向键、`complete` 事件、`autocomplete="one-time-code"`。
  - **KunAutocomplete** —— 组合框(combobox):文本输入 + 建议列表,客户端过滤或 `manualFilter` + `@search`(远程),`allowCustomValue`、`clearable`、键盘导航、`aria-autocomplete`。

  升级

  - **KunSelect** —— 补齐键盘可达性(P0):方向键 / Enter / Space / Esc / Home / End / 首字母 type-ahead + `aria-activedescendant`,禁用项自动跳过;新增 `searchable`(列表内过滤)、`multiple`(可移除 chips)、`clearable`、`description`、`name`(隐藏域)、选项 `disabled`。
  - **KunSlider** —— 默认 `min`/`max` 由 17–77 改为 **0–100**;修复 `reactive(props)` 拷贝导致改 prop 不更新的响应式缺陷;新增 `disabled`、`label`/`ariaLabel`、`error`/`description`、`color`、`marks`、值气泡 `showTooltip`、`showValue`、`formatValue`、`change` 事件。
  - **KunCheckBox** —— 新增 `indeterminate`(三态,用于全选)+ `error`/`description`。
  - **KunInput** —— 新增 `isClearable`、`revealPassword`(密码可见性切换)、`isInvalid` + `aria-invalid`/`aria-describedby`。
  - **KunSwitch** —— 新增 `error`/`description`。

  统一

  - 辅助文案统一为 `description`(对齐 HeroUI / React-Aria);`helperText`(Input/TagInput)与 `hint`(Textarea/FileInput/Upload)保留为 **已弃用别名**,仍可用,内部回退到 `description`。

  Breaking(0.x minor)

  - `KunSlider` 默认 `min`/`max` 改为 0–100(此前 17–77):依赖旧默认值的调用需显式传入。
  - `KunSelect` 的 v-model 类型放宽为 `T | T[] | null`(支持 `multiple` 与清除);单选用法不受运行时影响,仅 TS 类型变宽。

  新增打包图标(构建期内联,运行时零请求):`lucide:minus`、`eye`、`eye-off`、`search`。

### Patch Changes

- Updated dependencies [cd404aa]
  - @kungal/ui-core@0.14.0

## 0.13.0

### Minor Changes

- 59dc29e: Accessibility + SSR-correctness sweep across the library.

  - **SSR-stable ids (the big one).** `useKunUniqueId` deferred Vue's `useId()` to
    `onMounted`, so the server HTML rendered empty ids — every `<label for>` /
    `id` pairing was broken on the server and changed on hydration. It now calls
    `useId()` synchronously (Vue guarantees it's identical server/client), so
    KunInput / KunCheckBox / KunTextarea / etc. have correct, stable label
    associations in the SSR HTML.
  - **KunModal dialog semantics.** The panel was missing `role="dialog"` /
    `aria-modal="true"` / an accessible name — now added, plus an `ariaLabel` prop.
    (KunDrawer already had these.)
  - **Accessible names on icon-only buttons.** KunModal & KunLoli close buttons and
    KunPagination prev/next now have `aria-label` (the icon itself is `aria-hidden`,
    so these announced as just "button" before).
  - **KunPagination semantics.** Wrapped in `<nav aria-label>`; numbered pages get
    `aria-label` + `aria-current="page"` on the active page.
  - **KunSlider keyboard (WCAG 2.1.1).** The thumb now responds to Arrow keys
    (±step), PageUp/PageDown (±10×), Home (min) and End (max) — it was drag-only.
  - **KunMessage live region.** Toast containers are now `role="status"`
    `aria-live="polite"`, so screen readers announce toasts.
  - **KunTooltip keyboard/SR.** Now shows on focus (not just hover), links its text
    via `aria-describedby`, and dismisses on Escape.
  - **KunRating** stars gained `aria-label` (the `title` alone wasn't announced).
  - **KunPopover** dialog gained an `ariaLabel` prop / accessible name.

  All non-breaking. The id change improves SSR output; the new `ariaLabel` props on
  KunModal/KunPopover default to a generic name when omitted.

### Patch Changes

- @kungal/ui-core@0.13.0

## 0.12.0

### Minor Changes

- 6e5836e: Make the navigational components render real, crawlable `<a href>` links.

  Google only follows `<a href>` — it doesn't click `<div @click>` / `<button>` /
  programmatic navigation. Several KunUI components navigated via `config.navigate`
  on a non-anchor element, so those links were invisible to crawlers. They now
  render a real anchor (`config.linkComponent` → `<a>` / `NuxtLink`), keeping the
  same navigation behavior (and working without JS):

  - **KunBrand** — the home/logo link was a `<div @click>`; now a real `<a>` to `to`
    (the canonical crawl entry point).
  - **KunPagination** — new `pageHref?: (page) => string` prop. When provided, the
    numbered page controls render `<a href>` per page, so paginated content is
    crawlable. Without it, behaviour is unchanged (plain buttons).
  - **KunAvatar / KunUserChip** — a profile-linking avatar was a `<div @click>`;
    now a real `<a>` to the user profile when there's a user to link to. KunUserChip
    wraps the **whole** chip (avatar + name) in one link so the name is anchor text,
    and gained an `isNavigation` prop (default `true`); the inner avatar is no longer
    a nested link.
  - **KunDropdown / KunContextMenu** — menu items gained an optional `href`. An item
    with `href` renders `<a role="menuitem" href>` (crawlable, for navigational
    menus); action items without `href` stay `<button>`.

  All changes are non-breaking: components without a navigation target (or
  pagination without `pageHref`, menu items without `href`) render exactly as
  before. Note KunBrand and a profile-linking KunAvatar/KunUserChip now render an
  `<a>` instead of a `<div>` — restyle if you targeted the element by tag.

### Patch Changes

- @kungal/ui-core@0.12.0

## 0.11.0

### Minor Changes

- 5403dca: SEO-first Tab panels + crawlable tab-as-route.

  KunTab was a headless tab **bar** (it rendered `role="tab"` buttons and exposed
  the active value, but no content). That left the SSR-SEO-critical decision —
  how to render and hide each section — entirely to the consumer, and the obvious
  `v-if` choice silently drops inactive panels from the indexable DOM. This adds a
  first-class, SEO-optimal content layer.

  **New `KunTabPanel` / `KunTabPanels`.**

  ```vue
  <KunTab v-model="active" :items="items" name="product" />
  <KunTabPanels v-model="active" name="product">
    <KunTabPanel value="overview">…</KunTabPanel>
    <KunTabPanel value="specs">…</KunTabPanel>
  </KunTabPanels>
  ```

  - **`mount` (default `"eager"`)** — `eager` server-renders **every** panel into the
    HTML so search engines index all of it; inactive panels are hidden, not removed.
    `"lazy"` renders on first activation then keeps (huge data, accepts the
    trade-off for unopened panels); `"unmount"` keeps only the active panel in the
    DOM (NOT crawlable — for heavy non-SEO widgets only). `forceMount` is a boolean
    alias for `eager`, familiar from Radix/Reka/MUI.
  - **Inactive panels hide with `hidden="until-found"`** (`hiddenStrategy`, default) —
    they stay indexed _and_ become reachable by in-page search (Ctrl+F),
    scroll-to-text fragments and deep links; the `beforematch` reveal flips the
    active tab to match. `hiddenStrategy="display"` falls back to `display:none`.
    SSR/first paint is flash-free (a `content-visibility` placeholder upgrades to
    the real attribute on the client).
  - Correct `role="tabpanel"` + `aria-labelledby`/`aria-controls` wiring (tab ↔
    panel ids derive from the tab `value`, namespaced by an optional `name`).

  **KunTab: `href` items now render a real `<a>` (crawlable tab-as-route).** Tabs
  with `href` previously rendered a `<button>` that navigated programmatically —
  invisible to crawlers. They now render `config.linkComponent` (`<a>` / `NuxtLink`)
  with the href, so each tab is a discoverable URL and works without JS; with JS the
  click is intercepted and routed through `config.navigate` (no double-nav). Tabs
  also gained `id` / `aria-controls` (and KunTab a `name` prop) to pair with panels.

### Patch Changes

- @kungal/ui-core@0.11.0

## 0.10.0

### Minor Changes

- 7f8495d: A unified motion system — smoother, more consistent animation across every
  component.

  **Motion tokens (@kungal/ui-tokens).** One easing set + duration scale so the
  whole library shares a rhythm instead of each component inventing its own:
  `--ease-kun-standard / -out / -in / -emphasized` (also exposed as Tailwind
  `ease-kun-*` utilities) and `--kun-dur-fast / -base / -slow / -exit`. Curves are
  asymmetric by design — decelerate on enter, accelerate on exit — and exits run
  ~30% shorter than enters. The opinionated base layer now also honours
  `prefers-reduced-motion: reduce` (WCAG 2.3.3).

  **Killed the layout-thrashing animations** (these caused visible stutter):

  - **KunTab** indicator no longer transitions `height` (it never changes between
    same-row tabs); it slides via `transform` and only its `width` animates.
  - **KunFadeCard** expands via the grid `0fr → 1fr` trick instead of `max-height`
    — no more `max-h-96` clipping of tall content, no per-frame height recalc.
  - **KunMessage** progress bar shrinks via `transform: scaleX` (compositor)
    instead of animating `width`.

  **Overlays retuned and made origin-aware.** KunModal now fades its backdrop
  (opacity only) while the panel rises + scales independently; KunDrawer’s backdrop
  and panel are timing-matched. KunDropdown / KunSelect / KunPopover / KunDatePicker
  / KunContextMenu now **grow out of their trigger** — `transform-origin` follows
  the floating-ui placement, so a menu that flips above its trigger correctly grows
  from its bottom edge. Every overlay shares the `ease-kun-*` curves and timing.

  **Micro-interactions.** KunSlider’s thumb gains a hover/focus ring halo (it had
  no feedback before); KunSwitch gains a keyboard `focus-visible` ring and a
  springier thumb settle; KunCheckBox’s check eases in with the emphasized curve.

  No component API changed. KunFadeCard now wraps its slot in a grid container (a
  DOM-structure change); if you targeted its immediate child with CSS, retarget the
  inner content.

### Patch Changes

- @kungal/ui-core@0.10.0

## 0.9.0

### Patch Changes

- 0a57065: Make the default corner radius rounder, HeroUI-style.

  The `--radius-kun-*` scale grows so the default control radius lands at HeroUI's
  12px (it was 8px):

  | bucket | before      | after |
  | ------ | ----------- | ----- |
  | sm     | 4px         | 6px   |
  | md     | 12 ←default | 12px  |
  | lg     | 12px        | 16px  |

  `md` (every component's default) is now **12px**, `lg` (floating panels — dropdown
  / context-menu / toast) is **16px**, which keeps their concentric nesting exact
  (panel 16 = item 12 + the 4px `p-1` inset). The `--kun-radius-scale` runtime knob
  still multiplies on top, and `none` / `full` still don't scale.

  One component needed a fix at the larger radius: **KunCheckBox**. Its small square
  box would look circular at a 12px token radius (12px ≈ half a 16–20px box), so the
  box now uses a proportional `35%` radius — a rounded square at every size, never a
  circle (matching how HeroUI derives its checkbox radius). The radio-look variant
  stays a full circle. No other component needed a size change; pill/circle controls
  (chips, avatars, switch, slider) are unaffected.

  - @kungal/ui-core@0.9.0

## 0.8.0

### Minor Changes

- 7624924: Extend the unified size system to the non-text controls.

  The first sizing pass only covered text controls (button/input/select/…). This
  brings the selection + display controls onto the same coherent system, grounded
  in how HeroUI / PrimeVue / Naive UI / Mantine / Ant size them.

  - **New shared selection scale (`kunSelectionSizeClasses`, @kungal/ui-core)** —
    KunCheckBox and KunRadioGroup now use **identical** box sizes (every major
    library does this), so a checkbox and a radio of the same size match. Box px by
    size: 12 / 14 / 16 / 20 / 24 — ≈ 0.5× the text-control height and ≈ 1.2–1.4× the
    label font, so the box sits optically level with its label.
  - **KunCheckBox gains a `size` prop** (`xs`–`xl`, default `md`). It was hardcoded
    at 20px while its sibling KunRadioGroup scaled 12→24 — now they share one scale
    (md box is 16px). The check glyph and label scale with it.
  - **KunSwitch gains a `size` prop.** Track/thumb scale on clean steps (track
    28×16 → 64×32, thumb = track height − 4); `md` is the original switch size.
  - **KunSlider gains a `size` prop.** Track 4→12px, thumb 14→28px; `md` unchanged.
  - **KunChip** moved onto its proper compact sub-scale (≈ 0.7× the button height at
    the same keyword — a tag is text + tight padding, not a tap target); its `md`/
    `lg`/`xl` vertical padding is slightly tighter so chips no longer read as tall
    as buttons.

  Components sized by their content/padding rather than a height (KunTooltip,
  KunDropdown/KunContextMenu menus, KunPopover, KunInfo) intentionally keep no
  `size` prop — no surveyed library gives them one.

### Patch Changes

- Updated dependencies [7624924]
  - @kungal/ui-core@0.8.0

## 0.7.0

### Minor Changes

- 29a39a7: Unify form-control sizing on one shared scale, and fix the `lg`/`xl` button
  proportions.

  - **New `kunControlSizeClasses` (@kungal/ui-core)** — a single source of truth for
    the per-size font + padding of every text-like form control. Padding-driven,
    `md` (~38px) as the anchor, `px:py` a clean 2:1, horizontal padding growing
    faster than vertical so a bigger control gets wider, not flatter.
  - **KunButton `lg`/`xl` fixed** — `lg` was `px-6 py-2` (3:1) and `xl` was
    `px-8 py-2.5` (3.2:1, a wide flat bar). They're now `px-5 py-2.5` and
    `px-6 py-3` (both 2:1), so large buttons look proportional. `md` is unchanged.
  - **One scale across controls** — KunButton, KunInput, KunSelect, KunDatePicker,
    KunTextarea and KunTagInput all consume the shared scale, so a button, input,
    select and date-picker of the same size line up at the same height in a row
    (md = 38px).
  - **KunSelect / KunDatePicker / KunTextarea gain a `size` prop** (`xs`–`xl`,
    default `md`). Previously they had no size and were locked one notch tighter
    than buttons (`px-3` / `p-3`); their default horizontal padding is now `px-4`,
    matching KunButton/KunInput `md`.

  Pill/compact display components (KunChip, KunBadge, KunAvatar) are intentionally
  not part of this form-control scale and keep their compact sizing.

### Patch Changes

- Updated dependencies [29a39a7]
  - @kungal/ui-core@0.7.0

## 0.6.2

### Patch Changes

- 7b521fc: KunCheckBox: add a gap between the box and its slotted content.

  The box and its content sat as adjacent flex children with no gap, so the box's
  right edge touched the start of slotted content (`<KunCheckBox>分类</KunCheckBox>`)
  — measured gap was 0. Only the `label` _prop_ path was spaced, because that
  `<label>` carried its own `ml-2`; slot/`v-html` content had nothing. The wrapper
  now uses `gap-2` (matching KunRadioGroup) and the redundant `ml-2` is dropped from
  the label, so the box→content gap is a uniform 8px whether you use the `label`
  prop or the default slot.

  - @kungal/ui-core@0.6.2

## 0.6.1

### Patch Changes

- dc437bb: Bundle the KunLoli mascots, fix Tab icon spacing, enlarge the Null/Loading
  images, and align KunTagInput's tag color.

  - **KunLoli**: the popup pulled its mascot from `/alert/{name}.webp` in the
    consuming app's public dir, so it showed a broken image in any app that didn't
    ship those four files. The four mascots are now bundled as base64 webp data
    URIs (same zero-setup, no-network policy as the bundled icons and the
    KunLoading / KunNull images), so `<KunLoli>` works out of the box.
  - **KunTab**: tabs with both an icon and a label had no gap between them (the
    size→gap map was defined but never applied), so the two were cramped together.
    The gap (`gap-1` / `gap-1.5` / `gap-2` by size) is now applied.
  - **KunNull / KunLoading**: the default mascot image is one size larger
    (`w-60`→`w-72` and `w-72`→`w-80` respectively).
  - **KunTagInput**: tags used a one-off color palette (`bg-primary/15
text-primary-700`) that read slightly off from the rest of the UI; they now use
    the same `flat` variant every other KunUI chip uses, so a tag's color matches.
  - @kungal/ui-core@0.6.1

## 0.6.0

### Minor Changes

- c15c5fc: Remove the `KunFavicon` component.

  `KunFavicon` was just a static, hardcoded inline SVG of the KunUI lollipop mark
  with no props — it carried no library value (an app that wants a logo ships its
  own asset, e.g. via `KunBrand`'s `iconSrc`). It's dropped from the `@kungal/ui-vue`
  exports and the `@kungal/ui-nuxt` auto-import list.

  **Migration:** if you were rendering `<KunFavicon />`, inline your own logo SVG or
  `<img>`/`KunImage` pointing at your favicon asset instead.

### Patch Changes

- @kungal/ui-core@0.6.0

## 0.5.2

### Patch Changes

- 8b39e7c: Make every component's corner radius follow the unified Kun radius system.

  Two classes of inconsistency were leaking through:

  - **KunButton / KunCopy defaulted `rounded` to `'lg'`** (12px) while every other
    component defers to the global `config.rounded` (default `md`, 8px) — so buttons
    looked visibly rounder than inputs, cards and surfaces sitting next to them. And
    because `'lg'` was a _prop default_ (never `undefined`), setting `config.rounded`
    globally couldn't pull buttons in line. Both now omit the default and resolve to
    `config.rounded` like the rest; pass `rounded` to override per-instance.

  - **Several components hardcoded raw Tailwind radii** (`rounded-lg` / `rounded-md` /
    `rounded-xl` / `rounded`) instead of the `rounded-kun-*` tokens, so they neither
    shared the unified scale nor responded to the runtime `--kun-radius-scale` knob.
    Converted to tokens (preserving each surface's pixel size and concentric nesting):
    KunTab (container + items + indicators), KunDropdown (panel + items), KunContextMenu
    (panel), KunSelect (listbox + options), KunMessage (toast card), KunPagination
    (page-jump input), KunRadioGroup (option row), KunTagInput (tag chip) and
    KunCheckBox (the box). Pill/circle elements using `rounded-full` are unchanged by
    design; KunLightbox's dark floating toolbars and KunLoading's mascot/overlay keep
    their own styling.

  Net effect: one global radius for all components, all of it now driven by
  `config.rounded` and scaled live by `--kun-radius-scale`.

  - @kungal/ui-core@0.5.2

## 0.5.1

### Patch Changes

- @kungal/ui-core@0.5.1

## 0.5.0

### Minor Changes

- b669cf4: Button/input sizing polish, a beautified checkbox, and a uniform corner radius.

  - **KunButton / KunInput sizes**: horizontal padding now grows with size while
    vertical padding stays tight (`py < px`), so larger sizes get _wider_, not
    fatter — matching modern libraries (shadcn `lg = px-8`, HeroUI fixed heights).
    `md` is unchanged; `lg`/`xl` are noticeably less bulky. Input vertical padding
    matches Button per size so the two line up in a form row.
  - **KunCheckBox**: the check is smaller (more breathing room in the box),
    stays centered, and scales in with a subtle pop. Cursor is now a pointer.
  - **Uniform corner radius**: every component now defers to the single global
    `config.rounded` (default `md`). Removed the per-component radius overrides on
    KunModal / KunDrawer / KunInfo / KunPopover / KunUpload (were `lg`) and
    KunRadioGroup, so all surfaces share one radius — set `config.rounded` once to
    restyle them together. (Pill/circle controls that use `rounded-full` are
    unaffected, by design.)

### Patch Changes

- @kungal/ui-core@0.5.0

## 0.4.1

### Patch Changes

- 93b8446: KunTextarea: defer the first auto-grow height measurement to the next animation frame. Measuring `scrollHeight` synchronously in `onMounted` could read a too-tall height before the textarea was laid out (notably a chat input that first appears on mobile), which only corrected itself on the first keystroke. The deferred measure runs after layout, so an auto-grow textarea starts at its true single-row height.
  - @kungal/ui-core@0.4.1

## 0.4.0

### Minor Changes

- cb46d7b: `KunImage` / `KunImageNative` now default to `loading="lazy"`.

  Previously `loading` defaulted to unset, so the browser loaded every image
  eagerly. A page with many images (card grids, lists, avatars) fired them all at
  once and saturated the connection, starving the above-the-fold images — they
  filled in slowly behind a long-lingering skeleton, making the page feel stuck on
  images. `KunImage` already reserves space (its aspect-ratio box + skeleton), so
  deferring off-screen images causes no layout shift and shortens the critical
  path. `KunImageNative` also gains a `loading` prop (it had none before).

  **Opt your LCP / hero image back into eager loading:**
  `<KunImage loading="eager" fetchpriority="high" … />` — otherwise it's lazy like
  the rest, which can cost a little LCP for that one image.

### Patch Changes

- @kungal/ui-core@0.4.0

## 0.3.4

### Patch Changes

- 3a50b6a: KunAvatar: render the avatar URL exactly as given — stop deriving size variants
  in the component.

  KunAvatar used to turn `user.avatar` into a 100px thumbnail by string-replacing
  the extension (`.webp` → `-100.webp`, most recently host-aware `_100` / `-100`).
  That baked CDN-specific URL conventions into the UI library. KunAvatar now
  renders `user.avatar` as-is; `size` only controls the rendered dimensions.
  Empty/missing avatar still falls back to a deterministic sticker.

  **Migration (consumers now pass the exact URL to show):** for small avatars pass
  the pre-sized thumbnail your CDN exposes (e.g. content-addressed
  `…/<hash>_100.webp`, legacy `…/avatar-100.webp`); for profile/`original` sizes
  pass the full image. Your backend already knows the image host, so resolving the
  URL belongs there — not in the UI.

  - @kungal/ui-core@0.3.4

## 0.3.3

### Patch Changes

- 9e0bdc2: KunAvatar: pick the 100px-thumbnail variant separator by image family. Content-addressed image*service avatars (`…/aa/bb/<hash>.webp`) expose variants with an underscore (`<hash>_100.webp`), while legacy path-based avatars use a hyphen (`avatar-100.webp`). The previous hardcoded hyphen `-100` 404'd every new image_service avatar (blank top-bar/comment avatars after a user changed their picture). Now detects the two-level-hex hash path and uses `*`for those,`-` otherwise.
  - @kungal/ui-core@0.3.3

## 0.3.2

### Patch Changes

- 2bd491f: `KunModal`: the backdrop only dismisses when the press _started_ on the backdrop.

  The overlay used a bare `@click`, so pressing inside the modal (e.g. selecting
  text in an input), dragging the cursor onto the backdrop, and releasing there
  fired a `click` on the backdrop and closed the modal — "I let go of the mouse
  and the dialog vanished". The overlay now tracks the pointer-down target and
  treats the click as a dismiss only when both the press and the release are on
  the backdrop itself. `isDismissable` behaviour is unchanged.

  - @kungal/ui-core@0.3.2

## 0.3.1

### Patch Changes

- @kungal/ui-core@0.3.1

## 0.3.0

### Minor Changes

- 9b8cbae: Remove the `faded` variant.

  `faded` (tinted fill + border) was visually almost indistinguishable from
  `ghost`, so it's been dropped from `KunUIVariant`. This affects every variant
  consumer — `KunButton`, `KunChip`, `KunDropdown` and `KunInfo`.

  **Migration:** replace `variant="faded"` with `variant="flat"` (tinted fill, no
  border) or `variant="bordered"` (visible colored border); `ghost` stays for the
  outline look it overlapped with.

### Patch Changes

- Updated dependencies [9b8cbae]
  - @kungal/ui-core@0.3.0

## 0.2.5

### Patch Changes

- f0bbd79: Fix `KunDropdown` yanking the page to the top when opened.

  The menu is teleported to `<body>` and positioned by floating-ui's async
  `computePosition`. `open()` focuses the menu inside a `nextTick`, which fires
  before the position is committed — so the menu is still at its initial
  `top:0; left:0`, and focusing it there scrolled the document to the top (very
  visible on mobile: tapping a trigger low on the page yanked the viewport up).
  All three `focus()` calls now pass `{ preventScroll: true }`, so focus still
  lands on the menu/item (keyboard nav unchanged) without scrolling.

  - @kungal/ui-core@0.2.5

## 0.2.4

### Patch Changes

- 0ec98f9: Fix invisible outline variants (`bordered` / `faded` / `ghost`) and the
  off-center checkbox check.

  - **Variant table**: entries set `border-{color}` but never a border _width_ —
    which paints nothing in Tailwind v4, so `bordered` / `faded` / `ghost` showed
    no border on KunButton, KunChip and KunDropdown. Every variant now carries an
    explicit `border` width (transparent on `solid` / `light` / `flat` / `shadow`
    so box sizes stay uniform when switching variants), so the outline variants
    render again.
  - **KunCheckBox**: the checkmark was a full-size (1em) icon nudged down by its
    baseline offset, so it sat off-center and cramped the 20px box edge-to-edge.
    It's now an explicitly-sized 14px check centered with flexbox.

- Updated dependencies [0ec98f9]
  - @kungal/ui-core@0.2.4

## 0.2.3

### Patch Changes

- f0bc0fc: Fix stacked overlays: a newly-opened `KunModal` / `KunDrawer` could render
  _beneath_ an already-open one.

  All overlays shared a single z-index (`z-kun-modal`), so when several were open
  the stacking fell back to DOM order — and because each overlay `Teleport`s to
  `<body>` at its fixed template position, that order followed _declaration_
  order, not _open_ order. Opening a second modal from inside the first (when the
  second is declared earlier in the template) buried the newer one.

  Overlays now claim an incrementing z-index on open via the new
  `useKunOverlayZIndex` composable (anchored at the `--z-kun-modal` token so
  consumer overrides still apply; the counter resets when the last overlay
  closes), so the most-recently-opened overlay is always on top regardless of
  declaration/DOM order. `useKunOverlayZIndex` is exported for apps stacking their
  own overlays on the same layer. (`KunLightbox` uses a native `<dialog>` top
  layer and already stacked correctly.)

  - @kungal/ui-core@0.2.3

## 0.2.2

### Patch Changes

- d32b6e5: Fix `Unknown file extension ".css"` crash under Nuxt SSR.

  KunUpload imports `vue-advanced-cropper`'s stylesheets, and the library build
  externalized those `.css` subpaths — so bare `import 'vue-advanced-cropper/dist/
style.css'` statements survived at the top of the published `dist/index.js`.
  Nuxt externalizes `@kungal/ui-vue` for SSR and handed those paths straight to
  Node, which can't load `.css` — crashing dev _and_ production SSR for any app
  that imported any Kun component (the cropper sits at the top of the barrel).

  The build now bundles all imported dependency CSS into `@kungal/ui-vue`'s single
  `dist/style.css` (which consumers already import) and ships JS with no runtime
  CSS imports; the cropper's JS stays external. No consumer changes needed.

  - @kungal/ui-core@0.2.2

## 0.2.1

### Patch Changes

- f48f420: Export `useBodyScrollLock`. The refcounted body scroll-lock composable that
  KunModal / KunDrawer / KunLightbox already use internally is now public, so apps
  can lock body scroll for their own overlays through the same shared counter
  (nested overlays won't unlock the body until the outermost one closes).
  - @kungal/ui-core@0.2.1

## 0.2.0

### Minor Changes

- e3cf45d: Bundle the default KunLoading / KunNull mascot images (base64 data URIs) — zero
  consumer setup, no network request, consistent with the bundled-icon policy.

  - `KunLoading`: default `src` is now a bundled image (previously relied on a
    consumer-provided `/kun.webp` public asset).
  - `KunNull`: default image is now bundled (previously fetched a random sticker
    from the KunUI CDN via `getRandomSticker()`); added an optional `src` prop to
    override it.
  - Both images now render at their natural aspect ratio instead of being forced
    into a square.

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

### Patch Changes

- d5ffbb6: Fix KunIcon color inheritance and polish the loading/empty states:

  - **KunIcon**: the inline SVG bodies paint with `currentColor`, but the base
    layer's `* { color }` rule was landing on the `v-html`'d inner nodes and
    pinning them to the foreground color — so `text-*` on (or above) `<KunIcon>`
    didn't actually color the icon. The inner nodes now inherit the icon's color.
  - **KunLoading / KunNull**: larger default image (`w-72` / `w-60`) shown at its
    natural aspect ratio instead of being squished into a square.
  - **KunNull**: the empty-state caption is now muted (`text-default-500`), and
    the default caption text changed to `莲说这里什么都没有`.

- Updated dependencies [35358f2]
  - @kungal/ui-core@0.2.0

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
- Updated dependencies [c532a02]
  - @kungal/ui-core@0.1.1
