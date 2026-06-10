# RadioGroup (单选组)

> 单选组(v-model + options),支持经典 / 卡片变体。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue', description: 'The progressive framework' },
  { value: 'react', label: 'React', description: 'A library for web UIs' },
  { value: 'svelte', label: 'Svelte', description: 'A compile-time framework' },
]
</script>

<template>
  <KunRadioGroup v-model="value" :options="options" label="Framework" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `T` | — |
| `options` * | `readonly KunRadioOption<T>[]` | — |
| `ariaLabel` | `string` | `""` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `label` | `string` | `""` |
| `orientation` | `KunRadioOrientation` | `"vertical"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `size` | `KunUISize` | `"md"` |
| `variant` | `KunRadioVariant` | `"classic"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/radiogroup
