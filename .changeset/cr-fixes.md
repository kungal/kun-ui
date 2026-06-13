---
"@kungal/ui-vue": patch
---

代码评审(CR)修复:针对 0.14–0.17 四批改动的真实项目缺陷。

- **KunCopy / useKunCopy** —— `useKunCopy` 此前是 fire-and-forget(返回 `void`),`KunCopy` 的 `await` 立即 resolve,导致**剪贴板写入失败时也会错误地显示「已复制」**(还和它自己弹出的失败 toast 自相矛盾)。改为 `useKunCopy` 返回 `Promise<boolean>`(并兜底 `navigator.clipboard` 不存在的情况);`KunCopy` 仅在真正成功时才切到 ✓ 状态。
- **KunMessageItem(toast)** —— `pauseTimer`/`resumeTimer` 改为幂等:`mouseenter` 与 `pointerdown` 会同时触发暂停,此前会对同一 `startTime` **重复扣减剩余时间**,使 toast 在用户悬停/触摸时提前消失(或进度条与实际计时不同步)。
- **KunNumberInput** —— 修复无 `min`/`max` 且初始为空时,「−」按钮被错误禁用(`null ?? -∞ > -∞` 为 false)的问题;空值现在可正常从 0 起步进。
- **KunImage** —— `fallbackSrc` 现在也响应「缓存命中即同步报错」路径(`status==='error'`),此前这种情况下回退图永远不会加载。
- **KunContextMenu** —— `immediate` watcher 在 SSR 且 `visible=true` 时不再访问 `document`(加 typeof 守卫),避免 `renderToString` 崩溃。
- **KunMessageProvider** —— toast 容器标记 `data-kun-overlay`,使其在 Modal/Drawer 打开(背景 inert)时仍可交互(关闭按钮/滑动可用)。
- **KunPinInput** —— `length` 减小时截断内部 refs 数组,避免保留已卸载 `<input>` 的引用。
