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
