---
'@kungal/ui-core': minor
'@kungal/ui-vue': minor
---

`cn()` 现在认识 KunUI 自己的 Tailwind 比例尺；KunAutocomplete 补回输入法保护；组件文档补上事件与插槽

上一次发布后做了一轮更严格的复测，这次修的是那轮报告里"根因还在"的部分。

## `cn()`：把 KunUI 的比例尺教给 tailwind-merge

tailwind-merge 只认识 Tailwind 自己的比例尺，凡是它解析不了的类都原样放行、也就永远不会参与冲突消解。KunUI 在 `@theme` / `@utility` 里自己铸的那一批全都在这个盲区里：

```ts
cn('rounded-kun-md', 'rounded-full')  // 旧：两个类都留下，谁赢由 CSS 源码顺序决定
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
