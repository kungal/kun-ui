# AvatarGroup (头像组)

> 层叠头像组,超出部分以 +N 角标展示。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const users: KunUser[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <KunAvatarGroup :users="users" />
</template>
```

### Overflow.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const users: KunUser[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <!-- Only `visibleCount` avatars render; the rest collapse into a "+N" chip.
       Pass `total` to count members beyond the array you actually have. -->
  <KunAvatarGroup :users="users" :visible-count="4" :total="12" />
</template>
```

### ShowAll.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const users: KunUser[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <!-- `ellipsis="false"` disables the "+N" chip and renders every avatar.
       `ariaLabel` overrides the default "N 位用户" group label for screen readers. -->
  <KunAvatarGroup :users="users" :ellipsis="false" aria-label="项目协作者" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `users` * | `KunUser[]` | — |
| `ariaLabel` | `string` | `undefined` |
| `ellipsis` | `boolean` | `true` |
| `total` | `number` | `undefined` |
| `visibleCount` | `number` | `5` |

---
本页来源 · KunUI · https://ui.kungal.com/components/avatargroup
