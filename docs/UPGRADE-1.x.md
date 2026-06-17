# KunUI 1.x 升级指南

面向已在 **1.x**(任意 1.0+)的下游,升到当前最新。四个包(`@kungal/ui-core` / `ui-tokens` / `ui-vue` / `ui-nuxt`)始终**锁步同版本**,必须一起升。

```bash
pnpm up "@kungal/*@latest"
```

> **1.x 遵循 [SemVer](https://semver.org/lang/zh-CN/)**:`minor` 与 `patch` 只做**向后兼容**的新增与修复,破坏性变更只会出现在下一个 `major`(2.0)。所以 1.x 内升级几乎都是「装上就好」。
>
> **逐版完整变更不在本文** —— 见自动生成的[更新日志](https://ui.kungal.com/changelog)、各包 `CHANGELOG.md`(npm + 仓库)、[GitHub Releases](https://github.com/kungal/kun-ui/releases)。本文是**稳定的高层迁移摘要**:只列 1.x 内**需要回归或留意**的少数几处(主要是视觉变化),**不随每次发布更新**。
>
> - **从 0.5.2 或更早升级?** 先做大跨度破坏性迁移:[`UPGRADE-0.5.2-to-1.0.0.md`](./UPGRADE-0.5.2-to-1.0.0.md),再回到本文。
> - **未来的 2.0(破坏性版本)** 会有独立的迁移指南。

---

## 1. ⚠️ 破坏性变更(必须处理)

**无。** 1.1.0 → 1.5.0 全程没有任何破坏性 API 变更:没有删除/重命名 props、事件或导出,旧代码无需改动即可工作。下面列出的都是**视觉/行为变化**或**新增能力**,不是破坏性变更。

---

## 2. 🎨 行为 / 视觉变化(升级后过一眼)

不改 API,但渲染或交互会变,值得回归一眼。**只有 §2.3 是较明显的视觉变化**,其余多为修复或细化。

| 变化 | 版本 | 是否需要动作 |
|---|---|---|
| `KunLightbox` 点遮罩关闭(§2.1) | 1.1.0 | 仅当你**外层自写过遮罩关闭**才需删除 |
| Select / Autocomplete 首次打开不再跳页首 | 1.1.1 | 纯修复,无需动作 |
| Content 剧透改为粒子效果、按行/按词遮罩、去圆角(§2.4) | 1.2.0 / 1.3.0 | 视觉变化;markup 契约不变 |
| KunContent **内置代码复制按钮**(§2.2) | 1.4.0 | 下游可**删掉自写的复制实现** |
| 可选编辑式排版 `@kungal/ui-vue/prose.css` | 1.4.0 | opt-in,不导入则无变化 |
| KunContent 新增 `compact` prop | 1.4.0 | 新增,默认 `false` |
| `KunTab` 激活高亮 SSR 安全 | 1.4.1 | 纯修复,首屏不再丢高亮 |
| `bordered` 变体尺寸一致(§2.5) | 1.4.2 | Info / TagInput 的 `flat`/`solid` 现与 `bordered` 同尺寸 |
| **实心变体前景对比度(§2.3)** | 1.5.0 | **可见变化**,见下 |
| 新增 Accordion / Carousel / Skeleton / Steps / Timeline | 1.6.0 | 纯新增组件,无需动作 |

### 2.1 `KunLightbox` 点遮罩关闭(1.1.0)

点击图片**四周的暗色遮罩**现在会关闭查看器,与现代图片查看器(PhotoSwipe、iOS 相册、GitHub 自带查看器等)一致,并与原有的 **Esc 关闭**互补。

- **只关在遮罩上**——点击图片本身、以及任意控件(缩放/旋转/下载/上一张/下一张/缩略图/关闭按钮)都**不会**关闭。
- **拖拽不会误关**:平移、滑动切图、双指缩放收尾的那一次点击都被指针位移阈值挡掉。
- 关闭方式现共三种:**点遮罩 / 按 Esc / 点关闭按钮**,均触发既有的 `update:isOpen` → `false`。
- **需要回归**:若你在灯箱**外层自写过点击关闭逻辑**,现在会**双重关闭**,把自写的删掉即可;若你**依赖「点遮罩不关闭」**当常驻层,目前没有关闭该行为的开关,确有需求请提 issue。

### 2.2 KunContent 内置代码复制按钮(1.4.0)

KunContent 现在会给每个代码块**自动注入**一个自带样式(token 感知、暗色自适应)的复制按钮,带点击复制 + 即时图标反馈。

- **幂等**:已带 `.copy` 按钮的代码块(例如你的 Markdown 管线吐出的)会被**跳过**,不会重复 → 下游可以**删掉自己那份复制实现**。
- **留意**:如果你的内容里之前**没有**复制按钮,升级后代码块上会**新出现**一个复制按钮(纯增益,通常无需处理)。

### 2.3 实心变体前景对比度(1.5.0)⭐ 最明显的视觉变化

实心(`solid` / `shadow`)填充原先一律用**白字**,在两种情况下不达标(均经对比度实测):深色模式下 `bg-{color}` 反相变浅,白字对比度跌到 ~1.0–2.5:1(`solid` 的 `info` 几乎白底白字);而 secondary / success / warning / info 本身就是浅色,白字在**深浅两种模式**下都 ~2:1 不达标。

**现在:深色调(default / primary / danger)保留白字,浅色调(secondary / success / warning / info)改用深字**,并给深色模式钉死足够深的填充。所有实心前景在双模式下均达 WCAG AA(≈4.1–10.3:1)。

- **影响组件**:`KunButton` / `KunChip`(共享变体矩阵)、`KunInfo`(`solid`/`shadow`)、`KunBadge`、`KunProgress`(条上标签)、`KunTab`(`solid`/`pills`)、`KunDatePicker`(选中日期)、`KunCheckBox`(勾选填充 + 对勾/横杠)、`KunSwitch`(开态轨道)。
- **可见变化**:`secondary` / `success` / `warning` / `info` 的实心组件文字**由白色变为深色**。
- **需要回归**:若你对这些组件**自写过 CSS 覆盖、且预期文字是白色**(例如硬改了内部文字色),过一眼。
- **新增可复用导出**(`@kungal/ui-core`):`kunSolidClasses` / `kunSolidBgClasses` / `kunSolidFgClasses` —— 下游自建实心填充时直接复用,自动获得双模式对比色前景。

### 2.4 Content 剧透视觉(1.2.0 / 1.3.0)

剧透从「磨砂方块」改为**动画粒子场**(spawn → drift → fade → respawn),揭示时粒子消散。多行**按行遮罩**、空格分隔文本**按词遮罩**(CJK 无空格自然退化为按行)。

- **SSR 安全**:遮盖层是服务端就渲染好的纯 CSS,无水合闪烁;禁用 JS 时密文仍隐藏。粒子 canvas 是纯客户端增强。
- 可键盘操作(`role="button"`、Enter/Space 揭示、`aria-expanded`),尊重 `prefers-reduced-motion`。
- 遮盖层**无圆角**,以对齐浏览器文本选区高亮。
- **markup 契约不变**:可信 HTML 中仍是 `class="kun-spoiler kun-spoiler-hidden"`。

### 2.5 `bordered` 变体尺寸一致(1.4.2)

`bordered` 变体的边框会让元素变大,除非其它变体用透明边框预留同等宽度。Button / Chip / Tab 早已如此,Info 与 TagInput 之前没有:

- **`KunInfo`**:所有变体现在都带同样的 `1.5px` 边框(非 bordered 为透明),切换变体不再改变盒子尺寸。
- **`KunTagInput`**:外框始终预留 `1px` 透明边框,`flat` 与 `bordered` 现等尺寸;**`flat` 变体的报错红框现在也能显示**(之前没有边框宽度可上色)。
- 非 bordered 变体除尺寸变一致外无视觉变化(预留的是透明边框)。

---

## 3. 📌 新增可选能力(可按需采用,不采用无影响)

- **`@kungal/ui-vue/prose.css`**(1.4.0):token 驱动的编辑式排版,作用于任意 `.kun-prose` 容器(舒适行宽、模块化标题尺度、CJK 友好行距、列表/引用/代码/表格/链接精修、自动明暗)。**单独 import 是刻意设计**——KunContent 的 `style.css` 仍只含行为,已自带 `.kun-prose` 排版的下游不导入即不受影响。
- **KunContent `compact` prop**(1.4.0):加 `.kun-prose-compact`,用于评论/回复流的更紧凑排版(更小字号、行距、间距,铺满宽度而非 40rem)。视觉效果需导入 `prose.css`。
- **内置代码复制**(1.4.0,见 §2.2):下游可删掉自写实现。
- **`kunSolidClasses` 等导出**(1.5.0,见 §2.3):下游自建实心填充复用。

> 集成步骤**无新增**。1.0.0 里的那几条(Tailwind `@source` 同时扫 ui-core 与 ui-vue、可选 base 层 `prefers-reduced-motion`、库接管背景 `inert`、LCP 首图手动 `eager`、圆角 `--kun-radius-scale`)继续有效,详见 [`UPGRADE-0.5.2-to-1.0.0.md` §6](./UPGRADE-0.5.2-to-1.0.0.md#6-集成注意必读)。

---

## 4. ✅ 升级后自检清单

- [ ] `pnpm up "@kungal/*@latest"`,确认四个包都到 `1.5.0`(锁步同版本)。
- [ ] **实心组件回归(1.5.0)**:secondary / success / warning / info 的 `solid` 按钮/徽标/胶囊/Info/Tab/复选框等文字现为深色;若你自写过文字色覆盖,过一眼。
- [ ] **代码块(1.4.0)**:确认复制按钮没有重复(若你的管线已注入 `.copy`,应自动跳过;否则会新增一个)。
- [ ] **剧透(1.2/1.3)**:用到 `kun-spoiler` 的页面确认揭示交互正常、无水合闪烁。
- [ ] **Lightbox(1.1.0)**:点遮罩能关、点图片与控件不会关、拖拽/滑动不误关;外层若自写过遮罩关闭 —— 删掉。
- [ ] **Tab(1.4.1)**:SSR/首屏激活高亮不再丢失(`underlined`/`solid`/`light`)。

---

## 5. 逐版完整变更

**不在本文维护** —— 每个版本的完整改动随发布**自动生成**,去这三处任选其一:

- 🌐 [**ui.kungal.com/changelog**](https://ui.kungal.com/changelog) —— 按版本折叠、带 Major/Minor/Patch 标签
- 📦 各包 `CHANGELOG.md`(npm 包页面 + [仓库](https://github.com/kungal/kun-ui/tree/main/packages))
- 🏷 [**GitHub Releases**](https://github.com/kungal/kun-ui/releases)(可 watch 订阅;Renovate / Dependabot 也会抓取)

> 本文只在出现**需要回归的视觉/行为变化**时增补一行(见 §2 表),不逐版罗列。
