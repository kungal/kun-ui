# ChatMessageList (消息列表)

> 会话的消息流:同一发送人连续消息合并成组、日期分隔条吸顶、「以下为未读消息」分隔线并从那里打开;向上加载更早消息不跳、在底部时新消息自动贴底、不在底部时回到底部按钮累计未读;scrollToSeq 跳转并高亮;右键 / 长按菜单与左滑回复。

## 示例

### Direct.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DEMO_TZ,
  ME,
  demoReactions,
  demoUsers,
  makeDirectConversation,
} from '~/utils/chatDemo'

// A direct chat opened with unread messages: it opens at the "unread" divider,
// and `read` reports how far you have actually seen. Right-click (or long-press)
// a message for the menu; photos open in one lightbox for the whole chat.
const messages = ref(makeDirectConversation())
const readUpTo = ref(16)
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <KunChatMessageList
      class="bg-default-100 flex-1"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :last-read-seq="16"
      :peer-read-seq="14"
      :reaction-options="demoReactions"
      :time-zone="DEMO_TZ"
      @read="(seq) => (readUpTo = seq)"
    />
    <p class="text-default-500 border-default/20 border-t px-3 py-1.5 text-xs">
      已读到 seq {{ readUpTo }}
    </p>
  </div>
</template>
```

### Group.vue

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DEMO_TZ,
  ME,
  demoReactions,
  demoUsers,
  makeGroupConversation,
} from '~/utils/chatDemo'

// A group: names on the first message of each run, the avatar beside the last,
// service messages as centred pills. Click the pinned bar to jump to the
// pinned message and see it flash.
const messages = ref(makeGroupConversation())
const pinned = computed(() => messages.value.filter((m) => m.pinned_at))
const list = ref<{ scrollToSeq: (seq: number) => boolean } | null>(null)
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <KunChatPinnedBar :messages="pinned" @jump="(seq) => list?.scrollToSeq(seq)" />
    <KunChatMessageList
      ref="list"
      class="bg-default-100 flex-1"
      kind="group"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :reaction-options="demoReactions"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
```

### Paging.vue

```vue
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import type { KunChatMessage } from '@kungal/ui-vue'
import { ME, demoUsers, makeHistory } from '~/utils/chatDemo'

// Paging both ways, as the API does it (`before_seq`, `after_seq`,
// `around_seq`). Scroll up: older pages arrive above you and the view does not
// move. "跳到第 5 条" loads a window around a message that is not loaded — the
// list is then detached from the newest message (`has-newer`), and the
// scroll-down button brings the newest page back.
const PAGE = 30
const history = shallowRef<KunChatMessage[]>([])
const loaded = ref<KunChatMessage[]>([])
const loadingOlder = ref(false)
const loadingNewer = ref(false)
const list = ref<{ scrollToSeq: (seq: number) => boolean; scrollToBottom: () => void } | null>(null)

const first = computed(() => loaded.value[0]?.seq ?? 0)
const last = computed(() => loaded.value[loaded.value.length - 1]?.seq ?? 0)
const hasOlder = computed(() => first.value > 1)
const hasNewer = computed(() => last.value < history.value.length)
const slice = (from: number, to: number) => history.value.filter((m) => m.seq >= from && m.seq <= to)

onMounted(() => {
  history.value = makeHistory(400)
  loaded.value = slice(history.value.length - PAGE + 1, history.value.length)
})

const later = (fn: () => void) => setTimeout(fn, 500)
const loadOlder = () => {
  loadingOlder.value = true
  later(() => {
    loaded.value = [...slice(first.value - PAGE, first.value - 1), ...loaded.value]
    loadingOlder.value = false
  })
}
const loadNewer = () => {
  loadingNewer.value = true
  later(() => {
    loaded.value = [...loaded.value, ...slice(last.value + 1, last.value + PAGE)]
    loadingNewer.value = false
  })
}
const jump = async (seq: number) => {
  if (list.value?.scrollToSeq(seq)) return
  loaded.value = slice(seq - PAGE / 2, seq + PAGE / 2)
  await nextTick()
  list.value?.scrollToSeq(seq)
}
const latest = async () => {
  loaded.value = slice(history.value.length - PAGE + 1, history.value.length)
  await nextTick()
  list.value?.scrollToBottom()
}
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <div class="border-default/20 flex items-center gap-2 border-b px-3 py-2 text-sm">
      <KunButton size="sm" variant="flat" @click="jump(5)">跳到第 5 条</KunButton>
      <span class="text-default-500">已载入 seq {{ first }}–{{ last }},共 {{ history.length }} 条</span>
    </div>
    <KunChatMessageList
      ref="list"
      class="bg-default-100 flex-1"
      :messages="loaded"
      :users="demoUsers"
      :current-user-id="ME"
      :has-older="hasOlder"
      :has-newer="hasNewer"
      :loading-older="loadingOlder"
      :loading-newer="loadingNewer"
      @load-older="loadOlder"
      @load-newer="loadNewer"
      @jump="jump"
      @latest="latest"
    >
      <template #start>
        <p class="text-default-500 py-4 text-center text-xs">这是你们对话的开始</p>
      </template>
    </KunChatMessageList>
  </div>
</template>
```

### Thousands.vue

```vue
<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue'
import type { KunChatMessage } from '@kungal/ui-vue'
import { ME, demoReactions, demoUsers, makeHistory } from '~/utils/chatDemo'

// Three thousand messages in one list. Rows off screen skip layout and paint
// (`content-visibility: auto`), so scrolling stays smooth without a
// virtualisation library; the button reports how long the first render took.
const messages = shallowRef<KunChatMessage[]>([])
const took = ref<number | null>(null)

const load = async (count: number) => {
  const start = performance.now()
  messages.value = makeHistory(count)
  await nextTick()
  requestAnimationFrame(() => (took.value = Math.round(performance.now() - start)))
}
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <div class="border-default/20 flex items-center gap-2 border-b px-3 py-2 text-sm">
      <KunButton size="sm" variant="flat" @click="load(3000)">载入 3000 条</KunButton>
      <span v-if="took !== null" class="text-default-500">
        {{ messages.length }} 条,首次渲染 {{ took }} ms
      </span>
    </div>
    <KunChatMessageList
      class="bg-default-100 flex-1"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :reaction-options="demoReactions"
    >
      <template #empty>点上面的按钮载入 3000 条消息</template>
    </KunChatMessageList>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentUserId` * | `string` | — | The viewer's id. Their messages sit on the right, and a pending one they send (`status: 'sending'`) scrolls the list to the bottom. |
| `messages` * | `KunChatMessage[]` | — | Messages in display order, oldest first. Pending ones go last, carrying `client_message_id` and `status`. |
| `actions` | `((message: KunChatMessage, own: boolean) => KunChatMessageAction[])` | — | Which actions the menu offers for a message — permissions are the site's call. `quote` shows only while text of the message is selected, `copy` only for a message with text. Default `['reply', 'copy']`. |
| `ariaLabel` | `string` | `locale chat.messages` | Accessible name of the scroll region. |
| `groupWindow` | `number` | `600` | Longest gap, in seconds, inside one run of a sender's messages. |
| `hasNewer` | `boolean` | `false` | The list is a window that does not reach the newest message (after a jump): scrolling near the bottom emits `load-newer`, and the scroll-down button emits `latest`. |
| `hasOlder` | `boolean` | `false` | More history exists above: scrolling near the top emits `load-older`. |
| `kind` | `KunChatKind` | `"direct"` | `group` shows names and avatars on others' messages; `direct` does not. |
| `lastReadSeq` | `number \| null` | `null` | The viewer's read cursor as it was when the conversation opened. The unread divider goes above the first later message someone else sent, and the list opens there. Keep it fixed while the conversation is open, or the divider walks down as messages get read. |
| `loadingNewer` | `boolean` | `false` | The same for `load-newer`, at the bottom. |
| `loadingOlder` | `boolean` | `false` | A `load-older` request is in flight: a spinner shows on top and no second request goes out. Without it, the list waits for the first message to change before asking again. |
| `peerReadSeq` | `number \| null` | `null` | The other side's read cursor: own messages at or below it show the double tick, unless they carry their own `status`. |
| `reactionOptions` | `KunChatReactionOption[]` | `[]` | The reaction vocabulary: the menu's quick row, and the art on reaction chips. |
| `resolveMediaUrl` | `KunChatMediaUrlResolver` | — | Turns a photo into a URL, e.g. a smaller preview. Without it the photo's own `url` is shown. |
| `swipeToReply` | `boolean` | `true` | Swipe a bubble left to reply, on touch screens. |
| `timeZone` | `string` | — | IANA zone for times and day boundaries. Pass it when server-rendering, or the server's zone and the reader's disagree and hydration mismatches. |
| `unreadCount` | `number` | — | Unread count on the scroll-down button. Defaults to the messages of others below the read position that the list has seen. |
| `users` | `KunChatUser[]` | `[]` | The `users` of the chat responses: senders, reply targets, actors. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `action` | `action: string, message: KunChatMessage, detail: { quote?: KunChatReplyQuote; }` | A menu action, or a swipe (`reply`). `detail.quote` is set for `quote`: the selected part of the message. `copy` has already been done. |
| `jump` | `seq: number` | A reply target that is not loaded was clicked: load around it (`around_seq`), then call `scrollToSeq(seq)`. |
| `latest` | — | The scroll-down button was pressed while `hasNewer`: reload the newest page, then call `scrollToBottom()`. |
| `link` | `url: string, event: MouseEvent` | A link in a message was clicked. |
| `load-newer` | — | Scrolled near the bottom while `hasNewer`: fetch the page after. |
| `load-older` | — | Scrolled near the top while `hasOlder`: fetch the page before. |
| `mention` | `userId: string, event: MouseEvent` | A mention in a message was clicked. |
| `react` | `message: KunChatMessage, reaction: string \| null` | Set the viewer's reaction on a message, or remove it (null). |
| `read` | `seq: number` | Others' messages up to this seq have been on screen while the page was visible: mark them read. Only ever increases. |
| `retry` | `message: KunChatMessage` | Resend a failed message. |
| `user-click` | `userId: string, event: MouseEvent` | A sender's avatar or name was clicked. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#empty` | `any` | Shown when there are no messages. |
| `#footer` | `any` | Below the last message, e.g. a typing bubble. |
| `#start` | `any` | Above the first message once there is no older history, e.g. "this is the start of your conversation". |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatmessagelist
