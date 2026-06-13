# KunUI 升级指南:0.5.2 → 0.13.0

面向已集成 **0.5.2** 的下游(如 moyu)。四个包(`@kungal/ui-core` / `ui-tokens` / `ui-vue` / `ui-nuxt`)始终**锁步同版本**,必须一起升。

```bash
pnpm up "@kungal/ui-core@0.13.0" "@kungal/ui-tokens@0.13.0" "@kungal/ui-vue@0.13.0" "@kungal/ui-nuxt@0.13.0"
# 或简单地:
pnpm up "@kungal/*@latest"
```

升级后**最重要的一步**见 [§6 集成注意](#6-集成注意必读)。下面按"必须处理 → 可清理 → 要回归 → 可选采用"的顺序组织。

---

## 1. ⚠️ 破坏性变更(必须处理)

### 1.1 `KunFavicon` 组件已删除(0.6.0)
只是一段写死的 logo SVG,无 props,对库无价值。
- **迁移**:如果你用过 `<KunFavicon />`,改成自己的 logo SVG / `<img>`,或用 `KunBrand` 的 `iconSrc`。

> 其余所有组件 API 向后兼容;下面"新增 props"都有默认值,不传则行为不变。

### 1.2 两处 DOM 结构变化(只影响按标签/层级选的 CSS)
- **`KunFadeCard`(0.10.0)**:内容现在包在一层 grid 容器里(为了用 `0fr→1fr` 平滑展开、不再裁剪高内容)。若你用 CSS 选过它的**直接子元素**,改选内层。
- **`KunBrand` / 带导航的 `KunAvatar` / `KunUserChip`(0.12.0)**:从 `<div>` 变成了真 `<a>`(见 §5.5)。若你按标签 `div` 选过样式,改成 `a`。

---

## 2. 🧹 可以顺手移除的兜底(下游清理)

升级后这些 workaround 可以删掉:

- **删掉 `public/alert/*.webp`(0.6.1)**:`KunLoli` 弹窗的 4 张吉祥物(あーちゃん / こじかひわ / 雪々 / 琥珀)现在**内联进了组件**(base64),不再依赖 `/alert/{name}.webp`。这几个 public 资源可以删。
- **撤掉 CheckBox slot 的手动间距(0.6.2)**:`<KunCheckBox>分类</KunCheckBox>` 的方框与 slot 内容之间现在有统一 8px gap。如果你之前给分类 label 加了 `ml-1.5` 之类兜底,**撤掉**(否则会叠加变宽)。

---

## 3. 🎨 视觉 / 行为变化(升级后做一次回归)

这些不改 API,但外观会变,升级后扫一眼:

| 变化 | 版本 | 说明 |
|---|---|---|
| **默认圆角整体变大** | 0.9.0 | `--radius-kun-*`:`sm 4→6` / **`md 8→12`(全局默认)** / `lg 12→16`(HeroUI 风格)。所有组件默认更圆。想全局回调:设 `--kun-radius-scale` < 1。 |
| **CheckBox 方框** | 0.8.0 / 0.9.0 | 默认尺寸 20px→**16px**;圆角改为 `35%` 比例(任意尺寸都是圆角方块,不会变圆)。 |
| **Button lg/xl 比例** | 0.7.0 | lg/xl 之前又宽又扁,现在收成 2:1。**md 不变。** |
| **Select / DatePicker / Textarea 水平内边距** | 0.7.0 | `px-3`→`px-4`,与 Button/Input 对齐(略宽,同高 38px)。 |
| **Chip 略矮** | 0.8.0 | md/lg/xl 垂直 padding 收紧(标签不再像按钮那么高)。 |
| **全库动效统一** | 0.10.0 | 弹窗/下拉/抽屉/toast 改用统一缓动 + 时长,出场更快;下拉/气泡"从触发点长出来";Tab 指示条/折叠不再卡顿。**自动尊重 `prefers-reduced-motion`**(需引入 base 层,见 §6)。 |
| Null / Loading 吉祥物图 | 0.6.1 | 各放大一档。Tab 带 icon 时图标与文字间距修正。TagInput 标签配色统一为主色。 |

---

## 4. ✨ 新增能力:统一的尺寸系统(0.7.0 / 0.8.0)

所有表单/控件现在共享一套 `xs | sm | md | lg | xl` 尺寸尺度,同尺寸**一行内像素级对齐**(md = 38px)。

- **新增 `size` 属性**(默认 `md`,旧用法不受影响):`KunSelect`、`KunDatePicker`、`KunTextarea`、`KunCheckBox`、`KunSwitch`、`KunSlider`。(Button/Input 原本就有。)
- **`@kungal/ui-core` 新导出**(若你直接复用其类映射):`kunControlSizeClasses`(文本控件)、`kunSelectionSizeClasses`(CheckBox/Radio 共享的方框尺度)、类型 `KunSelectionSize`。
- CheckBox 与 RadioGroup 现在用**同一套方框尺寸**(同尺寸一致)。Chip/Badge/Avatar 作为展示型组件保持紧凑(符合各库惯例)。

```vue
<KunSelect v-model="x" :options="opts" size="lg" />
<KunSwitch v-model="on" size="sm" />
```

---

## 5. ✨ 新增能力:SEO / 可爬性 / 无障碍

这几块是这次升级的重点,直接关系到 SSR 站点的搜索表现。

### 5.1 圆角运行时旋钮 `--kun-radius-scale`(0.5.1,你可能还没用)
一个 CSS 变量驱动全站圆角,实时无需重渲染:
```css
:root { --kun-radius-scale: 0 }    /* 全站直角 */
:root { --kun-radius-scale: 1.5 }  /* 更圆 */
```

### 5.2 统一动效 token(0.10.0)
做自定义动画时复用,保持节奏一致:
- 缓动(也生成 Tailwind 工具类):`ease-kun-standard` `ease-kun-out`(进场)`ease-kun-in`(出场)`ease-kun-emphasized`。
- 时长 CSS 变量:`--kun-dur-fast(150)` `--kun-dur-base(250)` `--kun-dur-slow(350)` `--kun-dur-exit(180)`。

### 5.3 SEO-first 的 Tab 内容面板(0.11.0)—— **重点**
`KunTab` 仍是"只有条";新增 `KunTabPanel` / `KunTabPanels` 来管内容,默认对搜索引擎友好:

```vue
<KunTab v-model="active" :items="items" name="product" />
<KunTabPanels v-model="active" name="product">
  <KunTabPanel value="overview">…</KunTabPanel>   <!-- 默认全量 SSR + hidden=until-found -->
  <KunTabPanel value="specs">…</KunTabPanel>
</KunTabPanels>
```
- `mount="eager"`(默认):**每个 panel 都 SSR 进 HTML**,非激活的不删除、用 `hidden="until-found"` 隐藏 → 全部可索引,且能被 Ctrl+F / 文本片段深链命中(命中时自动切到该 tab)。
- `mount="lazy"`:首次激活才渲染、之后保留(数据巨大、愿意权衡 SEO 时)。
- `mount="unmount"`:只激活在 DOM(= v-if,**不可爬**,仅给图表/地图这类无 SEO 价值的重组件)。
- `forceMount`(= eager 别名)、`hiddenStrategy="until-found"|"display"`、`name`(与 `KunTab` 的 `name` 对应,做 ARIA id 关联)。

**铁律**:SEO 相关内容**永不用 `v-if`** 折叠;`v-show`/until-found(在 DOM 里)才会被索引。

### 5.4 「Tab 即路由」(0.11.0)
`KunTabItem` 带 `href` 时,tab 渲染成真 `<a>`(走 `config.linkComponent` → NuxtLink),每个 tab 是一个可爬 URL、可渐进增强成无刷新切换。各 section 能独立成搜索意图、或数据巨大时用它。

### 5.5 导航组件渲染真 `<a href>`(0.12.0)
Google 只跟随 `<a href>`,不点 `<div @click>` / `<button>`。以下现在渲染真链接:
- **`KunBrand`**:首页 logo 链接(div → `<a>`)。
- **`KunPagination`**:新增 `pageHref?: (page) => string`。传了它,页码就渲染 `<a href>`(可爬分页);不传则维持按钮。
- **`KunAvatar` / `KunUserChip`**:可点头像 → 真 `<a>` 到用户主页;UserChip 整条是一个链接(名字当锚文本),新增 `isNavigation`(默认 true)。
- **`KunDropdown` / `KunContextMenu`**:item 新增可选 `href` → `<a role="menuitem">`(导航型菜单);动作项不传 href 仍是 `<button>`。

```vue
<KunPagination v-model:current-page="page" :total-page="20" :page-href="(p) => `/list?page=${p}`" />
```

### 5.6 无障碍 + SSR 正确性(0.13.0)
- **SSR label 关联修复**:`useKunUniqueId` 改成同步 `useId()`,Input/CheckBox/Textarea 等的 `<label for>` 现在在**服务端 HTML 里就正确**(之前 SSR 是空 id)。无需改你的代码,自动生效。
- `KunModal` 补全 dialog 语义(`role="dialog"` + `aria-modal` + 新增 `ariaLabel` prop)。
- 图标按钮加可访问名(Modal/Loli 关闭、Pagination 上/下页)。
- `KunSlider` 支持键盘(方向键 / Home / End / PageUp/Down)。
- `KunMessage` toast 容器 `role="status" aria-live="polite"`(屏幕阅读器会播报)。
- `KunTooltip` 现在响应键盘 focus + `aria-describedby` + Esc 关闭。
- `KunRating` 星星加 `aria-label`;`KunPopover` 新增 `ariaLabel` prop。

---

## 6. 📌 集成注意(必读)

1. **Tailwind `@source` 必须同时扫 `@kungal/ui-core` 和 `@kungal/ui-vue` 的源码** —— 这是一直以来的要求,新尺寸/选择/动效的类字符串住在 ui-core,只扫 ui-vue 会漏。示例(你的全局 CSS):
   ```css
   @import 'tailwindcss';
   @import '@kungal/ui-tokens';
   @source '../node_modules/@kungal/ui-core/src';
   @source '../node_modules/@kungal/ui-vue/src';
   ```
   (路径相对你的 CSS 文件;monorepo 内指向 workspace 源码。)

2. **想要全局 `prefers-reduced-motion`**:它在**可选的 base 层**(`@kungal/ui-tokens/base.css`,通过 `@import '@kungal/ui-tokens'` 一并引入)。若你只引 `@kungal/ui-tokens/css`(纯 token),则不含该全局重置,需自行加。

3. **LCP 首图记得手动 `eager`**:`KunImage` 默认 `loading="lazy"`(非首屏安全),但库无法判断哪张是首图。首屏主图请显式:
   ```vue
   <KunImage src="..." loading="eager" fetchpriority="high" />
   ```

4. **圆角想整体回到偏方**:设一个 CSS 变量即可,无需改组件:`:root { --kun-radius-scale: 0.6 }`。

---

## 7. ✅ 升级后自检清单

- [ ] 跑一遍构建,确认 Tailwind 生成了新类(圆角、尺寸、`ease-kun-*`)——若样式缺失,八成是 §6.1 的 `@source` 没扫 ui-core。
- [ ] 回归外观:圆角、表单一行对齐、CheckBox 大小、Button lg/xl、Chip 高度。
- [ ] 删除 `public/alert/*.webp` 和 CheckBox 的 `ml-1.5` 兜底(§2)。
- [ ] 若有 Tab 折叠大量内容:改用 `KunTabPanel`(默认 eager)或「Tab 即路由」,**别用 v-if**。
- [ ] 分页/头像/导航菜单需要被收录的:传 `pageHref` / 确认渲染出 `<a href>`。
- [ ] 跑一次 Lighthouse / axe 复核 a11y(本次补了大量 aria/键盘/label)。
- [ ] SSR 十分钟自检:查看源代码确认正文/内链/meta 在首响应里;Search Console URL 检查看渲染后 HTML;禁用 JS 只靠点链接走主路径。

---

## 8. 版本流水对照

| 版本 | 主题 |
|---|---|
| **0.6.0** | ⚠️ 删除 `KunFavicon` |
| **0.6.1** | KunLoli 内联吉祥物图 / Tab 图标间距 / Null·Loading 放大 / TagInput 配色 |
| **0.6.2** | CheckBox slot 间距 |
| **0.7.0** | 表单控件尺寸统一 + Button lg/xl 修正 + Select·DatePicker·Textarea 加 `size` |
| **0.8.0** | 选择/展示控件尺寸统一 + CheckBox·Switch·Slider 加 `size` + Chip 收紧 |
| **0.9.0** | 默认圆角整体变大(HeroUI 6/12/16)+ CheckBox 圆角 35% |
| **0.10.0** | 统一动效系统(`ease-kun-*` / `--kun-dur-*` / reduced-motion / 消除卡顿 / origin-aware) |
| **0.11.0** | SEO-first Tab 面板(`KunTabPanel`/`Panels`,hidden=until-found)+ Tab 即路由 |
| **0.12.0** | 可爬 `<a href>`(Brand / Pagination `pageHref` / Avatar·UserChip / 菜单项 `href`) |
| **0.13.0** | a11y + SSR 修复(`useId` 修 SSR label / Modal dialog 语义 / Slider 键盘 / toast live region / Tooltip / Rating / Popover) |

完整逐版改动见各包的 `CHANGELOG.md`。
