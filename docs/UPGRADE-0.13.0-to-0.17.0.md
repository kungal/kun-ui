# KunUI 升级指南:0.13.0 → 0.17.0

接续 [0.5.2 → 0.13.0](./UPGRADE-0.5.2-to-0.13.0.md)。面向已集成 **0.13.0** 的下游(如 moyu)。四个包(`@kungal/ui-core` / `ui-tokens` / `ui-vue` / `ui-nuxt`)始终**锁步同版本**,一起升。

```bash
pnpm up "@kungal/*@latest"   # → 0.17.0
```

这四个版本是一次系统性的「对标主流库」升级:补齐 **API 完备性、键盘/读屏无障碍、浮层焦点管理**,并新增 3 个组件。按版本分:

| 版本 | 主题 |
|---|---|
| **0.14.0** | 表单/输入控件 + 3 个新组件(NumberInput / PinInput / Autocomplete) |
| **0.15.0** | 浮层/弹出层 a11y + Modal 能力 + 浮层基建收敛 |
| **0.16.0** | 反馈/状态 a11y + 可定制确认框 + Toast 体验 |
| **0.17.0** | 导航/展示 a11y/安全 + Chip/Copy 能力 |

> 绝大多数变更**向后兼容**;新增 props 都有默认值。下面只列需要你注意的部分,按「必须处理 → 可清理 → 要回归 → 可选采用」组织。**升级后最重要的一步仍是 [§6 集成注意](#6-集成注意必读)。**

---

## 1. ⚠️ 破坏性变更(0.x minor,需注意)

都是小范围、行为级的变化:

| # | 组件 | 变化 | 迁移 |
|---|---|---|---|
| 1.1 | **KunSlider** | 默认 `min`/`max` 由 **17–77 → 0–100**(0.14.0,清掉 galgame 残留默认) | 依赖旧默认值的调用**显式传** `:min`/`:max` |
| 1.2 | **KunSelect** | `v-model` 类型放宽为 `T \| T[] \| null`(支持 `multiple` 与清除,0.14.0) | 单选用法**运行时不受影响**,仅 TS 类型变宽;若你显式标注过泛型,确认仍兼容 |
| 1.3 | **KunPopover** | 触发器包裹层**不再**是 `role="button"` / 不再注入 tabindex(0.15.0,修「button 套 button」+ 假标签) | 传**可聚焦**触发器(`<KunButton>` 不受影响);若你传的是纯图标/文本,自行加 `tabindex="0"` |
| 1.4 | **KunModal** | 面板默认带 `max-w-md` 宽度上限(此前无上限,0.15.0) | 需要更宽:`size="lg"\|"xl"\|"full"` |
| 1.5 | **AlertProvider** | 「取消」按钮不再是 danger 红、改为中性;「确定」按主操作着色(0.16.0) | 视觉变化,无需改代码;想要红色确认用 `type:'danger'` |
| 1.6 | **KunScrollShadow** | 可访问名不再等于 `className`(此前是 bug,会把 CSS 类当 aria-label),改为新 `ariaLabel`(默认 'scrollable content',0.17.0) | 若依赖过这个(不太可能),改传 `ariaLabel` |

---

## 2. 🧹 可以顺手清理 / 迁移(不急)

升级后这些旧写法可以逐步替换,**旧名仍可用**:

- **辅助文案统一为 `description`(0.14.0)**:`helperText`(Input/TagInput)与 `hint`(Textarea/FileInput/Upload)保留为**已弃用别名**(内部回退到 `description`)。新代码统一用 `description`。
- **`KunDivider` 的 `withLabel` 已弃用(0.17.0)**:它一直是 no-op(label 由默认插槽是否有内容决定),可直接删掉。
- **自写的图片裂图兜底**:`KunAvatar` 现在裂图自动回退到确定性 sticker;`KunImage` 新增 `fallbackSrc`。若你给头像/图片写过 `onError` 换图逻辑,可移除。

---

## 3. 🎨 视觉 / 行为变化(升级后回归一次)

不改 API,但外观/交互会变:

| 变化 | 版本 | 说明 |
|---|---|---|
| **Slider 焕新** | 0.14.0 | 默认 0–100(见 §1.1);新增禁用态、`marks`、悬停值气泡、`color`、`error`/`description`。 |
| **CheckBox 三态** | 0.14.0 | `indeterminate` 显示横杠(全选父框);其余不变。 |
| **Modal 默认宽度** | 0.15.0 | 内容超宽的 Modal 现在被 `max-w-md` 收住(见 §1.4)。 |
| **确认框配色对调** | 0.16.0 | 取消=中性、确定=主色/危险色(见 §1.5)。 |
| **Toast 体验** | 0.16.0 | error/warn 改为**打断式**(`role="alert"` assertive);每条 toast 悬停出现 **×** 关闭按钮;每个位置**最多 5 条**(超出丢最旧);支持触摸滑动关闭。 |
| **Progress 不定态** | 0.16.0 | `indeterminate` 从「静态满条」改为**真不定动画**(条形横扫 / 圆环旋转)。 |
| **Copy 反馈** | 0.17.0 | 点击后图标切 ✓、文案切「已复制」、按钮短暂变 success 色,~1.5s 复位。 |
| **Chip × 按钮** | 0.17.0 | 仅当 `closable` 时出现,不影响现有 Chip。 |

---

## 4. ✨ 新增组件(0.14.0)

三个补齐表单常用控件,全部支持统一 `size` / `error` / `description` / `name`(可进原生 `<form>`):

```vue
<!-- 数字步进:钳制 / 精度 / 键盘上下 / role=spinbutton -->
<KunNumberInput v-model="qty" :min="0" :max="10" />
<KunNumberInput v-model="price" :min="0" :step="0.1" :precision="2" />

<!-- OTP / 验证码:自动前进、退格回退、粘贴分发、complete 事件 -->
<KunPinInput v-model="code" :length="6" @complete="verify" />

<!-- 组合框:文本输入 + 建议;客户端过滤,或 manualFilter + @search 远程 -->
<KunAutocomplete v-model="text" :options="cities" :clearable="true" @select="onSelect" />
```

---

## 5. ✨ 新增能力(可选采用)

### 5.1 表单控件(0.14.0)
- **KunSelect**:补齐**键盘可达性**(方向键 / Enter / Esc / Home / End / 首字母 type-ahead + `aria-activedescendant`,禁用项跳过);新增 `searchable`(列表内过滤)、`multiple`(可移除 chips)、`clearable`、`description`、`name`、选项 `disabled`。
- **KunInput**:`isClearable`、`revealPassword`(密码可见性切换)、`isInvalid`。
- **KunCheckBox**:`indeterminate` + `error`/`description`。**KunSwitch**:`error`/`description`。
- **KunSlider**:`disabled`、`label`/`ariaLabel`、`error`/`description`、`color`、`marks`、`showTooltip`、`showValue`、`formatValue`、`change` 事件。

### 5.2 浮层 / 弹出层(0.15.0)
- **KunModal**:`size`(sm…full)、`scrollBehavior`(inside/outside)、`placement`(center/top)、`role`('dialog'|'alertdialog');打开时给页面背景加 **`inert`**(比 `aria-modal` 更强的隔离,Tab/读屏都进不去背景)。**KunDrawer** 同样加 inert。
- **KunPopover**:现在是真正的对话框 —— 打开移焦入面板、关闭归还触发器;新增 `showArrow` 箭头。
- **KunTooltip**:`showArrow` 箭头。**KunDropdown**:首字母 type-ahead。
- **KunContextMenu**:升级为真 WAI-ARIA 菜单(`role=menu/menuitem`、roving tabindex、方向键/Home/End/Enter/Esc、聚焦首项、归还焦点)。
- **叠加弹窗**:多个 Modal/Drawer 叠加时,Esc **只关栈顶**那一个。
- **新导出 composable**(自建浮层可复用):`useKunFloating`(floating-ui 配置 + transform-origin + 可选 arrow)、`useKunBackgroundInert`(引用计数背景 inert)、`useKunOverlayZIndex` 新增 `isTopmost`。

### 5.3 反馈 / 状态(0.16.0)
- **useKunAlert**:`confirmText` / `cancelText` / `type`('info'|'warning'|'danger')/ `confirmColor`(可本地化文案 + 危险确认)。
  ```ts
  const ok = await useKunAlert({
    title: '删除确认', message: '不可撤销', type: 'danger', confirmText: '删除', cancelText: '再想想',
  })
  ```
- **KunProgress**:`ariaLabel`;圆环补 `role=progressbar` + aria;`indeterminate` 真动画。
- **KunLoading**:`role=status`/`aria-busy`;新增轻量 `spinner` 变体 + `size`。
- **KunMessage(toast)**:每条带关闭按钮(`duration:0` 常驻也能点掉);位置上限 5;滑动关闭;error/warn 自动 assertive。
- **KunBadge**:无锚点 slot 时渲染**独立内联**徽标;`ariaLabel`(如 "5 条未读")。

### 5.4 导航 / 展示(0.17.0)
- **KunChip**:`closable`(× 触发 `close`,可移除标签)、`disabled`、`start`/`end` 插槽(圆点/头像/图标)。
- **KunCopy**:`copiedText`(复制反馈文案)。
- **KunImage**:`fallbackSrc`(裂图回退)。**KunPagination**:`pageHref` 时上一页/下一页也渲染为可爬 `<a>`。
- **安全**:`KunLink` / `KunButton` 的 `target="_blank"` 自动补 `rel="noopener noreferrer"`(tabnabbing 防护)。
- **KunAvatarGroup**:"+N" 溢出从 `users.length` 推导(不传 `total` 也显示)、`role="group"` + 计数 `aria-label`。

### 5.5 新增打包图标(0.14.0)
构建期内联、运行时零请求:`lucide:minus` / `eye` / `eye-off` / `search`。(沿用既有「图标全部硬编码」策略。)

---

## 6. 📌 集成注意(必读)

1. **Tailwind `@source` 仍需同时扫 `@kungal/ui-core` 和 `@kungal/ui-vue`** —— 不变。新组件/新尺寸的类字符串部分住在 ui-core,只扫 ui-vue 会漏样式。
   ```css
   @import 'tailwindcss';
   @import '@kungal/ui-tokens';
   @source '../node_modules/@kungal/ui-core/src';
   @source '../node_modules/@kungal/ui-vue/src';
   ```

2. **背景 `inert` 现在由库接管**:Modal/Drawer 打开时自动给页面背景加 `inert`,并给自己的浮层根标 `data-kun-overlay`。若你之前自写过「打开弹窗时把 `#app` 设 inert / aria-hidden」的逻辑,可以删掉(避免双重 inert 把弹窗自己也锁住)。

3. **Toast 现在区分紧急度**:error/warn 是 `role="alert"`(assertive,会打断读屏),info/success 仍是 polite。这是 a11y 改进,通常无需处理;若你有大量 error toast 轰炸,注意 §3 的「位置上限 5 + 可关闭」已能缓解。

4. **`helperText`/`hint` → `description`**:旧名仍工作,但建议新代码统一 `description`(见 §2)。

5. **LCP 首图仍需手动 `eager`**(沿用上一版指南 §6.3):`<KunImage src="..." loading="eager" fetchpriority="high" />`。

---

## 7. ✅ 升级后自检清单

- [ ] 跑构建,确认 Tailwind 生成了新组件/新状态的类(NumberInput 步进、Chip ×、Progress 不定态动画)——缺样式八成是 §6.1 的 `@source` 漏扫 ui-core。
- [ ] 回归:Slider(默认值/marks)、Modal 宽度(`max-w-md` 是否够用)、确认框按钮配色、Toast(关闭按钮/上限/error 打断)。
- [ ] **Popover 触发器**确认是可聚焦元素(`<KunButton>` 等);纯图标触发器补 `tabindex`(§1.3)。
- [ ] 若用 `<KunSelect>` 做长列表:可加 `searchable`;多选场景换 `multiple`。
- [ ] 逐步把 `helperText`/`hint` 换成 `description`;删 `KunDivider` 的 `withLabel`、自写的图片裂图兜底。
- [ ] 跑一次 axe / Lighthouse:本轮补了大量键盘 + 读屏(Select/ContextMenu/Popover 焦点、Progress/Loading/toast aria),应有明显改善。
- [ ] 外链确认带上了 `rel="noopener"`(库已自动,核对一下你直接写的 `<a target="_blank">` 是否也补了)。

---

## 8. 版本流水对照

| 版本 | 主题 |
|---|---|
| **0.14.0** | 表单批:新增 NumberInput/PinInput/Autocomplete;Select 键盘 + searchable/multiple/clearable;Slider 默认值/响应式修复 + marks/气泡;CheckBox indeterminate;Input clearable/密码;helper 统一 `description` |
| **0.15.0** | 浮层批:Popover 触发器语义 + 焦点管理 + 箭头;ContextMenu 真菜单键盘;Modal size/scrollBehavior/placement/role + inert;叠加 Esc 只关栈顶;Dropdown type-ahead;`useKunFloating`/`useKunBackgroundInert` |
| **0.16.0** | 反馈批:Progress 圆环 ARIA + 不定态动画;Loading aria + spinner;toast assertive + 关闭 + 上限 + 滑动;useKunAlert 可定制 + alertdialog;Badge 独立/aria;Ripple key 修复 |
| **0.17.0** | 导航批:ScrollShadow aria 修复;Link/Button `_blank` noopener;AvatarGroup 溢出/aria;Divider/Markdown aria;Chip 可关闭/插槽;Copy 反馈;Image `fallbackSrc`;Pagination prev/next 可爬 |

完整逐版改动见各包的 `CHANGELOG.md` 与仓库 `.changeset/` 历史。
