# UserChip (用户胶囊)

> KunUser 的头像 + 名称 + 描述胶囊。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/></svg>'
)}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" description="Member since 2024" :disable-floating="true" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `user` * | `KunUser \| null` | — |
| `className` | `string` | `""` |
| `description` | `string` | `""` |
| `disableFloating` | `boolean` | `false` |
| `floatingPosition` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` |
| `size` | `KunAvatarSize` | `"md"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/userchip
