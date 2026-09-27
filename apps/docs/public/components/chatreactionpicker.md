# ChatReactionPicker (回应选择器)

> 回应词表网格(v-model 当前回应):有动图显示动图,没有显示原生 emoji;每人每条一个,点另一个即替换,再点当前的即撤销。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { demoReactions } from '~/utils/chatDemo'

// The vocabulary comes from `GET /v2/chat/reactions`: animated art where it
// has `image_url`, the native emoji otherwise. One reaction per person —
// choosing another replaces it, choosing it again removes it.
const current = ref<string | null>('heart')
const plain = demoReactions.slice(0, 8).map(({ image_url: _, ...r }) => r)
const plainCurrent = ref<string | null>(null)
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="bg-content1 border-default/20 max-w-sm rounded-kun-lg border p-2">
      <KunChatReactionPicker v-model="current" :options="demoReactions" :columns="7" />
    </div>
    <div class="bg-content1 border-default/20 max-w-sm rounded-kun-lg border p-2">
      <KunChatReactionPicker v-model="plainCurrent" :options="plain" />
    </div>
    <code class="text-default-500 text-xs">v-model: {{ current }} / {{ plainCurrent }}</code>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` * | `KunChatReactionOption[]` | — | The reaction vocabulary, as `GET /v2/chat/reactions` serves it. |
| `ariaLabel` | `string` | `locale chat.reactions` | Accessible name of the grid. |
| `columns` | `number` | `8` | Columns of the grid. |
| `modelValue` | `string \| null` | `null` | The viewer's current reaction key, or null. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `select` | `reaction: string \| null` | A reaction was chosen: its key, or null when the current one was chosen again (removing it). `v-model` has already been updated. |
| `update:modelValue` | `value: string \| null` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatreactionpicker
