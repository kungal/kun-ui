# TagInput (标签输入)

> 标签输入(v-model string[]),支持分隔符、校验与计数。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['vue', 'nuxt'])
</script>

<template>
  <KunTagInput
    v-model="tags"
    label="Tags"
    placeholder="Add a tag, press Enter…"
    :max-tags="8"
    show-counter
    class-name="max-w-md"
  />
</template>
```

### Variants.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
const c = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" variant="bordered" label="bordered（默认）" />
    <KunTagInput v-model="b" variant="flat" label="flat" />
    <KunTagInput v-model="c" variant="flat" color="secondary" label="flat · secondary" />
  </div>
</template>
```

### Limits.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref<string[]>(['vue', 'nuxt'])
</script>

<template>
  <div class="max-w-md">
    <KunTagInput
      v-model="tags"
      label="技术栈"
      placeholder="输入后回车，或用逗号 / 分号分隔"
      :max-tags="5"
      :split-chars="[',', '，', ';', ' ']"
      :show-counter="true"
    />
    <p class="text-default-400 mt-1 text-xs">最多 5 个标签，支持粘贴批量拆分</p>
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" label="禁用" :disabled="true" />
    <KunTagInput v-model="b" label="标签" error="至少需要一个标签" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `allowDuplicates` | `boolean` | `false` |
| `caseSensitive` | `boolean` | `false` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `confirmOnBlur` | `boolean` | `true` |
| `description` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `helperText` | `string` | `""` |
| `label` | `string` | `""` |
| `maxTagLength` | `number` | `100` |
| `maxTags` | `number` | `Number.POSITIVE_INFINITY` |
| `minTagLength` | `number` | `1` |
| `modelValue` | `string[]` | `[]` |
| `placeholder` | `string` | `""` |
| `readonly` | `boolean` | `false` |
| `respectComposition` | `boolean` | `true` |
| `rounded` | `KunUIRounded` | `undefined` |
| `showCounter` | `boolean` | `false` |
| `size` | `KunUISize` | `"md"` |
| `splitChars` | `(string \| RegExp)[]` | `["\n", ",", "，", ";"]` |
| `splitOnPaste` | `boolean` | `true` |
| `transform` | `((raw: string) => string)` | `undefined` |
| `trim` | `boolean` | `true` |
| `validate` | `KunTagInputValidator` | `undefined` |
| `variant` | `KunTagInputVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/taginput
