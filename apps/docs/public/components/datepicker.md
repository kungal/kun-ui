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

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `clearable` | `boolean` | `true` |
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
| `valueFormat` | `string` | `"yyyy-MM-dd"` |
| `weekdays` | `string[]` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/datepicker
