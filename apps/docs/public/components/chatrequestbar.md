# ChatRequestBar (消息请求栏)

> 陌生人对话顶部的操作栏:接受、删除、拉黑、举报,进行中的操作显示加载态。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatRequestAction } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// A conversation from someone outside your inbox rule (you do not follow
// them) arrives as a request. Deleting it does not tell them; until you accept,
// they cannot see whether you have read it.
const loading = ref<KunChatRequestAction | null>(null)
const result = ref('')
const run = (action: KunChatRequestAction) => {
  loading.value = action
  setTimeout(() => {
    loading.value = null
    result.value = `${action} 完成`
  }, 900)
}
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatRequestBar
      :user="demoUsers[2]"
      :loading="loading"
      @accept="run('accept')"
      @delete="run('delete')"
      @block="run('block')"
      @report="run('report')"
    />
    <p class="text-foreground-muted p-3 text-xs">{{ result || '选一个操作' }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `actions` | `KunChatRequestAction[]` | `["accept", "delete", "block", "report"]` | The buttons, in order. |
| `loading` | `KunChatRequestAction \| null` | `null` | The action in flight: its button spins and the others wait. |
| `user` | `KunChatUser \| null` | `null` | Who sent the request. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `accept` | — | Move the conversation into the inbox. |
| `block` | — |  |
| `delete` | — | Delete the conversation; the sender is not told. |
| `report` | — |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatrequestbar
