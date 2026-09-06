# @kungal/ui-core

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

## 2.28.0

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

## 2.26.3

## 2.26.2

## 2.26.1

## 2.26.0

## 2.25.1

## 2.25.0

## 2.24.0

## 2.23.0

## 2.22.0

## 2.21.0

## 2.20.0

## 2.19.1

## 2.19.0

## 2.18.2

## 2.18.1

## 2.18.0

## 2.17.0

## 2.16.0

## 2.15.1

## 2.15.0

## 2.14.1

## 2.14.0

## 2.13.1

## 2.13.0

## 2.12.2

## 2.12.1

## 2.12.0

## 2.11.0

## 2.10.0

## 2.9.1

## 2.9.0

## 2.8.3

## 2.8.2

## 2.8.1

## 2.8.0

## 2.7.1

## 2.7.0

## 2.6.0

## 2.5.0

## 2.4.0

## 2.3.1

## 2.3.0

## 2.2.0

## 2.1.1

## 2.1.0

## 2.0.1

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

## 1.14.2

## 1.14.1

## 1.14.0

## 1.13.0

## 1.12.1

## 1.12.0

## 1.11.0

## 1.10.1

## 1.10.0

## 1.9.5

## 1.9.4

## 1.9.3

## 1.9.2

## 1.9.1

## 1.9.0

## 1.8.3

## 1.8.2

## 1.8.1

## 1.8.0

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

## 1.6.3

## 1.6.2

### Patch Changes

- 05f2bee: chore: ship CHANGELOG.md in the published packages

  `CHANGELOG.md` is now included in each package's npm tarball (added to `files`),
  so downstream can read the per-version changes straight from the npm package
  page — not only from the GitHub repo. (Releases also now appear on GitHub
  Releases and the docs site's auto-generated /changelog page.)

## 1.6.1

## 1.6.0

## 1.5.0

### Minor Changes

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

## 1.4.2

## 1.4.1

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.1

## 1.1.0

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

## 0.22.4

## 0.22.3

## 0.22.2

### Patch Changes

- 957cb52: fix(core): `shadow` button variant now actually casts its colored glow

  The `shadow` variant set a shadow _color_ (`shadow-{color}/40`) but never a shadow
  _size_, so `--tw-shadow` stayed empty and the button rendered with `box-shadow:
none` — it looked identical to `solid`. Added `shadow-lg` to every entry so the
  geometry exists and the tint applies: each shadow button now floats with a soft
  diffuse glow in its own color (the button's `overflow-hidden` doesn't clip an
  outset box-shadow, so it shows in both themes).

## 0.22.1

### Patch Changes

- be17775: fix(core): consistent dark-mode fill for solid / shadow buttons

  Filled (`solid` / `shadow`) buttons keep white text in both themes, but the dark
  color scale is inverted — `bg-{color}` (a `-500`/`-600` step) renders _light_ in
  dark mode, so the fills came out pale and at wildly different levels: `info`
  ≈ L88% (near-white, white text barely legible), `default` ≈ L65%, `secondary`
  ≈ L72%, and `success` disagreed between the two variants (solid pinned
  `dark:bg-success-300` ≈ L35% while shadow used the un-pinned `bg-success-600`
  ≈ L66%).

  Each color now pins a `dark:bg-{color}-{n}` so every solid/shadow button lands at
  a consistent ~L44–55% in dark mode (info/success/default → ~L44–46, the rest
  ~L47–55) — one saturated tier with legible white text. Light mode is unchanged.

## 0.22.0

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

## 0.20.0

## 0.19.1

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

## 0.18.1

## 0.18.0

## 0.17.2

## 0.17.1

## 0.17.0

## 0.16.0

## 0.15.0

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

## 0.13.0

## 0.12.0

## 0.11.0

## 0.10.0

## 0.9.0

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

## 0.6.2

## 0.6.1

## 0.6.0

## 0.5.2

## 0.5.1

## 0.5.0

## 0.4.1

## 0.4.0

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

## 0.3.0

### Minor Changes

- 9b8cbae: Remove the `faded` variant.

  `faded` (tinted fill + border) was visually almost indistinguishable from
  `ghost`, so it's been dropped from `KunUIVariant`. This affects every variant
  consumer — `KunButton`, `KunChip`, `KunDropdown` and `KunInfo`.

  **Migration:** replace `variant="faded"` with `variant="flat"` (tinted fill, no
  border) or `variant="bordered"` (visible colored border); `ghost` stays for the
  outline look it overlapped with.

## 0.2.5

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

## 0.2.3

## 0.2.2

## 0.2.1

## 0.2.0

### Minor Changes

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
