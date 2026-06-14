# KunUI 升级指南:0.5.2 → 0.17.1

面向仍停留在 **0.5.2** 的下游(如 moyu),一次性升到当前最新 **0.17.1**。四个包(`@kungal/ui-core` / `ui-tokens` / `ui-vue` / `ui-nuxt`)始终**锁步同版本**,必须一起升。

```bash
pnpm up "@kungal/*@latest"   # → 0.17.1
```

跨度很大(0.6.0 → 0.17.1 共十余个版本),但绝大多数变更**向后兼容**:新增 props 都有默认值,不传则行为不变。本篇只列**需要你处理或注意**的部分,按「⚠️ 必须处理 → 🧹 可清理 → 🎨 要回归 → ✨ 可选采用」组织。

> **最重要的一步**是 [§6 集成注意](#6-集成注意必读) —— 跨这么多版本,Tailwind `@source` / reduced-motion / inert 这几点不处理会出问题。
>
> 快速地图见文末 [§8 版本流水对照](#8-版本流水对照)。

---

## 1. ⚠️ 破坏性变更(必须处理)

| # | 变更 | 版本 | 迁移 |
|---|---|---|---|
| 1.1 | **`KunFavicon` 组件删除** | 0.6.0 | 一段写死的 logo SVG,无价值。用过的话改成自己的 `<img>` / logo SVG,或 `KunBrand` 的 `iconSrc`。 |
| 1.2 | **两处 DOM 结构变化**(只影响按标签/层级选的 CSS) | 0.10.0 / 0.12.0 | `KunFadeCard` 内容现包在一层 grid 容器里(选直接子元素的改选内层);`KunBrand` / 带导航的 `KunAvatar` / `KunUserChip` 从 `<div>` 变真 `<a>`(按 `div` 选样式的改成 `a`)。 |
| 1.3 | **`KunSlider` 默认 `min`/`max` 17–77 → 0–100** | 0.14.0 | 清掉 galgame 残留默认。依赖旧默认值的调用**显式传** `:min`/`:max`。 |
| 1.4 | **`KunSelect` v-model 类型放宽为 `T \| T[] \| null`** | 0.14.0 | 支持 `multiple` 与清除。单选用法**运行时不受影响**,仅 TS 类型变宽。 |
| 1.5 | **`KunPopover` 触发器包裹层不再是 `role="button"`** | 0.15.0 | 修「button 套 button」+ 假标签。请传**可聚焦**触发器(`<KunButton>` 不受影响);纯图标/文本触发器自行加 `tabindex="0"`。 |
| 1.6 | **`KunModal` 面板默认带 `max-w-md` 宽度上限** | 0.15.0 | 此前无上限。需要更宽:`size="lg"\|"xl"\|"full"`。 |
| 1.7 | **`AlertProvider` 按钮配色对调** | 0.16.0 | 取消=中性、确定=主色(此前取消是红色,与惯例相反)。想要红色确认用 `type:'danger'`。 |
| 1.8 | **`KunScrollShadow` 可访问名不再等于 `className`** | 0.17.0 | 此前是 bug(把 CSS 类当 aria-label)。改用新 `ariaLabel`(默认 'scrollable content')。 |

---

## 2. 🧹 可以顺手清理 / 迁移(不急,旧写法仍可用)

- **删 `public/alert/*.webp`(0.6.1)**:`KunLoli` 弹窗的吉祥物图已**内联**(base64),不再依赖 `/alert/{name}.webp`。
- **撤掉 CheckBox slot 的手动间距(0.6.2)**:方框与 slot 内容之间现在有统一 8px gap;之前加的 `ml-1.5` 之类兜底要**撤掉**(否则叠加变宽)。
- **`helperText` / `hint` → `description`(0.14.0)**:辅助文案已统一为 `description`;旧名(Input/TagInput 的 `helperText`、Textarea/FileInput/Upload 的 `hint`)保留为**弃用别名**,逐步替换即可。
- **`KunDivider` 的 `withLabel`(0.17.0)**:一直是 no-op(label 由默认插槽决定),可删。
- **自写的图片裂图兜底(0.17.0)**:`KunAvatar` 裂图自动回退确定性 sticker,`KunImage` 新增 `fallbackSrc`;自写的 `onError` 换图逻辑可移除。

---

## 3. 🎨 视觉 / 行为变化(升级后做一次回归)

不改 API,但外观/交互会变:

| 变化 | 版本 | 说明 |
|---|---|---|
| **默认圆角整体变大** | 0.9.0 | `--radius-kun-*`:`sm 4→6` / **`md 8→12`(全局默认)** / `lg 12→16`。想全局回调:`--kun-radius-scale` < 1。 |
| **CheckBox 方框** | 0.8/0.9 | 20px→**16px**;圆角 `35%`(任意尺寸都是圆角方块)。 |
| **Button lg/xl 比例 / 表单内边距 / Chip 高度** | 0.7/0.8 | lg/xl 收成 2:1(**md 不变**);Select·DatePicker·Textarea `px-3→px-4` 与 Button/Input 对齐;Chip 垂直 padding 收紧。 |
| **全库动效统一** | 0.10.0 | 弹窗/下拉/抽屉/toast 统一缓动+时长、出场更快、origin-aware、消除卡顿;**自动尊重 `prefers-reduced-motion`**(需引 base 层,见 §6)。 |
| **Slider 焕新** | 0.14.0 | 默认 0–100(§1.3);新增禁用态、`marks`、悬停值气泡、`color`、`error`。 |
| **CheckBox 三态 / Modal 默认宽度** | 0.14/0.15 | `indeterminate` 显示横杠;Modal 超宽内容被 `max-w-md` 收住(§1.6)。 |
| **Toast 体验 / Progress 不定态** | 0.16.0 | error/warn 改打断式;每条 toast 悬停出现 × 关闭;每位置最多 5 条;滑动关闭。`indeterminate` 从静态满条改为真动画(横扫/旋转)。 |
| **Copy 反馈 / Chip ×** | 0.17.0 | Copy 点击后短暂切 ✓「已复制」;Chip 仅 `closable` 时出现 ×。 |
| Null / Loading 吉祥物图放大、Tab 图标间距、TagInput 配色 | 0.6.1 | 杂项视觉修正。 |

---

## 4. ✨ 新增组件

### 4.1 SEO-first Tab 内容面板(0.11.0)
`KunTab` 仍是「只有条」;新增 `KunTabPanel` / `KunTabPanels` 管内容,默认搜索引擎友好(见 §5.2)。

### 4.2 三个表单控件(0.14.0)
全部支持统一 `size` / `error` / `description` / `name`(可进原生 `<form>`):

```vue
<KunNumberInput v-model="qty" :min="0" :max="10" />          <!-- 步进/钳制/精度/role=spinbutton -->
<KunPinInput v-model="code" :length="6" @complete="verify" /><!-- OTP:自动前进/退格/粘贴分发 -->
<KunAutocomplete v-model="text" :options="cities" @select="…" /><!-- 组合框:过滤/远程建议 -->
```

---

## 5. ✨ 新增能力(可选采用)

### 5.1 统一尺寸系统(0.7.0 / 0.8.0)
所有表单/控件共享 `xs|sm|md|lg|xl`,同尺寸**一行像素级对齐**(md=38px)。`KunSelect`/`DatePicker`/`Textarea`/`CheckBox`/`Switch`/`Slider` 新增 `size`(默认 md)。`@kungal/ui-core` 导出 `kunControlSizeClasses` / `kunSelectionSizeClasses`。

### 5.2 SEO / 可爬性 / 无障碍 —— **重点**
- **圆角运行时旋钮 `--kun-radius-scale`(0.5.1)**:CSS 变量驱动全站圆角,实时无需重渲染。
- **动效 token(0.10.0)**:`ease-kun-standard/out/in/emphasized`(也是 Tailwind 工具类)+ `--kun-dur-fast/base/slow/exit`。
- **SEO-first Tab 面板(0.11.0)**:`mount="eager"`(默认)= 每个 panel 都 SSR 进 HTML、非激活用 `hidden="until-found"` 隐藏 → **全部可索引** + Ctrl+F / 文本片段深链可命中;`lazy` / `unmount` 按需。**铁律:SEO 内容永不用 `v-if` 折叠。**
- **「Tab 即路由」(0.11.0)**:`KunTabItem` 带 `href` → tab 渲染真 `<a>`(走 `config.linkComponent`)。
- **导航组件渲染真 `<a href>`(0.12.0)**:`KunBrand`、`KunPagination`(新增 `pageHref`,0.17.0 起上一/下一页也成链接)、`KunAvatar`/`KunUserChip`、`KunDropdown`/`KunContextMenu` 的 item `href`。Google 只跟随 `<a href>`。
- **a11y + SSR 正确性(0.13.0)**:`useKunUniqueId` 改同步 `useId()`(SSR label 关联在服务端 HTML 里就正确);Modal dialog 语义;图标按钮可访问名;Slider 键盘;toast live region;Tooltip 键盘+Esc;Rating/Popover `ariaLabel`。

### 5.3 表单控件能力(0.14.0)
- **KunSelect**:键盘可达性(方向键/Enter/Esc/Home/End/首字母 + `aria-activedescendant`,禁用项跳过)、`searchable`、`multiple`、`clearable`、`name`、选项 `disabled`。
- **KunInput** `isClearable`/`revealPassword`/`isInvalid`;**KunCheckBox** `indeterminate`;**KunSwitch** `error`/`description`;**KunSlider** `marks`/`showTooltip`/`showValue`/`formatValue`/`disabled`/`color`/`error`。

### 5.4 浮层 / 弹出层(0.15.0)
- **KunModal**:`size`(sm…full)/`scrollBehavior`/`placement`/`role`('dialog'|'alertdialog');打开给页面背景加 **`inert`**(Tab/读屏都进不去背景)。**KunDrawer** 同样。
- **KunPopover**:真对话框(打开移焦入面板、关闭归还触发器)+ `showArrow`。**KunTooltip** `showArrow`。**KunDropdown** 首字母 type-ahead。**KunContextMenu** 真 WAI-ARIA 菜单(键盘全套)。
- **叠加弹窗 Esc 只关栈顶**。新导出 composable:`useKunFloating`、`useKunBackgroundInert`、`useKunOverlayZIndex.isTopmost`。

### 5.5 反馈 / 状态(0.16.0)
- **useKunAlert** `confirmText`/`cancelText`/`type`('info'|'warning'|'danger')/`confirmColor`。
- **KunProgress** `ariaLabel` + 圆环 aria + 不定态动画;**KunLoading** aria + `spinner` 变体;**KunMessage** 关闭按钮/上限/滑动;**KunBadge** 独立内联 + `ariaLabel`。

### 5.6 导航 / 展示(0.17.0)
- **KunChip** `closable`(× 触发 `close`)/`disabled`/`start`/`end` 插槽;**KunCopy** `copiedText`;**KunImage** `fallbackSrc`;**KunLink/KunButton** 的 `target="_blank"` 自动补 `rel="noopener noreferrer"`;**KunAvatarGroup** 溢出从 `users.length` 推导 + `aria-label`。

### 5.7 新增打包图标(0.14.0)
`lucide:minus` / `eye` / `eye-off` / `search`(构建期内联,运行时零请求)。

### 5.8 评审修复(0.17.1,patch)
针对前四批的真实项目缺陷:`KunCopy` 剪贴板失败时不再误显示「已复制」(`useKunCopy` 现返回 `Promise<boolean>`);toast 悬停不再提前消失;`KunNumberInput` 空值+无 min 时 − 可用;`KunImage` 缓存裂图也触发 `fallbackSrc`;`KunContextMenu` SSR 守卫;toast 在 inert 背景上仍可交互。

---

## 6. 📌 集成注意(必读)

1. **Tailwind `@source` 必须同时扫 `@kungal/ui-core` 和 `@kungal/ui-vue` 的源码** —— 新尺寸/选择/动效的类字符串住在 ui-core,只扫 ui-vue 会漏样式。
   ```css
   @import 'tailwindcss';
   @import '@kungal/ui-tokens';
   @source '../node_modules/@kungal/ui-core/src';
   @source '../node_modules/@kungal/ui-vue/src';
   ```

2. **想要全局 `prefers-reduced-motion`**:它在**可选的 base 层**(`@kungal/ui-tokens/base.css`,经 `@import '@kungal/ui-tokens'` 一并引入)。只引纯 token(`/css`)则不含。

3. **背景 `inert` 现由库接管(0.15.0)**:Modal/Drawer 打开时自动给页面背景加 `inert`,并给自己的浮层根标 `data-kun-overlay`。**删掉你自写的「打开弹窗时把 `#app` 设 inert/aria-hidden」逻辑**(避免双重 inert 把弹窗自己锁住)。

4. **LCP 首图记得手动 `eager`**:`KunImage` 默认 `loading="lazy"`,库无法判断首图。首屏主图显式:`<KunImage src="…" loading="eager" fetchpriority="high" />`。

5. **圆角想整体回到偏方**:`:root { --kun-radius-scale: 0.6 }`,无需改组件。

---

## 7. ✅ 升级后自检清单

- [ ] 跑构建,确认 Tailwind 生成了新类(圆角、尺寸、`ease-kun-*`、新组件状态)——缺样式八成是 §6.1 的 `@source` 没扫 ui-core。
- [ ] 删除 `KunFavicon` 用法(§1.1);删 `public/alert/*.webp`、CheckBox `ml-1.5`、自写图片兜底、`Divider` 的 `withLabel`(§2)。
- [ ] 回归外观:圆角、表单一行对齐、CheckBox 大小、Button lg/xl、Chip 高度、Slider 默认值、Modal 宽度、确认框配色、Toast。
- [ ] **Popover 触发器**确认可聚焦(§1.5);超宽 Modal 用 `size`(§1.6)。
- [ ] Tab 折叠大量内容的:改用 `KunTabPanel`(默认 eager)或「Tab 即路由」,**别用 v-if**。
- [ ] 分页/头像/导航菜单要被收录的:传 `pageHref` / 确认渲染出 `<a href>`。
- [ ] 跑一次 Lighthouse / axe:本轮补了大量 aria/键盘/label(Select/ContextMenu/Popover 焦点、Progress/Loading/toast aria),应有明显改善。
- [ ] SSR 自检:查看源代码确认正文/内链/meta 在首响应里;禁用 JS 只靠点链接走主路径。

---

## 8. 版本流水对照

| 版本 | 主题 |
|---|---|
| **0.6.0** | ⚠️ 删除 `KunFavicon` |
| **0.6.1 / 0.6.2** | KunLoli 内联图 / Tab 图标间距 / Null·Loading 放大 / TagInput 配色;CheckBox slot 间距 |
| **0.7.0 / 0.8.0** | 尺寸系统统一 + Button lg/xl 修正 + 多组件加 `size` + Chip 收紧 |
| **0.9.0** | 默认圆角整体变大(6/12/16)+ CheckBox 圆角 35% |
| **0.10.0** | 统一动效系统(`ease-kun-*` / `--kun-dur-*` / reduced-motion / origin-aware) |
| **0.11.0** | SEO-first Tab 面板(`KunTabPanel`/`Panels`)+ Tab 即路由 |
| **0.12.0** | 可爬 `<a href>`(Brand / Pagination / Avatar·UserChip / 菜单项 `href`) |
| **0.13.0** | a11y + SSR 修复(`useId` / Modal dialog / Slider 键盘 / toast live region / Tooltip / Rating / Popover) |
| **0.14.0** | 表单批:NumberInput/PinInput/Autocomplete;Select 键盘+searchable/multiple/clearable;Slider 修复+marks;CheckBox indeterminate;Input clearable/密码;helper 统一 `description` |
| **0.15.0** | 浮层批:Popover 焦点+箭头;ContextMenu 键盘菜单;Modal size/scroll/placement/role+inert;叠加 Esc 只关栈顶;Dropdown type-ahead;`useKunFloating`/`useKunBackgroundInert` |
| **0.16.0** | 反馈批:Progress 圆环 ARIA+不定态;Loading aria+spinner;toast assertive+关闭+上限+滑动;useKunAlert 可定制+alertdialog;Badge 独立/aria;Ripple key |
| **0.17.0** | 导航批:ScrollShadow aria;Link/Button `_blank` noopener;AvatarGroup;Chip 可关闭/插槽;Copy 反馈;Image `fallbackSrc`;Pagination prev/next 可爬 |
| **0.17.1** | CR 修复:Copy 误报成功 / toast 提前消失 / NumberInput 步进 / Image 缓存回退 / ContextMenu SSR / toast inert / PinInput |
| **0.17.2** | 修复:Modal / Drawer / Tab 指示器 / toast / FadeCard 动画在下游构建中消失(`--kun-dur-*` 被 Tailwind tree-shake 出 `:root`,现镜像进普通 `:root`)。纯 CSS,无 API 变更 |
| **0.18.0** | 统一中性边框:新增 `--color-kun-border` token + `border-kun` 工具类,全部结构性 hairline(输入/卡片/分割线/浮层/Tab…)收敛到单一值并正确翻转亮↔暗;修复 Divider 暗色偏淡;弃用各输入/Card 的 `darkBorder`(no-op,可移除) |
| **0.18.1** | Tab `underlined` 去静态轨道线;修 FadeCard 不触发动画;Pagination 去 `mx-auto` 让 `justify-between` 生效 |
| **0.19.0** | Tab 新增 `align`('start'/'center'/'end');**统一聚焦环**:全控件改用 `focus-visible` + 2px + `{color}/50` 单一配方(新 `kunFocusRingClasses`/`kunFocusRingWithinClasses`),Button/CheckBox 补上缺失的 focus ring,复合控件改 `focus-within` 环、内层不重复;弃用 `kunRingClasses` |
| **0.19.1** | Card header 去下边框、footer 改细线分隔(去灰底);Tab item 圆角 `sm`→`md`(与整体一致)、容器 →`lg`;Message toast 加 `shadow-lg` 立体感 |
| **0.20.0** | **统一 elevation**:新增 `--shadow-kun-sm/md/lg` 三级阴影 token(`shadow-kun-*` utility,与 ring 叠加),浮层按层级套用(tooltip=sm,popover/菜单/列表/toast=md,modal/drawer=lg),Modal 补阴影。**统一 motion**:新增 `duration-kun-fast/base/slow/exit` utility,30 处过渡按角色走 token(enter=base/leave=exit/微交互=fast/淡入=slow),raw `ease-in-out`→`ease-kun-*`。杂项:Brand/Null/Loading raw 圆角走 token、NumberInput 禁用透明度统一 50 |

完整逐版改动见各包 `CHANGELOG.md` 与仓库 `.changeset/` 历史。
