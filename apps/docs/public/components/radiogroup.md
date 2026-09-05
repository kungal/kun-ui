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

### Card.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('pro')
const options: KunRadioOption[] = [
  { value: 'free', label: '免费版', description: '适合个人体验' },
  { value: 'pro', label: '专业版', description: '适合小型团队' },
  { value: 'team', label: '团队版', description: '适合企业协作' },
]
</script>

<template>
  <KunRadioGroup
    v-model="value"
    variant="card"
    color="secondary"
    label="订阅方案"
    :options="options"
  />
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('b')
const options: KunRadioOption[] = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <KunRadioGroup v-model="value" color="primary" label="primary" :options="options" />
    <KunRadioGroup v-model="value" color="secondary" label="secondary" :options="options" />
    <KunRadioGroup v-model="value" color="success" label="success" :options="options" />
    <KunRadioGroup v-model="value" color="warning" label="warning" :options="options" />
    <KunRadioGroup v-model="value" color="danger" label="danger" :options="options" />
  </div>
</template>
```

### Descriptions.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue', description: '渐进式 JavaScript 框架' },
  { value: 'react', label: 'React', description: '用于构建用户界面的库' },
  { value: 'solid', label: 'Solid', description: '简洁且高性能' },
]
</script>

<template>
  <KunRadioGroup v-model="value" label="带描述的选项" :options="options" />
</template>
```

### Orientation.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('s')
const options: KunRadioOption[] = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunRadioGroup
      v-model="value"
      orientation="horizontal"
      label="水平排列（horizontal）"
      :options="options"
    />
    <KunRadioGroup
      v-model="value"
      orientation="vertical"
      label="垂直排列（vertical，默认）"
      :options="options"
    />
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const groupValue = ref('react')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte（禁用）', disabled: true },
]
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <KunRadioGroup v-model="value" label="禁用单个选项" :options="options" />
    <KunRadioGroup v-model="groupValue" label="整组禁用" disabled :options="options" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `KunRadioValue` | — |
| `options` * | `readonly KunRadioOption<KunRadioValue>[]` | — |
| `ariaLabel` | `string` | `""` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `hideIndicator` | `boolean` | `false` |
| `label` | `string` | `""` |
| `orientation` | `KunRadioOrientation` | `"vertical"` |
| `rounded` | `KunUIRounded` | — |
| `size` | `KunUISize` | `"md"` |
| `variant` | `KunRadioVariant` | `"classic"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/radiogroup
