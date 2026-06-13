---
"@kungal/ui-vue": minor
---

反馈 / 状态层第三批升级:补齐 a11y(aria-live/role)、确认框可定制、Toast 体验。

修正(a11y / 正确性)

- **KunProgress** —— `variant="circle"` 现在带 `role="progressbar"` + `aria-valuenow/min/max`(此前圆环完全没有,读屏不可知);`indeterminate` 改为真正的不定动画(条形横扫 / 圆环旋转,此前只是静态满条);新增 `ariaLabel`。
- **KunLoading** —— 加载态加 `role="status"` + `aria-live="polite"` + `aria-busy`,装饰图 `aria-hidden`;新增轻量 `spinner` 变体(内联小尺寸,用打包的 spinner 图标)+ `size`。
- **KunMessage(toast)** —— error / warn 现在用 `role="alert"` + `aria-live="assertive"`(打断式),info / success 仍是 `status` / polite(此前一律 polite,错误可能被读屏忽略)。
- **AlertProvider** —— 用 `role="alertdialog"` + `aria-label`(取自 title);确认按钮改为**强调色**(主操作)、取消按钮**中性**(此前取消是红色,与惯例相反);`danger` 类型确认按钮变红。
- **useRipple** —— 涟漪 `key` 改用自增计数(此前 `Date.now()` 在同毫秒多次点击会 key 冲突)。

升级

- **useKunAlert** —— 新增 `confirmText` / `cancelText` / `type`('info'|'warning'|'danger')/ `confirmColor`(可本地化文案 + 危险确认)。
- **KunModal** —— 新增 `role`('dialog' | 'alertdialog')。
- **KunMessage(toast)** —— 每条 toast 加悬停显示的关闭按钮(`duration:0` 常驻 toast 也能手动关);每个位置最多并存 5 条(超出丢弃最旧);支持滑动关闭(触摸横向拖拽)。
- **KunBadge** —— 无锚点 slot 时渲染为独立内联徽标;新增 `ariaLabel`(如 "5 条未读")。

Behavior(0.x minor)

- `AlertProvider` 的取消按钮不再是 danger 红色,改为中性;确认按钮改为主色/按 `type` 着色。
