# ChatHeader (会话头部)

> 会话顶部栏:单栏时的返回按钮、头像、标题,第二行在有人输入时变成「正在输入…」,右侧放操作按钮。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// The back button shows below `md` only (`back="mobile"`, the default). The
// second line turns into "typing…" while a typing notification is live.
const haru = demoUsers[1]!
const typing = ref<KunChatTypingEvent[]>([])
const type = () => (typing.value = [{ user_id: haru.id, at: Date.now() }])
</script>

<template>
  <div class="w-full border-default/20 flex flex-col overflow-hidden rounded-kun-lg border">
    <KunChatHeader :user="haru" subtitle="最近在线" :typing="typing">
      <template #actions>
        <KunButton is-icon-only variant="light" aria-label="搜索">
          <KunIcon name="lucide:search" />
        </KunButton>
      </template>
    </KunChatHeader>
    <KunChatHeader
      title="Galgame 汉化交流 · 校对组"
      kind="group"
      :avatar="demoUsers[3]!.avatar"
      subtitle="4 位成员"
      :back="true"
    />
    <div class="p-3">
      <KunButton size="sm" variant="flat" @click="type">模拟对方正在输入(6 秒后消失)</KunButton>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `avatar` | `string \| null` | `null` | Avatar URL, e.g. a group photo. |
| `back` | `boolean \| "mobile"` | `"mobile"` | The back button. `mobile` shows it only while the KunChatLayout around the header shows one pane (its own width below 48rem), or, outside a KunChatLayout, below the `md` window width. |
| `kind` | `KunChatKind` | `"direct"` | A direct chat says "typing…"; a group names who is typing. |
| `subtitle` | `string` | `""` | Second line, e.g. a member count. Replaced while someone types. |
| `title` | `string` | — | Title. Defaults to `user`'s name. |
| `typing` | `KunChatTypingEvent[]` | `[]` | Typing notifications as received; while one is live it replaces the subtitle. |
| `user` | `KunChatUser \| null` | `null` | The other person of a direct chat: title and avatar. |
| `users` | `KunChatUser[]` | `[]` | Users, to name who is typing in a group. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `back` | — | The back button was clicked. |
| `title-click` | `event: MouseEvent` | The avatar or title was clicked, e.g. to open the profile or details. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#actions` | `any` | Buttons on the right: search, call, a menu. |
| `#subtitle` | `any` | Replaces the second line when nobody is typing. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatheader
