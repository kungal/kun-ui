# Dropdown (下拉菜单)

> 锚定在触发元素上的下拉菜单。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import type { KunContextMenuItem } from '@kungal/ui-vue'

const items: KunContextMenuItem[] = [
  { key: 'profile', label: 'Profile', icon: 'lucide:info' },
  { key: 'copy', label: 'Copy link', icon: 'lucide:copy' },
  { key: 'logout', label: 'Log out', icon: 'lucide:x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">Open menu</KunButton>
    </template>
  </KunDropdown>
</template>
```

### WithIcons.vue

```vue
<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

const items: KunDropdownItem[] = [
  { key: 'view', label: 'View', icon: 'lucide:eye' },
  { key: 'copy', label: 'Copy', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download' },
  { key: 'upload', label: 'Upload', icon: 'lucide:upload' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">
        操作
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// `color` tints the item (light variant) — handy for distinguishing intent,
// e.g. a destructive action in danger.
const items: KunDropdownItem[] = [
  { key: 'open', label: 'Open', icon: 'lucide:external-link', color: 'primary' },
  { key: 'approve', label: 'Approve', icon: 'lucide:circle-check', color: 'success' },
  { key: 'flag', label: 'Flag', icon: 'lucide:triangle-alert', color: 'warning' },
  { key: 'delete', label: 'Delete', icon: 'lucide:circle-x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">彩色菜单项</KunButton>
    </template>
  </KunDropdown>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// `disabled: true` dims the item and removes it from keyboard navigation /
// type-ahead — it can't be focused or selected.
const items: KunDropdownItem[] = [
  { key: 'view', label: 'View', icon: 'lucide:eye' },
  { key: 'duplicate', label: 'Duplicate', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download', disabled: true },
  { key: 'delete', label: 'Delete', icon: 'lucide:circle-x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">含禁用项</KunButton>
    </template>
  </KunDropdown>
</template>
```

### AsLink.vue

```vue
<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// Items with `href` render a real, crawlable <a> (NuxtLink) instead of a
// <button> — for navigational menus. Action items omit `href`.
const items: KunDropdownItem[] = [
  { key: 'docs', label: 'Documentation', icon: 'lucide:book-open', href: '/components/button' },
  { key: 'overlay', label: 'Overlay 组件', icon: 'lucide:package', href: '/components/dropdown' },
  { key: 'github', label: 'GitHub', icon: 'lucide:github', href: 'https://github.com/KUN1007/kun-ui' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">导航菜单</KunButton>
    </template>
  </KunDropdown>
</template>
```

### Grouped.vue

```vue
<script setup lang="ts">
import type { KunMenuEntry } from '@kungal/ui-vue'

// One command list, grouped by separators. `shortcut` is display only — bind
// the keys yourself. Separators that end up leading, trailing or doubled (say,
// "Edit" and "Delete" filtered out for a post that is not yours) are dropped.
const isOwner = true
const items: KunMenuEntry[] = [
  { key: 'reply', label: '回复', icon: 'lucide:reply', shortcut: 'R' },
  { key: 'quote', label: '引用', icon: 'lucide:quote', shortcut: 'Q' },
  { key: 'copy', label: '复制链接', icon: 'lucide:copy', shortcut: 'Mod+Shift+C' },
  { type: 'separator' },
  ...(isOwner
    ? ([
        { key: 'edit', label: '编辑', icon: 'lucide:pencil', shortcut: 'E' },
        { key: 'delete', label: '删除', icon: 'lucide:trash-2', color: 'danger', shortcut: 'Mod+Backspace' },
      ] as KunMenuEntry[])
    : []),
]
</script>

<template>
  <KunDropdown :items="items" @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')">
    <template #trigger>
      <KunButton variant="light" color="default" is-icon-only aria-label="更多操作">
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
```

### Submenu.vue

```vue
<script setup lang="ts">
import type { KunMenuEntry } from '@kungal/ui-vue'

// `children` opens a submenu: hover, → or a tap. One level only.
const items: KunMenuEntry[] = [
  { key: 'pin', label: '置顶对话', icon: 'lucide:pin' },
  {
    key: 'mute',
    label: '静音通知',
    icon: 'lucide:bell-off',
    children: [
      { key: 'mute-1h', label: '1 小时' },
      { key: 'mute-8h', label: '8 小时' },
      { key: 'mute-1d', label: '1 天' },
      { type: 'separator' },
      { key: 'mute-forever', label: '直到我取消' },
    ],
  },
  { key: 'archive', label: '归档', icon: 'lucide:archive' },
  { type: 'separator' },
  { key: 'delete', label: '删除对话', icon: 'lucide:trash-2', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items" @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')">
    <template #trigger>
      <KunButton variant="bordered" color="default">
        对话设置
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` |  |
| `items` | `KunMenuEntry[]` | `[]` | Items and separators; an item with `children` opens a submenu. |
| `menuClass` | `string` | `""` |  |
| `minWidth` | `number` | `192` |  |
| `position` | `Placement` | `"bottom-start"` |  |
| `triggerClass` | `string` | `""` |  |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `close` | — | The menu closed, for any reason. |
| `open` | — | The menu opened. |
| `select` | `item: KunContextMenuItem` | The item the user activated. A disabled item never emits. |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#trigger` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/dropdown
