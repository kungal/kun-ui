# Avatar (头像)

> 基于 KunUser 的用户头像,支持确定性贴纸兜底与点击跳转个人主页。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// A bundled data-URI avatar (no network request for the demo).
const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#7c3aed"/></svg>'
)}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" size="sm" />
  <KunAvatar :user="user" :is-navigation="false" size="md" />
  <KunAvatar :user="user" :is-navigation="false" size="lg" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `user` * | `KunUser \| null` | — |
| `className` | `string` | `""` |
| `disableFloating` | `boolean` | — |
| `floatingPosition` | `"top" \| "bottom" \| "left" \| "right"` | — |
| `imageClassName` | `string` | `""` |
| `isNavigation` | `boolean` | `true` |
| `size` | `KunAvatarSize` | `"md"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/avatar
