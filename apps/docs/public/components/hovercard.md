# HoverCard (悬停卡片)

> 鼠标悬停或键盘聚焦在链接上时浮出的预览卡片,点击照常跟随链接,触屏上不出现。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = { id: 42, name: '鲲', avatar: '/favicon.webp' }
const following = ref(false)
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <KunHoverCard>
      <template #trigger>
        <KunUserChip :user="user" />
      </template>

      <div class="w-72 space-y-3 p-4">
        <div class="flex items-center gap-3">
          <KunAvatar :user="user" size="lg" :is-navigation="false" />
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ user.name }}</p>
            <p class="text-default-500 text-xs">2019 年加入 · 管理员</p>
          </div>
          <KunButton
            size="sm"
            :variant="following ? 'flat' : 'solid'"
            @click="following = !following"
          >
            {{ following ? '已关注' : '关注' }}
          </KunButton>
        </div>
        <p class="text-default-600 text-sm">
          写 galgame 攻略和补丁,偶尔修 bug。
        </p>
        <div class="border-kun grid grid-cols-3 border-t pt-3 text-center">
          <div>
            <p class="font-semibold">128</p>
            <p class="text-default-500 text-xs">话题</p>
          </div>
          <div>
            <p class="font-semibold">2,301</p>
            <p class="text-default-500 text-xs">回复</p>
          </div>
          <div>
            <p class="font-semibold">12,480</p>
            <p class="text-default-500 text-xs">萌萌点</p>
          </div>
        </div>
      </div>
    </KunHoverCard>
    <span class="text-default-500">发布于 3 小时前</span>
  </div>
</template>
```

### Group.vue

```vue
<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const replies: { user: KunUser; joined: string; text: string }[] = [
  {
    user: { id: 42, name: '鲲', avatar: '/favicon.webp' },
    joined: '2019 年加入',
    text: '补丁已经更新到 1.2,之前存档不兼容的问题修好了。',
  },
  {
    user: { id: 7, name: 'KUN Galgame', avatar: '/kungalgame.webp' },
    joined: '2021 年加入',
    text: '感谢汉化组,周末就去通关。',
  },
  {
    user: { id: 103, name: '路过的旅人', avatar: '' },
    joined: '2024 年加入',
    text: '请问 Steam 版能直接用这个补丁吗?',
  },
]
</script>

<template>
  <ul class="w-full">
    <li
      v-for="reply in replies"
      :key="reply.user.id"
      class="border-kun flex gap-3 border-b py-3 last:border-b-0"
    >
      <KunHoverCard group="replies" position="right-start">
        <template #trigger>
          <KunAvatar :user="reply.user" />
        </template>

        <div class="flex w-60 items-center gap-3 p-3">
          <KunAvatar :user="reply.user" size="lg" :is-navigation="false" />
          <div class="min-w-0">
            <p class="truncate font-semibold">{{ reply.user.name }}</p>
            <p class="text-default-500 text-xs">{{ reply.joined }}</p>
          </div>
        </div>
      </KunHoverCard>
      <div class="min-w-0 text-sm">
        <p class="font-medium">{{ reply.user.name }}</p>
        <p class="text-default-600">{{ reply.text }}</p>
      </div>
    </li>
  </ul>
</template>
```

### LazyContent.vue

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = { id: 7, name: 'KUN Galgame', avatar: '/kungalgame.webp' }

const open = ref(false)
const stats = ref<{ topics: number; followers: number } | null>(null)

// Fetch once, on the first open; the card shows a skeleton until it lands.
watch(open, async (isOpen) => {
  if (!isOpen || stats.value) return
  await new Promise((resolve) => setTimeout(resolve, 800))
  stats.value = { topics: 56, followers: 1024 }
})
</script>

<template>
  <KunHoverCard v-model:open="open">
    <template #trigger>
      <KunUserChip :user="user" description="悬停查看资料" />
    </template>

    <div class="w-56 space-y-2 p-4">
      <p class="font-semibold">{{ user.name }}</p>
      <template v-if="stats">
        <p class="text-default-600 text-sm">{{ stats.topics }} 个话题</p>
        <p class="text-default-600 text-sm">{{ stats.followers }} 位关注者</p>
      </template>
      <template v-else>
        <KunSkeleton variant="text" width="60%" />
        <KunSkeleton variant="text" width="40%" />
      </template>
    </div>
  </KunHoverCard>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `autoPosition` | `boolean` | `true` | Avoid viewport collisions: flip to the opposite side, shift along the edge, and cap height/width to the available space so tall content scrolls instead of overflowing. Set `false` to honour `position` verbatim. |
| `closeDelay` | `number` | `300` | ms grace after the pointer leaves the trigger or the card, long enough to cross the gap between them. |
| `disabled` | `boolean` | `false` | Render the trigger alone, with no card and no listeners. For a trigger that has nothing to preview, such as a deleted user. |
| `group` | `string` | — | Shared id for a list of cards (every author avatar on a page): only one is open at a time, and once one is open, moving to a sibling switches at once instead of waiting out `openDelay` again. |
| `innerClass` | `string` | `""` | Classes for the floating panel. |
| `opaque` | `boolean` | `false` | Force a fully opaque panel, ignoring a globally lowered `--kun-surface-opacity`. See KunPopover's `opaque`. |
| `open` | `boolean` | `false` | Whether the card is open. Bind `v-model:open` to prefetch or track it, or to close it from outside. |
| `openDelay` | `number` | `600` | ms a mouse must rest on the trigger, or keyboard focus stay on it, before the card opens. |
| `position` | `KunPopoverPosition` | `"bottom-start"` | Placement relative to the trigger. |
| `rounded` | `KunUIRounded` | — | Corner radius of the card. Left unset it follows the app-wide config. |
| `showArrow` | `boolean` | `false` | Render a caret pointing at the trigger. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `update:open` | `value: boolean` |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#default` | `{ close: () => void; }` | The card. Mounted only while open, so a fetch in its setup runs on open. |
| `#trigger` | `any` | The element the card previews, usually a link. The card anchors to its first element. |

---
本页来源 · KunUI · https://ui.kungal.com/components/hovercard
