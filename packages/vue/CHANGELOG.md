# @kungal/ui-vue

## 2.29.0

### Minor Changes

- bd3836f: `rounded="full"` no longer paints 9999px onto a floating panel: the popups of KunSelect / KunAutocomplete / KunDatePicker fall back to `lg`

  > From this release the changelog is written in English.

  **The bug**

  All three are trigger + panel components, and all three applied the same `roundedClass` to both. On the trigger — a single-line control — `full` is a pill and is correct. On the panel it is not a pill at all: per CSS Backgrounds 3 §5.5 the browser scales every corner by `min(side / sum of that side's radii)`, so the radius actually painted is half the panel's short side.

  Measured in this repo's own docs (`/components/select`, the FilterBar example, Chromium):

  | panel                | declared | actually painted |
  | -------------------- | -------- | ---------------- |
  | 218×280 tag list     | 9999px   | 109px            |
  | 80×116 platform list | 9999px   | 40px             |

  The 80×116 one was a lozenge with its option labels pushed into the curve. KunDatePicker's 276×324 calendar was 138px.

  This was not a misconfiguration downstream. **KunUI's own example prescribed it** — `apps/docs/app/examples/select/FilterBar.vue` sets `rounded="full"` on three `KunSelect`s and overrides only `classNames.trigger`. Anyone copying the example shipped the blob.

  **The change**

  New `kunPanelRoundedClass(rounded)` in `@kungal/ui-core`: `full` resolves to `lg`, the other four buckets pass through unchanged. The three components' floating panels use it; their triggers are untouched.

  `lg` is not an invented number — `--radius-kun-lg: 16px` is documented in `tokens.css` as “containers / floating panels”. HeroUI is built the same way: the five buckets of its select `radius` variant write **only** `trigger`, and `popoverContent` takes its radius from Popover, whose default is `lg`.

  **What it costs you**

  - If you set `rounded="full"`: the popup becomes a 16px rounded rectangle; the trigger stays a pill. That is the only visible change.
  - If you already corrected it with `classNames.popup`: your class still wins (since 2.27.0 `cn()` understands `rounded-kun-*`). Nothing changes for you.
  - The other four buckets (`none` / `sm` / `md` / `lg`) behave exactly as before.
  - If you genuinely want a 9999px panel: `classNames.popup="rounded-kun-full"`. KunAutocomplete has no `classNames` at all — which is also why this had to be fixed in the library: its consumers had no local escape hatch.

  **KunPopover / KunModal / KunDrawer / KunTooltip are unchanged.** They have a single surface, so `rounded` names that surface directly and `full` there is an explicit request. What was fixed here is one prop quietly governing two surfaces, one of which has no correct value for `full`.

  **Docs site**

  The homepage's version badge and component counts are now read at build time from `packages/vue/package.json` and `KUN_COMPONENT_NAMES` instead of being typed by hand — they said “v0.2” and “53 个组件” while npm was at 2.28.0 with 70 components. Section 12 of `docs/INTEGRATION.md` (inlined verbatim into `llms-full.txt`) is now generated from the same list; hand-maintained, it had fallen 18 names behind, so AI tools reading `llms-full.txt` were told KunAccordion, KunCarousel, KunCommandPalette, KunSteps and friends did not exist.

### Patch Changes

- Updated dependencies [bd3836f]
  - @kungal/ui-core@2.29.0

## 2.28.0

### Minor Changes

- 346ea36: KunDatePicker 补齐筛选栏外观面，并修好 `mode="range"` 中途状态看不见的问题；KunTagInput 加 `classNames`

  **KunDatePicker `mode="range"` 首击之后，触发器会说自己是空的（bug 修复）**

  区间选择的第一次点击本来就会 emit 一个半开区间——`selectDate` 返回 `[start, null]`，面板保持打开等第二次点击。但触发器把这个状态渲染成空串，于是：消费者的 model 里已经是 `['2021', null]`，界面上却显示占位符「请选择年份」，而且 `clearable` 的判断挂在 `displayValue` 上，清除按钮跟着一起消失。此时点击面板外面走开，这个值既看不见也清不掉，只能重新选满两端。

  现在半开状态会渲染成 `2021 -`，那个悬着的短横就是在说哪一端已经定了；清除按钮也跟着回来。完整区间 `2021 - 2024` 的显示不变，`mode="range"` 的语义、关闭时机、`clearDate` 的行为都没有动。

  **KunDatePicker 新增 `fullWidth` / `icon` / `className` / `classNames`**

  `precision` 是为筛选栏加的，但筛选栏要的外观面当时只给了 KunSelect：DatePicker 的触发器硬编码 `w-full`，尾部硬编码日历图标，20 个 prop 里一个样式钩子都没有，slot 数是 0。放进一排胶囊里它必然是个全宽表单框。

  - `fullWidth`（默认 `true`）—— 关掉之后触发器收缩到内容宽，和 KunSelect 同义。
  - `icon` —— 触发器里值前面的前导图标，和 KunSelect 同义。尾部的日历图标是展开指示器，两种情况下都保留。
  - `className` / `classNames`（`root` / `trigger` / `popup` / `grid` / `cell`）—— 部位名和 `KunSelectClassNames` 对齐，两个组件的心智模型一致。

  **没有给 `popupWidth`，这是有意的。** KunSelect 需要它，是因为它的 floating middleware 会把弹层宽度设成触发器宽度，短胶囊会得到一个同样窄的列表。KunDatePicker 的 middleware 只封顶高度，面板一直是内容宽加 260px 下限、从不跟随触发器——它现在就等价于 `popupWidth: 'auto'`，短胶囊照样得到完整日历，加这个 prop 只会是空实现。

  **KunTagInput 新增 `classNames`**

  `root` / `field` / `chip` / `input`。此前整个组件只有一个 `className`（指向带边框的字段），tag 的样式完全够不着——而 tag 恒为胶囊，`rounded` 不管它，`rounded="none"` 下方角字段里就是一排胶囊 tag，没有任何出路。`className` 的目标不变（仍是字段），`classNames.field` 是它的同义词。

  tag 保持胶囊是刻意的：一个 tag 就是一个 `<KunChip>`，这样字段旁边放一个独立 `KunChip` 和字段里的 tag 不会长得不一样。要改它用 `classNames.chip`——从 2.27.0 起 `cn()` 认识 KunUI 自己的 `rounded-kun-*` 比例尺，所以消费者传的圆角能正确压过组件的 `rounded-full`。

  **KunRadioGroup / KunCheckBoxGroup 的 `rounded` 补了文档**

  它只作用于 `card` 变体——`classic` 是点/框加标签，`pill` 本身就是胶囊，两者都忽略它。行为没变，此前传了没反应也没地方能查到原因。

### Patch Changes

- @kungal/ui-core@2.28.0

## 2.27.0

### Minor Changes

- 5890c9c: `cn()` 现在认识 KunUI 自己的 Tailwind 比例尺；KunAutocomplete 补回输入法保护；组件文档补上事件与插槽

  上一次发布后做了一轮更严格的复测，这次修的是那轮报告里"根因还在"的部分。

  ## `cn()`：把 KunUI 的比例尺教给 tailwind-merge

  tailwind-merge 只认识 Tailwind 自己的比例尺，凡是它解析不了的类都原样放行、也就永远不会参与冲突消解。KunUI 在 `@theme` / `@utility` 里自己铸的那一批全都在这个盲区里：

  ```ts
  cn("rounded-kun-md", "rounded-full"); // 旧：两个类都留下，谁赢由 CSS 源码顺序决定
  ```

  实测后果是 `KunSelect` 的 `classNames.trigger: 'rounded-full'` 传下去圆角仍然是 12px —— 也就是说 `classNames` 文档里承诺的"你的类会赢"对 `rounded-kun-*`、`shadow-kun-*`、`z-kun-*`、`ease-kun-*`、`duration-kun-*` 和自定义 `animate-*` 全部不成立。

  `shadow-kun-*` 比其它几个更糟：shadow **颜色**组的校验器接受任意非任意值单词，所以 `shadow-kun-md` 被归类成了颜色，会和 `shadow-primary/20` 互相消解 —— 被丢掉的是那条真正的 box-shadow。

  现在 `cn()` 用 `extendTailwindMerge` 把这些名字注册进对应的组，`classNames` 的承诺第一次是真的。**名单由 `pnpm gen` 从 `tokens.css` 生成**（`packages/ui-core/src/twScales.generated.ts`），因为手写名单漂移之后不会报任何错，只会安静地退回旧行为。

  库内部只有两处的合并结果因此改变，两处都是"本来就想让后写的那个赢"：日期面板里区间中段的月/年格子（`rounded-kun-md` 之后跟 `rounded-none`）现在稳定是方角，禁用的 `KunTextarea`（`shadow-kun-sm` 之后跟 `shadow-none`）现在稳定没有阴影。

  ## KunAutocomplete：补回输入法保护

  和 KunSelect 上一轮修掉的是同一个洞。`:value` + 手写 `@input` 会绕过 Vue 自己的组合输入保护（`runtime-dom` 的 `vModelText` 在 `compositionstart` 上打 `e.target.composing` 标记，input 监听器以 `if (e.target.composing) return` 开头），于是用拼音打「你好」时列表会在每一次罗马字按键上重新过滤、塌成"无匹配项"，`@search` 也会在真正那一次之前先发五次半成品。现在按 `compositionstart` / `compositionend` 跟踪，一个词只发一次。

  ## KunDatePicker

  - **「今天」不再无视 `minDate` / `maxDate` / `isDateDisabled`。** 它绕开网格直接提交，所以当今天本身超出边界时它是唯一一条能一键选中被禁日期的路径。现在按钮直接禁用。
  - **面板的 ARIA 语义改成自洽的组合框 + 网格。** 原先面板是 `role="dialog" aria-modal="true"`，但焦点始终留在 trigger 上 —— 等于对辅助技术宣称"页面其余部分已惰性化"，而被聚焦的元素恰恰在那"其余部分"里。ARIA 1.2 只在 "`aria-controls` refers to an element that supports `aria-activedescendant`" 时允许组合框保留焦点并把 `aria-activedescendant` 指进弹出层，而 `dialog` 不在该属性的适用角色里、`grid` 在。所以：弹出层就是网格，trigger 改为 `aria-haspopup="grid"`、`aria-controls` 指向网格本身，面板不再是 dialog。与 KunSelect（`combobox` + `haspopup="listbox"` + `aria-controls` 指向 listbox）完全同构。
  - **三个网格补上 `role="row"`。** `role="grid"` 直接套 `role="gridcell"` 是不完整的，屏幕阅读器会把 42 个格子读成一个平铺列表，丢掉"第 3 列 / 共 7 列"。每一行现在是自己的 CSS grid，行永远是满的，所以视觉上和原来逐像素一致。星期表头按 react-aria `useCalendarGrid` 的做法标 `aria-hidden`（"the day names are already included in the label of each cell"，我们的格子标签是完整的 `toDateString()`）。

  如果你的测试用 `[role="dialog"]` 找日期面板、或者用 `[role="grid"] > [role="gridcell"]` 直接取格子，需要相应改一下。

  ## KunTab

  `setTabRef` 的开发期警告用的是 `import.meta.env.DEV`，Vite 在构建本包时会把它折叠成 `false`，警告根本不会进入发布产物。改为 `process.env.NODE_ENV !== 'production'`（由**消费方**的打包器替换），与 KunModal / KunDrawer 一致。

  ## 文档：属性表之外的一半 API

  - **78 个公开 prop 的说明此前写成了 `//` 注释**，而只有 JSDoc 会进入属性表和 `llms.txt`。全部转成 JSDoc；`KunImage` 的 `@nuxt/image` 那一组原先共用一条组标题注释，现在每个 prop 各有一条。
  - **事件和插槽第一次出现在生成的文档里。** `gen:meta` 现在一并导出 `events`（74 个）和 `slots`（65 个），组件页新增「事件」「插槽」两张表，`<route>.md` 同步。此前 `@search`、`@invalid`、`#option` 这些不打开 SFC 就无从发现。25 个语义不能从名字读出来的事件补了 JSDoc。
  - 新增生成器 `pnpm gen:scales`（`gen` 链里排在 `gen:tokens` 之后），CI 的"生成物是否最新"这一关会顺带盯住 `cn()` 的比例尺名单。

- 6e4add7: KunSelect 补齐异步多选与筛选栏形态，KunDatePicker 新增 `precision`（日 / 月 / 年）

  下游（moyu）报了三条需求：KunSelect 加 pill 形态、KunAutocomplete 加 `multiple`、KunDatePicker 加粒度。翻了 Base UI、HeroUI v3、Reka、Element Plus、Ant Design、shadcn/ui、MUI 的源码之后，前两条合并成了 **一件事，而且做在 KunSelect 上**。

  ## 为什么 `multiple` 不加在 KunAutocomplete

  Base UI 明确把两者分开：`AutocompleteRootProps extends Omit<AriaCombobox.Props<ItemValue, 'none'>, 'selectionMode' | 'selectedValue' | …>` —— `selectionMode` 是被显式 Omit 掉的，`autocomplete/` 的 parts 里没有 chip，只有 `combobox/` 有 `chip / chips / chip-remove`。HeroUI v3 同样拆成 `autocomplete`（建在 SelectPrimitive 上）和 `combo-box`（建在 react-aria ComboBox 上）。

  KunAutocomplete 的 `v-model` 是**输入框文本**（`defineModel<string>`），加 `multiple` 等于把 model 类型改成 `string | T[]`，那是换一个组件，不是加一个 prop。而 KunSelect 本来就有 `multiple`、chips、`role="listbox"`、type-ahead、完整键盘导航，缺的只有异步。Element Plus 的 `el-select` 正是这个组合：`remote` + `remote-method` + `loading` + `filterable` + `multiple`。

  ## KunSelect 新增

  异步数据源（prop 名与 KunAutocomplete 完全一致，零新概念）：

  - `manualFilter` —— 关掉内置 label 过滤，`options` 由你从 `@search` 驱动。需要配合 `searchable`。
  - `@search(query: string)` —— 过滤框每次输入触发，**打开面板时也会以空串立即触发一次**，远程源可以借此拉第一页。
  - `loading` / `loadingText` —— 请求进行中在列表里显示 spinner 而不是 `noResultText`。
  - `debounce` —— 防抖 `@search`；防抖窗口内 spinner 也会亮，避免"请求还没发出就先闪一下无匹配项"。

  trigger 与弹层：

  - `maxVisibleTags` —— 多选 trigger 最多渲染几个 chip，其余收成 `+N`。`0` 表示完全不渲染 chip，trigger 直接读作 `{placeholder} · {n}`（筛选栏要的形态）。不设则保持现状全部渲染。同类先例：antd `maxTagCount`/`maxTagPlaceholder`、Element Plus `collapse-tags`/`max-collapse-tags`、MUI `limitTags`。
  - `fullWidth`（默认 `true`，行为不变）—— 关掉后控件按自身内容宽度排布，用于筛选栏。
  - `icon` —— trigger 前置图标（antd 5.22 的 `prefix`、Element Plus 的 `#prefix` 插槽）。顺带把 `lucide:filter` 加进了内置图标集（现在 30 个）。
  - `popupWidth: 'trigger' | 'auto' | number`（默认 `'trigger'`，行为不变）—— **这条是 pill 形态的硬前提**：弹层宽度此前写死等于 trigger 宽度，一个 90px 的胶囊 trigger 会得到一个 90px 的列表。`'auto'` 按内容撑开、以 trigger 宽度为下限。对应 antd `popupMatchSelectWidth`、Element Plus `fit-input-width`。
  - `classNames: { root, trigger, popup, list, option, chip }` —— 逐部位 class 钩子，合并在组件自身 class 之后。antd 5.25 正是用 `classNames` 收敛掉了 `dropdownClassName`/`popupClassName` 这类一次性 prop。**注意一个真实边界**：`cn()` 是 tailwind-merge，它只认识标准比例尺，所以内边距、颜色、边框色、排版都能正常覆盖，而 KunUI 自有的 `rounded-kun-*` / `shadow-kun-*` / `z-kun-*` 不在它的类组里 —— 两个类会同时存活、由 CSS 源顺序决胜。实测 `classNames.trigger: 'rounded-full'` 之后圆角仍是 12px。圆角请用 `rounded` prop，这一点已经写进 prop 文档。

  **没有加 `variant: 'field' | 'pill'`。** 没有任何一家把胶囊做成 select 的 variant：shadcn 的 faceted filter 是 Popover + Command + `border-dashed` Button 的组合式 recipe，Material 把 `filter-chip` 做成独立组件，antd 的 `variant` 只有 `outlined | borderless | filled | underlined`。而且 `KunUIVariant` 全库已经是 `solid | bordered | light | flat | shadow`，再来一个同名不同义的枚举只会坑掉调用点。胶囊靠 `rounded="full"` + `size="sm"` + `classNames.trigger` 拼，文档里有完整示例（`FilterBar.vue`）。

  ### 顺手修掉的几个真 bug

  **1. 远程查询换掉 `options` 时 chip 丢失标签。** 搜 "fate" 选中，再搜 "clannad"，选中的值还在 model 里，trigger 上的 chip 却因为在 `options` 里找不到而消失。现在为**当前选中的值**保留最后一次见到的 option（Element Plus 的 `cachedOptions` 同理），缓存不会长过选中项本身。单选同样受益。另外，一个连缓存都命名不了的值（比如从 URL query 恢复、而远程还没加载完）现在会用原始值渲染成 chip，而不是被丢掉 —— 丢掉会让 chip 数量和 `+N` 计数对不上，出现一个既解释不了也删不掉的徽章。antd / Element Plus 同样回退到原始值。

  **2. 输入法组合期间会边打拼音边过滤、边发请求。** 把 `v-model` 换成 `:value` + `@input` 取事件值（为了让 `@search` 携带刚敲下的文本）的同时，也放弃了 Vue `v-model` 自带的 composition 保护 —— 它的监听器开头就是 `if (e.target.composing) return`。实测（CDP `Input.imeSetComposition`，Chrome 152）：打 `nihao` → `你好`，候选窗还开着，下拉列表已经塌成「无匹配项」，并且先发出了 5 次半成品 `@search`。现在自行跟踪 composition，提交时只发一次。Element Plus 的 `handleQueryChange` 首行做的是同一件事。

  **3. spinner 亮着时键盘还能操作看不见的选项。** 加载中列表被 spinner 顶替，但 `aria-activedescendant` 仍指向一个不在 DOM 里的 id，而 Enter 会提交**上一次查询**结果里的某一项 —— 用户从未看见、也从未高亮过。现在加载期间不暴露 activedescendant，方向键、type-ahead 和 Enter 一律不响应。同时查询变化会把高亮重置到第一条可选项（KunAutocomplete 早就这么做，注释里记着同一起事故）。

  **4. 数字型 `popupWidth` 会跑出屏幕。** `'auto'` 有视口上限而固定宽度没有：`popupWidth: 700` 在 360px 视口下右侧挂出 348px，并让整页多出一条横向滚动条。现在除 `'trigger'` 外都夹紧到视口。

  **5. `fullWidth: false` 在 grid 单元格里不收缩**（inline-block 作为 grid item 会被 blockify，再被 `justify-self: stretch` 填满整条轨道），补 `w-fit` 修正。另外 label / description / error 是块级兄弟节点，会把 shrink-to-fit 的包裹层撑到文字宽度 —— 这一条是 CSS 的固有行为，已写进 `fullWidth` 的 prop 文档。

  **6. `disabled` 的 select 仍可通过已打开的弹层操作。** `removeValue` / `clearAll` 都检查了 `disabled`，`selectOption` 没有。

  ### 行为变化（很小，但请知悉）

  多选 chip 现在按 **model 顺序**渲染，而不是 `options` 顺序。`name` 生成的隐藏 input 本来就是按 model 顺序的，两者此前会不一致。

  ## KunDatePicker 新增 `precision`

  `precision?: 'day' | 'month' | 'year'`（默认 `'day'`，行为不变），**与 `mode` 正交** —— `mode="range"` + `precision="year"` 就是年份区间。刻意没学 Element Plus 把粒度和区间揉成 `daterange`/`monthrange` 一个枚举，那会让每加一个粒度就乘一遍模式。先例：antd `picker`、MUI X `views`、HeroUI v3 甚至有独立的 `calendar-year-picker`。

  - 面板按 `precision` 打开对应网格；标题是按钮，可以向外缩放 日 → 月 → 年，在比 `precision` 粗的视图里点击是**下钻**而不是提交值。
  - 月 / 年网格都是 3 列；年视图一页 12 格（十年 + 前后各一格，和日网格的相邻月格子同一个道理）。
  - 单箭头按当前视图向外一级翻页（日视图翻月、月视图翻年、年视图翻十年），`aria-label` 说的是**这一步走多远**而不是当前视图名；双箭头只在日视图存在。
  - `format` / `valueFormat` / `placeholder` 的默认值现在跟着 `precision` 走：`'yyyy-MM-dd'` / `'yyyy-MM'` / `'yyyy'`。三者都是合法 ISO 8601，`parseISO` 会读回该周期的本地零点，能原样往返。显式传入照旧优先。
  - `minDate` / `maxDate` / `isDateDisabled` 在粗粒度下按**整个周期**判定：`minDate` 为 2026-06-15 时六月**可选**（否则会连带禁掉半个月），`isDateDisabled` 收到的是该周期的第一刻（当天 / 当月 1 号 / 1 月 1 日）。
  - 键盘：左右 ±1 格，上下 ±3 格（3 列网格），Enter 提交当前格；越过页边会自动翻页。

  ### 顺带修掉的旧问题

  **1. 面板不会重新锚定。** 此前只在 setup 时锚定一次 `viewingDate`，所以外部改了 model、或者翻页后没选就关掉，再打开还停在旧的一页。现在每次打开都重新锚定到当前值 —— 在年粒度下这个问题会直接表现为"打开时停在另一个十年"。运行时改 `precision` 同理会带着页面一起走，否则网格会渲染一页、活动格却在另一页上，实测表现为 `aria-activedescendant` 指向不存在的 id 且**没有任何格子带 `tabindex="0"`**。

  **2. 粗粒度方向键会跳格或原地不动。** `setMonth` / `setFullYear` 在目标周期没有那一天时是溢出而不是钳制：活动日期停在 1 月 31 日时，右键落到 3 月 3 日（二月被跳过），左键同样落到 3 月 3 日（等于没动）。今天不是月末所以不容易撞见。现在统一走 date-fns 并先对齐到周期起点。

  **3. 键盘能提交被禁用的格子。** 格子上的原生 `disabled` 只挡得住鼠标；键盘路径从不查询它。粗粒度下更糟 —— 在禁用的月格上回车会**下钻**到一个每天都禁用的死页，而鼠标根本到不了那里。

  **4. 面板内任何一次鼠标交互都会让键盘失效。** 面板 teleport 到 `body`，keydown 到不了 trigger 的监听器：点过导航箭头或标题之后，方向键和 Escape 全都不响应，而面板还开着。下钻更彻底 —— 被点击的按钮随网格卸载，焦点掉到 `<body>`。现在面板自己监听按键（Enter / Space 仍留给持有焦点的按钮，否则会翻页的同时提交日期），下钻后把焦点停在面板上。

  **5. 清空后残留半截区间。** `clearDate` 没有重置 `tempRangeStart`：选了起点、点「清空」、再点一个日期，得到的是一段以被清掉的起点开头的区间。

  **6. 月份格的可访问名是 ISO key。** 可见文字是「Jan」而可访问名是「2026-01」，不满足 WCAG 2.5.3 Label in Name，语音控制说"点击 Jan"点不到。现已改为「Jan 2026」。

  **7. `precision="year"` 下小于 100 的年份错位。** `new Date(y, 0, 1)` 会把 0–99 映射到 1900+y，而 `parseISO` 接受 `'0005'` —— 网格会渲染成 1900 年代且选不中任何格子。

  **8. `format=""` 抛错、`months` 数组短于 12 项留下空白格。** 前者现在与 `valueFormat` 一致回退到粒度默认值；后者用当前 locale 补齐。

  **9. 单选模式收到数组 model 会从渲染函数里抛出。** prop 类型两种模式都允许数组，而 `[null, null]` 正是 `clearDate` 在区间模式下发出的值 —— 运行时把 `mode` 从 `range` 切回 `single` 就会踩到，组件会僵在最后一帧正常 DOM 上。

  ## 文档

  - KunSelect 新增「异步 / 远程数据源」「筛选栏形态」两个示例，KunDatePicker 新增「选择粒度」示例。
  - 生成器修正：`withDefaults(x: undefined)` 表示"没有默认值"，不该盖过 JSDoc 的 `@default` 标签。修掉之后 68 个原本在属性表里显示成 `undefined` 的 prop 变回 `—`，另有若干条件默认值第一次正确显示出来。（`button` / `link` 的 `rel` 仍显示 `undefined`，因为它的 JSDoc 里本来就写了 `@default undefined` —— 那里"未设置"和 `rel=""` 确实不是一回事。）

### Patch Changes

- Updated dependencies [5890c9c]
  - @kungal/ui-core@2.27.0

## 2.26.3

### Patch Changes

- a36bbe9: 修复 `defineModel` 回读导致的三处状态滞后：KunAutocomplete、KunTagInput、KunCheckBoxGroup

  下游报了 KunAutocomplete 的 `@search` 事件带的是按键之前的值。查下来是同一个根因，而且还漏网了两处更严重的。

  **根因。** `defineModel()` 返回的不是普通 ref。父组件绑了 `v-model` 时，赋值只会 `emit('update:modelValue')`，本地值要等父组件重渲染、props 回流之后才更新 —— 同一个 tick 内再读它，拿到的还是旧值。Vue 官方判定这是预期行为（vuejs/core#11832：“The new value will only be available after the parent has updated (on the next tick)”）。更容易踩坑的是它不对称：父组件只传 `:model-value` 而不绑 `v-model` 时，赋值走本地分支，读回来就是新值。消费者侧几乎总是绑 `v-model`，所以这三处 bug 全落在「正常用法」那一侧。

  **实测（Chrome 152 / CDP，父组件绑 v-model）。**

  | 组件             | 操作                                  | 修复前                                            | 修复后                             |
  | ---------------- | ------------------------------------- | ------------------------------------------------- | ---------------------------------- |
  | KunAutocomplete  | 逐字输入 `key`                        | `@search` 依次为 `""`、`"k"`、`"ke"`              | `"k"`、`"ke"`、`"key"`             |
  | KunAutocomplete  | 首项 disabled 的列表里输入 `a`        | 高亮落在第 2 行 `apricot`，回车提交 `apricot`     | 高亮 `apple`，回车提交 `apple`     |
  | KunTagInput      | 粘贴 `a,b,c`（`splitOnPaste` 默认开） | 只剩一个标签 `c`，但 `@add` 触发了 3 次           | 三个标签都在，`@add` 与 model 一致 |
  | KunCheckBoxGroup | 依次点 A、B、A                        | `@change` 依次为 `[]`、`[a]`、`[a,b]`，永远慢一步 | `[a]`、`[a,b]`、`[b]`              |

  KunTagInput 那条最严重：`splitAndAdd` 每次循环都基于粘贴前的数组重建，所以只有最后一个分片留下来；`maxTags` 和查重也都是拿粘贴前的数组去比的。

  **改法。** 事件载荷和内部判断一律用刚算出来的值，不再回读 model：`onInput` 用 `e.target.value`，过滤函数改成接受 query 参数，`toggleOption` / `tryAdd` 传显式的数组并把新数组一路串下去。这也是各家的通行写法 —— Reka UI 的 `ComboboxInput` 把 `event.target.value` 交给内部的 `filterSearch` ref、Element Plus autocomplete 的 `handleInput(value)` 两个 emit 都用同一个入参、Vant Search 的 `onInput = (value) => emit('update:modelValue', value)`、Zag combobox 发的是 `event.currentTarget.value`，没有一家会去读 model 的当前值。

  无 API 变更。下游如果为了绕开 `@search` 滞后而改读自己的 v-model ref，可以继续那么写，也可以换回事件载荷 —— 两者现在一致。

  - @kungal/ui-core@2.26.3

## 2.26.2

### Patch Changes

- 78f0206: 修复输入法(IME)组合期间回车/方向键被组件抢走,并给 KunCommandPalette 补上「回车提交查询」的出口。

  **输入法组合期误触发(KunCommandPalette / KunAutocomplete / KunSelect[searchable])**

  用 Chrome 152.0.7977.8 经 CDP `Input.imeSetComposition` 实测:拼音还没上屏时,用来选中候选词的那个回车会以普通 `keydown` 送到页面 —— `key: 'Enter'`、`keyCode: 13`、`isComposing: true`。三个组件的键盘处理都没有过滤它,于是:

  - 命令面板:打「sousuo」按回车上屏,面板直接选中高亮项并关闭,输入框里还留着未上屏的 `sousuo`;
  - KunAutocomplete:组合中的 `app` 被回车确认成了选项 `apple`;
  - 可搜索的 KunSelect:组合「xuan」按回车,值被填成了「选项甲」。

  方向键同理 —— 翻候选词的 ↑↓ 会同时移动列表高亮。

  现在这三个组件的 keydown 在 `e.isComposing || e.keyCode === 229` 时直接放行(229 是不支持 `isComposing` 的老引擎上的等价信号)。cmdk、Zag 的 combobox、Reka 的 ListboxRoot 都有同一道守卫,本仓库的 KunTagInput 早就有(`respectComposition`),这次只是补齐其余三个。**中文/日文/韩文输入下这是每天都会撞到的行为,建议下游一并升级。**

  **KunCommandPalette 新增 `@submit`**

  面板本身不含搜索逻辑,此前回车只有一条路径:选中高亮项。没有可选中的结果时(无结果,或结果全部 `disabled`),回车照样被 `preventDefault` 吃掉却什么也不做 —— 是一个死键。

  现在:回车落在真实结果上时行为不变,照常 `@select`;**没有可选中的结果**时改为触发 `@submit`,带上 `query.trim()`,并且不再吞掉这个按键。

  ```vue
  <KunCommandPalette
    v-model:open="open"
    v-model:query="query"
    :items="items"
    @select="go"
    @submit="(q) => navigateTo(`/search?q=${encodeURIComponent(q)}`)"
  >
    <template #no-result="{ query }">
      <p class="text-default-400 text-xs">按 ↵ 全站搜索「{{ query }}」</p>
    </template>
  </KunCommandPalette>
  ```

  有结果时也要提交原始查询的场景,**继续把动作项排在第 0 位**当成一条普通结果 —— cmdk(`forceMount`)、GitHub、Linear 都是这么做的,好处是这个动作看得见、能用鼠标点,而不是一个只有键盘用户才发现得了的隐藏行为。所以我们没有引入 Zag 那种 `alwaysSubmitOnEnter`:让回车永不选中会破坏命令面板的核心键盘约定。

  纯新增,没有破坏性变更。

  - @kungal/ui-core@2.26.2

## 2.26.1

### Patch Changes

- ef32101: 修复 KunSlider 拖动时会选中页面文字，以及 KunDatePicker / KunSelect / KunRating / KunCommandPalette 中纯图标按钮的图标未垂直居中。

  **KunSlider — 拖动会选中别处的文字**

  滑块的 `mousedown` / `touchstart` 是 passive 监听，永远调不到 `preventDefault()`，
  浏览器于是照常从按下点开始拉一段原生选区：鼠标不在圆点上（在圆点上也一样）随便甩两下，
  页面上其它段落、标签、数值就被整片选中了。

  修法是 CSS，不是 JS：滑轨容器上加 `user-select: none` 与 `touch-action: none`。
  这与 shadcn/ui 在 Slider 根节点上写 `touch-none select-none`、Radix / Reka 在
  `pointerdown` 里 `preventDefault()` 是同一条思路；react-aria 的 `disableTextSelection`
  更直接写明「只给按下的元素加 user-select 挡不住相邻元素被选中」，正是这次反馈的现象。

  两条声明按本仓库的规矩写成 inline `style` 而非工具类——`dist/style.css` 不含任何工具类，
  工具类要靠消费端 Tailwind 扫描 `dist/index.js` 再生成，可能被漏掉；行内样式不会。

  `touch-action: none` 同时修掉了一个附带问题：以前在移动端按住滑块上下滑，
  页面会跟着一起滚动。标签与数值文本在滑轨容器之外，仍可正常选中复制。

  **KunDatePicker / KunSelect — 清除按钮比尾部图标高约 2px**

  清除按钮是块级的，里面只有一个 `<svg>`。`<svg>` 是 inline-block，坐在行盒的文字基线上，
  行盒的 strut 在基线下方还留着降部空间，图标因此被顶到按钮盒子中心线的上方；
  外层 `items-center` 居中的是按钮，不是图标，于是它比旁边的日历图标 / 箭头高出一截。

  按钮改为 `flex items-center`（与 KunInput、KunAutocomplete 一致），图标即被真正居中。

  KunDatePicker 另外两处一并对齐：清除图标原本固定 16px，而日历图标是 1em、随控件尺寸缩放，
  xs 下 16px 对 12px 明显一大一小——现在两者都用 1em；按钮的 `p-1` 还把整个触发器撑高了 8px，
  同尺寸下比 KunSelect / KunInput 高一截，现在以负外边距抵消内边距，既保住点按热区又不再撑高。

  实测（Chrome 151）：md 尺寸触发器高度 45.6px → 37.6px，与 KunSelect 的 37.6px 一致；
  xs–xl 五档清除图标与日历图标的中心线偏差由 -1.64 ~ +0.25px 全部归零，热区 24×24 起。

  **同一根因的其余四处**

  顺着这条线把 71 个 SFC 里 18 个「只装一个图标的 button」全部量了一遍，
  除上面两处外还有三处中招（KunTab 的两个滚动按钮本来就是 `inline-flex`，误报）：

  - **KunRating** —— 偏差 **-2.20px**，是全库最大的一处：星星按钮是块级的，
    整排星星因此比旁边的评分文字（「4.5 · 120 条评价」这类写法）高出 2px。修后归零，
    星排高度 24.4px → 20px，与图标本身一致。
  - **KunCommandPalette** 关闭按钮 -0.40px、**KunSelect** 多选标签上的移除按钮 -0.49px ——
    都在亚像素级，肉眼看不出来，但根因相同：谁哪天把图标调大一档，偏差就跟着放大。
    一并改成 `flex items-center` 收口。

  拖动选中文字这条线也一并排查了：KunScrollShadow（`draggable`）会在 6px 判定阈值之前
  起一个 1 字符的选区，拖动中被 `user-select: none` 收起、松手后又恢复，属于痕迹级；
  KunMessageItem（吐司滑动关闭）、KunLightbox、useKunSwipeDismiss（抽屉/弹窗下拉关闭）、
  KunCarousel 实测均无此问题——它们各自用 `setPointerCapture`、`touch-none` +
  `draggable="false"`、非 passive `touchmove` + `preventDefault()`、原生 scroll-snap 挡住了。

  - @kungal/ui-core@2.26.1

## 2.26.0

### Minor Changes

- f07c615: 浮层不再被 KunModal / KunDrawer 的焦点陷阱抢走焦点,所有内部 `focus()` 一律带 `preventScroll`

  下游(kun-editor)报了两个 bug,都属实,而且第二个比报告里写的还要广。根因是同一个:**KunUI 的浮层面板 `Teleport` 到 `<body>`,而 KunModal / KunDrawer 的焦点陷阱和 Escape 处理都是以自己那棵 DOM 子树为界建立的** —— 面板在界外,于是陷阱把它当成「焦点跑了」。

  ### 其一:弹出浮层会把页面弹到顶部

  `KunInput` 的 `autofocus` 在 `onMounted` 里裸调 `input.focus()`。浮层刚挂载那一拍,Floating UI 还没算出位置,面板停在文档原点,浏览器于是「滚动到该元素」—— 把整页拉回顶部。

  实测(Chrome 151,apps/playground,页面滚到 3232px 处点开 Popover):

  |                       | 修复前       | 修复后          |
  | --------------------- | ------------ | --------------- |
  | `scrollY`             | 3232 → **0** | 3232 → **3232** |
  | 面板内 input 拿到焦点 | 是           | 是              |

  现在库里**每一处 KunUI 主动发起的 `focus()`** 都带 `{ preventScroll: true }` —— 不只是 KunInput 的 `autofocus`,还有 KunTextarea 的 `autofocus`、KunInput/KunTextarea 的 `clear()` 与 `insertAtCaret()`、KunPinInput 的逐格跳转、KunNumberInput 的 ±1、KunTagInput 的 chip 左右键、KunRadioGroup 与 KunTab 的 roving focus。Radix 的 `FocusScope` 与 Reka UI 的 `focusFirst` 都是无条件 `focus({ preventScroll: true })`,理由一致:组件替用户移动焦点时,滚动从来不是用户要的。

  `defineExpose` 出去的 `focus()` 保持原生语义(1.14.1 已经定过这个调子:「the public `Autocomplete.focus()` method keeps the default so the caller controls scroll intent」),但现在能透传参数了:`inputRef.value.focus({ preventScroll: true })`。KunInput / KunTextarea / KunNumberInput / KunAutocomplete 都是。

  ### 其二:弹窗里的浮层根本无法聚焦

  focus-trap 的 `checkFocusIn` 发现焦点落到容器外,立刻 `tryFocus` 拽回去。报告里说的是「手机 KunDrawer + 桌面 KunModal 里的链接输入框」,实测范围要大得多 —— 凡是**把真实 DOM 焦点移进 teleport 面板**的组件都中招。

  实测(Chrome 151,真实 Playwright 击键,不是合成事件):

  | 场景                                       | 修复前                                    | 修复后                           |
  | ------------------------------------------ | ----------------------------------------- | -------------------------------- |
  | Modal 里 Popover 的 input,敲 `example.com` | `value === ""`,`activeElement` 是触发按钮 | `value === "example.com"` ✅     |
  | Drawer(768px)里同一个 input                | `value === ""`                            | `value === "example.com"` ✅     |
  | Modal 里可搜索 KunSelect 的搜索框,敲 `Bra` | 焦点被拽回按钮,一个字打不进去             | 过滤出 `Bravo`,焦点留在搜索框 ✅ |
  | Modal 里 KunDropdown 按 ↓                  | 焦点被拽回 `menu` 按钮,方向键导航整个失效 | 焦点落在 `menuitem“Alpha”` ✅    |
  | Modal 里 KunContextMenu 的菜单项           | 拿不到焦点                                | `menuitem“Alpha”` 拿到焦点 ✅    |

  **没中招的**是 KunAutocomplete、非搜索态的 KunSelect、KunDatePicker 的键盘导航 —— 它们走 `aria-activedescendant`,真实焦点始终留在弹窗内的触发器上(实测:Autocomplete 的 `[role="option"]` 连 tabindex 都没有,`activeElement` 一直是那个 input),陷阱自然没话说。这些组件同样登记了浮层,拿到的是下面「其三」的 Escape 修复,以及鼠标点中面板内某个可聚焦元素(比如 KunDatePicker 的日期格)时焦点不再被拽走 —— 实测点中后焦点稳在日期按钮上。

  修法:新增 `useKunFloatingLayer`,每个浮层在打开期间把自己的面板登记进去,Modal / Drawer 把**属于自己的**面板加进焦点陷阱的容器列表(focus-trap 的 `updateContainerElements`)。归属由**触发器**判定 —— 面板被 teleport 走了不在任何人里面,但触发器还在正常树上,`trapEl.contains(trigger)` 正好回答「这个浮层是不是从这个弹窗里打开的」。

  这条路是有前例的:Radix 的 `FocusScope` 为此加了 `branches`(radix-ui/primitives#3423,原文 "portalled content of a nested, non-modal layer"),Reka UI 则是 #2749 —— "a Combobox input inside a Dialog could not be focused",一模一样的症状。

  焦点陷阱**仍然是陷阱**:实测在 Modal 里连按 4 次 Tab 会绕回起点,从浮层面板里按 Tab 也回到弹窗内,焦点没有跑到背景页面上。

  ### 其三:一次 Escape 关掉两层(顺手带出来的)

  验证时发现的:浮层开着时按一次 Escape,浮层和它底下的弹窗**一起**关了 —— 两个 keydown 处理器都是活的,彼此不知道对方存在。现在 Modal / Drawer 在自己拥有的浮层还在屏幕上时让出 Escape,形状与既有的 `!isWatchingCloseRequests` 完全一致。第一次 Escape 关浮层,第二次关弹窗。

  ### 其四:一个字节让 KunPinInput 对 grep 隐身

  `PinInput.vue` 里有一个**字面 NUL 字节**(用作 `join()` 的分隔符),ripgrep / grep 因此把整个文件判成 binary 直接跳过 —— 这次全库 `.focus()` 排查就是这么漏掉 `focusCell` 的。改写成 `'\u0000'` 转义,行为不变,文件重新可被搜索。

  ### 升级注意

  - **下游 kun-editor 不需要改任何东西。** `:autofocus="true"` 现在既不弹页面也不被抢焦点了,留着或删掉都可以(KunPopover 本来就会聚焦面板里第一个可聚焦元素)。
  - 弹窗里的浮层面板现在也在 Tab 序里 —— 这正是 Tab 该去的地方。菜单类面板用的是 roving tabindex,只贡献一个停靠点。
  - focus-trap 有一条限制会随之生效:**多容器陷阱不支持正 tabindex**,会直接抛错。弹窗内部写 `tabindex="1"` 这类值本来就是反模式,现在会从「不对」变成「致命」。
  - 快速连按两次 Escape 时,第二次若落在浮层 180ms 关闭动画之内会被吞掉(面板还在屏幕上)。再按一次即可。
  - 新导出 `useKunFloatingLayer` / `useKunFloatingLayerStack`,给自己把面板 teleport 出弹窗的应用用。

### Patch Changes

- @kungal/ui-core@2.26.0

## 2.25.1

### Patch Changes

- b7040e0: KunInfo:补齐 props 文档,写清楚「描述区就是默认插槽」

  下游报 KunInfo 没有 `description` 插槽。查过了,这是**预期行为**:KunInfo 只有两个插入点 —— 标题(`title` 具名插槽)和正文(默认插槽),与 `KunAccordionItem`、`KunTimelineItem` 同构。库里唯一带 `description` 具名插槽的是 `KunHeader`,因为它根本没有默认插槽,四个插入点必须全部具名。

  坑在于 **Vue 对匹配不上的具名插槽是静默丢弃的**,没有任何 dev warning。所以 `<template #description>` 写下去什么都不渲染,看起来就像功能缺失,而不是写错了名字。正确写法:

  ```vue
  <KunInfo color="success" icon="lucide:circle-check" title="上传完成">
    文件已成功上传,你可以在 <a class="underline" href="#">资源列表</a> 中查看。
  </KunInfo>
  ```

  `description` 属性和默认插槽可以同时用,描述段落在上、插槽内容在下。

  运行时没有任何改动。这一版补的是我们这边的文档欠债:

  - `KunInfoProps` 之前一条 JSDoc 都没有,文档站 PropsTable 里只有名字和类型。现在每个 prop 都有说明,`description` 那条直接点明富文本走默认插槽 —— 编辑器悬浮提示也能看到。
  - `llms.txt` 里的 KunInfo 一行没提默认插槽,而 `KunTimelineItem`、`KunAccordionItem` 都提了。照着 AI 生成代码的下游没有任何途径知道它的存在,猜 `#description` 几乎是必然。现在补上了。
  - @kungal/ui-core@2.25.1

## 2.25.0

### Minor Changes

- d8f9145: KunDatePicker:修掉两处 SSR hydration mismatch,并让它重新能用键盘操作

  下游(鲲论坛)报了 KunDatePicker 在 SSR 下的 hydration mismatch,只能用 `<ClientOnly>` + skeleton 在应用层绕过。复现了,是真的,而且是**两个互相独立**的原因;同时报告里提到的 KunTagInput 已在 2026-06-06 修好(`cn()` 里传了未解包的 ref),这次实测 56 个组件文档页,只有 datepicker 一页有 mismatch。

  **其一:触发器里嵌了一个 `<button>`。** 清除按钮是真 `<button>`,而它当时被放在外层触发器 `<button>` 里面。HTML 规范中 `<button>` 的内容模型是 "Phrasing content, but there must be no interactive content descendant and no descendant with the `tabindex` attribute specified",解析器也确实照做:遇到嵌套的 `<button>` 起始标签会先补一个隐式 `</button>`。所以浏览器把清除按钮和日历图标**从触发器里拎了出去**,解析出的 DOM 与服务端字符串对不上,Vue 报 "Hydration children mismatch"。只在**有值**的时候出现(没值就没有清除按钮),这也是为什么它一直只在部分页面翻车。

  触发器改成 `<div role="combobox">` —— 与 KunSelect 的触发器同形,也是 React Aria / HeroUI / Reka UI / Element Plus / ARIA APG 的一致做法(触发器是容器,按钮是兄弟节点,从不嵌套)。视觉不变,class 串一字未动。

  **其二:`new Date('2026-06-14')` 按 UTC 解析,再按本地时区格式化。** 于是 UTC 以西的浏览器整整少一天,而服务端与访客不同区时还会额外触发一次 "Hydration text content mismatch"。实测(服务端 America/Los_Angeles):浏览器设 Asia/Shanghai 时,`- rendered on server: 2026-06-13 / - expected on client: 2026-06-14`。改用 `parseISO`(日历网格本来就在用),日期只解析为**本地**零点。

  **其三,顺手带出来的:键盘完全不可用。** 根节点上的 `@keydown.prevent.capture` 对**每一个**按键都调 `preventDefault()`,包括 Tab —— 焦点进去就出不来(实测连按 4 次 Tab 原地不动);而 Enter 的默认行为正是激活触发器,也被一并掐掉,于是日历根本无法用键盘打开(Enter / Space 实测均无效)。现在只对真正处理的键 `preventDefault`:Enter / Space / ↑ / ↓ 打开日历,方向键移动待选日期(`aria-activedescendant` 同步),Enter 选中,Escape 关闭,Tab 正常离开。

  **其四:`disabled` 的选择器可以被清空。** 禁用状态下仍然渲染清除按钮,`clearDate()` 也不检查 `disabled`,点一下值就没了(实测)。现在禁用时不渲染该按钮,`clearDate()` 也会提前返回。

  **升级注意**

  - 触发器元素从 `<button type="button">` 变成 `<div role="combobox" tabindex="0">`。按 `button` 选择这个触发器的 CSS 或端到端测试需要改成 `[role="combobox"]`。日历面板新增 `id`,由触发器的 `aria-controls` 指向。
  - 如果你在应用层用 `<ClientOnly>` 包住了 KunDatePicker,升到这一版之后可以拆掉了。

### Patch Changes

- @kungal/ui-core@2.25.0

## 2.24.0

### Minor Changes

- 177b028: KunLink / KunButton:`rel` 改为「替换默认值」而非「叠加」,`noreferrer` 终于可以去掉

  自 0.17.0 起,`target="_blank"` 的链接被无条件塞上 `rel="noopener noreferrer"`,而 `rel` prop 只能往上加、删不掉。下游踩到了后果:`noreferrer` 会连 `Referer` 请求头一起掐掉,于是合作方的统计里,从论坛点过去的流量全部记成「直接访问」——而「带来跳转」恰好是这次合作的条件。

  防 tabnabbing 的是 `noopener`;`noreferrer` 是隐私默认值,不该锁死。现在 `rel` 的语义与 NuxtLink 对齐(KunLink 在 Nuxt 层渲染的正是 NuxtLink,两者此前对同一个 prop 各执一词):

  | 写法                             | 输出                                           |
  | -------------------------------- | ---------------------------------------------- |
  | `target="_blank"`,不传 `rel`     | `noopener noreferrer`(不变)                    |
  | `target="_blank" rel="noopener"` | `noopener` ← 保留来源                          |
  | `target="_blank" rel="nofollow"` | `nofollow noopener`                            |
  | `target="_blank" rel="opener"`   | `opener`(规范里的反向 opt-in)                  |
  | `rel=""`                         | 不渲染 `rel` 属性(等价于 NuxtLink 的 `no-rel`) |

  `noopener` 仍会补回任何 `_blank` 链接,除非值里显式写了 `opener` —— 安全的那一半是底线,隐私的那一半可替换。

  `KunButton` 此前根本没有 `rel` prop(只能靠未文档化、无类型的 fallthrough attr 覆盖),这次补上,与 KunLink 同语义。

  **升级注意**

  - 只有「同时传了 `rel` 和 `target="_blank"`」的调用点行为会变:此前是你的 token **并上** `noopener noreferrer`,现在是你的 token 并上 `noopener`。不传 `rel` 的调用点一切照旧。
  - Nuxt 层下还有更隐蔽的一处:NuxtLink 自己会给**任何绝对 URL**补 `noopener noreferrer`,不需要 `target="_blank"`。所以同标签页打开的外链要留住来源,同样得写 `rel="noopener"`。实测(Nuxt dev SSR 输出):`<KunLink href="https://…">` 不传 rel → `noopener noreferrer`;传 `rel="noopener"` → `noopener`;传 `rel=""` → 无 `rel` 属性。

### Patch Changes

- @kungal/ui-core@2.24.0

## 2.23.0

### Minor Changes

- 7786891: KunLightbox's thumbnail strip now runs on phones as well, and it follows the
  image you are looking at.

  Below `md` the viewer used to show a row of dots and keep the thumbnails for
  desktop only. Dots do not survive a real gallery — twenty of them are twenty 8px
  targets that say nothing about where they lead — so the same strip is shown at
  every width, sized down on phones (48px thumbnails against 56px, `max-width:
92vw`). It pans with a finger for free: it is a plain `overflow-x` scroller, and
  that is what the browser already does with one.

  - **The active thumbnail is kept centred** — on open, and on every change after
    that (swipe, ←/→, a click on another thumbnail). A gallery longer than the
    strip used to stay parked at the first thumbnail, so past the fifth image
    there was nothing on screen telling you where you were. Centring, rather than
    the smallest scroll that brings it into view (what KunTab does), is what a
    filmstrip wants: the neighbours on both sides stay visible. It is lightGallery's
    default too (`currentPagerPosition: 'middle'`). Smooth, or instant under
    `prefers-reduced-motion`.
  - **The mouse wheel scrolls the strip** on desktop. The dominant axis wins, so a
    trackpad's horizontal swipe drives it as well as a vertical wheel does, and at
    either end the wheel is released rather than swallowed, so nothing is trapped.
  - Thumbnails are `loading="lazy"`. `KunLightboxImage` carries no separate
    thumbnail URL, so every thumbnail is the full-size original — measured in
    Chrome 151, a 100-image strip now fetches 26 of them when the viewer opens
    instead of 100.
  - `overscroll-behavior-x: contain` on the strip. Horizontal overscroll is the
    back gesture on Chrome for Android and on Safari; dragging past the last
    thumbnail must not navigate away from the page the viewer was opened from.

  Also: wheel deltas are now converted to pixels before they are used, in the
  lightbox strip and in `KunScrollShadow`'s `wheel` mode. A wheel event may report
  its delta in lines (`deltaMode: 1`, which is what Firefox sends for a mouse
  wheel — 3 per notch) or pages, and both were being applied as if they were
  pixels: one notch moved a `KunScrollShadow` row 3px in Firefox. A line counts as
  40px, which puts a Firefox notch within a few pixels of the ~125px Chromium
  reports for the same notch.

  No API change; the dot row is the only thing removed.

### Patch Changes

- @kungal/ui-core@2.23.0

## 2.22.0

### Minor Changes

- c0e371d: A phone sheet can now be dragged downwards to dismiss it — KunModal in its
  `placement="auto"` sheet form below `md`, and any KunDrawer sitting on the
  bottom edge, including a `responsive` one that becomes a bottom sheet there.

  The rule that matters is how the gesture shares a finger with the sheet's own
  scrolling: **the content wins until it is scrolled back to the top**. A swipe
  over content that is scrolled down still scrolls it, so long content can't be
  dismissed by accident. This is what vaul (shadcn-vue's and Nuxt UI's Drawer) and
  Base UI's `useSwipeDismiss` both do; the thresholds are theirs too — 25% of the
  panel height, or a 0.4 px/ms flick, else it springs back.

  - Touch only (`pointer: coarse`), so a mouse never starts a drag and text
    selection is untouched.
  - A drag handle is drawn at the top of the sheet to advertise the gesture. It is
    CSS-gated to exactly where the gesture exists, decorative, and costs the
    content no layout.
  - Follows `isDismissable`, so `role="alertdialog"` and a non-dismissable dialog
    cannot be swiped away. New `isSwipeDismissable` prop (default `true`) turns it
    off on its own.
  - Drags starting on an `input`, `textarea`, `select`, `[contenteditable]` or
    `[role="slider"]` are left to that control; `data-kun-no-drag` opts anything
    else out.
  - A drawer's backdrop dims in step with the drag.
  - `prefers-reduced-motion` keeps the gesture but drops the spring-back
    animation.

  Also: the body scroll lock now sets `overscroll-behavior: none` while an overlay
  is open. Chrome for Android's pull-to-refresh survives `overflow: hidden`, and
  it fires on exactly the downward drag this gesture uses.

  `useKunSwipeDismiss` is exported for apps that want the gesture on their own
  sheets.

### Patch Changes

- @kungal/ui-core@2.22.0

## 2.21.0

### Minor Changes

- 8f0373b: On Android, the back button and back gesture now close KunModal and KunDrawer
  instead of navigating away from the page — the behaviour a native `<dialog>`
  already has, and what a phone user expects from anything that looks like a
  sheet.

  This uses the platform's `CloseWatcher` API, so it needs no history entry and
  touches nothing the host app's router owns. The widespread `history.pushState`
  workaround is deliberately not used: the WICG explainer for this API lists why,
  ending on the one that decides it for a shared component — "a shared component
  that attempts to use the history API to implement these techniques can easily
  corrupt a web application's router."

  Scope, deliberately narrow:

  - Android only. The only close request a desktop browser sends is Escape, which
    both components already handle, so desktop behaviour is byte-for-byte
    unchanged. iOS has no back button and Safari has not shipped `CloseWatcher`,
    so it is unaffected too.
  - Only the topmost overlay answers, so stacked dialogs close one layer per
    press, matching Escape.
  - Nothing happens when `isDismissable` is `false`. A non-dismissable dialog lets
    the back press navigate as before rather than trapping the user on the page.

  New prop on both components, `isCloseRequestDismissable` (default `true`), turns
  it off for a dialog that is bound to a route and wants back to navigate.

  `useKunCloseRequest` is exported for apps that want the same behaviour on their
  own overlays.

### Patch Changes

- @kungal/ui-core@2.21.0

## 2.20.0

### Minor Changes

- ab9e4ea: fix(vue): KunModal/KunDrawer get real ARIA names, a tab-order-clean backdrop, and a scroll lock that holds on iOS

  A pass over the dialog primitives against what Radix, Reka (Nuxt UI), react-aria
  (HeroUI v3), Base UI and Zag (Chakra v3) actually ship. The architecture already
  matched them — portal + `div[role=dialog]` + focus trap + `inert` + refcounted
  scroll lock, deliberately NOT a native `<dialog>`, whose top layer would leave
  every KunUI popover teleported to `<body>` painted above the modal but inert.
  These are the details that didn't.

  **KunModal gains `title` and `description`.** `title` renders the panel's `<h2>`
  and is wired to `aria-labelledby`; `description` renders under it and is wired to
  `aria-describedby` (which `role="alertdialog"` is required to have). Both are
  opt-in — a dialog that draws its own heading in the slot renders exactly as
  before. The old hardcoded `aria-label="对话框"` fallback is gone: it announced a
  meaningless Chinese string to every screen-reader user regardless of the app's
  language and never announced the real title. With neither `title` nor
  `ariaLabel`, KunUI now warns in dev. `KunDrawer` gains `ariaLabel` and the same
  warning.

  **`role="alertdialog"` is no longer dismissed by a backdrop click.** A click that
  lands on the dim area is not an answer to "delete this account?". Escape still
  cancels — Radix and Reka both prevent outside-dismissal on their AlertDialog and
  leave Escape alone. `:is-dismissable="true"` opts the backdrop back in; `false`
  still turns both off.

  **The backdrop is out of the tab order.** It carried `tabindex="0"` — the only
  way focus-trap would activate on a dialog whose body has no tabbable node — which
  made the dim area itself a tab stop that assistive tech announces. The panel now
  carries `tabindex="-1"` and serves as focus-trap's `fallbackFocus` instead.

  **The body scroll lock now holds on iOS**, where `overflow: hidden` never stopped
  touch scrolling: the body is taken out of flow and the scroll position is stashed
  and restored, the same trick body-scroll-lock and react-aria's `usePreventScroll`
  use. Unlock also restores the page's own inline styles rather than blanking them.

  **Scrollbar compensation actually compensates.** The gap was measured after
  `overflow: hidden` had already removed the scrollbar, so it always came out 0 and
  the page jumped ~15px sideways on every open. It is measured first now, and added
  to the page's existing padding instead of replacing it.

  **`overscroll-behavior: contain`** on the modal panel, the `outside`-scrolling
  overlay and the drawer body, so a scroller inside the dialog can't chain its
  leftover scroll to the page behind it.

  **Every teleported overlay is tagged `data-kun-overlay`** — Tooltip, Popover,
  Dropdown, Select, Autocomplete, DatePicker, ContextMenu and CommandPalette were
  missing the tag that `useKunBackgroundInert` documents and uses to keep KunUI's
  own layers out of the `inert` sweep.

### Patch Changes

- @kungal/ui-core@2.20.0

## 2.19.1

### Patch Changes

- 7752893: fix(vue): a KunModal sheet caps at 85dvh instead of 90dvh on phones

  `placement="auto"` below `md` — the bottom sheet — now caps at `min(85dvh, 100%)`.
  Every other placement, and the sheet from `md` up, keeps `min(90dvh, 100%)`.

  The leftover height is spent differently in the two shapes. A centred dialog
  splits it into two strips (~37px each on a 750px viewport, which reads as
  ordinary padding). A bottom sheet puts all of it into one strip at the top, and
  that strip is doing two jobs: signalling that this is a layer over the page, and
  being the only tap-to-dismiss target. At 90dvh it was 71px on a 750px viewport
  and 48px on an iPhone SE — past the 44px minimum with nothing to spare. 85dvh
  makes it 108px / 74px.

  For reference, HeroUI caps at `calc(100% - 8rem)` at every width, which is really
  its desktop `sm:my-16` margins in disguise — on a phone (`my-1`) it just leaves
  124px unused, landing at 83% of a 750px viewport and 75% of an SE. shadcn's vaul
  drawer is `max-h-[80vh]` with a 96px floor. 85 sits between them.

  - @kungal/ui-core@2.19.1

## 2.19.0

### Minor Changes

- 177abc6: feat(vue): KunModal opens as a bottom sheet on phones

  **Behaviour change.** `placement` gains an `auto` value and it is now the
  default: below `md` the panel is anchored to the bottom edge and spans the
  width, at `md` and up it is the centred dialog it has always been. This is
  HeroUI's default too, and it matches how a phone expects a dialog to arrive —
  within thumb reach, rising from the edge, instead of parked in the middle of the
  screen. Pass `placement="center"` to keep the old behaviour at every width.

  Measured against HeroUI v2's own modal at 390x844, the two now agree: panel
  inset 4px from the left and bottom edges, `align-items: flex-end`, corners left
  rounded, and an 80px rise on enter with no scale (desktop keeps KunUI's existing
  `translateY(8px) scale(0.96)`).

  It is built out of breakpoint classes — `items-end md:items-center` — not a
  `useMediaQuery` ref, deliberately. VueUse's media queries evaluate to `false` on
  the server unless the app calls `provideSSRWidth`, so a JS-driven version would
  ship a dialog that is open in the SSR markup as centred and snap it to the
  bottom on hydration. The static classes render the sheet in the first paint,
  before any JS runs. Verified under Nuxt SSR with the modal open: no hydration
  warnings.

  Two mobile sizing bugs are fixed along the way, and they apply to **every**
  placement, not just `auto`:

  - The panel was capped at `90vh`. On phones `vh` resolves against the _large_
    viewport — the one you get with the address bar retracted — so a tall panel
    already ran off-screen behind the browser chrome. It is now
    `min(90dvh, 100%)`.
  - Nothing tracked the on-screen keyboard. `dvh` deliberately ignores it, so a
    dialog with an input in it sat behind the keyboard the moment that input took
    focus. The overlay now measures `visualViewport` (a new
    `useVisualViewportHeight` composable, listening only while open) and shrinks to
    what is genuinely visible. Simulated at 390x844 with a 424px keyboard: the
    panel's bottom edge moves from 840px to 416px, and a panel too tall to fit
    clamps to the visible area and scrolls inside itself.

  `auto` also pads the overlay with `env(safe-area-inset-bottom)` so the sheet
  clears the home indicator on notched phones, and drops the panel's `min-w-80`
  floor below `md`, which on its own overflowed a 320px-wide screen.

  `KunModalPlacement` is exported alongside `KunModalSize`.

### Patch Changes

- @kungal/ui-core@2.19.0

## 2.18.2

### Patch Changes

- 7af1744: fix(vue): KunContent spoilers no longer shift the text they cover

  `.kun-spoiler` was given `display: inline-block; overflow: hidden;
vertical-align: middle` unconditionally, and none of it was released on reveal —
  so a revealed spoiler stayed misaligned with the prose around it forever.

  The root cause was `overflow: hidden`. It only existed to clip a `border-radius`
  that was dropped when the particle cover landed, and any non-`visible` overflow
  moves an inline-block's baseline to its bottom margin edge (CSS 2.1 §10.8.1).
  `vertical-align: middle` was compensating for that: measured against the
  surrounding text at prose metrics, `overflow` alone pushed the spoiler text
  **-8.00px** off the baseline and `middle` pulled it back to **+0.95px** — closer,
  but still wrong, and it left the whole line ~1px taller than its neighbours.

  Both are gone. What remains — `position: relative` and `display: inline-block`,
  needed because the particle canvas is sized from `clientWidth`/`clientHeight`
  (0 on a non-replaced inline box) and positioned against this element — now
  applies only while the cover is up (`.kun-spoiler-hidden`) or the canvas is
  still dissolving (`.kun-spoiler-live`), so a revealed spoiler is a plain inline
  again and leaves no trace. Block-level spoilers use `display: flow-root` for the
  BFC that keeps their child `<p>` margins inside the covered box, instead of
  `overflow: hidden` and its clipping/scroll-container side effects.

  Measured on the real component, revealed state, against a spoiler-free control
  paragraph:

  |                                                  | before   | after       |
  | ------------------------------------------------ | -------- | ----------- |
  | inline spoiler text vs. surrounding text         | +0.95px  | **0**       |
  | line height (control: 30.60px)                   | 31.55px  | **30.60px** |
  | paragraph with a long spoiler (natural: 91.80px) | 122.40px | **91.80px** |
  | does a long spoiler flow with the text           | no       | **yes**     |

  Downstream overrides that reset `display` / `vertical-align` on `.kun-spoiler`
  can be removed — they were tying with the component's own `(0,3,0)` selector and
  winning only on stylesheet order.

- c71759e: fix(vue): KunPagination no longer walks past the end when `totalPage` is 0

  The next-page button's disabled test was `currentPage === totalPage`. With an
  empty result set — `totalPage: 0`, `currentPage: 1` — that equality is false, so
  the button stayed live and every click emitted `update:currentPage` for page 2,
  3, 4… forever, with nothing to show on any of them.

  Both arrows now compare with `>=` / `<=` instead of `===`, so they disable on any
  out-of-range `currentPage` rather than only on an exact match, and
  `handlePageChange` bails out when `totalPage <= 0` as a backstop for callers that
  reach it without going through a button.

  Thanks to @miaoledor (#3).

  - @kungal/ui-core@2.18.2

## 2.18.1

### Patch Changes

- 84ae5dc: fix(vue): KunImage renders the ThumbHash blur during SSR

  The blur-up placeholder was decoded in `onMounted`, so it could not exist in
  server-rendered markup: SSR painted the grey pulse skeleton, and the blur only
  appeared after hydration — precisely when it was no longer needed. The point of
  shipping a ThumbHash is a meaningful placeholder in the _first_ paint, at zero
  extra requests, and that was being missed on every SSR page.

  The decode is now a `computed`, evaluated during render on both server and
  client.

  The client-only gate rested on a code comment claiming the decode needs a
  canvas. It does not: thumbhash's `rgbaToDataURL` hand-assembles the PNG bytes
  and needs only `atob`/`btoa`, so it runs unchanged under Node and produces
  byte-identical output on both sides — verified in a real Nuxt SSR build, with no
  hydration mismatch.

  - @kungal/ui-core@2.18.1

## 2.18.0

### Minor Changes

- b78e78b: feat(vue): KunImage / KunImageNative emit `load` and `error`

  Both components now declare `load` and `error` as real events, with the
  signature `(src: string, event?: Event)`.

  `src` is the payload rather than only the DOM event because `fallbackSrc` makes
  a single `KunImage` perform two attempts — a listener needs to tell "the
  original failed (and a fallback is coming)" from "the fallback failed too".
  Both attempts are reported. `event` is the native DOM event where one exists;
  it is `undefined` when the outcome was determined by re-reading an image that
  was already complete in cache, which fires no DOM event.

  This closes a gap where `@error` could not be used to drop an image's whole
  container on failure — `fallbackSrc` only swaps the source, leaving the
  aspect-ratio box in place.

  Note for existing users:

  - On `KunImage`, `@error` previously reached the parent ONLY when `skeleton`
    was `false` and no `thumbhash` was set. In every other configuration the
    component's root is the wrapper `<div>`, and since `error` does not bubble
    from the inner `<img>`, the listener silently never fired. It now fires in
    all configurations.
  - Where `@error` / `@load` did fire before, they arrived by attribute
    fallthrough and were passed the raw `Event` as the first argument. The first
    argument is now `src`, with the event second. Handlers written as
    `@error="e => ..."` need updating.

### Patch Changes

- 037c3e6: fix(vue): KunLightbox double-tap zoom no longer snaps straight back on touch

  On a touchscreen, double-tapping the image zoomed in and instantly zoomed back
  out. Touch devices replay a tap as synthesized mouse events once the touch
  sequence ends, and the second tap's replay includes a `dblclick` — verified on
  mobile Chromium as `touchstart > touchend > mousedown > mouseup > click >
dblclick`. So the gesture was handled twice: `onTouchEnd`'s own double-tap
  detection zoomed to 2×, then the synthesized `dblclick` saw `scale > 1` and ran
  the reset branch back to 1×.

  Mouse handlers (`dblclick`, `mousedown`, `mousemove`, `mouseup`) now ignore
  events arriving in the wake of a touch, so each gesture is handled exactly once.
  Mouse-only interaction is unaffected.

  - @kungal/ui-core@2.18.0

## 2.17.0

### Minor Changes

- aae4747: feat(vue): KunPopover exposes right / left (and centered) placements

  `KunPopoverPosition` now covers all 12 floating-ui sides — the `right-*` / `left-*`
  placements (and the centered `top` / `bottom` / `right` / `left`) are now part of
  the public type, not just `top-*` / `bottom-*`.

  The implementation already passed `position` straight to floating-ui and mapped
  every side's transform-origin, so a side-anchored flyout just needed the type to
  allow it. With `autoPosition` (the default) a `position="right-start"` flyout is
  fully collision-aware: `flip()` / `shift()` keep it on-screen and `size()` caps
  its height to the available space and scrolls — so a tall menu near the bottom
  edge no longer clips. This makes a navigation rail's hover flyout a first-class
  use of `<KunPopover position="right-start" trigger="hover" :group>` instead of
  hand-rolled `absolute left-full` + `max-h-[80vh]` positioning.

### Patch Changes

- @kungal/ui-core@2.17.0

## 2.16.0

### Minor Changes

- d23e061: feat(vue): KunTab auto-handles horizontal overflow (scroll + edge fade + chevrons)

  A horizontal tab strip that outgrows its container now scrolls **inside** the
  container instead of widening the page — automatically, with no `scrollable`
  flag and no manual overflow check. When the tabs overflow:

  - the overflowing edge fades to transparent via a CSS mask — **background-independent**,
    so it reads clearly on any surface (unlike a colored scroll shadow that blends in);
  - a chevron button floats on each scrollable side (opt out with `:scroll-buttons="false"`
    to keep just the fade);
  - the active tab auto-scrolls into view, so ← / → keyboard nav always keeps the
    selection visible.

  New prop: `scrollButtons?: boolean` (default `true`). The existing `scrollable`
  prop now only governs _vertical_ tab columns; horizontal overflow is handled
  unconditionally.

### Patch Changes

- @kungal/ui-core@2.16.0

## 2.15.1

### Patch Changes

- 4ba751a: fix(vue): KunTab vertical orientation now defaults to left-aligned content

  The `align` default is now orientation-aware. A vertical tab list reads as a
  nav column, where left-aligned labels are the convention, so vertical tabs now
  default to `align="start"`. Horizontal tabs keep the classic centered look.
  An explicit `align` prop still overrides either orientation — pass
  `align="center"` to restore the previous centered vertical tabs.

  - @kungal/ui-core@2.15.1

## 2.15.0

### Minor Changes

- 19e041c: feat(vue): KunTab `#tab` slot for custom tab content (badges, dots)

  KunTab is now generic over the item shape and exposes a `#tab` scoped slot
  (`{ item, index, active }`) so you can render custom per-tab content — e.g.
  compose a `KunBadge` for an unread count or an "unsaved" dot — instead of being
  limited to icon + label. Extra fields on the item (a `count`, a `dirty` flag, …)
  are typed inside the slot. The sliding indicator measures the button, so
  badge-widened tabs are tracked automatically. Defaults to icon + label
  (backward-compatible).

### Patch Changes

- @kungal/ui-core@2.15.0

## 2.14.1

### Patch Changes

- 27790a5: feat(vue): KunPagination animates the active page (sliding pill + "highlight leads")

  The active page is now a single primary pill that slides between numbers (like
  KunTab's indicator) with a small elastic pop, instead of the highlight jumping.
  For mid-range pages — where the active number stays centered in the ellipsis
  window so the pill can't slide — the highlight _leads_: it first covers the
  adjacent number, then the number row scrolls (FLIP) to recenter and the pill
  rides back with it. Honors `prefers-reduced-motion`; falls back to a solid pill
  before hydration. No API change.

  - @kungal/ui-core@2.14.1

## 2.14.0

### Minor Changes

- b4b1460: feat(vue): add KunCommandPalette (⌘K command palette / spotlight)

  The generic ⌘K palette SHELL — trigger + global shortcut, teleported dialog,
  autofocus, body scroll-lock, keyboard nav (↑↓ / Home / End / Enter / Esc),
  grouped results, safe match highlighting, and full a11y (dialog + combobox +
  listbox + aria-activedescendant) — with NO search logic baked in. You compute
  `items` (flat or grouped) from the `query` it exposes via `v-model:query` (your
  own scoring / index / async fetch) and it renders + navigates them; selecting
  emits `@select`. Generic over the item shape, with `#trigger` / `#item` /
  `#empty` / `#no-result` / `#footer` slots, a `loading` state, and a configurable
  `shortcut`. The docs site's ⌘K search is now a thin consumer of it.

### Patch Changes

- @kungal/ui-core@2.14.0

## 2.13.1

### Patch Changes

- 978cf03: fix(vue): KunMessage no longer leaks toasts across SSR requests

  The toast store is module-scope, so on the server it's a single array shared by
  every SSR request and never cleared there (the dismiss timer is client-only). A
  server-side `useKunMessage()` — e.g. from a data-fetch error handler that runs
  during SSR — therefore piled up (deduped into a growing `count`), baked into
  every page's SSR HTML, and vanished on hydration (empty client store →
  hydration mismatch). Two guards, both making toasts the client-only ephemeral UI
  they are: `useKunMessage()` is a no-op on the server (the store is never mutated
  there), and `KunMessageProvider` renders nothing until mounted.

  - @kungal/ui-core@2.13.1

## 2.13.0

### Minor Changes

- 6eadb74: feat(vue): KunPopover gains a `fullWidth` prop

  The trigger was wrapped in two hardcoded `inline-block` divs, so a consumer could
  never make the anchor span its container — external classes only reached the outer
  wrapper, not the inner `triggerRef`. `<KunPopover full-width>` now switches both
  wrappers to `block w-full`, so a full-width trigger (e.g. a `fullWidth` KunButton
  or a split button) fills the width. Default `false` (inline, content-width) —
  unchanged.

### Patch Changes

- @kungal/ui-core@2.13.0

## 2.12.2

### Patch Changes

- 7a99394: fix(vue): KunDropdown / KunContextMenu item labels align left, not center

  Menu items are native `<button>`s, which default to `text-align: center`; the
  `flex-1` label span inherited that, so short labels sat centered. Both item rows
  now carry `text-left` so the label starts at the left edge (icon → label), the
  expected menu-item layout.

  - @kungal/ui-core@2.12.2

## 2.12.1

### Patch Changes

- f5c867b: fix(vue): KunMessage no longer jumps wider for a frame when dismissed

  The leaving toast went `position: absolute; width: 100%`, but the `%` resolved
  against the outer `fixed` container's padding box — 2rem wider than the in-flow
  content width — so the toast visibly widened and spilled out the right edge for a
  frame before fading. The `TransitionGroup` wrapper is now the containing block
  (`position: relative`), so `width: 100%` matches the in-flow width exactly.

- f5c867b: fix(vue): KunMessage toasts use semantic-colored border + count badge

  Each toast's outline is now its own semantic colour (`ring-{color}/50`) instead of
  a uniform neutral grey ring, and the de-dup count badge uses a matching
  `bg-{color}/10` tint instead of the neutral `bg-black/10`. Each type now reads as
  one cohesive coloured surface in both light and dark.

  - @kungal/ui-core@2.12.1

## 2.12.0

### Minor Changes

- 08e2226: feat(vue): KunAutocomplete & KunSelect support custom option rendering via `#option`

  Both components are now generic over the option shape, so you can pass options
  with extra fields (avatar, description, …) and read them — typed — in a new
  `#option` scoped slot: `<template #option="{ option, index, active, selected }">`.
  Render a leading image, two-line text, badges, anything. Without the slot the
  plain label renders exactly as before (fully backward-compatible). Select keeps
  its check indicator outside the slot, and the option row now groups rich content
  at the left with the indicator at the right.

### Patch Changes

- @kungal/ui-core@2.12.0

## 2.11.0

### Minor Changes

- 0215eec: feat(vue): KunAutocomplete gains `loading` + `debounce` for async data sources

  `:loading` shows a spinner in the dropdown (reusing `KunLoading`) instead of
  `noResultText` while a remote `@search` request is in flight — drive it from your
  fetch (true on request start, false when the options land). `:debounce` (ms)
  delays the `@search` emit so you fetch once the user pauses, not per keystroke
  (the input text still updates instantly). The two mesh: while the debounce is
  armed the spinner already shows, so the gap before the request never flashes
  "no matches" — it's continuous from keystroke to results. `:loadingText` sets the
  spinner caption (default '加载中…'). Fully backward-compatible: `debounce` defaults
  to 0 (emit every keystroke, unchanged).

### Patch Changes

- 0215eec: fix(vue): KunAutocomplete no longer reopens the panel after picking an option

  Clicking an option blurred the input, and the post-select refocus then
  re-triggered the `@focus`-to-open — so the panel visibly closed and sprang back
  open. Options now `@mousedown.prevent` (keeping focus on the field, so no
  reopen), and the input opens on `@click` too so clicking the already-focused
  field can still reopen the list. Keyboard selection was unaffected either way.

  - @kungal/ui-core@2.11.0

## 2.10.0

### Minor Changes

- a7d8e8d: feat(vue): KunTabPanel gains a `loading` state (dim + inert + aria-busy)

  `<KunTabPanel :loading>` marks a panel busy while async / lazy data resolves. It
  dims the panel to `0.5` opacity, makes it `inert` (no pointer **or** keyboard
  interaction) and sets `aria-busy` for screen readers. The dim uses a _delayed_
  fade (`transition: opacity 0.2s 0.2s linear` — the React `useDeferredValue`
  trick): a load that resolves quickly clears `loading` before the dim ever paints,
  so fast tab switches never flicker; only a genuinely slow load visibly dims. It
  snaps back to full opacity the instant content is ready, and honours
  `prefers-reduced-motion`.

  This is the stale-while-revalidate mechanism only — it dims content that is
  already there. For a true first load (nothing to dim), render a skeleton (e.g.
  `KunSkeleton`) in the slot and leave `loading` off, so the skeleton shows at full
  opacity; flip `loading` on only when revalidating existing content. See the new
  "懒加载 / 加载中" docs example.

### Patch Changes

- @kungal/ui-core@2.10.0

## 2.9.1

### Patch Changes

- f4f84d3: fix(vue): KunReaction honors `active` skin in action mode (menu-button reactions)

  The filled/coloured skin now follows the `active` model in BOTH modes, not just
  `toggle` mode. This lets an action-mode (`toggle="false"`) reaction be a
  controlled "menu button": wrap it as a `KunPopover` trigger, bind `:model-value`
  to your own state, and the click opens the picker instead of self-toggling while
  the skin still reflects your state. This is what a 收藏 button needs when it sits
  next to a 点赞 reaction — both stay peer pills (identical skin), but 收藏's click
  opens a 收藏夹 picker and its filled state = "in ≥1 list" (Bilibili / YouTube
  pattern), no split button. Fully backward-compatible: existing action-mode
  buttons (share / more …) pass no `active`, so they stay neutral exactly as before.

  - @kungal/ui-core@2.9.1

## 2.9.0

### Minor Changes

- 1e253ef: feat(vue): add KunButtonGroup (segmented actions + split buttons)

  `KunButtonGroup` joins a row/column of `KunButton`s into one attached unit —
  collapsing the touching inner corners and overlapping the 1px borders into a
  single seam. It is the building block for a GitHub-style **split button**: a
  primary `KunButton` next to a chevron `KunButton` that triggers a `KunPopover`
  holding a rich menu (e.g. a `KunCheckBoxGroup` of lists + a "create list"
  footer). The seam CSS reaches a button nested inside a `KunPopover` trigger
  wrapper, and — because the popover panel teleports to `<body>` — never touches
  the menu's own buttons. Supports `orientation="horizontal" | "vertical"`.

### Patch Changes

- @kungal/ui-core@2.9.0

## 2.8.3

### Patch Changes

- 4ec9965: fix(vue): KunModal panel is opaque by default (drop the hardcoded 85% alpha)

  The modal panel hardcoded `bg-content1/85`, forcing an 85%-opaque (see-through)
  surface that ignored `--kun-surface-opacity` and stacked on top of it — so on a
  site that already lowered that token (a background-image page) the panel went
  even more translucent than every other surface. It now uses plain `bg-content1`
  like Card / Drawer / Dropdown / Tooltip / Select, so it is fully opaque by
  default and follows `--kun-surface-opacity` (set it < 1 with `--kun-backdrop-filter`
  to opt every surface into frosted glass at once). The backdrop scrim is unchanged.

  - @kungal/ui-core@2.8.3

## 2.8.2

### Patch Changes

- 1e31d5c: fix(vue): KunTab active-tab text color now tracks the sliding indicator

  The per-tab text color transitioned over Tailwind's default 150ms while the
  sliding indicator slid over 250ms (`--kun-dur-base`), so the newly-active tab's
  text reached its final color ~100ms before the pill arrived under it. With
  `solid`/`pills` that meant the text went white over the still-uncovered light
  background and read as "invisible until the animation finished". The tab text
  transition is now pinned to the indicator's duration and easing
  (`duration-kun-base ease-kun-standard`), so color and position land in lockstep.

  - @kungal/ui-core@2.8.2

## 2.8.1

### Patch Changes

- 028d94a: fix(vue): KunTab `bordered` and `pills` now slide the active indicator

  The sliding indicator (the element that animates between tabs via `transform`)
  was only rendered for `underlined`/`solid`/`light` — `bordered` and `pills` fell
  through to `indicatorClasses` returning `null`, so their active state only did an
  in-place color fade and looked like it had no switch animation. Both variants now
  get the same measured, sliding indicator (a rounded-full solid pill for `pills`,
  a colored outline for `bordered`), with the per-tab fill/border gated to the
  pre-hydration fallback exactly like `solid`/`light` — no hydration flash, no
  layout shift. Respects `disableAnimation`.

  - @kungal/ui-core@2.8.1

## 2.8.0

### Minor Changes

- 3ebc4de: feat(vue): add KunCheckBoxGroup + pill/icon selectors on KunRadioGroup

  Adds the multi-select form field the library was missing, and rounds out the
  single-select one, so "pick a category / pick sections / pick types" selectors
  (previously hand-rolled in every downstream app) come from KunUI:

  - **New `KunCheckBoxGroup`** — WAI-ARIA checkbox-group semantics (value is a real
    `T[]` the form submits, unlike a toolbar-style toggle group). Variants
    `classic | pill | card`, a `max` cap that blocks extra picks and emits
    `invalid: 'max-reached'`, and per-option `icon` / `description`.
  - **`KunRadioGroup`** gains a `pill` variant (single-select "choice chips"), an
    optional `icon` per option, and `hideIndicator` for the `card` variant (drop
    the radio dot and signal selection with the tinted border alone — the
    icon-card look).

  Both share the selection size scale, color matrix, and focus ring with the rest
  of the library. Picking between them follows the recognized rule: single-select
  form field → RadioGroup, multi-select form field → CheckBoxGroup; a ToggleGroup
  stays for non-form UI toggles.

### Patch Changes

- @kungal/ui-core@2.8.0

## 2.7.1

### Patch Changes

- 8d36753: fix(vue): ThumbHash blur-up now reliably shows before fast/cached images load

  Both KunImage (covers) and KunContent (body images) decoded the ThumbHash through a
  lazy `import('thumbhash')`. A fast or cached CDN image could finish loading during
  that import — after which a placeholder is pointless and was skipped — so the blur
  never appeared (you'd see the reserved box but no blur). The decode is now a
  synchronous (static) import, painted in the same tick as mount/scan, so it always
  wins the race against the image load. The decoder stays externalized + tree-shaken;
  it's ~2KB.

  - @kungal/ui-core@2.7.1

## 2.7.0

### Minor Changes

- 2060622: feat(vue): KunContent — ThumbHash blur-up for body images

  Body images in KunContent are raw `<img>` from v-html (backend-rendered markdown),
  not components, so they couldn't get the cover-image blur-up. Now any
  `<img data-thumbhash="…">` in the prose automatically shows a decoded, blurred
  placeholder until it loads.

  The decoded ThumbHash is painted as the image's OWN `background` (visible behind the
  not-yet-loaded content, cleared once it paints over) — zero DOM restructuring, so it
  coexists with the existing lightbox and spoiler passes and never disturbs prose
  layout. The blur shows when the `<img>` reserves space (width/height attributes),
  which the same backend metadata supplies — together they also remove the load-time
  layout shift (CLS).

  Also exported as `useContentBlurUp(containerRef)` for apps building their own prose
  renderer. Client-only; the ~2KB decoder is lazy-imported.

### Patch Changes

- @kungal/ui-core@2.7.0

## 2.6.0

### Minor Changes

- 76307df: feat(vue): KunImage — ThumbHash blur-up placeholder

  KunImage gains a `thumbhash` prop: pass the base64 ThumbHash a backend ships
  alongside image metadata, and KunImage shows a decoded, blurred "blur-up"
  placeholder until the image loads, then cross-fades to it — much closer to the
  final frame than a plain skeleton, with no extra network request.

  - Decoded on the client (canvas) to a tiny data-URL image, upscaled by `bg-cover`;
    SSR-safe — falls back to the pulse skeleton until decoded, or if the hash is
    invalid.
  - The ~2KB `thumbhash` decoder is loaded via a dynamic import, so it only ships for
    images that actually use the prop — zero cost otherwise.

### Patch Changes

- @kungal/ui-core@2.6.0

## 2.5.0

### Minor Changes

- 10d4087: feat(vue): KunScrollShadow — wheel-to-scroll, drag-to-scroll, and a scrollbar toggle

  A horizontal `KunScrollShadow` couldn't be scrolled by mouse users (the wheel
  scrolls the page, not the strip). Three opt-in props fix that, all reusable:

  - `wheel` — when `axis="horizontal"`, a vertical mouse wheel scrolls the content
    sideways (horizontal trackpad swipes too). `true` releases at the edges so the
    page keeps scrolling (no scroll-trap); `'contain'` keeps the wheel on the strip
    at the edges so the page doesn't move — only while the strip is actually
    scrollable, so it can never freeze the page.
  - `draggable` — click-and-drag with a mouse/pen to scroll, like grabbing a strip.
    A drag past a small threshold suppresses the trailing click so cards inside
    still work on a normal click; touch is left to native scrolling.
  - `scrollbar` — `'hide'` (default, unchanged), `'thin'` for a slim, theme-coloured
    CSS scrollbar (a dependency-free alternative to an overlay-scrollbar library), or
    `'auto'` for the platform default.

  Performance: the wheel/drag handlers do O(1) work per event and read no layout in
  the hot path — scroll bounds come from the ResizeObserver-backed sizes, and the
  non-passive wheel listener is bound only when `wheel` is on. No API breakage;
  defaults preserve current behaviour.

### Patch Changes

- @kungal/ui-core@2.5.0

## 2.4.0

### Minor Changes

- 93befa5: feat(vue): add KunShatter — break any content into glass shards that fly apart

  A new animation component that shatters its slotted content (an image, a card, anything)
  into Voronoi glass shards which burst outward from an impact point, arc under gravity,
  spin, and fade.

  Performance-first and dependency-free:

  - The fly-apart is **compositor-only** — every shard animates only `transform` + `opacity`
    (the two properties that run on the compositor thread, never re-running layout or paint),
    so it holds 60fps regardless of piece count. Verified: 0 dropped frames even at the
    160-piece cap.
  - `clip-path` carves each shard's glass edge but is set once and **never animated** (animating
    clip-path is not compositor-accelerated yet).
  - Each shard is sized to its own bounding box with `overflow:hidden` + paint containment, so
    N shards tile to **≈1× the element's area** instead of N× full-size GPU layers — the one-time
    build stays a few milliseconds even at the cap.
  - Voronoi shard geometry is computed in-component (rectangle clipped against seed-point
    perpendicular bisectors); **no runtime dependency**.

  Usage: wrap content in `<KunShatter>` and trigger via `trigger="click"`, `v-model:shattered`,
  or the exposed `shatter()` / `restore()` methods. Tunable with `pieces`, `origin`, `spread`,
  `gravity`, `rotation`, `fade`, `duration`, `easing`, `seed`, `autoRestore`, and `keepSpace`.
  Honours `prefers-reduced-motion` (instant hide, no shards) and is SSR-safe.

### Patch Changes

- @kungal/ui-core@2.4.0

## 2.3.1

### Patch Changes

- cf30b0c: fix(vue): KunCarousel — structurally eliminate the "runaway auto-advance" flicker

  The seamless loop drives itself by writing `scrollLeft`; some browsers then nudge
  `scrollLeft` again after the reorder/reflow, which the re-home logic read back as a
  user scroll → re-home → nudge → a per-frame feedback loop (slides stacking and
  flickering, Chrome/Edge). 2.0.1's `overflow-anchor: none` only closed one drift
  source (Chromium scroll-anchoring); other sources (snap re-alignment after the
  `order` reflow) could still drive it.

  Three layers of defense so it can't recur regardless of the browser:

  - `overflow-anchor: none` is now applied as an **inline style** instead of a
    Tailwind utility — a correctness fix must not depend on a headless consumer's
    Tailwind regenerating an arbitrary class; an inline style always wins and is
    never purged.
  - A **re-entrancy lock**: the carousel's own programmatic `scrollLeft` writes can
    no longer trigger a re-home, which breaks the whole class of write→event→re-home
    loops — not just scroll-anchoring.
  - A **circuit breaker** plus an autoplay **self-heal**: if reorders ever spike it
    drops to a plain non-looping slider, and autoplay re-homes before advancing so a
    stray drift can never leave the carousel parked at a physical edge.

  No API change.

  - @kungal/ui-core@2.3.1

## 2.3.0

### Minor Changes

- 349b46d: feat(vue): overlays avoid viewport collisions by default + cap size on small screens

  Aligns the floating overlays with Floating UI / Radix defaults so they never
  overflow the screen at an edge or on a short viewport:

  - **KunPopover** now flips, shifts AND caps its size by default (`autoPosition`
    defaults to **`true`** — it was `false`, so a popover near an edge used to
    overflow). Set `auto-position="false"` to honour `position` verbatim. (Panels
    with `show-arrow` skip the size-cap so the caret isn't clipped.)
  - **KunDropdown** and **KunDatePicker** now cap their height to the available
    space and scroll, instead of overflowing off-screen on a short viewport.
  - New `maxSize` option on the internal `useKunFloating` (size() middleware:
    max-height/width + scroll) — one implementation reused across overlays. Select /
    Autocomplete already did this.

### Patch Changes

- @kungal/ui-core@2.3.0

## 2.2.0

### Minor Changes

- 8ce8049: feat(vue): KunPopover `opaque` prop — keep a menu solid on a frosted site

  Sites with a background image often lower `--kun-surface-opacity` to frost every
  surface — which also makes popover/hover-menu panels translucent and hard to read.
  `opaque` forces a solid `content1` background (from its raw channels, ignoring the
  surface-opacity alpha; still light/dark adaptive). Note this is the only reliable
  way: setting `--kun-surface-opacity:1` on the panel does NOT work, because the
  themed `--color-content1` is resolved at `:root`, not on the element.

### Patch Changes

- @kungal/ui-core@2.2.0

## 2.1.1

### Patch Changes

- c3f4c91: fix(vue): KunPopover restores focus to the trigger on every close

  Hardens focus handling found while stress-testing hover menus: if focus was
  inside the panel when it closed via a path that doesn't restore it itself —
  e.g. a hover `group` sibling stealing the open menu — focus is now pulled back to
  the trigger instead of being orphaned on the detached panel node. Covers all
  close paths (group steal, click-outside, programmatic).

  - @kungal/ui-core@2.1.1

## 2.1.0

### Minor Changes

- d566c45: feat(vue): KunPopover `trigger="hover"` + `useKunPointerMenu` — navigation hover menus done right

  Adds first-class hover menus without the usual traps, via a reusable composable
  `useKunPointerMenu` (also exported):

  - **Coordinate safe-triangle** — on leaving the trigger you can travel to the
    panel without it closing. Computed from `clientX/Y` + `getBoundingClientRect()`,
    so it works even though panels are `Teleport`ed to `<body>` (DOM-containment
    safe-polygons break across portals; coordinates don't).
  - **`openDelay` / `closeDelay`** and a shared **`group`** so a row of menus
    switches instantly between siblings and keeps only one open (menu-bar feel).
  - **No focus steal on hover** (unlike the click open), and **touch falls back to
    click** (`pointerType` gate) so the first tap doesn't follow a link — the
    classic a11y trap. Click / keyboard / Esc / click-outside all still work.

  `KunPopover` gains `trigger` ('click' default | 'hover'), `openDelay`,
  `closeDelay`, `group`. `KunDropdown` (role=menu) stays click-only by design.

### Patch Changes

- @kungal/ui-core@2.1.0

## 2.0.1

### Patch Changes

- 373c616: fix(vue): KunCarousel runaway auto-advance / "wild flicker" on Chromium

  The seamless loop is a scroll-jacked container — it programmatically reorders
  slides (CSS `order`) and resets `scrollLeft` to re-home. Chromium's default
  **scroll anchoring** reacts to that reorder/reflow by nudging `scrollLeft` to keep
  an anchor element in view; the re-home logic then misreads the nudge as "the user
  moved to the next slide", advances, reorders again, and loops — so the carousel
  races through slides far faster than the autoplay interval (looks like everything
  flickering/stacking; reported on Chrome + Edge, desktop). The track now sets
  `overflow-anchor: none`, handing scroll control entirely to the component. No API
  or behaviour change otherwise.

  - @kungal/ui-core@2.0.1

## 2.0.0

### Major Changes

- c0e69ae: Remove the `ghost` variant.

  `ghost` was visually indistinguishable from `bordered`: at rest both are just
  `border + bg-transparent + colored text`. `ghost` only added a faint `hover` fill,
  so the two looked identical until hovered. It has been dropped from `KunUIVariant`,
  which affects every variant consumer — `KunButton`, `KunChip`, `KunDropdown` and
  `KunInfo`.

  **Migration:** replace `variant="ghost"` with `variant="bordered"` (the outline
  look it overlapped). For a softer fill instead, `variant="flat"` or `variant="light"`.

  (This mirrors the earlier removal of the `faded` variant for the same reason; the
  remaining set — solid / bordered / light / flat / shadow — has no visual overlap.)

### Patch Changes

- Updated dependencies [c0e69ae]
  - @kungal/ui-core@2.0.0

## 1.14.2

### Patch Changes

- @kungal/ui-core@1.14.2

## 1.14.1

### Patch Changes

- 6d0bce9: fix(vue): DatePicker / Autocomplete focus-on-open no longer risks scrolling the page

  Hardens the two remaining popup components that still used a bare `.focus()`:
  DatePicker (focus the root on open) and Autocomplete (refocus the input after
  select / clear) now pass `{ preventScroll: true }`. The menu components already
  did this; this brings the last two in line so a portaled-panel open can never
  jump the page to the top. (The public `Autocomplete.focus()` method keeps the
  default so the caller controls scroll intent.)

  - @kungal/ui-core@1.14.1

## 1.14.0

### Minor Changes

- cf7f212: feat(vue): KunReaction `toggle` (action mode) + default-slot visible label

  Two additive, backward-compatible hooks so a whole actions row can be one
  component, and so the text is part of the click target:

  - **`toggle` prop** (default `true`). `false` = a one-shot ACTION (share / 更多 …)
    in the same compact skin: no pressed state, no burst, just a tactile pop —
    handle it with a native `@click`. A reactions row no longer needs to mix in a
    heavier icon button.
  - **Default slot** = a visible label rendered INSIDE the button, so clicking the
    TEXT (not just the icon) toggles too — the clean fix for "点 收藏游戏 文字也该收藏".
    It inherits the active colour; when present it becomes the accessible name (the
    `label` prop is the aria fallback only when there's no visible label). Omit it to
    keep the compact icon-(+count) reaction.

### Patch Changes

- @kungal/ui-core@1.14.0

## 1.13.0

### Minor Changes

- 9cd2af8: feat: single source of truth for component registration + `KunUIResolver`

  Kills the class of bug where a newly-added component is registered for plain Vue
  but forgotten elsewhere (the recent `Failed to resolve component: KunReaction`).

  - **One source** — `KUN_COMPONENT_NAMES` (exported from `@kungal/ui-vue`). The
    plain-Vue plugin types its registry as `Record<KunComponentName, …>`, so a
    missing/extra entry is a **compile error**, not a silent runtime failure. The
    Nuxt layer's auto-import list and the docs meta now derive from this list
    instead of hand-maintaining their own copies — they can no longer drift.
  - **`KunUIResolver`** (new, from `@kungal/ui-vue`) for `unplugin-vue-components`,
    matching Element Plus / PrimeVue: Vite apps get on-demand, tree-shaken
    auto-import of every KunUI component with zero registration and zero list —
    new components work automatically.

    ```ts
    import Components from "unplugin-vue-components/vite";
    import { KunUIResolver } from "@kungal/ui-vue";
    // plugins: [Components({ resolvers: [KunUIResolver()] })]
    ```

  No change to existing usage (`app.use(KunUI)`, the Nuxt layer auto-import).

### Patch Changes

- @kungal/ui-core@1.13.0

## 1.12.1

### Patch Changes

- @kungal/ui-core@1.12.1

## 1.12.0

### Minor Changes

- 886e58f: feat(vue): KunReaction — `#icon` slot + arbitrary `color`

  Two additive, backward-compatible hooks for fully custom reactions (e.g. a "推"):

  - **`#icon` slot** (scoped `{ active }`) replaces the whole glyph — an emoji,
    image or custom SVG, and it can differ by active state. Slot content still gets
    the pop + burst animations.
  - **`color`** now also accepts any CSS colour string (e.g. a brand `#ff6a00`), not
    just a palette key. The whole effect runs through `currentColor`, so the icon
    fill, the pop and the burst (ring + sparks) all follow it with no extra wiring.

  Existing `icon` / palette-`color` usage is unchanged.

### Patch Changes

- @kungal/ui-core@1.12.0

## 1.11.0

### Minor Changes

- 160667d: feat(vue): KunReaction — a compact like/reaction control with count

  A purpose-built reaction control so a like + count doesn't bloat into a wide
  padded text button. It's a tight pill (icon + optional count), a proper toggle
  (`aria-pressed`, accessible name includes the count), and it animates on click —
  all pure CSS/Vue, no external library:

  - icon fills + colours when active;
  - a bouncy pop;
  - a one-shot burst (expanding ring + radiating sparks) when liking;
  - the count rolls in the direction it changed.

  `v-model` is the active state; `v-model:count` the count (auto ±1 on click, the
  parent can override for server sync). Props: `icon` (default a heart), `color`
  (default danger), `size`, `disabled`, `disableAnimation`, `label`. All animation
  is off under `prefers-reduced-motion`.

### Patch Changes

- @kungal/ui-core@1.11.0

## 1.10.1

### Patch Changes

- 56bd509: fix(vue): vertical underlined Tab indicator jumping on hydration (SSR)

  The pre-hydration fallback bar (drawn before the JS-measured indicator mounts) was
  hardcoded to the BOTTOM edge, so a vertical `underlined` tab showed its indicator
  under the active tab on the server and then jumped to the LEFT once the measured
  indicator took over. The fallback now follows orientation — a LEFT inset bar for
  vertical, BOTTOM for horizontal — so the SSR axis matches the final one and there's
  no jump.

  - @kungal/ui-core@1.10.1

## 1.10.0

### Minor Changes

- ae0c566: feat(vue): KunCarousel seamless infinite loop (`loop`, default on)

  Autoplay used to smooth-scroll all the way back to the first slide at the end — a
  jarring reverse sweep. KunCarousel now loops seamlessly by **repositioning** slides
  (a CSS `order` ring), with NO cloned DOM: the slide physically to the right of the
  last is always the first, and after each scroll settles the position is re-homed in
  the same frame (only off-screen slides shuffle, so the reset is invisible). Autoplay
  glides forward past the end into the start; the arrows wrap both ways too.

  - New `loop` prop, **default `true`** (auto-disabled when there are too few slides to
    loop without glitches; pass `loop="false"` for the old bounded behaviour).
  - Reposition, not cloning → no duplicate nodes for screen readers to read twice.
  - Keeps the native scroll-snap base (touch swipe + momentum + SSR).

  Note: default-on, so existing carousels now loop — autoplay no longer snaps back, and
  the arrows wrap around instead of disabling at the edges.

### Patch Changes

- @kungal/ui-core@1.10.0

## 1.9.5

### Patch Changes

- 770b77b: fix(vue): DatePicker trigger — gap + truncation between text and calendar icon

  The trigger only had `justify-between` (no gap), so in a narrow field the
  placeholder/value text butted right against the calendar icon with no spacing
  (and looked vertically off). Adopted the Select trigger's pattern: `gap-2` on the
  button, `min-w-0 flex-1 truncate` on the text, and `shrink-0` on the icon group —
  so there's always an 8px gap, the text truncates gracefully, and the icon stays
  put. (Audited Select, Autocomplete and the input family — they already do this;
  DatePicker was the only one missing it.)

  - @kungal/ui-core@1.9.5

## 1.9.4

### Patch Changes

- 92d0ff4: fix: DatePicker month/year nav closing on mobile; Enter key hijacked to "Next"

  - **DatePicker**: the calendar panel is teleported to `<body>`, so its month/year
    nav buttons were treated as outside-clicks and closed the picker (felt on mobile,
    where you must tap the nav). Added the same `dropdownRef.contains` guard that
    Select/Autocomplete already use; outside clicks still close it.
  - **Mobile "Next" key**: on a page with several fields the virtual keyboard shows a
    "Next" action that jumps to the next field instead of firing Enter — breaking
    inputs whose Enter does an in-component action. Declared `enterkeyhint` on those:
    TagInput (`enter`, add tag), Autocomplete & searchable Select (`done`, pick the
    active option), Pagination jump field (`go`). Plain Input/Textarea/NumberInput/
    PinInput are unchanged (field-to-field "Next" is correct there).
  - @kungal/ui-core@1.9.4

## 1.9.3

### Patch Changes

- 0b42fd3: perf: stop shipping backdrop-filter on every surface (mobile scroll jank)

  KunCard shipped `backdrop-filter: blur(var(--kun-background-blur))` on EVERY card —
  and the default blur was `0px` over an opaque surface, so it did nothing visually
  while still promoting each card to a compositing layer and running the backdrop
  pipeline. `backdrop-filter: blur()` is the #1 cause of janky scrolling on mobile
  (a 120Hz phone can drop to ~30–60Hz). With many cards per page the layers piled up.

  - KunCard / KunModal now emit `backdrop-filter` only via the new opt-in
    `kun-backdrop` utility, which is `none` by default (free — no layer, no blur pass).
  - New token `--kun-backdrop-filter` (default `none`) **replaces `--kun-background-blur`**.
    A glass site opts in for every raised surface at once:
    `:root { --kun-surface-opacity: 0.7; --kun-backdrop-filter: blur(12px); }`

  BREAKING (glass only): if you set `--kun-background-blur: 12px`, switch to
  `--kun-backdrop-filter: blur(12px)`. Sites that never enabled glass are unaffected
  (and get smoother scrolling for free).

  - @kungal/ui-core@1.9.3

## 1.9.2

### Patch Changes

- b673935: fix(tokens,vue): softer neutral hairline + bordered cards by default

  - KunCard shows a faint hairline border by default again (it was borderless during
    the filled-surface work) — with the lighter page and softer shadows, a hairline
    delineates the card better than shadow alone.
  - The shared neutral border token (`--color-kun-border` / the `border-kun` utility)
    drops from `default-200` to `default-100` — a lighter hairline that delineates a
    surface without framing it. Every consumer softens at once: inputs, textarea,
    select & other controls, accordion, tabs, dividers, drawer rules, etc. Error
    borders (danger) and focus rings are unaffected.
  - @kungal/ui-core@1.9.2

## 1.9.1

### Patch Changes

- 7a2c64d: fix(vue,tokens): bordered inputs, softer shadows, lighter page background

  - Form controls (Input, Textarea, Select, NumberInput, Autocomplete, DatePicker,
    TagInput flat, PinInput, Pagination jump field, Select's inline search) get a
    card-like neutral border back on top of the filled surface — the borderless
    fill was too hard to spot on a card. Error state recolours the border to danger
    instead of a persistent ring. (= the shadcn "border + fill + subtle shadow" input.)
  - Elevation scale softened ~30% across all three tiers (sm/md/lg) — lighter, tighter
    shadows on cards, inputs, dropdowns, modals.
  - Light page background nudged brighter (#f2f2f5 → #f4f4f7). Dark unchanged.
  - @kungal/ui-core@1.9.1

## 1.9.0

### Minor Changes

- 29a6a07: feat(vue): KunCard `padding` prop + roomier default; bump KunInfo padding

  KunCard's inner padding was `p-3` (12px) — tighter than the modern norm (shadcn /
  Ant use 24px, MUI 16px) and tighter than KunModal's own 24px, which made
  card-heavy UIs feel cramped.

  - New `padding` prop on KunCard: `none` | `sm` (12px) | `md` (20px) | `lg` (24px),
    **default `lg`**. Inner section `gap` also grows 12px → 16px. Pass `sm` for the
    old compact density, `none` for a full-bleed card (e.g. just a cover image).
  - KunInfo padding 12px → 16px to match.

  Visual change: cards/info are roomier by default. Set `padding="sm"` to keep the
  previous density.

### Patch Changes

- @kungal/ui-core@1.9.0

## 1.8.3

### Patch Changes

- @kungal/ui-core@1.8.3

## 1.8.2

### Patch Changes

- 117063e: fix(tokens,vue): give surfaces breathing room + refine KunCard hover

  - The light page background is a touch deeper (`#f5f5f7` → `#eeeef1`) so white
    cards/surfaces pop more (≈17 vs ≈10 units) and there's room for interaction
    states. Dark mode is unchanged (it already had ample headroom).
  - KunCard hover feedback now applies only to interactive cards (`href` /
    `clickable`) or an explicit `isHoverable`; a plain static card no longer reacts.
  - Hover is a faint `foreground` state layer (≈3%, via `::after`) — darkens
    slightly in light, lightens in dark — and stays clearly brighter than the page
    (no surface-colour swap, no shadow change).
  - KunNumberInput stepper buttons use `hover:bg-foreground/8` (a normal control
    hover) instead of the absolute `bg-default-100`.
  - @kungal/ui-core@1.8.2

## 1.8.1

### Patch Changes

- @kungal/ui-core@1.8.1

## 1.8.0

### Minor Changes

- 3e821c4: feat(tokens,vue): surface-elevation system — cards & inputs pop by fill+shadow, not borders

  Move from a border-defined look to an elevation scale. The page background is now
  a soft neutral (light `#f5f5f7`, dark near-black `#0a0a0a`) instead of pure
  white/black, so raised surfaces read as raised:

  - **Card** is a raised surface — `bg-content1` (`#fff` / `#18181b`) + `shadow-kun-sm`;
    border is now OFF by default (`bordered` is opt-in). It no longer shares the
    page background.
  - **Inputs are borderless and share the card surface**: Input, Textarea, Select,
    NumberInput, TagInput, PinInput, Autocomplete, DatePicker trigger and the
    Pagination field use `bg-content1` + `shadow-kun-sm` (same fill as a card, lifted
    by a small shadow). The error state is a danger **ring**, not a border.
  - **Floating panels lose their border** and rely on shadow + the `content1`
    surface: Dropdown, Select/Autocomplete lists, ContextMenu, Popover, Tooltip,
    DatePicker calendar, Modal, Drawer.
  - **Placeholder** now uses a theme-adaptive `::placeholder` colour (the browser
    default grey didn't follow light/dark).

  Visual change only; component APIs are unchanged except `KunCard`'s `bordered`
  default (true→false) and `KunTagInput`'s `variant` default (bordered→flat).

### Patch Changes

- @kungal/ui-core@1.8.0

## 1.7.0

### Minor Changes

- 82de3b5: feat(tokens): regenerate the semantic palette in OKLCH with contrast-guaranteed on-colors

  The whole semantic color system is now **generated** (scripts/gen-tokens.mjs,
  OKLCH via culori) instead of hand-authored HSL. Each hue is defined once by its
  OKLCH hue + a vivid `solidL`; every shade is laid on a perceptual lightness ramp
  (so `-500` means the same perceived lightness for every color), and each color
  ships a paired **`--color-{c}-foreground`** on-color DERIVED by measured WCAG
  contrast. The generator asserts AA on every solid (fill, text) pair in BOTH light
  and dark and fails the build on any regression — illegible solids can't ship
  again. Adds the previously-missing `-950` shade.

  What changes visually: solids keep HeroUI-style vivid fills (bright amber warning,
  bright green success — no more muddy darkened `-600` fills), with white text on
  the medium hues (primary/danger/default) and a refined dark tint on the bright
  ones (secondary/success/warning/info). Solids are now mode-independent, so the
  per-variant `dark:bg-{c}-{n}` pins are gone. **This is a visual change** to every
  colored surface; the component API (color/variant names) is unchanged.

  `@kungal/ui-core`: `kunSolidClasses` / `kunSolidFgClasses` / `kunSolidBgClasses`
  and the Button solid/shadow rows now use `bg-{c} text-{c}-foreground`. CheckBox,
  DatePicker, Switch, Carousel drop their hardcoded white/black + dark pins.

### Patch Changes

- Updated dependencies [82de3b5]
  - @kungal/ui-core@1.7.0

## 1.6.3

### Patch Changes

- 0019f45: fix(vue): icon-only buttons now match the height of same-size text buttons

  `isIconOnly` previously only swapped the padding (`p-2.5` etc.), so an icon-only
  button collapsed to the icon's `1em` height instead of the text line-height —
  leaving it ~8px shorter than a text button of the same `size` and breaking
  alignment in a toolbar row. Icon-only buttons are now a fixed square whose side
  equals the same-size text-button height (the new `kunControlSquareClasses`),
  matching how shadcn/HeroUI/Chakra/Ant size their icon buttons. The icon stays at
  its natural `1em`, centered.

  Also pins `KunPagination`'s prev/next arrows to `size="sm"` so they line up with
  the (already `sm`) numbered page buttons — without it the now-correct default
  `md` icon button would render 4px taller than the numbers.

  - @kungal/ui-core@1.6.3

## 1.6.2

### Patch Changes

- 05f2bee: chore: ship CHANGELOG.md in the published packages

  `CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
  so downstream can read the per-version changes straight from the npm package
  page — not only from the GitHub repo. (Releases also now appear on GitHub
  Releases and the docs site's auto-generated /changelog page.)

- Updated dependencies [05f2bee]
  - @kungal/ui-core@1.6.2

## 1.6.1

### Patch Changes

- 498a9c1: fix(vue): Accordion duplicate ids + Carousel dot indicators

  Two issues found reviewing the 1.6.0 components:

  - **KunAccordion**: header/panel ARIA ids were derived from the item `value`, so
    two accordions reusing the same values (e.g. `a`/`b`) emitted duplicate ids —
    invalid HTML and a broken `aria-controls` target. Ids are now generated with
    Vue's SSR-stable `useId()`, so they're globally unique regardless of `value`.
    (`name` stays as an optional readable prefix.)
  - **KunCarousel**: with `slidesPerView > 1` the dots rendered one-per-slide, but
    the last `slidesPerView − 1` of them could never become active. Dots now map to
    reachable scroll positions (`maxIndex + 1`), so every dot works. The dots also
    switched from an incorrect `role="tab"` (with no tabpanels) to plain buttons
    with `aria-current`, and an internal computed no longer shadows the
    `showArrows` prop.
  - @kungal/ui-core@1.6.1

## 1.6.0

### Minor Changes

- 5d9ced9: feat(vue): five new components — Accordion, Carousel, Skeleton, Steps, Timeline

  Adds the components the kungal apps were repeatedly hand-rolling on top of KunUI.
  All are SSR-safe and accessible, and reuse the shared design tokens / contrast
  helpers.

  - **KunAccordion + KunAccordionItem** — collapsible sections. Single-open by
    default or `multiple`; controlled via `v-model` (string / string[]) or
    uncontrolled from `defaultValue`. `light` / `bordered` / `splitted` variants.
    The reveal uses the CSS grid `0fr → 1fr` trick — animates real height with no
    JS measurement and renders collapsed in SSR HTML (no hydration flash). Proper
    `aria-expanded` / `aria-controls`, and the closed panel is `inert`.
  - **KunCarousel + KunCarouselItem** — horizontal slider on native CSS
    scroll-snap, so touch swipe + momentum work with zero JS and it renders
    server-side. Prev/next arrows, dot indicators (read from scroll position) and
    optional `autoplay` are progressive enhancements; autoplay pauses on
    hover/focus and is off under reduced-motion. `slidesPerView` for thumbnail
    strips.
  - **KunSkeleton** — content loading placeholder (`text` / `rect` / `circle`),
    `loaded` swaps in the real content via the default slot, pulse respects
    reduced-motion.
  - **KunSteps** — multi-step indicator (`items` + `current`), horizontal /
    vertical, done / active / pending states, contrast-correct filled markers.
  - **KunTimeline + KunTimelineItem** — vertical timeline with coloured dots or
    icon medallions; the connecting line is pure CSS.

### Patch Changes

- @kungal/ui-core@1.6.0

## 1.5.0

### Patch Changes

- 13005ea: fix(vue): legible foreground on solid/filled color variants (esp. dark mode)

  Solid fills painted white text on `bg-{color}`, which has two problems verified
  by contrast measurement:

  1. The dark color scale is inverted, so a plain `bg-{color}` renders **pale** in
     dark mode — white text dropped to ~1.0–2.5:1 (the `solid` Info `info` callout
     was essentially invisible, white on near-white).
  2. The light hues (secondary / success / warning / info) are light in **both**
     modes, so white text fails WCAG everywhere (~2:1), not just in dark mode.

  New single source of truth in `@kungal/ui-core` — `kunSolidClasses`,
  `kunSolidBgClasses`, `kunSolidFgClasses` — pairs each fill with a `dark:bg-*`
  pin (stays saturated in dark mode) and a contrast-correct foreground: the dark
  hues (default / primary / danger) keep white, the light hues take dark text.
  Every solid foreground now clears WCAG AA in both modes (≈4.1–10.3:1).

  Applied to: Button / Chip (shared variant matrix), Info (`solid` / `shadow` — the
  reported bug; its title no longer overrides the box foreground), Badge, Progress
  (on-bar label), Tab (`solid` / `pills`), DatePicker (selected day), CheckBox
  (checked fill + check/dash mark), Switch (on-track).

  Visible change: `secondary` / `success` / `warning` / `info` solid components now
  use dark text instead of (illegible) white.

- Updated dependencies [13005ea]
  - @kungal/ui-core@1.5.0

## 1.4.2

### Patch Changes

- 6d70e87: fix(vue): keep `bordered` variants the same size as the others (Info, TagInput)

  A `bordered` variant adds a real border, which enlarges the element unless the
  other variants reserve the same width with a transparent border. Button / Chip
  (via the shared variant matrix) and Tab already did this; Info and TagInput did
  not, so their `bordered` variant was ~2–3px larger than `solid` / `light` /
  `flat`.

  - **Info**: every variant now carries the same `1.5px` border (transparent for
    the non-bordered ones), so switching variants no longer changes the box size.
  - **TagInput**: the wrapper always reserves a `1px` transparent border; `flat`
    and `bordered` are now identical in size, and the error border is now visible
    on the `flat` variant too (it previously had no border width to colour).

  No visual change to the non-bordered variants beyond the size becoming
  consistent — the reserved border is transparent.

  - @kungal/ui-core@1.4.2

## 1.4.1

### Patch Changes

- 0752bc1: fix(vue): SSR-safe active highlight for KunTab

  The Tab active indicator was measured on the client (`offsetLeft`/`offsetWidth`)
  and so was absent from server-rendered HTML — on first paint (and the whole
  pre-hydration window) the selected tab showed only a text-color change, with the
  underline/pill missing. For the `solid` variant the active tab was effectively
  invisible (white text on no background) until hydration.

  The selected tab now carries a CSS-only active highlight that renders in SSR
  (inline inset box-shadow for `underlined`; background tint for `solid` / `light`);
  the JS-measured sliding indicator takes over after the client mounts, with no
  hydration mismatch. The indicator is also re-measured on mount and via a
  `ResizeObserver`, so web-font swaps and container resizes no longer leave it
  stale. `pills` / `bordered` were already SSR-safe and are unchanged.

  - @kungal/ui-core@1.4.1

## 1.4.0

### Minor Changes

- cf9196c: **KunContent: opt-in editorial prose typography + first-class code-copy & compact density.**

  - **New opt-in stylesheet `@kungal/ui-vue/prose.css`** — a token-driven editorial type system for any `.kun-prose` container (comfortable measure, modular heading scale, generous CJK-friendly leading, refined lists/blockquote/code/table/links, auto light/dark). It is a _separate import on purpose_: KunContent's `style.css` still ships only behaviour, so downstreams that already own their own `.kun-prose` typography are unaffected — they simply don't import it.
  - **Code-block copy button is now built in.** KunContent auto-injects a self-styled (token-aware, dark-mode-aware) copy button into each code block, with click-to-copy + instant icon feedback. Idempotent: a block that already carries a `.copy` button (e.g. one emitted by a Markdown pipeline) is left untouched, so it never doubles up — downstreams can drop their own copy implementations.
  - **New `compact` prop** on KunContent (adds `.kun-prose-compact`) for tighter comment/reply streams — smaller base size, leading and spacing, full-width instead of the 40rem measure. Visual effect requires importing `@kungal/ui-vue/prose.css`.

  Syntax highlighting remains a content-pipeline concern (not bundled); the prose styles theme plain code blocks neutrally and compose with pre-highlighted markup.

### Patch Changes

- @kungal/ui-core@1.4.0

## 1.3.0

### Minor Changes

- 27e40d4: **Content spoilers**: the particle mask now follows the real text shape. Multi-line spoilers are masked **line-by-line**, and space-separated text is masked **word-by-word** (gaps at spaces and ragged line ends stay clear) instead of one solid block — the cover lines up with how the text actually flows. CJK / no-space text degrades naturally to per-line masking.

  Word/line rectangles are measured once per layout via the Range API (never per frame), and the per-frame cost stays capped (the particle budget and tint fills are independent of text length), so animation never janks regardless of size. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"`).

### Patch Changes

- @kungal/ui-core@1.3.0

## 1.2.0

### Minor Changes

- 8368cfe: **Content spoilers**: reworked the click-to-reveal spoiler effect. The covered region now renders an animated dust/particle field (spawn → drift → fade → respawn) instead of a flat frosted block, and revealing dissolves the particles out as the text appears. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"` in trusted HTML).

  Under the hood it's now SSR-safe by construction (the cover is pure CSS present in the server-rendered HTML — no post-mount DOM injection, no hydration flash, and the secret stays hidden with JS disabled), the particle canvas is a pure client-side enhancement driven by one shared, fps-throttled rAF loop with off-screen spoilers paused via IntersectionObserver, and spoilers are now keyboard-accessible (`role="button"`, focusable, Enter/Space to reveal, `aria-expanded`). Respects `prefers-reduced-motion`. The cover is rectangular (no rounded corners) so it lines up with the browser's text-selection highlight.

### Patch Changes

- @kungal/ui-core@1.2.0

## 1.1.1

### Patch Changes

- c6d7502: **Select / Autocomplete**: fix the page jumping to the top the first time the dropdown is opened while scrolled down. The teleported list is momentarily at `(0,0)` before floating-ui's first async measurement, so `Element.scrollIntoView()` (and a plain `focus()` on the search field) scrolled the whole window to the top. The active option now scrolls **within its own list container** only, and Select's search-field focus uses `{ preventScroll: true }`.
  - @kungal/ui-core@1.1.1

## 1.1.0

### Minor Changes

- eaf375b: **Lightbox**: clicking the dark backdrop around the image now closes the viewer, matching the convention of every modern image viewer (and complementing the existing ESC-to-close). Clicks on the image and on the controls are unaffected, and a click that is the tail of a drag / pan / swipe no longer dismisses the viewer.

### Patch Changes

- @kungal/ui-core@1.1.0

## 1.0.0

### Major Changes

- ac0bd4e: 1.0.0 — first stable release.

  The component set (57 Vue components) and the design-token system are stable and
  documented. Over the 0.14 → 0.22 line every cross-cutting surface was routed
  through a single source of truth: borders (`--color-kun-border` / `border-kun`),
  focus rings (`kunFocusRingClasses`), corner radius (`rounded-kun-*` /
  `--kun-radius-scale`), elevation (`--shadow-kun-*`), motion (`--kun-dur-*` +
  `duration-kun-*` + `ease-kun-*`), and sizing (`kunControlSize` /
  `kunSelectionSize` / `kunChipSize`).

  Also fixes a registration gap surfaced while completing the docs: `KunAutocomplete`,
  `KunNumberInput`, and `KunPinInput` (added in 0.14.0) were never added to the Nuxt
  layer's auto-import list, so Nuxt consumers hit "Failed to resolve component". They
  now auto-import like every other component (plain-Vue `app.use(KunUI)` already
  registered them). Their docs pages, prop tables, and `llms.txt` entries are added.

### Patch Changes

- Updated dependencies [ac0bd4e]
  - @kungal/ui-core@1.0.0

## 0.22.4

### Patch Changes

- 157c04f: fix(vue): single-line audit follow-ups (menu items, UserChip, Tooltip)

  After a full sweep for which components carry a single-unit label vs. flowing
  prose:

  - **`KunDropdown` / `KunContextMenu`** menu-item labels now `truncate` (single
    line + ellipsis when the menu is width-constrained) with `shrink-0` icons,
    instead of wrapping to two lines.
  - **`KunUserChip`** name and description now `truncate` (the text column gets
    `min-w-0`) — a long name ellipsizes on one line rather than wrapping past the
    avatar.
  - **`KunTooltip`** dropped its unconditional `whitespace-nowrap` for `max-w-xs`:
    short tips still sit on one line, but a long tip now wraps inside ~20rem
    instead of being forced into one screen-wide line.

  Prose components (Card / Modal / Alert / toast bodies, checkbox/radio/switch
  labels, helper & error text) intentionally keep wrapping.

  - @kungal/ui-core@0.22.4

## 0.22.3

### Patch Changes

- 0305c8d: fix(vue): keep button / chip / badge / tag labels on a single line

  A label on these atomic components is one action/marker, not flowing prose, so it
  shouldn't wrap to a second line (the modern standard — shadcn's button ships
  `whitespace-nowrap`, Material's spec keeps the label single-line). Added
  `whitespace-nowrap` to `KunButton`, `KunChip`, `KunBadge`, and the tags inside
  `KunTagInput` (KunTab already had it). `KunButton` also gets `[&_svg]:shrink-0`
  (plus `shrink-0` on its icon slots) so a long label never squishes the icons —
  the label overflows on one line instead of wrapping.

  - @kungal/ui-core@0.22.3

## 0.22.2

### Patch Changes

- Updated dependencies [957cb52]
  - @kungal/ui-core@0.22.2

## 0.22.1

### Patch Changes

- Updated dependencies [be17775]
  - @kungal/ui-core@0.22.1

## 0.22.0

### Minor Changes

- 2026df2: feat(vue): every text control's focus ring follows its `color` prop (default `default`)

  The focus-ring color was inconsistent across the form family: some controls tied
  it to their `color` prop (Input/NumberInput/CheckBox), others hardcoded a primary
  ring (Textarea/Select/Autocomplete/DatePicker/Pagination), and even among the
  first group the default differed (Input defaulted `color: 'default'` → grey ring;
  NumberInput defaulted `color: 'primary'` → blue ring). So an Input and a Textarea
  side by side focused in different colors.

  Now uniform: every text control's focus ring routes through its `color` prop, and
  they all default to **`'default'`** (a neutral grey ring) — `color="primary"` (etc.)
  themes it. `color="success"`/`"danger"`/… give that ring; an invalid control still
  overrides to a danger ring.

  - **New `color?: KunUIColor` prop** on `KunTextarea`, `KunSelect`,
    `KunAutocomplete`, `KunDatePicker` (default `'default'`).
  - **`KunNumberInput` default `color` changed `'primary'` → `'default'`** so an
    un-themed number input matches the rest (grey ring, was blue).
  - `KunPagination`'s jump input uses the neutral ring.

  Also: **`KunCard` footer no longer draws a top border** — it's just a section
  spaced by the card's own gap, matching the (already borderless) header.

### Patch Changes

- @kungal/ui-core@0.22.0

## 0.21.0

### Minor Changes

- 3e841f0: feat: align form labels / error text and unify the chip-tag size scale

  The core size system was already consistent (form controls share
  `kunControlSizeClasses`, checkbox/radio share `kunSelectionSizeClasses`). The
  drift was in the peripheral bits:

  - **Form labels** now identical everywhere: `KunTextarea` and `KunDatePicker`
    labels gained the `text-default-700` tint, and `KunDatePicker` dropped its odd
    `mb-2` for the standard `mb-1`.
  - **Error messages** now identical: `KunTextarea` switched from `text-danger-600`
    (and a `<div>`) to the standard `text-danger` `<p>`; `KunDatePicker` and
    `KunRadioGroup` dropped `mt-2` for `mt-1`.
  - **Chip / tag size**: new `kunChipSizeClasses` in `@kungal/ui-core` is the single
    source for chip/tag pills. `KunChip` and the tags inside `KunTagInput` now share
    it (and the pill `rounded-full` shape), so a tag looks identical to a standalone
    `<KunChip>` of the same size instead of being a one-off smaller rounded-rect.

  Tab keeps its intentionally-compact tab scale; Switch/Slider keep their
  dimension-specific scales.

### Patch Changes

- Updated dependencies [3e841f0]
  - @kungal/ui-core@0.21.0

## 0.20.0

### Minor Changes

- 40e8abf: feat: unified elevation scale + misc token cleanups

  **Elevation scale** — floating surfaces were assigned `shadow-md` / `shadow-lg` /
  `shadow-2xl` ad hoc, so same-kind surfaces disagreed (Select & Autocomplete
  option lists were `shadow-lg`, but Dropdown & ContextMenu menus were `shadow-2xl`;
  Modal had no shadow at all). New three-tier scale in `@kungal/ui-tokens` —
  `--shadow-kun-sm` / `-md` / `-lg`, generating `shadow-kun-sm|md|lg` utilities
  (they compose with `ring-*` via `--tw-shadow`, so a ringed toast still gets its
  elevation). Applied by tier:

  - **sm** — tooltips, slider value bubble
  - **md** — popovers, dropdowns, context menus, select/autocomplete/date lists, toasts
  - **lg** — modals (now actually elevated), drawers

  **Misc consistency cleanups:**

  - Raw Tailwind radii routed through the token scale: `KunBrand` / `KunNull`
    `rounded-2xl` → `rounded-kun-lg`; `KunLoading` `rounded-lg` → `rounded-kun-md`
    (so `--kun-radius-scale` now affects them too). The dark `KunLightbox` viewer
    chrome keeps its own radii intentionally.
  - `KunNumberInput` stepper buttons: `disabled:opacity-40` → `disabled:opacity-50`
    to match every other disabled control.

- 40e8abf: feat: route component transitions through the motion scale

  Transitions hardcoded raw `duration-150/200/300` and raw `ease-in/out/in-out`
  that didn't match the designed motion tokens (overlay enters were `200ms` but
  `--kun-dur-base` is `250ms`; some controls used symmetric `ease-in-out` while the
  rest used the asymmetric `ease-kun-*` curves). Now unified:

  - New `duration-kun-fast | base | slow | exit` utilities bound to `--kun-dur-*`
    (with literal fallbacks). Every component transition routes through them, so a
    global motion retune via the tokens actually propagates.
  - Mapped by role, preserving the asymmetric rhythm (enter decelerates, exit
    accelerates): overlay **enter → base**, **leave → exit**, hover/selection/focus
    **micro → fast**, skeleton/fade/large **→ slow**.
  - Remaining raw `ease-in-out` / `ease-out` Tailwind classes (Avatar, Input,
    Textarea, Progress) switched to `ease-kun-standard` / `ease-kun-out`; scoped-style
    easings (Content, Ripple) now read `var(--ease-kun-*)`. The looping indeterminate
    progress keyframe and the dark Lightbox viewer keep their own timing.

  Net effect: a single, consistent motion feel across every control. No API changes.

### Patch Changes

- @kungal/ui-core@0.20.0

## 0.19.1

### Patch Changes

- 3a67606: fix(vue): Card header/footer, Tab item radius, Message elevation

  - **KunCard** — the header slot no longer draws a `border-b`. The footer dropped
    its `bg-default-100` fill + double padding for a single hairline divider in the
    unified `border-kun` token (`-mt-3` pulls it flush under the content), so it
    matches the rest of the UI instead of looking like a grey block.
  - **KunTab** — `solid` / `light` / `bordered` tab items were `rounded-kun-sm`
    (6px), half the radius of every other control. Items (and their sliding
    indicator) are now `rounded-kun-md` (12px, the default control radius) and the
    list container is `rounded-kun-lg` (16px), so the items nest concentrically and
    match the overall corner radius.
  - **KunMessage** (toast) — added `shadow-lg` (and a `dark:ring-white/10` edge) so
    toasts read as elevated/floating above the page instead of sitting flat with
    only a faint hairline ring.
  - @kungal/ui-core@0.19.1

## 0.19.0

### Minor Changes

- d8e7e76: feat: KunTab `align` prop + one unified focus ring across every control

  **KunTab `align`** — new `align?: 'start' | 'center' | 'end'` (default `'center'`)
  controls how each tab's content sits inside its box. Mainly for vertical /
  full-width tabs, where the box is wider than its label.

  **Unified focus ring** — focus indication was a mess: `:focus` vs `:focus-within`
  vs `:focus-visible`, ring widths `1`/`2`/`4`, opacities `/25`/`/40`/`/50`/full,
  some controls dropped their border to fake a ring (a jarring jump), and Button /
  CheckBox had **no** focus ring at all. Everything now routes through one recipe:

  - New `kunFocusRingClasses` (direct controls) and `kunFocusRingWithinClasses`
    (composite wrappers) in `@kungal/ui-core`. One recipe: keyboard-only
    (`focus-visible`; text fields still show it on click), a flush **2px** ring in
    the control's semantic color at **/50**, no border-transparent jump.
  - Migrated Input, Textarea, Select, Autocomplete, NumberInput, DatePicker,
    PinInput, TagInput, Pagination, RadioGroup, **Button** (offset ring, added) and
    **CheckBox** (added) onto it. Composite widgets (NumberInput / TagInput) ring
    the wrapper via `focus-within` and the inner `<input>` has no ring of its own,
    so there's exactly one indicator.
  - Invalid controls turn the ring **danger** (same mechanism, swapped color).
  - **Deprecated:** `kunRingClasses` (mixed `:focus`/`:focus-within`, off-opacity).
    Use `kunFocusRingClasses` / `kunFocusRingWithinClasses`.

  No prop/API removals — purely additive plus a visual refinement of focus states.

### Patch Changes

- Updated dependencies [d8e7e76]
  - @kungal/ui-core@0.19.0

## 0.18.1

### Patch Changes

- 1016e80: fix(vue): Tab underlined track line, FadeCard not animating, Pagination layout

  - **KunTab** `variant="underlined"` no longer draws a static full-length track
    border — only the sliding active indicator remains.
  - **KunFadeCard** now actually animates. Its `<Transition>` previously wrapped an
    always-present `<div>`, so a `v-if` on the _slotted_ element (the documented
    `<KunFadeCard><Foo v-if="show"/></KunFadeCard>` usage) never triggered
    enter/leave. The `v-if` now lives on the Transition's direct child, driven by
    whether the slot has real content, so toggling collapses/expands (grid
    `0fr↔1fr`) and fades as intended.
  - **KunPagination** `justify-between` is now effective: the page block and the
    jump-to-page block sat under conflicting `mx-auto` margins (auto margins beat
    `justify-content` in flexbox), which spread them oddly. Removed, so the page
    controls sit at the start and the jump control at the end.
  - @kungal/ui-core@0.18.1

## 0.18.0

### Minor Changes

- 6fa75bb: feat(tokens,vue): unified neutral border token (`--color-kun-border` / `border-kun`)

  Every structural hairline (inputs, textareas, selects, autocomplete, date picker,
  cards, dividers, tabs, tooltips, popovers, dropdowns, context menus, drawers,
  pagination, slider tooltip, radio cards, tag input) now resolves to ONE semantic
  token instead of a scatter of `border-default-200` / `border-default/20` /
  `dark:border-default-200` + a per-component `darkBorder` toggle.

  - **New:** `--color-kun-border` (defaults to the `default-200` step, so it flips
    light↔dark automatically) and a `border-kun` utility. Retheme every border at
    once by overriding `--color-kun-border` (set it under `.kun-dark-mode` too for a
    fixed non-flipping value). The global `*` border-color (opinionated base layer)
    now points at this token as well, so a bare `border` matches `border-kun`.
  - **Fixed:** `KunDivider` (and any control that used the translucent
    `border-default/20` without a dark override) was ~half as bright as other
    hairlines in dark mode (L13% vs L26%); it now matches everything else (L26%).
  - **Consistency:** light mode is visually unchanged (the old `default/20`-over-white
    already ≈ `default-200`); dark mode now collapses to a single neutral border value
    across all components.
  - Interactive-control borders intentionally stay one step stronger (checkbox/radio
    boxes `default-300`, slider thumb) per common design-system practice — they are
    not structural hairlines.
  - **Deprecated (no-op):** the `darkBorder` prop on Input/Textarea/NumberInput/
    Select/Autocomplete/DatePicker/Card. Safe to remove from call sites; kept for
    backward compatibility. Note: an un-bordered `KunCard` that relied on
    `darkBorder` to show a dark-only border should now use `bordered`.

### Patch Changes

- @kungal/ui-core@0.18.0

## 0.17.2

### Patch Changes

- @kungal/ui-core@0.17.2

## 0.17.1

### Patch Changes

- 54f3498: 代码评审(CR)修复:针对 0.14–0.17 四批改动的真实项目缺陷。

  - **KunCopy / useKunCopy** —— `useKunCopy` 此前是 fire-and-forget(返回 `void`),`KunCopy` 的 `await` 立即 resolve,导致**剪贴板写入失败时也会错误地显示「已复制」**(还和它自己弹出的失败 toast 自相矛盾)。改为 `useKunCopy` 返回 `Promise<boolean>`(并兜底 `navigator.clipboard` 不存在的情况);`KunCopy` 仅在真正成功时才切到 ✓ 状态。
  - **KunMessageItem(toast)** —— `pauseTimer`/`resumeTimer` 改为幂等:`mouseenter` 与 `pointerdown` 会同时触发暂停,此前会对同一 `startTime` **重复扣减剩余时间**,使 toast 在用户悬停/触摸时提前消失(或进度条与实际计时不同步)。
  - **KunNumberInput** —— 修复无 `min`/`max` 且初始为空时,「−」按钮被错误禁用(`null ?? -∞ > -∞` 为 false)的问题;空值现在可正常从 0 起步进。
  - **KunImage** —— `fallbackSrc` 现在也响应「缓存命中即同步报错」路径(`status==='error'`),此前这种情况下回退图永远不会加载。
  - **KunContextMenu** —— `immediate` watcher 在 SSR 且 `visible=true` 时不再访问 `document`(加 typeof 守卫),避免 `renderToString` 崩溃。
  - **KunMessageProvider** —— toast 容器标记 `data-kun-overlay`,使其在 Modal/Drawer 打开(背景 inert)时仍可交互(关闭按钮/滑动可用)。
  - **KunPinInput** —— `length` 减小时截断内部 refs 数组,避免保留已卸载 `<input>` 的引用。
  - @kungal/ui-core@0.17.1

## 0.17.0

### Minor Changes

- 59479bc: 导航 / 展示 / 排版第四批升级:修零散 a11y/安全缺陷,补 Chip/Copy 能力。

  修正(a11y / 安全)

  - **KunScrollShadow** —— `aria-label` 此前误用了 `className`(把 CSS 类当可访问名,读屏会念出 "mt-4 flex…");新增独立 `ariaLabel` prop(默认 'scrollable content')。
  - **KunLink / KunButton** —— `target="_blank"` 现在自动补 `rel="noopener noreferrer"`(tabnabbing 防护)。
  - **KunAvatarGroup** —— "+N" 溢出现在从 `users.length` 推导(不传 `total` 也能显示);按 `user.id` 作 key;加 `role="group"` + 计数 `aria-label`。
  - **KunDivider** —— 竖向加 `aria-orientation="vertical"`;`withLabel` 标记为弃用(label 由默认插槽是否有内容决定)。
  - **KunMarkdown** —— 装饰 SVG 加 `aria-hidden`。

  升级

  - **KunChip** —— 新增 `closable`(× 触发 `close`,可移除标签)、`disabled`,以及 `start` / `end` 插槽(圆点/头像/图标)。
  - **KunCopy** —— 复制后短暂反馈:图标切到 ✓、文案切到 `copiedText`(默认 '已复制')、`aria-live` 播报,~1.5s 复位。
  - **KunImage** —— 新增 `fallbackSrc`(图裂时回退,`src` 变化时重置)。
  - **KunAvatar** —— 头像 URL 裂图时回退到确定性 sticker。
  - **KunPagination** —— 提供 `pageHref` 时,上一页/下一页也渲染为可爬 `<a>`(与数字页一致)。

  Behavior(0.x minor)

  - `KunScrollShadow` 的可访问名不再等于 `className`,改为 `ariaLabel`(默认 'scrollable content')。

### Patch Changes

- @kungal/ui-core@0.17.0

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
