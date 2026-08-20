---
'@kungal/ui-vue': minor
---

KunLink / KunButton:`rel` 改为「替换默认值」而非「叠加」,`noreferrer` 终于可以去掉

自 0.17.0 起,`target="_blank"` 的链接被无条件塞上 `rel="noopener noreferrer"`,而 `rel` prop 只能往上加、删不掉。下游踩到了后果:`noreferrer` 会连 `Referer` 请求头一起掐掉,于是合作方的统计里,从论坛点过去的流量全部记成「直接访问」——而「带来跳转」恰好是这次合作的条件。

防 tabnabbing 的是 `noopener`;`noreferrer` 是隐私默认值,不该锁死。现在 `rel` 的语义与 NuxtLink 对齐(KunLink 在 Nuxt 层渲染的正是 NuxtLink,两者此前对同一个 prop 各执一词):

| 写法 | 输出 |
| --- | --- |
| `target="_blank"`,不传 `rel` | `noopener noreferrer`(不变) |
| `target="_blank" rel="noopener"` | `noopener` ← 保留来源 |
| `target="_blank" rel="nofollow"` | `nofollow noopener` |
| `target="_blank" rel="opener"` | `opener`(规范里的反向 opt-in) |
| `rel=""` | 不渲染 `rel` 属性(等价于 NuxtLink 的 `no-rel`) |

`noopener` 仍会补回任何 `_blank` 链接,除非值里显式写了 `opener` —— 安全的那一半是底线,隐私的那一半可替换。

`KunButton` 此前根本没有 `rel` prop(只能靠未文档化、无类型的 fallthrough attr 覆盖),这次补上,与 KunLink 同语义。

**升级注意**

- 只有「同时传了 `rel` 和 `target="_blank"`」的调用点行为会变:此前是你的 token **并上** `noopener noreferrer`,现在是你的 token 并上 `noopener`。不传 `rel` 的调用点一切照旧。
- Nuxt 层下还有更隐蔽的一处:NuxtLink 自己会给**任何绝对 URL**补 `noopener noreferrer`,不需要 `target="_blank"`。所以同标签页打开的外链要留住来源,同样得写 `rel="noopener"`。实测(Nuxt dev SSR 输出):`<KunLink href="https://…">` 不传 rel → `noopener noreferrer`;传 `rel="noopener"` → `noopener`;传 `rel=""` → 无 `rel` 属性。
