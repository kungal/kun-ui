# ChatMessageMenu (消息菜单)

> 消息的右键 / 长按菜单:顶部一排快捷回应(可展开全部),下面是回复、引用、复制、编辑、置顶、删除、举报——哪些项出现由站点决定。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoReactions, demoTime, demoUsers } from '~/utils/chatDemo'

// Right-click the bubble (long-press on a touch screen). Which actions appear
// is the site's decision — its permissions, its time limits; custom items can
// sit beside the built-in ones. KunChatMessageList opens this for you.
const message = demoMessage('1002', demoTime(0, '09:14'), '周末的线下聚会你去吗?')
const menu = ref<{ x: number; y: number } | null>(null)
const reaction = ref<string | null>(null)
const log = ref('')
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-3 rounded-kun-lg p-3">
    <div @contextmenu.prevent="(e) => (menu = { x: e.clientX, y: e.clientY })">
      <KunChatBubble :message="message" :users="demoUsers" :time-zone="DEMO_TZ" />
    </div>
    <code class="text-default-500 text-xs">{{ log || '右键点击上面的消息' }}</code>
    <KunChatMessageMenu
      :visible="!!menu"
      :position="menu"
      :actions="['reply', 'copy', 'pin', { key: 'translate', label: '翻译', icon: 'lucide:external-link' }, 'report']"
      :reactions="demoReactions"
      :current-reaction="reaction"
      @select="(key) => (log = `select → ${key}`)"
      @react="(key) => ((reaction = key), (log = `react → ${key}`))"
      @close="menu = null"
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` * | `boolean` | — | Whether the menu is open. It asks to close — Escape, a click outside, the page scrolling, a choice made — by emitting `close`. |
| `actions` | `KunChatMessageAction[]` | `["reply", "copy"]` | The actions, in order: built-in keys, or items of your own. |
| `currentReaction` | `string \| null` | `null` | The viewer's current reaction on the message, highlighted. |
| `position` | `{ x: number; y: number; } \| null` | `{ x: 0, y: 0 }` | Viewport point to open at — the cursor, or the long-press point. |
| `quickReactions` | `number` | `7` | How many reactions the row shows before the expand button. |
| `reactions` | `KunChatReactionOption[]` | `[]` | The quick-reaction row on top; empty hides it. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `close` | — | The menu closed, for any reason. |
| `react` | `reaction: string \| null` | A reaction was chosen: its key, or null when the current one was chosen again. |
| `select` | `action: string` | An action was chosen: a built-in key or one of your own items' keys. |

---
本页来源 · KunUI · https://ui.kungal.com/components/chatmessagemenu
