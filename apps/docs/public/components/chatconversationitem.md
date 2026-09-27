# ChatConversationItem (对话列表项)

> 对话列表的一行:头像、标题、时间与发送状态,预览行依次显示「正在输入…」、草稿或最后一条消息;未读角标(静音置灰)、@ 角标、置顶标记、选中态;触屏左右滑出站点给的操作。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { DEMO_TZ, ME, demoMessage, demoPhoto, demoTime, demoUsers } from '~/utils/chatDemo'

// Every state a row has, in one list. The preview line shows, by precedence,
// who is typing, then the draft, then the last message.
const [haru, ayase, luna, gone] = [demoUsers[1]!, demoUsers[2]!, demoUsers[3]!, demoUsers[4]!]
const last = {
  haru: demoMessage(haru.id, demoTime(0, '09:14'), `对了,[@鲲](mention:${ME}) 周末的线下聚会你去吗?`),
  ayase: demoMessage(ME, demoTime(0, '08:02'), '存档我发你了'),
  luna: demoMessage(luna.id, demoTime(0, '07:40'), '', { media: demoPhoto('bg/bg4', 1920, 1200) }),
  group: demoMessage(luna.id, demoTime(3, '19:12'), '有兴趣帮忙校对的私聊我'),
  gone: demoMessage(ME, demoTime(40, '12:00'), '谢谢你的补丁!'),
}
const selected = ref('haru')
const typing = ref<KunChatTypingEvent[]>([])
let timer: ReturnType<typeof setInterval> | undefined
// A typing notification lapses after 6 s; renew it every 5 s, as a client does.
onMounted(() => {
  typing.value = [{ user_id: ayase.id, at: Date.now() }]
  timer = setInterval(() => (typing.value = [{ user_id: ayase.id, at: Date.now() }]), 5000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-md flex-col gap-0.5 rounded-kun-lg border p-1.5">
    <KunChatConversationItem
      :user="haru"
      :last-message="last.haru"
      :unread-count="3"
      :mention-count="1"
      :selected="selected === 'haru'"
      :time-zone="DEMO_TZ"
      @click="selected = 'haru'"
    />
    <KunChatConversationItem
      :user="ayase"
      :last-message="last.ayase"
      last-message-sender="你"
      status="read"
      :typing="typing"
      pinned
      :selected="selected === 'ayase'"
      :time-zone="DEMO_TZ"
      @click="selected = 'ayase'"
    />
    <KunChatConversationItem
      :user="luna"
      :last-message="last.luna"
      :draft="{ text: '第三章的校对我明天', entities: [] }"
      :selected="selected === 'luna'"
      :time-zone="DEMO_TZ"
      @click="selected = 'luna'"
    />
    <KunChatConversationItem
      title="Galgame 汉化交流 · 校对组"
      kind="group"
      :avatar="luna.avatar"
      :last-message="last.group"
      last-message-sender="樱小路露娜"
      :unread-count="128"
      muted
      :selected="selected === 'group'"
      :time-zone="DEMO_TZ"
      @click="selected = 'group'"
    />
    <KunChatConversationItem
      :user="gone"
      :last-message="last.gone"
      last-message-sender="你"
      status="sent"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
```

### Swipe.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// On a touch screen (try the phone width in devtools), swipe a row right for
// the leading actions and left for the trailing ones. What they do is the
// site's: `action` carries the key.
const haru = demoUsers[1]!
const last = demoMessage(haru.id, demoTime(0, '09:14'), '周末的线下聚会你去吗?')
const log = ref('')
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-md flex-col gap-2 rounded-kun-lg border p-1.5">
    <KunChatConversationItem
      :user="haru"
      :last-message="last"
      :unread-count="1"
      :time-zone="DEMO_TZ"
      :leading-actions="[{ key: 'read', label: '标为已读', icon: 'lucide:mail-open', color: 'primary' }]"
      :trailing-actions="[
        { key: 'mute', label: '静音', icon: 'lucide:bell-off', color: 'warning' },
        { key: 'pin', label: '置顶', icon: 'lucide:pin', color: 'success' },
        { key: 'archive', label: '归档', icon: 'lucide:archive', color: 'default' },
      ]"
      @action="(key) => (log = `action → ${key}`)"
    />
    <code class="text-default-500 px-2 text-xs">{{ log || '在触屏上左右滑动这一行' }}</code>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `avatar` | `string \| null` | `null` | Avatar URL, e.g. a group photo. Defaults to `user`'s. |
| `currentUserId` | `string` | — | The viewer's id, so a service message can say "you". |
| `draft` | `KunChatFormattedText \| null` | `null` | An unsent draft replaces the preview with "草稿：…". |
| `href` | `string` | — | Render the row as a link. Without it the row is a button. |
| `kind` | `KunChatKind` | `"direct"` | A group prefixes the preview with its sender and names who is typing; a direct chat does neither. |
| `lastMessage` | `KunChatMessage \| null` | `null` | The newest message, previewed on the second line. |
| `lastMessageSender` | `string \| null` | `null` | Who sent `lastMessage`, as the preview prefix ("你：", "鲲："). Omitted in a direct chat for the other side's messages. |
| `leadingActions` | `KunChatSwipeAction[]` | `[]` | Revealed by swiping right on a touch screen. |
| `markedUnread` | `boolean` | `false` | "Mark as unread" was used: a badge with no number. |
| `mentionCount` | `number` | `0` | Unread mentions: an @ badge. |
| `muted` | `boolean` | `false` | A muted conversation's badge is grey. |
| `pinned` | `boolean` | `false` | A pin icon where the badge would be. |
| `selected` | `boolean` | `false` | The open conversation. |
| `status` | `KunChatSendStatus` | — | Delivery state of `lastMessage` when the viewer sent it. |
| `time` | `string \| number \| Date \| null` | `null` | Defaults to `lastMessage.created_at`. |
| `timeZone` | `string` | — | IANA zone for times and day boundaries. Pass it when server-rendering, or the server's zone and the reader's disagree and hydration mismatches. |
| `title` | `string` | — | Row title. Defaults to `user`'s name. |
| `trailingActions` | `KunChatSwipeAction[]` | `[]` | Revealed by swiping left on a touch screen. |
| `typing` | `KunChatTypingEvent[]` | `[]` | Typing notifications; while one is live it replaces the preview. |
| `unreadCount` | `number` | `0` | Unread messages; the badge caps at 999+. |
| `user` | `KunChatUser \| null` | `null` | The other person of a direct chat: title, avatar and deleted state. |
| `users` | `KunChatUser[]` | `[]` | Users, to name who is typing in a group and who acted in a service message. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `action` | `key: string` | A swipe action was tapped. |
| `click` | `event: MouseEvent` | The row was activated. With `href` it also navigates. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatconversationitem
