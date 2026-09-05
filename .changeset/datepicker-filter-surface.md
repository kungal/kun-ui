---
'@kungal/ui-vue': minor
---

KunDatePicker 补齐筛选栏外观面，并修好 `mode="range"` 中途状态看不见的问题；KunTagInput 加 `classNames`

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
