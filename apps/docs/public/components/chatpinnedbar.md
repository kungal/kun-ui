# ChatPinnedBar (置顶条)

> 会话顶部的置顶消息条:多条时从最新的开始,点击跳到当前这条并切到上一条,左侧分段指示位置。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ME, demoMessage, demoPhoto, demoTime, resolveDemoMedia } from '~/utils/chatDemo'

// Three pinned messages. The bar starts at the newest; each click emits `jump`
// for the one shown and moves on to the next older one, round and round.
const pinned = [
  demoMessage(ME, demoTime(3, '19:02'), '群规:聊剧情请把关键内容用 ||剧透|| 遮起来'),
  demoMessage('1004', demoTime(2, '20:10'), '', { media: demoPhoto('bg/bg1', 1920, 1080) }),
  demoMessage('1004', demoTime(0, '08:47'), '**第三章校对截止**:本周日晚 22:00'),
]
const log = ref<number[]>([])
</script>

<template>
  <div class="w-full border-default/20 flex flex-col overflow-hidden rounded-kun-lg border">
    <KunChatPinnedBar
      :messages="pinned"
      :resolve-media-url="resolveDemoMedia"
      unpinnable
      @jump="(seq) => log.unshift(seq)"
      @unpin="(seq) => log.unshift(-seq)"
    />
    <p class="text-default-500 p-3 text-xs">
      jump → {{ log.length ? log.slice(0, 5).join(', ') : '点一下置顶条' }}
    </p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `messages` * | `KunChatMessage[]` | — | Pinned messages, in any order. The bar starts at the newest and each click moves to the next older one, as Telegram does. |
| `resolveMediaUrl` | `KunChatMediaUrlResolver` | — | Turns a pinned photo's hash into a URL, for the thumbnail. |
| `unpinnable` | `boolean` | `false` | Show the × that emits `unpin`. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `jump` | `seq: number` | Scroll the conversation to this message (`scrollToSeq`). |
| `unpin` | `seq: number` | The × was clicked for the message shown. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#actions` | `any` | Extra buttons on the right, e.g. "all pinned messages". |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatpinnedbar
