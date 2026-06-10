# Tab (标签页)

> 标签页(v-model + items),支持多种变体与方向。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const tab = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'features', textValue: 'Features' },
  { value: 'pricing', textValue: 'Pricing' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <KunTab v-model="tab" :items="items" />
    <p class="text-default-600 mt-3 text-sm">Active tab: {{ tab }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `items` * | `KunTabItem[]` | — |
| `modelValue` * | `string` | — |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `disableAnimation` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `iconSize` | `string` | `"1em"` |
| `innerClassName` | `string` | `""` |
| `orientation` | `KunTabOrientation` | `"horizontal"` |
| `scrollable` | `boolean` | `false` |
| `size` | `KunTabSize` | `"md"` |
| `variant` | `KunTabVariant` | `"underlined"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/tab
