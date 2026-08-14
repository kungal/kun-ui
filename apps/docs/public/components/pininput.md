# PinInput (PIN 输入框)

> OTP / PIN 分段输入(v-model 字符串):逐格输入、粘贴分发、掩码、填满触发 complete。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const done = ref('')
</script>

<template>
  <div>
    <KunPinInput v-model="pin" :length="6" @complete="(v) => (done = v)" />
    <p class="text-default-500 mt-2 text-sm">值: {{ pin || '—' }}</p>
    <p v-if="done" class="text-success mt-1 text-sm">complete: {{ done }}</p>
  </div>
</template>
```

### Masked.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `mask` hides each filled cell behind a • (e.g. a security PIN). `type="text"`
// allows letters; the default 'numeric' restricts to digits + numeric keypad.
const pin = ref('')
</script>

<template>
  <KunPinInput v-model="pin" :length="4" :mask="true" color="secondary" />
</template>
```

### LengthType.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `length` sets the number of cells. `type="numeric"` (default) restricts
// input to digits; `type="text"` accepts letters too.
const code = ref('')
const text = ref('')
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">4 位数字</p>
      <KunPinInput v-model="code" :length="4" type="numeric" />
    </div>
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">5 位字母数字</p>
      <KunPinInput v-model="text" :length="5" type="text" />
    </div>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` tints the focus ring of each cell.
const pin = ref('')
const colors: KunUIColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
</script>

<template>
  <div class="grid gap-4">
    <div v-for="c in colors" :key="c">
      <p class="text-default-700 mb-1 text-sm font-medium">{{ c }}</p>
      <KunPinInput v-model="pin" :length="4" :color="c" />
    </div>
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

const pin = ref('')
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid gap-4">
    <div v-for="s in sizes" :key="s">
      <p class="text-default-700 mb-1 text-sm font-medium">{{ s }}</p>
      <KunPinInput v-model="pin" :length="4" :size="s" />
    </div>
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `isInvalid` tints every cell with the danger color; `disabled` blocks input.
const pin = ref('12')
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">无效 (isInvalid)</p>
      <KunPinInput v-model="pin" :length="4" :is-invalid="true" />
    </div>
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">禁用</p>
      <KunPinInput v-model="pin" :length="4" :disabled="true" />
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | `"验证码"` |
| `autofocus` | `boolean` | `false` |
| `color` | `KunUIColor` | `"primary"` |
| `disabled` | `boolean` | `false` |
| `isInvalid` | `boolean` | `false` |
| `length` | `number` | `6` |
| `mask` | `boolean` | `false` |
| `modelValue` | `string` | `""` |
| `name` | `string` | `undefined` |
| `placeholder` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |
| `size` | `KunUISize` | `"md"` |
| `type` | `"text" \| "numeric"` | `"numeric"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/pininput
