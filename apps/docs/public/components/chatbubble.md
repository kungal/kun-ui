# ChatBubble (消息气泡)

> Telegram 式消息气泡:自己的靠右用主色阶,别人的靠左;回复与部分引用预览、照片与相册拼图(点击进灯箱)、跨站上下文卡片、回应条,右下角时间 / 已编辑 / 发送状态,失败可重试;服务消息是居中的小胶囊。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// A run of messages from one sender: `position` rounds the corners on the
// sender's side and puts the tail on the last one. Own messages sit right in
// the primary tint; the list does that alignment, here a flex column does.
const theirs = [
  demoMessage('1002', demoTime(0, '21:03'), '在吗在吗'),
  demoMessage('1002', demoTime(0, '21:03'), '你之前说的那个补丁我装上了'),
  demoMessage('1002', demoTime(0, '21:04'), '但是一进游戏就乱码,是不是要转区?'),
]
const mine = demoMessage(ME, demoTime(0, '21:07'), '对,用 Locale Emulator 转区再开就好了', {
  edited_at: demoTime(0, '21:08'),
})
const positions = ['first', 'middle', 'last'] as const
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-0.5 rounded-kun-lg p-3">
    <KunChatBubble
      v-for="(m, i) in theirs"
      :key="m.id"
      :message="m"
      :users="demoUsers"
      :position="positions[i]"
      :time-zone="DEMO_TZ"
    />
    <KunChatBubble
      class="mt-2 self-end"
      :message="mine"
      :users="demoUsers"
      own
      status="read"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
```

### Reply.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, ME, demoMessage, demoReplyTo, demoTime, demoUsers } from '~/utils/chatDemo'

// The server embeds `reply_to` (the replied-to message's first 120 characters)
// and, for a partial quote, `reply_quote`. Clicking the preview emits
// `reply-click` with the seq — the list scrolls there.
const original = demoMessage('1002', demoTime(0, '10:35'), '最后那个反转你猜到了吗?原来||列车长就是白本人||')
const reply = demoMessage(ME, demoTime(0, '10:41'), '猜到一半,第三章那封信就有暗示了', {
  reply_to: demoReplyTo(original),
})
const quote = demoMessage(ME, demoTime(0, '10:42'), '这句我也没想到', {
  reply_to: demoReplyTo(original),
  reply_quote: { text: '列车长就是白本人', entities: [], offset: 14 },
})
const gone = demoMessage('1002', demoTime(0, '10:50'), '那条我删了哈哈', {
  reply_to: { ...demoReplyTo(original), text: '', entities: [], deleted: true },
})
const clicked = ref<number | null>(null)
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-1.5 rounded-kun-lg p-3">
    <KunChatBubble :message="original" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble class="self-end" :message="reply" :users="demoUsers" own status="read" :time-zone="DEMO_TZ" @reply-click="(s) => (clicked = s)" />
    <KunChatBubble class="self-end" :message="quote" :users="demoUsers" own status="read" :time-zone="DEMO_TZ" @reply-click="(s) => (clicked = s)" />
    <KunChatBubble :message="gone" :users="demoUsers" :time-zone="DEMO_TZ" />
    <code v-if="clicked" class="text-default-500 text-xs">reply-click → seq {{ clicked }}</code>
  </div>
</template>
```

### Media.vue

```vue
<script setup lang="ts">
import { DEMO_TZ, demoMessage, demoPhoto, demoTime, demoUsers } from '~/utils/chatDemo'

// A photo keeps its shape inside 320 × 420; photos sharing a `media_group_id`
// are one album, laid out with Telegram's mosaic. A thumbhash shows while the
// image loads; a click opens the lightbox. The photo's `url` is shown as the
// server sends it; pass `resolve-media-url` to serve a smaller preview.
const photo = demoMessage('1002', demoTime(0, '09:13'), '', { media: demoPhoto('bg/bg36', 1920, 1080) })
const captioned = demoMessage('1002', demoTime(0, '09:14'), '片头曲好好听,这张是开场动画的截图', {
  media: demoPhoto('ren/2337', 290, 599),
})
const album = [
  demoPhoto('bg/bg12', 1920, 1080),
  demoPhoto('ren/2339', 367, 602),
  demoPhoto('bg/bg25', 1920, 1239),
  demoPhoto('bg/bg4', 1920, 1200),
  demoPhoto('bg/bg45', 1920, 1268),
].map((media, i) =>
  demoMessage('1002', demoTime(0, '10:33'), i === 4 ? '通关了!最喜欢的五张 CG' : '', { media, media_group_id: '5001' })
)
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-2 rounded-kun-lg p-3">
    <KunChatBubble :message="photo" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble :message="captioned" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble
      :message="album[4]!"
      :album="album"
      :users="demoUsers"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
```

### Status.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatSendStatus } from '@kungal/ui-vue'
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// The delivery state of an own message is the site's to compute: a clock
// while sending, one tick once stored, two once the other side's read cursor
// has passed it. A failed message gets a button that emits `retry`.
const states: KunChatSendStatus[] = ['sending', 'sent', 'read', 'failed']
const texts = ['正在发送的消息', '已送达,对方还没看', '对方已读', '网络断了,没发出去']
const messages = states.map((s, i) => demoMessage(ME, demoTime(0, `22:0${i}`), texts[i]!))
const status = ref<KunChatSendStatus[]>([...states])
const retry = (i: number) => {
  status.value[i] = 'sending'
  setTimeout(() => (status.value[i] = 'sent'), 800)
}
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col items-end gap-1 rounded-kun-lg p-3 pl-12">
    <KunChatBubble
      v-for="(m, i) in messages"
      :key="m.id"
      :message="m"
      :users="demoUsers"
      own
      :status="status[i]"
      :time-zone="DEMO_TZ"
      @retry="retry(i)"
    />
  </div>
</template>
```

### Reactions.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoReactions, demoTime, demoUsers } from '~/utils/chatDemo'

// Reactions sit at the foot of the bubble; the viewer's own is filled. One per
// person: a click on another replaces yours, a click on yours removes it.
// `react` carries the new key (or null); applying it is the site's job.
const message = ref(
  demoMessage('1004', demoTime(0, '08:45'), '第三章校对完成,辛苦大家!', {
    reactions: [
      { reaction: 'party', count: 4, reacted: false },
      { reaction: 'heart', count: 3, reacted: true },
      { reaction: 'salute', count: 1, reacted: false },
    ],
  })
)
const react = (key: string | null) => {
  const reactions = message.value.reactions
    .map((r) => (r.reacted ? { ...r, count: r.count - 1, reacted: false } : r))
    .filter((r) => r.count > 0)
  const hit = reactions.find((r) => r.reaction === key)
  if (hit) Object.assign(hit, { count: hit.count + 1, reacted: true })
  else if (key) reactions.push({ reaction: key, count: 1, reacted: true })
  message.value = { ...message.value, reactions }
}
</script>

<template>
  <div class="w-full bg-default-100 rounded-kun-lg p-3">
    <KunChatBubble
      :message="message"
      :users="demoUsers"
      :reaction-options="demoReactions"
      :time-zone="DEMO_TZ"
      @react="react"
    />
  </div>
</template>
```

### Service.vue

```vue
<script setup lang="ts">
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// Service messages are centred pills, their sentence built from the action and
// the users. A message can also carry a cross-site context card.
const service = [
  demoMessage(ME, demoTime(0, '19:00'), '', { kind: 'service', service_action: { type: 'group_created', title: 'Galgame 汉化交流' } }),
  demoMessage(ME, demoTime(0, '19:01'), '', { kind: 'service', service_action: { type: 'members_added', user_ids: ['1002', '1003', '1004'] } }),
  demoMessage('1004', demoTime(0, '19:05'), '', { kind: 'service', service_action: { type: 'title_changed', title: '汉化交流 · 校对组' } }),
  demoMessage('1005', demoTime(0, '19:06'), '', { kind: 'service', service_action: { type: 'member_left' } }),
]
const withContext = demoMessage('1002', demoTime(0, '21:16'), '这个补丁的汉化是完整的吗?', {
  context: {
    site: 'moyu',
    kind: 'patch',
    id: '3021',
    title: '《星空鉄道とシロの旅》汉化补丁 v0.9',
    url: 'https://www.moyu.moe/patch/3021/introduction',
  },
})
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-2 rounded-kun-lg p-3">
    <KunChatBubble v-for="m in service" :key="m.id" :message="m" :users="demoUsers" :current-user-id="ME" />
    <KunChatBubble :message="withContext" :users="demoUsers" :time-zone="DEMO_TZ" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` * | `KunChatMessage` | — | The message. For an album, the one it acts as (reactions, replies). |
| `album` | `KunChatMessage[] \| null` | `null` | Every photo of an album, in order; omitted for anything else. |
| `currentUserId` | `string` | — | The viewer's id, so a service message can say "you". |
| `disabled` | `boolean` | `false` | Swallow clicks on the sender, reply and reactions, e.g. under a selection mode. |
| `lightbox` | `boolean` | `true` | Open photos in a built-in KunLightbox on click. The message list turns this off and shows every loaded photo in one lightbox instead. |
| `own` | `boolean` | `false` | Sent by the viewer: right-aligned, in the primary tint. |
| `position` | `KunChatBubblePosition` | `"single"` | Where the bubble sits in its sender's run: it rounds the corners on the sender's side, and `single` / `last` draw the tail. |
| `reactionOptions` | `KunChatReactionOption[]` | `[]` | The reaction vocabulary, to draw each reaction key. |
| `resolveMediaUrl` | `KunChatMediaUrlResolver` | — | Turns a photo into a URL, e.g. a smaller preview. Without it the photo's own `url` is shown. |
| `resolveMessage` | `((seq: number) => KunChatMessage)` | — | Finds a loaded message by seq — the text a "pinned a message" service line quotes. |
| `showSender` | `boolean` | `false` | Show the sender's name on top: group chats, first of a run. |
| `status` | `KunChatSendStatus` | — | Delivery state of an own message. The clock / tick / double tick at the bottom corner; `failed` is a button that emits `retry`. |
| `timeZone` | `string` | — | IANA zone for the timestamp. Pass it when server-rendering, or the server's zone and the reader's disagree and hydration mismatches. |
| `users` | `KunChatUser[]` | `[]` | Users the message refers to — its sender, a reply's sender, a service message's actors. A missing or `deleted` user shows as deleted. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `link` | `url: string, event: MouseEvent` | A link in the text or the context card was clicked. |
| `mention` | `userId: string, event: MouseEvent` | A mention in the text was clicked. |
| `photo-click` | `index: number` | A photo was clicked (index into the album). Fires with `lightbox` on as well. |
| `react` | `reaction: string \| null` | A reaction chip was clicked: the key to set, or null to remove the viewer's own. One reaction per person, so setting replaces. |
| `reply-click` | `seq: number` | The reply preview was clicked: jump to the replied-to message. |
| `retry` | — | The failed-status button was clicked. |
| `user-click` | `userId: string, event: MouseEvent` | The sender's name was clicked. It links to the profile unless you call `event.preventDefault()`. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatbubble
