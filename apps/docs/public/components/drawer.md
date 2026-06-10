# Drawer (抽屉)

> 从任意边缘滑出的抽屉面板,支持尺寸与标题。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open drawer</KunButton>
  <KunDrawer v-model="open" title="Drawer title">
    <p class="text-default-600">
      Slides in from the edge (set <code>placement</code>). Press Esc or click the
      backdrop to close.
    </p>
  </KunDrawer>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `boolean` | — |
| `className` | `string` | `""` |
| `innerClassName` | `string` | `""` |
| `isDismissable` | `boolean` | `true` |
| `isShowCloseButton` | `boolean` | `true` |
| `placement` | `KunDrawerPlacement` | `"right"` |
| `responsive` | `boolean` | `true` |
| `rounded` | `KunUIRounded` | `undefined` |
| `size` | `KunDrawerSize` | `"md"` |
| `title` | `string` | `""` |
| `withContainer` | `boolean` | `true` |

---
本页来源 · KunUI · https://ui.kungal.com/components/drawer
