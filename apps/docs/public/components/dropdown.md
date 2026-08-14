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

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `disabled` | `boolean` | `false` |
| `items` | `KunContextMenuItem[]` | `[]` |
| `menuClass` | `string` | `""` |
| `minWidth` | `number` | `192` |
| `position` | `Placement` | `"bottom-start"` |
| `triggerClass` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/dropdown
