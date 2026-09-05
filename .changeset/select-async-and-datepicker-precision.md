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
- `classNames: { root, trigger, popup, list, option, chip }` —— 逐部位 class 钩子，合并在组件自身 class 之后（`cn()` 里后写的赢）。antd 5.25 正是用 `classNames` 收敛掉了 `dropdownClassName`/`popupClassName` 这类一次性 prop。

**没有加 `variant: 'field' | 'pill'`。** 没有任何一家把胶囊做成 select 的 variant：shadcn 的 faceted filter 是 Popover + Command + `border-dashed` Button 的组合式 recipe，Material 把 `filter-chip` 做成独立组件，antd 的 `variant` 只有 `outlined | borderless | filled | underlined`。而且 `KunUIVariant` 全库已经是 `solid | bordered | light | flat | shadow`，再来一个同名不同义的枚举只会坑掉调用点。胶囊靠 `rounded="full"` + `size="sm"` + `classNames.trigger` 拼，文档里有完整示例（`FilterBar.vue`）。

### 顺手修掉的一个真 bug

远程源每次查询都会换掉 `options`，此前会把 chip 一起换掉：搜 "fate" 选中，再搜 "clannad"，选中的值还在 model 里，trigger 上的 chip 却因为在 `options` 里找不到而消失。现在为**当前选中的值**保留最后一次见到的 option（Element Plus 的 `cachedOptions` 同理），缓存不会长过选中项本身。单选同样受益。

### 行为变化（很小，但请知悉）

多选 chip 现在按 **model 顺序**渲染，而不是 `options` 顺序。`name` 生成的隐藏 input 本来就是按 model 顺序的，两者此前会不一致。

## KunDatePicker 新增 `precision`

`precision?: 'day' | 'month' | 'year'`（默认 `'day'`，行为不变），**与 `mode` 正交** —— `mode="range"` + `precision="year"` 就是年份区间。刻意没学 Element Plus 把粒度和区间揉成 `daterange`/`monthrange` 一个枚举，那会让每加一个粒度就乘一遍模式。先例：antd `picker`、MUI X `views`、HeroUI v3 甚至有独立的 `calendar-year-picker`。

- 面板按 `precision` 打开对应网格；标题是按钮，可以向外缩放 日 → 月 → 年，在比 `precision` 粗的视图里点击是**下钻**而不是提交值。
- 月 / 年网格都是 3 列；年视图一页 12 格（十年 + 前后各一格，和日网格的相邻月格子同一个道理）。
- 单箭头按当前视图向外一级翻页（日视图翻月、月视图翻年、年视图翻十年），`aria-label` 说的是**这一步走多远**而不是当前视图名；双箭头只在日视图存在。
- `format` / `valueFormat` / `placeholder` 的默认值现在跟着 `precision` 走：`'yyyy-MM-dd'` / `'yyyy-MM'` / `'yyyy'`。三者都是合法 ISO 8601，`parseISO` 会读回该周期的本地零点，能原样往返。显式传入照旧优先。
- `minDate` / `maxDate` / `isDateDisabled` 在粗粒度下按**整个周期**判定：`minDate` 为 2026-06-15 时六月**可选**（否则会连带禁掉半个月），`isDateDisabled` 收到的是该周期的第一刻（当天 / 当月 1 号 / 1 月 1 日）。
- 键盘：左右 ±1 格，上下 ±3 格（3 列网格），Enter 提交当前格。

### 顺带修掉的旧问题

面板此前只在 setup 时锚定一次 `viewingDate`，所以外部改了 model、或者翻页后没选就关掉，再打开还停在旧的一页。现在每次打开都重新锚定到当前值 —— 在年粒度下这个问题会直接表现为"打开时停在另一个十年"。

## 文档

- KunSelect 新增「异步 / 远程数据源」「筛选栏形态」两个示例，KunDatePicker 新增「选择粒度」示例。
- 生成器修正：`withDefaults(x: undefined)` 表示"没有默认值"，不该盖过 JSDoc 的 `@default` 标签。修掉之后 63 个原本在属性表里显示成 `undefined` 的 prop 变回 `—`，另有若干条件默认值第一次正确显示出来。
