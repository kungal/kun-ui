# Avatar (头像)

> 基于 KunUser 的用户头像,支持确定性贴纸兜底与点击跳转个人主页。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// Any image URL works — a local/public asset (here the site icon), a remote CDN
// image, or the deterministic sticker fallback when `avatar` is omitted.
const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" />
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" size="xs" />
  <KunAvatar :user="user" :is-navigation="false" size="sm" />
  <KunAvatar :user="user" :is-navigation="false" size="md" />
  <KunAvatar :user="user" :is-navigation="false" size="lg" />
  <KunAvatar :user="user" :is-navigation="false" size="xl" />
  <KunAvatar :user="user" :is-navigation="false" size="original-sm" />
  <KunAvatar :user="user" :is-navigation="false" size="original" />
</template>
```

### StickerFallback.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// No `avatar` URL → KunAvatar falls back to a deterministic sticker, stable per
// name, so the same unknown user always gets the same picture.
const alice: KunUser = { id: 1, name: 'Alice', avatar: '' }
const bob: KunUser = { id: 2, name: 'Bob', avatar: '' }
const carol: KunUser = { id: 3, name: 'Carol', avatar: '' }
</script>

<template>
  <KunAvatar :user="alice" :is-navigation="false" size="lg" />
  <KunAvatar :user="bob" :is-navigation="false" size="lg" />
  <KunAvatar :user="carol" :is-navigation="false" size="lg" />
</template>
```

### Navigation.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// With `isNavigation` (the default) and a user that has an `id`, the avatar
// renders a real, crawlable link to the user's profile and scales on hover.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" size="lg" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `user` * | `KunUser \| null` | — | Nullable — upstream user hydration can return a missing brief; Avatar falls back to a deterministic sticker. |
| `className` | `string` | `""` |  |
| `disableFloating` | `boolean` | — | Accepted but unused (kept so existing call sites don't TS-error). |
| `floatingPosition` | `"top" \| "right" \| "bottom" \| "left"` | — |  |
| `imageClassName` | `string` | `""` |  |
| `isNavigation` | `boolean` | `true` |  |
| `size` | `KunAvatarSize` | `"md"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/avatar
