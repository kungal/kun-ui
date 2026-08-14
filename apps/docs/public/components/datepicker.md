# DatePicker (日期选择器)

> 日期 / 日期范围选择器(基于 date-fns),支持格式化、最小/最大值与禁用日期。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="Pick a date" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
  </div>
</template>
```

### Range.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const range = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="range" mode="range" label="选择日期范围" />
    <p class="text-default-600 mt-2 text-sm">起始：{{ range[0] || '—' }}</p>
    <p class="text-default-600 text-sm">结束：{{ range[1] || '—' }}</p>
  </div>
</template>
```

### Format.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')

// 仅允许选择今天及以后的工作日
const today = new Date()
today.setHours(0, 0, 0, 0)
const isDateDisabled = (d: Date) => {
  const day = d.getDay()
  return d < today || day === 0 || day === 6
}
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker
      v-model="date"
      label="自定义格式与禁用日期"
      format="yyyy 年 MM 月 dd 日"
      :is-date-disabled="isDateDisabled"
    />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
    <p class="text-default-400 text-xs">已禁用过去的日期、周六与周日</p>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" color="primary" label="primary" />
    <KunDatePicker v-model="b" color="secondary" label="secondary" />
    <KunDatePicker v-model="c" color="success" label="success" />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('2026-06-14')
const b = ref('2026-06-14')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" label="可清除（默认）" :clearable="true" />
    <KunDatePicker v-model="b" label="禁用" :disabled="true" />
  </div>
</template>
```

### Error.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="出生日期" error="请选择一个有效的日期" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `clearable` | `boolean` | `true` |
| `color` | `KunUIColor` | `"default"` |
| `darkBorder` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `format` | `string` | `"yyyy-MM-dd"` |
| `isDateDisabled` | `((date: Date) => boolean)` | — |
| `label` | `string` | `""` |
| `locale` | `string` | — |
| `maxDate` | `string \| Date` | — |
| `minDate` | `string \| Date` | — |
| `mode` | `KunDatePickerMode` | `"single"` |
| `modelValue` | `string \| [string \| null, string \| null] \| null` | `""` |
| `months` | `string[]` | — |
| `placeholder` | `string` | `"请选择日期"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `size` | `KunUISize` | `"md"` |
| `valueFormat` | `string` | `"yyyy-MM-dd"` |
| `weekdays` | `string[]` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/datepicker
