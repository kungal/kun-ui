# ContextMenu (右键菜单)

> 在指定坐标打开的菜单,例如右键菜单。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const items: KunContextMenuItem[] = [
  { key: 'copy', label: 'Copy', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download' },
  { key: 'delete', label: 'Delete', icon: 'lucide:x', color: 'danger' },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <div
    class="border-default-200 text-default-500 rounded-kun-lg flex h-28 w-full max-w-md items-center justify-center border border-dashed text-sm"
    @contextmenu.prevent="onContext"
  >
    Right-click inside this box
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`Clicked ${i.label}`, 'info')"
    />
  </div>
</template>
```

### WithIcons.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const items: KunContextMenuItem[] = [
  { key: 'view', label: 'View', icon: 'lucide:eye' },
  { key: 'copy', label: 'Copy', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download' },
  { key: 'refresh', label: 'Refresh', icon: 'lucide:rotate-cw' },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <div
    class="border-default-200 text-default-500 rounded-kun-lg flex h-28 w-full max-w-md items-center justify-center border border-dashed text-sm"
    @contextmenu.prevent="onContext"
  >
    右键这里
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
// `disabled: true` dims the item and skips it during keyboard navigation —
// it can't be focused or selected.
const items: KunContextMenuItem[] = [
  { key: 'back', label: 'Back', icon: 'lucide:arrow-left' },
  { key: 'forward', label: 'Forward', icon: 'lucide:arrow-right', disabled: true },
  { key: 'reload', label: 'Reload', icon: 'lucide:rotate-cw' },
  { key: 'save', label: 'Save as…', icon: 'lucide:download', disabled: true },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <div
    class="border-default-200 text-default-500 rounded-kun-lg flex h-28 w-full max-w-md items-center justify-center border border-dashed text-sm"
    @contextmenu.prevent="onContext"
  >
    右键这里
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
// `color` tints the item (light variant) to signal intent — e.g. a
// destructive action in danger.
const items: KunContextMenuItem[] = [
  { key: 'open', label: 'Open', icon: 'lucide:external-link', color: 'primary' },
  { key: 'approve', label: 'Approve', icon: 'lucide:circle-check', color: 'success' },
  { key: 'report', label: 'Report', icon: 'lucide:triangle-alert', color: 'warning' },
  { key: 'delete', label: 'Delete', icon: 'lucide:circle-x', color: 'danger' },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <div
    class="border-default-200 text-default-500 rounded-kun-lg flex h-28 w-full max-w-md items-center justify-center border border-dashed text-sm"
    @contextmenu.prevent="onContext"
  >
    右键这里
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </div>
</template>
```

### Commands.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunMenuEntry } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
// The same command list an app renders as a right-click menu, a ⋯ menu and a
// long-press menu: separators, shortcuts and one level of submenu.
const items: KunMenuEntry[] = [
  { key: 'reply', label: '回复', icon: 'lucide:reply', shortcut: 'R' },
  { key: 'quote', label: '引用', icon: 'lucide:quote', shortcut: 'Q' },
  { key: 'copy', label: '复制文本', icon: 'lucide:copy', shortcut: 'Mod+C' },
  {
    key: 'share',
    label: '分享',
    icon: 'lucide:external-link',
    children: [
      { key: 'share-link', label: '复制帖子链接', shortcut: 'Mod+Shift+C' },
      { key: 'share-image', label: '生成分享图片' },
    ],
  },
  { type: 'separator' },
  { key: 'report', label: '举报', icon: 'lucide:flag', color: 'warning' },
  { key: 'delete', label: '删除', icon: 'lucide:trash-2', color: 'danger', shortcut: 'Mod+Backspace' },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <KunCard bordered class-name="w-full max-w-md" @contextmenu.prevent="onContext">
    <div class="flex items-center gap-2">
      <KunAvatar :user="{ id: 1, name: '鲲', avatar: '' }" :is-navigation="false" size="sm" />
      <span class="text-sm font-medium">鲲</span>
      <span class="text-foreground-muted text-xs">3 分钟前</span>
    </div>
    <p class="text-default-700 mt-2 text-sm">
      刚通关了《星空列车与白的旅行》，结局那段配乐真的太好了。右键这条回复试试。
    </p>
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </KunCard>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` * | `boolean` | — |  |
| `items` | `KunMenuEntry[]` | `[]` | Items and separators; an item with `children` opens a submenu. |
| `padding` | `number` | `12` |  |
| `position` | `{ x: number; y: number; } \| null` | `{ x: 0, y: 0 }` |  |
| `width` | `number` | `192` |  |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `close` | — | The menu closed, for any reason. |
| `select` | `item: KunContextMenuItem` | The item the user activated. A disabled item never emits. |

---
本页来源 · KunUI · https://ui.kungal.com/components/contextmenu
