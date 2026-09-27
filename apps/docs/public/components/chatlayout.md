# ChatLayout (聊天外壳)

> 响应式聊天外壳:md 以上对话列表与会话两栏并排,手机上一次一栏,用 showConversation 切换;纯断点类,SSR 不猜屏幕。

## 示例

### App.vue

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type {
  KunChatFormattedText,
  KunChatMessage,
  KunChatMessageAction,
  KunChatReplyQuote,
  KunChatTypingEvent,
} from '@kungal/ui-vue'
import {
  DEMO_TZ,
  ME,
  demoMessage,
  demoReactions,
  demoReplyTo,
  demoUsers,
  makeDirectConversation,
  makeGroupConversation,
  resolveDemoMedia,
} from '~/utils/chatDemo'

// A whole chat screen: list and conversation side by side from `md` up, one at
// a time on a phone. Sending goes through a pending state, the third message
// you send fails (retry it from the red button), and 雪之下小春 answers.
const conversations = ref([
  { id: 'direct', kind: 'direct' as const, messages: makeDirectConversation(), lastReadSeq: 16, peerReadSeq: 14 },
  { id: 'group', kind: 'group' as const, messages: makeGroupConversation(), lastReadSeq: 210, peerReadSeq: 210 },
])
const openId = ref<string | null>('direct')
const open = computed(() => conversations.value.find((c) => c.id === openId.value) ?? null)
const peer = demoUsers[1]!

const draft = ref('')
const replyTo = ref<KunChatMessage | null>(null)
const quote = ref<KunChatReplyQuote | null>(null)
const editing = ref<KunChatMessage | null>(null)
const typing = ref<KunChatTypingEvent[]>([])
const list = ref<{ scrollToSeq: (seq: number) => boolean } | null>(null)

let sent = 0
const timers: ReturnType<typeof setTimeout>[] = []
onBeforeUnmount(() => timers.forEach(clearTimeout))
const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))

const now = () => new Date().toISOString()
const nextSeq = () => Math.max(...open.value!.messages.map((m) => m.seq)) + 1

const send = (body: KunChatFormattedText) => {
  const c = open.value
  if (!c) return
  sent += 1
  const pending = demoMessage(ME, now(), '', {
    ...body,
    seq: 0,
    status: 'sending',
    client_message_id: `local-${Date.now()}`,
    reply_to: replyTo.value ? demoReplyTo(replyTo.value) : null,
    reply_quote: quote.value,
  })
  c.messages.push(pending)
  const fail = sent === 3
  later(700, () => {
    const i = c.messages.findIndex((m) => m.client_message_id === pending.client_message_id)
    if (i < 0) return
    c.messages[i] = fail ? { ...pending, status: 'failed' } : { ...pending, seq: nextSeq(), status: undefined }
    if (fail || c.kind !== 'direct') return
    later(900, () => (typing.value = [{ user_id: peer.id, at: Date.now() }]))
    later(2600, () => {
      typing.value = []
      c.messages.push(demoMessage(peer.id, now(), '收到~ 我先去吃个饭,晚点细聊', { seq: nextSeq() }))
      later(1200, () => (c.peerReadSeq = nextSeq() - 1))
    })
  })
}

const retry = (message: KunChatMessage) => {
  const c = open.value!
  const i = c.messages.indexOf(message)
  if (i < 0) return
  c.messages[i] = { ...message, status: 'sending' }
  later(600, () => (c.messages[i] = { ...message, seq: nextSeq(), status: undefined }))
}

const edit = (body: KunChatFormattedText, target: KunChatMessage) => {
  const c = open.value!
  const i = c.messages.indexOf(target)
  if (i >= 0) c.messages[i] = { ...target, ...body, edited_at: now() }
}

const react = (message: KunChatMessage, reaction: string | null) => {
  const c = open.value!
  const i = c.messages.indexOf(message)
  if (i < 0) return
  const reactions = message.reactions
    .map((r) => (r.reacted ? { ...r, count: r.count - 1, reacted: false } : r))
    .filter((r) => r.count > 0)
  if (reaction) {
    const hit = reactions.find((r) => r.reaction === reaction)
    if (hit) Object.assign(hit, { count: hit.count + 1, reacted: true })
    else reactions.push({ reaction, count: 1, reacted: true })
  }
  c.messages[i] = { ...message, reactions }
}

const onAction = (action: string, message: KunChatMessage, detail: { quote?: KunChatReplyQuote }) => {
  if (action === 'reply' || action === 'quote') {
    editing.value = null
    replyTo.value = message
    quote.value = detail.quote ?? null
  } else if (action === 'edit') {
    editing.value = message
  } else if (action === 'delete') {
    const c = open.value!
    c.messages = c.messages.filter((m) => m !== message)
  } else if (action === 'pin' || action === 'unpin') {
    const c = open.value!
    const i = c.messages.indexOf(message)
    c.messages[i] = { ...message, pinned_at: action === 'pin' ? now() : null }
  }
}

const actions = (message: KunChatMessage, own: boolean): KunChatMessageAction[] => [
  'reply',
  'quote',
  'copy',
  ...(own && message.text ? (['edit'] as const) : []),
  message.pinned_at ? 'unpin' : 'pin',
  'retry',
  own ? 'delete' : 'report',
]

const editLast = () => {
  const mine = [...(open.value?.messages ?? [])].reverse().find((m) => m.sender_id === ME && m.text)
  if (mine) editing.value = mine
}

const pinned = computed(() => open.value?.messages.filter((m) => m.pinned_at) ?? [])
const last = (c: (typeof conversations.value)[number]) => c.messages[c.messages.length - 1] ?? null
const unread = (c: (typeof conversations.value)[number]) =>
  c.messages.filter((m) => m.sender_id !== ME && m.seq > c.lastReadSeq && m.kind === 'message').length
</script>

<template>
  <div class="w-full border-default/20 h-[36rem] overflow-hidden rounded-kun-lg border">
    <KunChatLayout :show-conversation="!!open">
      <template #sidebar>
        <div class="bg-content1 flex h-full flex-col gap-0.5 overflow-y-auto p-1.5">
          <KunChatConversationItem
            :user="peer"
            :last-message="last(conversations[0]!)"
            :last-message-sender="last(conversations[0]!)?.sender_id === ME ? '你' : null"
            :typing="typing"
            :unread-count="openId === 'direct' ? 0 : unread(conversations[0]!)"
            :selected="openId === 'direct'"
            :time-zone="DEMO_TZ"
            :trailing-actions="[{ key: 'archive', label: '归档', icon: 'lucide:archive' }]"
            @click="openId = 'direct'"
          />
          <KunChatConversationItem
            title="Galgame 汉化交流 · 校对组"
            kind="group"
            :avatar="demoUsers[3]!.avatar"
            :last-message="last(conversations[1]!)"
            :users="demoUsers"
            :current-user-id="ME"
            :unread-count="openId === 'group' ? 0 : 4"
            muted
            :selected="openId === 'group'"
            :time-zone="DEMO_TZ"
            @click="openId = 'group'"
          />
        </div>
      </template>

      <template v-if="open">
        <KunChatHeader
          :user="open.kind === 'direct' ? peer : null"
          :title="open.kind === 'group' ? 'Galgame 汉化交流 · 校对组' : undefined"
          :avatar="open.kind === 'group' ? demoUsers[3]!.avatar : null"
          :kind="open.kind"
          :subtitle="open.kind === 'group' ? '4 位成员' : '最近在线'"
          :typing="open.kind === 'direct' ? typing : []"
          :users="demoUsers"
          @back="openId = null"
        />
        <KunChatPinnedBar
          v-if="pinned.length"
          :messages="pinned"
          :resolve-media-url="resolveDemoMedia"
          @jump="(seq) => list?.scrollToSeq(seq)"
        />
        <KunChatMessageList
          ref="list"
          :key="open.id"
          class="bg-default-100 min-h-0 flex-1"
          :messages="open.messages"
          :users="demoUsers"
          :current-user-id="ME"
          :kind="open.kind"
          :last-read-seq="open.lastReadSeq"
          :peer-read-seq="open.peerReadSeq"
          :reaction-options="demoReactions"
          :resolve-media-url="resolveDemoMedia"
          :actions="actions"
          :time-zone="DEMO_TZ"
          @action="onAction"
          @react="react"
          @retry="retry"
        />
        <KunChatComposer
          v-model="draft"
          v-model:reply-to="replyTo"
          v-model:quote="quote"
          v-model:editing="editing"
          :users="demoUsers"
          @send="send"
          @edit="edit"
          @edit-last="editLast"
        />
      </template>

      <template #empty>
        <div class="bg-default-100 text-default-500 flex h-full items-center justify-center text-sm">
          选择一个对话开始聊天
        </div>
      </template>
    </KunChatLayout>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showConversation` | `boolean` | `false` | Which pane a narrow screen shows: the conversation, or the list. From `md` up both panes show. |
| `sidebarWidth` | `string` | `"22rem"` | Width of the list pane from `md` up, as CSS. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#default` | `any` | The open conversation. |
| `#empty` | `any` | What the right pane shows with no conversation open, from `md` up. |
| `#sidebar` | `any` | The conversation list. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatlayout
