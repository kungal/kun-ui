# UserChip (用户胶囊)

> KunUser 的头像 + 名称 + 描述胶囊。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" :is-navigation="false" />
</template>
```

### Description.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <!-- A secondary `description` line renders under the name in a muted color. -->
  <KunUserChip
    :user="user"
    description="2024 年加入 · 管理员"
    size="lg"
    :is-navigation="false"
  />
</template>
```

### Navigation.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// With `isNavigation` (the default) and a user that has an `id`, the WHOLE chip
// becomes one crawlable link to the profile, with the name as anchor text.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" description="点击进入个人主页" />
</template>
```

### Truncate.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// Long names and descriptions truncate with an ellipsis inside a constrained box.
const user: KunUser = {
  id: 1,
  name: '这是一个非常非常长的用户名会被自动截断显示省略号',
  avatar,
}
</script>

<template>
  <div class="w-56">
    <KunUserChip
      :user="user"
      description="同样很长的一段个人简介也会被截断而不会撑破布局"
      :is-navigation="false"
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `user` * | `KunUser \| null` | — |  |
| `className` | `string` | `""` |  |
| `description` | `string` | `""` |  |
| `disableFloating` | `boolean` | `false` |  |
| `floatingPosition` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |  |
| `isNavigation` | `boolean` | `true` | When true (default) and the user has an id, the whole chip is a real <a>/link to the user's profile (crawlable, name as anchor text). |
| `size` | `KunAvatarSize` | `"md"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/userchip
