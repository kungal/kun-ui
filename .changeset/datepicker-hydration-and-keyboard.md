---
'@kungal/ui-vue': minor
---

KunDatePicker:修掉两处 SSR hydration mismatch,并让它重新能用键盘操作

下游(鲲论坛)报了 KunDatePicker 在 SSR 下的 hydration mismatch,只能用 `<ClientOnly>` + skeleton 在应用层绕过。复现了,是真的,而且是**两个互相独立**的原因;同时报告里提到的 KunTagInput 已在 2026-06-06 修好(`cn()` 里传了未解包的 ref),这次实测 56 个组件文档页,只有 datepicker 一页有 mismatch。

**其一:触发器里嵌了一个 `<button>`。** 清除按钮是真 `<button>`,而它当时被放在外层触发器 `<button>` 里面。HTML 规范中 `<button>` 的内容模型是 "Phrasing content, but there must be no interactive content descendant and no descendant with the `tabindex` attribute specified",解析器也确实照做:遇到嵌套的 `<button>` 起始标签会先补一个隐式 `</button>`。所以浏览器把清除按钮和日历图标**从触发器里拎了出去**,解析出的 DOM 与服务端字符串对不上,Vue 报 "Hydration children mismatch"。只在**有值**的时候出现(没值就没有清除按钮),这也是为什么它一直只在部分页面翻车。

触发器改成 `<div role="combobox">` —— 与 KunSelect 的触发器同形,也是 React Aria / HeroUI / Reka UI / Element Plus / ARIA APG 的一致做法(触发器是容器,按钮是兄弟节点,从不嵌套)。视觉不变,class 串一字未动。

**其二:`new Date('2026-06-14')` 按 UTC 解析,再按本地时区格式化。** 于是 UTC 以西的浏览器整整少一天,而服务端与访客不同区时还会额外触发一次 "Hydration text content mismatch"。实测(服务端 America/Los_Angeles):浏览器设 Asia/Shanghai 时,`- rendered on server: 2026-06-13 / - expected on client: 2026-06-14`。改用 `parseISO`(日历网格本来就在用),日期只解析为**本地**零点。

**其三,顺手带出来的:键盘完全不可用。** 根节点上的 `@keydown.prevent.capture` 对**每一个**按键都调 `preventDefault()`,包括 Tab —— 焦点进去就出不来(实测连按 4 次 Tab 原地不动);而 Enter 的默认行为正是激活触发器,也被一并掐掉,于是日历根本无法用键盘打开(Enter / Space 实测均无效)。现在只对真正处理的键 `preventDefault`:Enter / Space / ↑ / ↓ 打开日历,方向键移动待选日期(`aria-activedescendant` 同步),Enter 选中,Escape 关闭,Tab 正常离开。

**其四:`disabled` 的选择器可以被清空。** 禁用状态下仍然渲染清除按钮,`clearDate()` 也不检查 `disabled`,点一下值就没了(实测)。现在禁用时不渲染该按钮,`clearDate()` 也会提前返回。

**升级注意**

- 触发器元素从 `<button type="button">` 变成 `<div role="combobox" tabindex="0">`。按 `button` 选择这个触发器的 CSS 或端到端测试需要改成 `[role="combobox"]`。日历面板新增 `id`,由触发器的 `aria-controls` 指向。
- 如果你在应用层用 `<ClientOnly>` 包住了 KunDatePicker,升到这一版之后可以拆掉了。
