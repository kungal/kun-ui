---
'@kungal/ui-vue': minor
---

浮层不再被 KunModal / KunDrawer 的焦点陷阱抢走焦点,所有内部 `focus()` 一律带 `preventScroll`

下游(kun-editor)报了两个 bug,都属实,而且第二个比报告里写的还要广。根因是同一个:**KunUI 的浮层面板 `Teleport` 到 `<body>`,而 KunModal / KunDrawer 的焦点陷阱和 Escape 处理都是以自己那棵 DOM 子树为界建立的** —— 面板在界外,于是陷阱把它当成「焦点跑了」。

### 其一:弹出浮层会把页面弹到顶部

`KunInput` 的 `autofocus` 在 `onMounted` 里裸调 `input.focus()`。浮层刚挂载那一拍,Floating UI 还没算出位置,面板停在文档原点,浏览器于是「滚动到该元素」—— 把整页拉回顶部。

实测(Chrome 151,apps/playground,页面滚到 3232px 处点开 Popover):

| | 修复前 | 修复后 |
| --- | --- | --- |
| `scrollY` | 3232 → **0** | 3232 → **3232** |
| 面板内 input 拿到焦点 | 是 | 是 |

现在库里**每一处 KunUI 主动发起的 `focus()`** 都带 `{ preventScroll: true }` —— 不只是 KunInput 的 `autofocus`,还有 KunTextarea 的 `autofocus`、KunInput/KunTextarea 的 `clear()` 与 `insertAtCaret()`、KunPinInput 的逐格跳转、KunNumberInput 的 ±1、KunTagInput 的 chip 左右键、KunRadioGroup 与 KunTab 的 roving focus。Radix 的 `FocusScope` 与 Reka UI 的 `focusFirst` 都是无条件 `focus({ preventScroll: true })`,理由一致:组件替用户移动焦点时,滚动从来不是用户要的。

`defineExpose` 出去的 `focus()` 保持原生语义(1.14.1 已经定过这个调子:「the public `Autocomplete.focus()` method keeps the default so the caller controls scroll intent」),但现在能透传参数了:`inputRef.value.focus({ preventScroll: true })`。KunInput / KunTextarea / KunNumberInput / KunAutocomplete 都是。

### 其二:弹窗里的浮层根本无法聚焦

focus-trap 的 `checkFocusIn` 发现焦点落到容器外,立刻 `tryFocus` 拽回去。报告里说的是「手机 KunDrawer + 桌面 KunModal 里的链接输入框」,实测范围要大得多 —— 凡是**把真实 DOM 焦点移进 teleport 面板**的组件都中招。

实测(Chrome 151,真实 Playwright 击键,不是合成事件):

| 场景 | 修复前 | 修复后 |
| --- | --- | --- |
| Modal 里 Popover 的 input,敲 `example.com` | `value === ""`,`activeElement` 是触发按钮 | `value === "example.com"` ✅ |
| Drawer(768px)里同一个 input | `value === ""` | `value === "example.com"` ✅ |
| Modal 里可搜索 KunSelect 的搜索框,敲 `Bra` | 焦点被拽回按钮,一个字打不进去 | 过滤出 `Bravo`,焦点留在搜索框 ✅ |
| Modal 里 KunDropdown 按 ↓ | 焦点被拽回 `menu` 按钮,方向键导航整个失效 | 焦点落在 `menuitem“Alpha”` ✅ |
| Modal 里 KunContextMenu 的菜单项 | 拿不到焦点 | `menuitem“Alpha”` 拿到焦点 ✅ |

**没中招的**是 KunAutocomplete、非搜索态的 KunSelect、KunDatePicker 的键盘导航 —— 它们走 `aria-activedescendant`,真实焦点始终留在弹窗内的触发器上(实测:Autocomplete 的 `[role="option"]` 连 tabindex 都没有,`activeElement` 一直是那个 input),陷阱自然没话说。这些组件同样登记了浮层,拿到的是下面「其三」的 Escape 修复,以及鼠标点中面板内某个可聚焦元素(比如 KunDatePicker 的日期格)时焦点不再被拽走 —— 实测点中后焦点稳在日期按钮上。

修法:新增 `useKunFloatingLayer`,每个浮层在打开期间把自己的面板登记进去,Modal / Drawer 把**属于自己的**面板加进焦点陷阱的容器列表(focus-trap 的 `updateContainerElements`)。归属由**触发器**判定 —— 面板被 teleport 走了不在任何人里面,但触发器还在正常树上,`trapEl.contains(trigger)` 正好回答「这个浮层是不是从这个弹窗里打开的」。

这条路是有前例的:Radix 的 `FocusScope` 为此加了 `branches`(radix-ui/primitives#3423,原文 "portalled content of a nested, non-modal layer"),Reka UI 则是 #2749 —— "a Combobox input inside a Dialog could not be focused",一模一样的症状。

焦点陷阱**仍然是陷阱**:实测在 Modal 里连按 4 次 Tab 会绕回起点,从浮层面板里按 Tab 也回到弹窗内,焦点没有跑到背景页面上。

### 其三:一次 Escape 关掉两层(顺手带出来的)

验证时发现的:浮层开着时按一次 Escape,浮层和它底下的弹窗**一起**关了 —— 两个 keydown 处理器都是活的,彼此不知道对方存在。现在 Modal / Drawer 在自己拥有的浮层还在屏幕上时让出 Escape,形状与既有的 `!isWatchingCloseRequests` 完全一致。第一次 Escape 关浮层,第二次关弹窗。

### 其四:一个字节让 KunPinInput 对 grep 隐身

`PinInput.vue` 里有一个**字面 NUL 字节**(用作 `join()` 的分隔符),ripgrep / grep 因此把整个文件判成 binary 直接跳过 —— 这次全库 `.focus()` 排查就是这么漏掉 `focusCell` 的。改写成 `'\u0000'` 转义,行为不变,文件重新可被搜索。

### 升级注意

- **下游 kun-editor 不需要改任何东西。** `:autofocus="true"` 现在既不弹页面也不被抢焦点了,留着或删掉都可以(KunPopover 本来就会聚焦面板里第一个可聚焦元素)。
- 弹窗里的浮层面板现在也在 Tab 序里 —— 这正是 Tab 该去的地方。菜单类面板用的是 roving tabindex,只贡献一个停靠点。
- focus-trap 有一条限制会随之生效:**多容器陷阱不支持正 tabindex**,会直接抛错。弹窗内部写 `tabindex="1"` 这类值本来就是反模式,现在会从「不对」变成「致命」。
- 快速连按两次 Escape 时,第二次若落在浮层 180ms 关闭动画之内会被吞掉(面板还在屏幕上)。再按一次即可。
- 新导出 `useKunFloatingLayer` / `useKunFloatingLayerStack`,给自己把面板 teleport 出弹窗的应用用。
