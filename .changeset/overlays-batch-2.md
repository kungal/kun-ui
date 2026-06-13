---
"@kungal/ui-vue": minor
---

浮层 / 弹出层第二批升级:对标 Radix / HeroUI / Reka,修掉 Popover 与 ContextMenu 的 a11y 缺陷,统一浮层基建。

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
