# Select (选择器)

> 下拉选择框(v-model),由 options 数组驱动。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <KunSelect v-model="value" :options="options" label="Framework" class-name="max-w-xs" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `T` | — |
| `options` * | `readonly KunSelectOption<T>[]` | — |
| `ariaLabel` | `string` | `""` |
| `className` | `string` | `""` |
| `darkBorder` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `label` | `string` | `""` |
| `placeholder` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/select
