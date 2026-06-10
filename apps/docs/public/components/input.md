# Input (输入框)

> 文本输入框(v-model),带标签、辅助 / 错误文本与尺寸。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>

<template>
  <KunInput
    v-model="value"
    label="Username"
    placeholder="Type here…"
    helper-text="Helper text below the field."
    class-name="max-w-xs"
  />
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('locked')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="a" label="With error" error="This field is required." />
    <KunInput v-model="b" label="Disabled" disabled />
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="v" size="sm" placeholder="sm" />
    <KunInput v-model="v" size="md" placeholder="md" />
    <KunInput v-model="v" size="lg" placeholder="lg" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `autofocus` | `boolean` | `false` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `darkBorder` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `helperText` | `string` | `""` |
| `label` | `string` | `""` |
| `modelValue` | `string \| number` | `""` |
| `placeholder` | `string` | `""` |
| `required` | `boolean` | `false` |
| `rounded` | `KunUIRounded` | `undefined` |
| `size` | `KunUISize` | `"md"` |
| `type` | `string` | `"text"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/input
