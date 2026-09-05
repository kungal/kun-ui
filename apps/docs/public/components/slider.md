# Slider (滑块)

> 范围滑块(v-model number),支持 min / max / step。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref(40)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider v-model="v" :min="0" :max="100" :step="1" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ v }}</p>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` sets the fill + thumb + halo tone.
const v = ref(60)
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
  <div class="grid w-full max-w-md gap-5">
    <div v-for="c in colors" :key="c">
      <p class="text-default-600 mb-1 text-sm">{{ c }}</p>
      <KunSlider v-model="v" :color="c" />
    </div>
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

// `size` scales the track thickness and thumb diameter.
const v = ref(50)
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid w-full max-w-md gap-6">
    <div v-for="s in sizes" :key="s">
      <p class="text-default-600 mb-1 text-sm">{{ s }}</p>
      <KunSlider v-model="v" :size="s" />
    </div>
  </div>
</template>
```

### Marks.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSliderMark } from '@kungal/ui-vue'

// `marks` accepts a plain number[] (tick dots) or {value,label}[] (labelled).
const a = ref(50)
const b = ref(50)
const labelledMarks: KunSliderMark[] = [
  { value: 0, label: 'Min' },
  { value: 50, label: 'Mid' },
  { value: 100, label: 'Max' },
]
</script>

<template>
  <div class="grid w-full max-w-md gap-8">
    <div>
      <p class="text-default-600 mb-1 text-sm">number[] 刻度</p>
      <KunSlider v-model="a" :marks="[0, 25, 50, 75, 100]" />
    </div>
    <div>
      <p class="text-default-600 mb-1 text-sm">带标签的刻度</p>
      <KunSlider v-model="b" :marks="labelledMarks" />
    </div>
  </div>
</template>
```

### Tooltip.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `showValue` renders the current value beside the label; `showTooltip` shows
// a bubble above the thumb while dragging or focused.
const v = ref(40)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider
      v-model="v"
      label="音量"
      :show-value="true"
      :show-tooltip="true"
    />
  </div>
</template>
```

### Step.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `step` snaps the value to discrete increments anchored at `min`.
const v = ref(50)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider
      v-model="v"
      :min="0"
      :max="100"
      :step="25"
      :marks="[0, 25, 50, 75, 100]"
      :show-value="true"
      label="步长 25"
    />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `disabled` blocks all interaction; `error` turns the control danger-colored
// and shows a message below.
const v = ref(40)
</script>

<template>
  <div class="grid w-full max-w-md gap-8">
    <KunSlider v-model="v" label="禁用" :disabled="true" />
    <KunSlider v-model="v" label="错误" error="数值超出范围" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` * | `number` | — |  |
| `ariaLabel` | `string` | — | Accessible name when there is no visible label (role="slider" needs a name). |
| `color` | `KunUIColor` | `"primary"` |  |
| `description` | `string` | — | Helper text below the track (hidden when `error` is set). |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | — | Error message (red text below + danger fill). Takes precedence over description. |
| `formatValue` | `((value: number) => string)` | — | Format the value shown in the tooltip / value readout. |
| `label` | `string` | — | Visible field label (rendered above the track, associates the slider). |
| `marks` | `(number \| KunSliderMark)[]` | — | Tick marks under the track. Pass numbers (or {value,label}) within [min,max]. |
| `max` | `number` | `100` |  |
| `min` | `number` | `0` |  |
| `showTooltip` | `boolean` | `false` | Show a value bubble above the thumb while hovering / dragging / focused. |
| `showValue` | `boolean` | `false` | Always render the current value next to the label. |
| `size` | `KunUISize` | `"md"` |  |
| `step` | `number` | `1` |  |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `change` | `value: number` | Fired once on commit (pointer release / keyboard), for forms that only care about the final value — `update:modelValue` still streams live. |
| `update:modelValue` | `value: number` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/slider
