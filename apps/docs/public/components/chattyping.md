# ChatTyping (正在输入)

> 三点动画 +「某某 正在输入…」:站点把收到的 typing 事件原样交进来,组件负责 6 秒过期与多人合并,尊重 prefers-reduced-motion。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// Hand over typing notifications as they arrive, stamped with Date.now(). The
// component merges them per person and lets each lapse 6 s after it came — a
// client repeats its notification every 5 s while it keeps typing.
const events = ref<KunChatTypingEvent[]>([])
const type = (id: string) => (events.value = [...events.value, { user_id: id, at: Date.now() }])
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      <KunButton v-for="u in demoUsers.slice(1, 4)" :key="u.id" size="sm" variant="flat" @click="type(u.id)">
        {{ u.name }} 输入
      </KunButton>
    </div>
    <div class="bg-content1 border-default/20 flex min-h-12 flex-col justify-center gap-1 rounded-kun-lg border px-4 py-2 text-sm">
      <KunChatTyping :events="events" :users="demoUsers" kind="group" />
      <KunChatTyping :events="events" kind="direct" />
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `events` | `KunChatTypingEvent[]` | `[]` | Typing notifications as received, each stamped with the receiving client's `Date.now()`. Each lapses 6 s after it arrived. |
| `kind` | `KunChatKind` | `"direct"` | A direct chat says "typing…"; a group names who is typing. |
| `showText` | `boolean` | `true` | Show the sentence beside the dots. |
| `users` | `KunChatUser[]` | `[]` | Users, to name who is typing in a group. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chattyping
