---
'@kungal/ui-vue': minor
---

KunSelect 补齐异步多选与筛选栏形态，KunDatePicker 新增 `precision`（日 / 月 / 年）

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
