# ChatText (消息文本)

> 把消息的 text + entities 渲染出来:粗体、斜体、剧透(点击揭开)、行内代码与带语言标签可复制的代码块、引用块、链接与提及。不走 v-html,实体树由 ui-core 的纯函数生成,Flutter 端照同一算法移植。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'
import { ME } from '~/utils/chatDemo'

// text + entities exactly as the API returns them. Here they come from the
// composer syntax, which is how a real message gets its entities too.
const message = parseKunChatMarkdown(
  [
    '**《星空鉄道とシロの旅》** 补丁更新了,__主线__ 已经 ++完整++ 汉化,~~番外还在路上~~ 番外下月补齐。',
    `安装说明见 [补丁页](https://www.moyu.moe/patch/3021/introduction),有问题 [@鲲](mention:${ME})。`,
    '> 转区后再启动,不然会乱码。',
    '启动命令:',
    '```shell\nLANG=ja_JP.UTF-8 wine "Game.exe"\n```',
    '存档在 `%APPDATA%/StarRail` 下面。',
  ].join('\n')
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 rounded-kun-lg border p-4 text-[0.9375rem] leading-snug">
    <KunChatText :text="message.text" :entities="message.entities" />
  </div>
</template>
```

### Spoiler.vue

```vue
<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// Covered in the server HTML already (no JS needed to hide it); one click
// uncovers every spoiler in the message, and the cover dissolves.
const message = parseKunChatMarkdown(
  '通关了!最后的反转是 ||列车长就是白本人||,而且 ||第三章那封信|| 早就暗示过了。'
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 rounded-kun-lg border p-4 text-[0.9375rem]">
    <KunChatText :text="message.text" :entities="message.entities" />
  </div>
</template>
```

### Preview.vue

```vue
<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// `preview` is the one-line form used by conversation rows, reply and pinned
// bars: blocks run inline, links are plain text, and a spoiler's text is not
// rendered at all — only a mask.
const message = parseKunChatMarkdown(
  '结局是 ||列车长就是白本人||!**强烈推荐**,攻略见 [论坛](https://www.kungal.com/topic/1024)\n```\nwine Game.exe\n```'
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-sm flex-col gap-1 rounded-kun-lg border p-3 text-sm">
    <span class="font-semibold">雪之下小春</span>
    <span class="text-default-500 truncate">
      <KunChatText :text="message.text" :entities="message.entities" preview />
    </span>
  </div>
</template>
```

### Events.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// Links open in a new tab and mentions link to the profile by default; both
// emit first, so a site can take over — route an in-site URL, open a user card.
const message = parseKunChatMarkdown(
  '[@雪之下小春](mention:1002) 发了 [补丁页](https://www.moyu.moe/patch/3021/introduction),详见 https://www.kungal.com/topic/1024'
)
// The server marks bare URLs with a `url` entity; the demo does it by hand.
const at = message.text.indexOf('https://www.kungal.com')
message.entities.push({ type: 'url', offset: at, length: message.text.length - at })
const log = ref('点一下链接或提及')

const onLink = (url: string, event: MouseEvent) => {
  event.preventDefault()
  log.value = `link → ${url}`
}
const onMention = (id: string, event: MouseEvent) => {
  event.preventDefault()
  log.value = `mention → 用户 ${id}`
}
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex flex-col gap-2 rounded-kun-lg border p-4 text-[0.9375rem]">
    <KunChatText :text="message.text" :entities="message.entities" @link="onLink" @mention="onMention" />
    <code class="text-default-500 text-xs">{{ log }}</code>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` * | `string` | — | Message text. |
| `entities` | `KunChatEntity[] \| null` | `null` | Formatting ranges over `text`, in UTF-16 code units. Normalized before rendering, so malformed input renders instead of throwing. |
| `preview` | `boolean` | `false` | One-line summary rendering for previews (conversation rows, reply and pinned bars): blocks flatten inline, links are plain text, spoilers are masked so their text is not in the DOM at all. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `link` | `url: string, event: MouseEvent` | A link was clicked. It opens in a new tab unless you call `event.preventDefault()`, e.g. to route an in-site URL. |
| `mention` | `userId: string, event: MouseEvent` | A mention was clicked. It is a real link to the profile (`userLinkTemplate`); call `event.preventDefault()` to handle it yourself. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chattext
