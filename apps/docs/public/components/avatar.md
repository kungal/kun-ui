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

// No `avatar` URL → KunAvatar picks from `avatarFallbackPool`, hashed on the
// name, so the same unknown user always gets the same picture. The pool is HOST
// config: leave it unset and all three of these render the identical bundled
// fallback instead. This site configures it in app/plugins/kun-avatar-pool.ts.
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

### Decoration.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = {
  id: 1,
  name: 'Kun',
  avatar: '/favicon.webp',
  avatarDecoration: {
    src: '/demo/decorations/sakura.png',
    animatedSrc: '/demo/decorations/sakura.webp',
  },
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" :is-navigation="false" />
      <span class="text-default-500 text-xs">hover</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" decoration="always" :is-navigation="false" />
      <span class="text-default-500 text-xs">always</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" decoration="static" :is-navigation="false" />
      <span class="text-default-500 text-xs">static</span>
    </div>
    <div class="flex items-center gap-4">
      <KunAvatar :user="user" size="sm" :is-navigation="false" />
      <KunAvatar :user="user" size="md" :is-navigation="false" />
      <KunAvatar :user="user" size="lg" :is-navigation="false" />
      <KunAvatar :user="user" size="xl" :is-navigation="false" />
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `user` * | `KunUser \| null` | — | Nullable — upstream user hydration can return a missing brief; Avatar falls back to a deterministic sticker. |
| `className` | `string` | `""` |  |
| `decoration` | `KunAvatarDecorationMode` | `"hover"` | How `user.avatarDecoration` is drawn. `hover` (default) shows the still frame and plays the animated one while the avatar is hovered or focused; `always` plays it continuously; `static` never animates; `none` hides the frame. Below the `md` size the frame is never drawn, and a reader who asked for reduced motion always gets the still image. |
| `disableFloating` | `boolean` | — | Legacy floating user-card toggle. **已废弃**：No-op: KunAvatar renders no floating card. Accepted so existing call sites still type-check; safe to remove from them. |
| `floatingPosition` | `"top" \| "right" \| "bottom" \| "left"` | — | Legacy floating user-card placement. **已废弃**：No-op: KunAvatar renders no floating card. Accepted so existing call sites still type-check; safe to remove from them. |
| `imageClassName` | `string` | `""` |  |
| `isNavigation` | `boolean` | `true` | When true (default) and `user.id` is not 0, the avatar is a real <a>/link to the user's profile (`userLinkTemplate`). |
| `size` | `KunAvatarSize` | `"md"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/avatar
