---
"@kungal/ui-vue": minor
---

导航 / 展示 / 排版第四批升级:修零散 a11y/安全缺陷,补 Chip/Copy 能力。

修正(a11y / 安全)

- **KunScrollShadow** —— `aria-label` 此前误用了 `className`(把 CSS 类当可访问名,读屏会念出 "mt-4 flex…");新增独立 `ariaLabel` prop(默认 'scrollable content')。
- **KunLink / KunButton** —— `target="_blank"` 现在自动补 `rel="noopener noreferrer"`(tabnabbing 防护)。
- **KunAvatarGroup** —— "+N" 溢出现在从 `users.length` 推导(不传 `total` 也能显示);按 `user.id` 作 key;加 `role="group"` + 计数 `aria-label`。
- **KunDivider** —— 竖向加 `aria-orientation="vertical"`;`withLabel` 标记为弃用(label 由默认插槽是否有内容决定)。
- **KunMarkdown** —— 装饰 SVG 加 `aria-hidden`。

升级

- **KunChip** —— 新增 `closable`(× 触发 `close`,可移除标签)、`disabled`,以及 `start` / `end` 插槽(圆点/头像/图标)。
- **KunCopy** —— 复制后短暂反馈:图标切到 ✓、文案切到 `copiedText`(默认 '已复制')、`aria-live` 播报,~1.5s 复位。
- **KunImage** —— 新增 `fallbackSrc`(图裂时回退,`src` 变化时重置)。
- **KunAvatar** —— 头像 URL 裂图时回退到确定性 sticker。
- **KunPagination** —— 提供 `pageHref` 时,上一页/下一页也渲染为可爬 `<a>`(与数字页一致)。

Behavior(0.x minor)

- `KunScrollShadow` 的可访问名不再等于 `className`,改为 `ariaLabel`(默认 'scrollable content')。
