# NumberInput (数字输入框)

> 数字输入(v-model number|null),带步进按钮、min/max/step、小数精度与自动钳制。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const qty = ref<number | null>(3)
const price = ref<number | null>(19.9)
const free = ref<number | null>(null)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput v-model="qty" label="Quantity" :min="0" :max="10" />
    <KunNumberInput
      v-model="price"
      label="Price"
      :min="0"
      :step="0.1"
      :precision="2"
    />
    <KunNumberInput v-model="free" label="Unbounded (empty start)" />
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

const v = ref<number | null>(5)
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid max-w-xs gap-3">
    <KunNumberInput
      v-for="s in sizes"
      :key="s"
      v-model="v"
      :size="s"
      :label="s"
      :min="0"
    />
  </div>
</template>
```

### Precision.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `step` controls the increment for the stepper buttons / arrow keys.
// `precision` fixes the number of decimal places on commit (blur).
const price = ref<number | null>(19.9)
const rate = ref<number | null>(0.25)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="price"
      label="价格 (step 0.1, precision 2)"
      :min="0"
      :step="0.1"
      :precision="2"
    />
    <KunNumberInput
      v-model="rate"
      label="利率 (step 0.05, precision 2)"
      :min="0"
      :max="1"
      :step="0.05"
      :precision="2"
    />
  </div>
</template>
```

### Range.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `min` / `max` clamp the committed value: typing 999 and blurring snaps it
// back to max, and the stepper buttons disable at each bound.
const qty = ref<number | null>(3)
</script>

<template>
  <div class="grid max-w-xs gap-2">
    <KunNumberInput
      v-model="qty"
      label="数量 (0 – 10)"
      :min="0"
      :max="10"
    />
    <p class="text-default-500 text-sm">值: {{ qty ?? '—' }}</p>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` tints the focus ring. Click into each field to see the difference.
const v = ref<number | null>(5)
const colors: KunUIColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
</script>

<template>
  <div class="grid max-w-xs gap-3">
    <KunNumberInput
      v-for="c in colors"
      :key="c"
      v-model="v"
      :color="c"
      :label="c"
      :min="0"
    />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `error` shows a danger message + tints the control; `isInvalid` only tints.
// `disabled` blocks all input; `readonly` shows the value but prevents edits.
const v = ref<number | null>(5)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="v"
      label="错误"
      :min="0"
      error="数量超出库存"
    />
    <KunNumberInput
      v-model="v"
      label="无效 (isInvalid)"
      :min="0"
      :is-invalid="true"
    />
    <KunNumberInput v-model="v" label="禁用" :min="0" :disabled="true" />
    <KunNumberInput v-model="v" label="只读" :min="0" :readonly="true" />
  </div>
</template>
```

### NoControls.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `controls="false"` hides the +/- stepper buttons, leaving a plain numeric
// field. Arrow-key stepping still works.
const v = ref<number | null>(42)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="v"
      label="无步进按钮"
      :controls="false"
      :min="0"
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `controls` | `boolean` | `true` |
| `darkBorder` | `boolean` | `true` |
| `description` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `isInvalid` | `boolean` | `false` |
| `label` | `string` | `""` |
| `max` | `number` | `Number.POSITIVE_INFINITY` |
| `min` | `number` | `Number.NEGATIVE_INFINITY` |
| `modelValue` | `number \| null` | `null` |
| `name` | `string` | — |
| `placeholder` | `string` | `""` |
| `precision` | `number` | — |
| `readonly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `rounded` | `KunUIRounded` | — |
| `size` | `KunUISize` | `"md"` |
| `step` | `number` | `1` |

---
本页来源 · KunUI · https://ui.kungal.com/components/numberinput
