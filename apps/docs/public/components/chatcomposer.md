# ChatComposer (输入区)

> 聊天输入区:自动长高,Enter 发送 / Shift+Enter 换行(触屏反过来,可配置),markdown 快捷写法发出时转成 entities,回复 / 引用 / 编辑预览条,粘贴或拖入图片,接近 4096 字上限时显示计数,输入时节流发出 typing。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatFormattedText } from '@kungal/ui-vue'

// Type with the shortcuts — **粗体**、||剧透||、`代码`、```语言 代码块``` — and
// send: `send` carries the parsed text and entities, the input clears.
// Enter sends and Shift+Enter breaks the line; on a touch screen it is the
// other way round. Typing emits `typing` at most once every 5 s.
const draft = ref('周末去漫展吗?**上午十点** 地铁站 B 口集合,||我会 cos 白||')
const sent = ref<KunChatFormattedText | null>(null)
const typingAt = ref<string | null>(null)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <pre
      v-if="sent"
      class="bg-default-100 max-h-48 overflow-auto p-3 text-xs"
    >{{ JSON.stringify(sent, null, 2) }}</pre>
    <p v-if="typingAt" class="text-foreground-muted px-3 pt-2 text-xs">typing 事件:{{ typingAt }}</p>
    <KunChatComposer
      v-model="draft"
      @send="(m) => (sent = m)"
      @typing="typingAt = new Date().toLocaleTimeString()"
    />
  </div>
</template>
```

### ReplyEdit.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatFormattedText, KunChatMessage, KunChatReplyQuote } from '@kungal/ui-vue'
import { ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// `reply-to`, `quote` and `editing` are v-models the message menu sets. While
// editing, the message comes back into the input in the shortcut syntax
// (formatKunChatMarkdown) and the unsent draft waits aside; Esc or × cancels,
// ↑ in an empty input asks to edit your last message.
const hers = demoMessage('1002', demoTime(0, '10:35'), '最后那个反转你猜到了吗?原来||列车长就是白本人||')
const mine = demoMessage(ME, demoTime(0, '10:42'), '不过前作的__系统__有点老,存档记得**多开几个位**')
const draft = ref('这是还没发出去的草稿')
const replyTo = ref<KunChatMessage | null>(null)
const quote = ref<KunChatReplyQuote | null>(null)
const editing = ref<KunChatMessage | null>(null)
const log = ref('')
const onSend = (m: KunChatFormattedText) => (log.value = `send:${m.text}`)
const onEdit = (m: KunChatFormattedText) => (log.value = `edit:${m.text}`)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <div class="flex flex-wrap gap-2 p-3">
      <KunButton size="sm" variant="flat" @click="(replyTo = hers), (quote = null)">回复她</KunButton>
      <KunButton
        size="sm"
        variant="flat"
        @click="(replyTo = hers), (quote = { text: '列车长就是白本人', entities: [], offset: 14 })"
      >
        引用一段
      </KunButton>
      <KunButton size="sm" variant="flat" @click="editing = mine">编辑我的消息</KunButton>
      <span class="text-foreground-muted self-center text-xs">{{ log }}</span>
    </div>
    <KunChatComposer
      v-model="draft"
      v-model:reply-to="replyTo"
      v-model:quote="quote"
      v-model:editing="editing"
      :users="demoUsers"
      @send="onSend"
      @edit="onEdit"
      @edit-last="editing = mine"
    />
  </div>
</template>
```

### Attachments.vue

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { KunChatAttachment } from '@kungal/ui-vue'

// Pick, paste or drop images: `attach` hands over the files. The site uploads
// them (NextMoe: POST /v2/chat/images) and lists them in `attachments` with a
// local preview and progress; a failed one is a button that emits
// `retry-attachment`. Here every third upload fails once.
const attachments = ref<KunChatAttachment[]>([])
const draft = ref('')
let count = 0
const urls: string[] = []

const upload = (key: string) => {
  const item = attachments.value.find((a) => a.key === key)
  if (!item) return
  Object.assign(item, { progress: 0, error: false })
  const fail = ++count % 3 === 0
  const tick = setInterval(() => {
    const a = attachments.value.find((x) => x.key === key)
    if (!a) return clearInterval(tick)
    a.progress = Math.min(1, (a.progress ?? 0) + 0.2)
    if (fail && a.progress >= 0.6) {
      clearInterval(tick)
      a.error = true
    } else if (a.progress >= 1) {
      clearInterval(tick)
      a.progress = undefined
    }
  }, 250)
}

const onAttach = (files: File[]) => {
  for (const file of files.filter((f) => f.type.startsWith('image/'))) {
    const url = URL.createObjectURL(file)
    urls.push(url)
    const key = `${file.name}-${Date.now()}-${Math.random()}`
    attachments.value.push({ key, url, name: file.name, progress: 0 })
    upload(key)
  }
}
const remove = (key: string) => (attachments.value = attachments.value.filter((a) => a.key !== key))
const send = () => (attachments.value = [])
onBeforeUnmount(() => urls.forEach((u) => URL.revokeObjectURL(u)))
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <p class="text-foreground-muted px-3 pt-3 text-xs">点回形针选图,或把图片粘贴 / 拖到输入区。</p>
    <KunChatComposer
      v-model="draft"
      :attachments="attachments"
      @attach="onAttach"
      @remove-attachment="remove"
      @retry-attachment="upload"
      @send="send"
    />
  </div>
</template>
```

### Limit.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// The limit counts the parsed text, as the server does — shortcut markers are
// free. The counter appears for the last 200 characters and turns red past the
// limit, where sending is blocked.
const draft = ref(`${'这是一段很长的攻略。'.repeat(398)}**结尾**`)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatComposer v-model="draft" :max-rows="4" />
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
// When sending is not possible — the other account was deleted, you were
// blocked — the input gives way to a line saying why.
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatComposer disabled disabled-text="对方已注销,无法继续发送消息" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | `"image/*"` | `accept` of the attach button's file picker. Pasted and dropped files are passed on unfiltered. |
| `attachments` | `KunChatAttachment[]` | `[]` | Photos being uploaded for this message, shown above the input. |
| `disabled` | `boolean` | `false` | Replace the input with `disabledText`, e.g. for a deleted peer. |
| `disabledText` | `string` | `""` | Why sending is not possible, shown in place of the input. |
| `editing` | `KunChatMessage \| null` | `null` | The message being edited. Setting it puts the message in the input (the draft is kept aside and comes back when editing ends); `edit` fires instead of `send`. |
| `enterToSend` | `boolean \| "auto"` | `"auto"` | Enter sends and Shift+Enter breaks the line, or the reverse. `auto`: Enter sends with a fine pointer, breaks the line on a touch screen. |
| `maxLength` | `number` | `4096` | Longest message, counted on the parsed text. The counter shows in the last 200. |
| `maxRows` | `number` | `8` | Growth limit of the input, in lines, before it scrolls. |
| `modelValue` | `string` | `""` | The input as typed, shortcuts included. Keep a draft as `parseKunChatMarkdown(value)` and restore it with `formatKunChatMarkdown`. |
| `placeholder` | `string` | `locale chatComposer.placeholder` | Placeholder text. |
| `quote` | `KunChatReplyQuote \| null` | `null` | The quoted part of `replyTo`, from the message menu's `quote`. |
| `replyTo` | `KunChatMessage \| null` | `null` | The message being replied to; the bar above the input shows it. Cleared on send and on cancel. |
| `users` | `KunChatUser[]` | `[]` | Users, to name whoever a reply is to. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `attach` | `files: File[]` | Files were picked, pasted or dropped: upload them and list them in `attachments`. |
| `edit` | `message: KunChatFormattedText, target: KunChatMessage` | Save an edit of `target`. Editing ends and the draft comes back. |
| `edit-last` | — | ↑ in an empty input: start editing your last message, as Telegram Desktop does. |
| `remove-attachment` | `key: string` | The × of an attachment was clicked. |
| `retry-attachment` | `key: string` | A failed attachment (`error`) was clicked: upload it again. |
| `send` | `message: KunChatFormattedText` | Send a new message. The input is cleared and the reply consumed. |
| `typing` | — | The user is typing: at most once per 5 s, never while editing. Send the typing notification. |
| `update:editing` | `value: KunChatMessage \| null` |  |
| `update:modelValue` | `value: string` |  |
| `update:quote` | `value: KunChatReplyQuote \| null` |  |
| `update:replyTo` | `value: KunChatMessage \| null` |  |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#prefix` | `any` | Before the input, after the attach button, e.g. an emoji button. |
| `#suffix` | `any` | After the input, before the send button. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatcomposer
